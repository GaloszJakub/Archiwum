"""
Flask API dla FilmanScraper - Cloud-Ready Version
Endpoint do scrapowania odcinków seriali z obsługą cookie injection
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from scraper.filman_scraper import FilmanScraper
import os
import atexit
import threading
import json
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Konfiguracja
HEADLESS_MODE = os.getenv('HEADLESS_MODE', 'True').lower() == 'true'
PROFILE_DIR = os.path.join(os.path.dirname(__file__), 'scraper', 'chrome_profile')
COOKIES_FILE = os.path.join(os.path.dirname(__file__), 'session_cookies.json')

scraper_instance: FilmanScraper = None
scraper_lock = threading.Lock()
session_cookies = None

def load_cookies_from_file():
    """Wczytuje cookies z pliku"""
    global session_cookies
    try:
        if os.path.exists(COOKIES_FILE):
            with open(COOKIES_FILE, 'r') as f:
                session_cookies = json.load(f)
                app.logger.info(f"✓ Loaded cookies from {COOKIES_FILE}")
                return True
    except Exception as e:
        app.logger.error(f"Error loading cookies: {e}")
    return False

def save_cookies_to_file(cookies):
    """Zapisuje cookies do pliku"""
    try:
        with open(COOKIES_FILE, 'w') as f:
            json.dump(cookies, f)
        app.logger.info(f"✓ Saved cookies to {COOKIES_FILE}")
        return True
    except Exception as e:
        app.logger.error(f"Error saving cookies: {e}")
        return False

def get_scraper() -> FilmanScraper:
    """Zwraca instancję scrapera, tworząc ją jeśli nie istnieje (thread-safe)"""
    global scraper_instance, session_cookies
    with scraper_lock:
        if scraper_instance is None or scraper_instance.driver is None:
            if scraper_instance is not None:
                app.logger.info("🔧 Scraper istnieje ale driver jest None, tworzę nową instancję...")
            else:
                app.logger.info("🔧 Tworzenie nowej instancji FilmanScraper...")
            
            scraper_instance = FilmanScraper(
                headless=HEADLESS_MODE, 
                debug=True,
                profile_dir=PROFILE_DIR
            )
            
            # Inject cookies if available
            if session_cookies:
                app.logger.info("🍪 Injecting stored cookies...")
                try:
                    scraper_instance.inject_cookies(session_cookies)
                    app.logger.info("✓ Cookies injected successfully")
                except Exception as e:
                    app.logger.error(f"Error injecting cookies: {e}")
            
            if not scraper_instance.check_if_logged_in():
                app.logger.warning("🔔 Scraper nie jest zalogowany. Użyj /api/update-session aby dodać cookies.")
        return scraper_instance

def shutdown_scraper():
    """Zamyka scraper przy zamykaniu aplikacji"""
    global scraper_instance
    if scraper_instance:
        app.logger.info("🚪 Zamykanie instancji FilmanScraper...")
        scraper_instance.close()

atexit.register(shutdown_scraper)


@app.route('/api/health', methods=['GET'])
def health_check():
    """Sprawdź czy API działa i odśwież sesję"""
    try:
        scraper = get_scraper()
        is_logged_in = scraper.check_if_logged_in() if scraper else False
        
        return jsonify({
            'status': 'ok', 
            'message': 'FilmanScraper API is running',
            'logged_in': is_logged_in,
            'has_cookies': session_cookies is not None
        })
    except Exception as e:
        return jsonify({
            'status': 'ok',
            'message': 'FilmanScraper API is running',
            'error': str(e)
        })

@app.route('/api/keep-alive', methods=['GET'])
def keep_alive():
    """Keep-alive endpoint do zapobiegania uśpieniu serwera"""
    try:
        scraper = get_scraper()
        # Odśwież sesję odwiedzając stronę główną
        if scraper and scraper.driver:
            scraper.driver.get(FilmanScraper.BASE_URL)
            is_logged_in = scraper.check_if_logged_in()
            return jsonify({
                'status': 'alive',
                'message': 'Session refreshed',
                'logged_in': is_logged_in
            })
        return jsonify({'status': 'alive', 'message': 'No active scraper'})
    except Exception as e:
        return jsonify({'status': 'alive', 'error': str(e)})

@app.route('/api/update-session', methods=['POST'])
def update_session():
    """
    Endpoint do aktualizacji cookies sesji.
    
    Body: {
        "cookies": [
            {"name": "cookie_name", "value": "cookie_value", "domain": ".filman.cc"},
            ...
        ]
    }
    lub
    Body: {
        "cookie_string": "name1=value1; name2=value2; ..."
    }
    """
    global session_cookies
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No JSON data provided'
            }), 400
        
        # Obsługa cookie_string
        if 'cookie_string' in data:
            cookie_string = data['cookie_string']
            cookies = []
            for cookie in cookie_string.split(';'):
                cookie = cookie.strip()
                if '=' in cookie:
                    name, value = cookie.split('=', 1)
                    cookies.append({
                        'name': name.strip(),
                        'value': value.strip(),
                        'domain': '.filman.cc'
                    })
            session_cookies = cookies
        # Obsługa listy cookies
        elif 'cookies' in data:
            session_cookies = data['cookies']
        else:
            return jsonify({
                'success': False,
                'error': 'Missing "cookies" or "cookie_string" in request body'
            }), 400
        
        # Zapisz cookies do pliku
        save_cookies_to_file(session_cookies)
        
        # Jeśli scraper już istnieje, wstrzyknij nowe cookies
        global scraper_instance
        with scraper_lock:
            if scraper_instance and scraper_instance.driver:
                app.logger.info("🍪 Updating cookies in active scraper...")
                try:
                    scraper_instance.inject_cookies(session_cookies)
                    is_logged_in = scraper_instance.check_if_logged_in()
                    
                    return jsonify({
                        'success': True,
                        'message': 'Session cookies updated successfully',
                        'logged_in': is_logged_in,
                        'cookies_count': len(session_cookies)
                    })
                except Exception as e:
                    app.logger.error(f"Error injecting cookies: {e}")
                    return jsonify({
                        'success': False,
                        'error': f'Failed to inject cookies: {str(e)}'
                    }), 500
            else:
                # Scraper nie istnieje, tylko zapisz cookies
                return jsonify({
                    'success': True,
                    'message': 'Session cookies stored (will be used on next scraper init)',
                    'cookies_count': len(session_cookies)
                })
    
    except Exception as e:
        app.logger.error(f"Error in /api/update-session: {e}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/test', methods=['POST'])
def test_endpoint():
    """Test endpoint bez scrapera"""
    app.logger.info("🧪 Otrzymano request na /api/test")
    data = request.get_json()
    app.logger.info(f"📦 Data: {data}")
    
    return jsonify({
        'success': True,
        'message': 'Test OK',
        'received': data
    })


@app.route('/api/scrape/search', methods=['POST'])
def scrape_search():
    """
    Wyszukuje serial/film i zwraca listę odcinków.

    Body: {"title": "Breaking Bad", "type": "serial", "year": 2008}
    """
    app.logger.info(f"🔍 Otrzymano request /api/scrape/search")
    
    try:
        data = request.get_json()
        app.logger.info(f"📦 Request data: {data}")
        
        if not data or 'title' not in data:
            app.logger.error("❌ Brak 'title' w requeście")
            return jsonify({
                'success': False,
                'error': 'Missing title in request body'
            }), 400
        
        title = data['title']
        content_type = data.get('type', 'serial')
        year = data.get('year')
        app.logger.info(f"🎬 Szukam: '{title}', Typ: {content_type}, Rok: {year}")
        
        scraper = get_scraper()
        
        try:
            if not scraper.search_series(title):
                app.logger.error("❌ Nie znaleziono wyników w wyszukiwarce")
                return jsonify({
                    'success': False,
                    'error': 'Nie znaleziono wyników'
                }), 404
        except Exception as e:
            app.logger.error(f"❌ Błąd w search_series: {e}", exc_info=True)
            return jsonify({
                'success': False,
                'error': f'Błąd wyszukiwania: {str(e)}'
            }), 500
        
        search_results = scraper.get_search_results(content_type)
        
        if not search_results:
            return jsonify({
                'success': False,
                'error': 'Brak wyników wyszukiwania'
            }), 404
        
        app.logger.info(f"📝 Znaleziono {len(search_results)} wyników:")
        for i, result in enumerate(search_results):
            app.logger.info(f"  {i}. [{result['type']}] {result['title']} ({result['year']})")
        
        result_index = 0
        if year:
            year_str = str(year)
            app.logger.info(f"🔍 Próbuję dopasować rok: {year_str}")
            
            for i, result in enumerate(search_results):
                if result.get('year', '') == year_str:
                    result_index = i
                    app.logger.info(f"✓ Znaleziono dopasowanie na pozycji {i}")
                    break
            else:
                app.logger.warning(f"⚠️ Nie znaleziono wyniku z rokiem {year_str}, używam pierwszego z listy.")
        
        selected_result = search_results[result_index] if result_index < len(search_results) else None
        
        if not selected_result:
            return jsonify({
                'success': False,
                'error': 'Nie można wybrać wyniku'
            }), 404
        
        if not scraper.select_result_by_index(result_index, content_type):
            return jsonify({
                'success': False,
                'error': 'Nie można otworzyć strony z wynikami'
            }), 500
        
        episodes = scraper.extract_episodes()
        
        app.logger.info(f"✓ Pobrano {len(episodes)} odcinków dla '{title}' ({selected_result['year']})")
        
        return jsonify({
            'success': True,
            'title': selected_result['title'],
            'type': selected_result['type'],
            'year': selected_result['year'],
            'url': selected_result['url'],
            'episodes': episodes,
            'count': len(episodes)
        })

    
    except Exception as e:
        app.logger.error(f"Błąd w /api/scrape/search: {e}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/scrape/links', methods=['POST'])
def scrape_links():
    """
    Pobiera linki streamingowe dla wybranych odcinków.

    Body: {"episodes": [{"episode": "S01E01", "url": "..."}]}
    """
    app.logger.info(f"🔗 Otrzymano request /api/scrape/links")

    try:
        data = request.get_json()
        
        if not data or 'episodes' not in data:
            app.logger.error("❌ Brak 'episodes' w requeście")
            return jsonify({
                'success': False,
                'error': 'Missing episodes in request body'
            }), 400
        
        episodes = data['episodes']
        app.logger.info(f"🔗 Pobieram linki dla {len(episodes)} odcinków.")

        scraper = get_scraper()
        
        if not scraper.is_logged_in:
            if not scraper.check_if_logged_in():
                 return jsonify({ 
                    'success': False,
                    'error': 'Not logged in. Please update session cookies via /api/update-session'
                }), 401

        results = []
        
        for ep in episodes:
            episode_url = ep.get('url')
            episode_num = ep.get('episode', 'Unknown')
            
            if not episode_url:
                continue
            
            links = scraper.extract_streaming_links(episode_url)
            
            results.append({
                'episode': episode_num,
                'url': episode_url,
                'links': links
            })
        
        app.logger.info(f"✓ Zakończono pobieranie linków dla {len(results)} odcinków.")
        
        # NIE restartujemy scrapera - zachowujemy sesję dla kolejnych requestów
        # try:
        #     app.logger.info("🔄 Restartuję scraper...")
        #     scraper.close()
        #     global scraper_instance
        #     with scraper_lock:
        #         scraper_instance = None
        #     app.logger.info("✓ Scraper zrestartowany.")
        # except Exception as e:
        #     app.logger.warning(f"⚠️ Błąd podczas restartu scrapera: {e}")
        
        return jsonify({
            'success': True,
            'results': results,
            'count': len(results)
        })

    
    except Exception as e:
        app.logger.error(f"Błąd w /api/scrape/links: {e}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


if __name__ == '__main__':
    # Cloud-ready: używaj PORT z environment variable (Render/Heroku)
    port = int(os.getenv('PORT', os.getenv('FLASK_PORT', 5001)))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    # Wczytaj cookies z pliku przy starcie
    load_cookies_from_file()
    
    if not app.debug or os.environ.get('WERKZEUG_RUN_MAIN') == 'true':
        app.logger.info("Inicjalizuję instancję scrapera...")
        try:
            get_scraper()
        except Exception as e:
            app.logger.warning(f"Could not initialize scraper on startup: {e}")

    app.logger.info(f"🚀 API startuje na porcie {port}")
    app.logger.info(f"👻 Tryb Headless: {HEADLESS_MODE}")
    app.logger.info(f"🍪 Cookies file: {COOKIES_FILE}")
    
    # Production: bez reloadera
    app.run(host='0.0.0.0', port=port, debug=debug, use_reloader=False)
