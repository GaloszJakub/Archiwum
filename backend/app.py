"""
Flask API dla FilmanScraper
Endpoint do scrapowania odcinków seriali
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from scraper.filman_scraper import FilmanScraper
import os
import atexit
import threading
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Konfiguracja
HEADLESS_MODE = os.getenv('HEADLESS_MODE', 'False').lower() == 'true'
# Ścieżka do profilu Chrome - taka sama jak w run_login.py i test_login.py
PROFILE_DIR = os.path.join(os.path.dirname(__file__), 'scraper', 'chrome_profile')

scraper_instance: FilmanScraper = None
scraper_lock = threading.Lock()

def get_scraper() -> FilmanScraper:
    """Zwraca instancję scrapera, tworząc ją jeśli nie istnieje (thread-safe)"""
    global scraper_instance
    with scraper_lock:
        if scraper_instance is None or scraper_instance.driver is None:
            if scraper_instance is not None:
                app.logger.info("🔧 Scraper istnieje ale driver jest None, tworzę nową instancję...")
            else:
                app.logger.info("🔧 Tworzenie nowej instancji FilmanScraper...")
            
            # Używamy tego samego profilu co run_login.py, żeby zachować sesję
            scraper_instance = FilmanScraper(
                headless=HEADLESS_MODE, 
                debug=True,
                profile_dir=PROFILE_DIR
            )
            
            if not scraper_instance.check_if_logged_in():
                app.logger.warning("🔔 Scraper nie jest zalogowany. Uruchom test_login.py lub przygotuj profil.")
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
    """Sprawdź czy API działa"""
    return jsonify({'status': 'ok', 'message': 'FilmanScraper API is running'})


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
                    'error': 'Not logged in. Please run test_login.py first.'
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
    port = int(os.getenv('FLASK_PORT', 5001))
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    if not app.debug or os.environ.get('WERKZEUG_RUN_MAIN') == 'true':
        app.logger.info("Inicjalizuję instancję scrapera...")
        get_scraper()

    app.logger.info(f"🚀 API startuje na porcie {port}")
    app.logger.info(f"👻 Tryb Headless: {HEADLESS_MODE}")
    
    use_reloader = False if debug else True
    app.run(host='0.0.0.0', port=port, debug=debug, use_reloader=use_reloader)
