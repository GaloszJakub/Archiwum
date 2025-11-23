# Changelog - Cloud-Ready Refactoring

## 🎯 Cel refaktoryzacji
Przygotowanie aplikacji do hostowania w chmurze (Render.com, Heroku) z możliwością zdalnej aktualizacji sesji bez redeploymentu.

## ✨ Nowe funkcje

### 1. Cookie Injection System
**Pliki**: `app.py`, `scraper/filman_scraper.py`

- **Nowy endpoint**: `POST /api/update-session`
  - Przyjmuje cookies w dwóch formatach:
    - `{"cookie_string": "name1=value1; name2=value2"}` 
    - `{"cookies": [{"name": "...", "value": "...", "domain": "..."}]}`
  - Zapisuje cookies do `session_cookies.json`
  - Automatycznie wstrzykuje do aktywnego scrapera

- **Nowa metoda**: `FilmanScraper.inject_cookies(cookies)`
  - Dodaje cookies do sesji Selenium
  - Odświeża stronę aby zastosować cookies

- **Auto-load**: Cookies są automatycznie ładowane przy starcie aplikacji

### 2. Keep-Alive Endpoint
**Plik**: `app.py`

- **Endpoint**: `GET /api/keep-alive`
- **Funkcja**: 
  - Zapobiega uśpieniu serwera (free tier)
  - Odświeża sesję na stronie docelowej
  - Zwraca status logowania

### 3. Enhanced Health Check
**Plik**: `app.py`

- **Endpoint**: `GET /api/health`
- **Zwraca**:
  - Status API
  - Stan logowania (`logged_in`)
  - Obecność cookies (`has_cookies`)

### 4. Production Configuration
**Pliki**: `app.py`, `gunicorn.conf.py`, `requirements.txt`

- **PORT**: Używa zmiennej `PORT` (Render/Heroku) lub `FLASK_PORT` (local)
- **Host**: `0.0.0.0` - nasłuchuje na wszystkich interfejsach
- **Headless**: Domyślnie `True` w produkcji
- **Gunicorn**: 
  - Dodany do dependencies
  - Konfiguracja w `gunicorn.conf.py`
  - Single worker (Selenium nie jest thread-safe)
  - Timeout 120s dla długich operacji

### 5. Error Handling
**Plik**: `app.py`

- **401 Unauthorized**: Gdy brak cookies lub sesja wygasła
- **Jasne komunikaty**: "Please update session cookies via /api/update-session"

## 📦 Nowe pliki

| Plik | Opis |
|------|------|
| `session_cookies.json` | Przechowuje cookies (gitignored) |
| `gunicorn.conf.py` | Konfiguracja Gunicorn dla produkcji |
| `Procfile` | Heroku deployment config |
| `runtime.txt` | Python version dla Heroku |
| `render.yaml` | Render.com deployment config |
| `CLOUD_DEPLOYMENT.md` | Szczegółowa instrukcja wdrożenia |
| `README_CLOUD.md` | Dokumentacja zmian |
| `CHANGES.md` | Ten plik |
| `test_cookie_injection.py` | Test cookie injection |
| `test_cloud_flow.py` | Kompletny test flow |
| `export_cookies.html` | Helper do eksportu cookies |

## 🔧 Zmodyfikowane pliki

### `app.py`
- Dodano `session_cookies` global variable
- Dodano `load_cookies_from_file()` i `save_cookies_to_file()`
- Zmodyfikowano `get_scraper()` - auto-inject cookies
- Dodano endpoint `/api/update-session`
- Dodano endpoint `/api/keep-alive`
- Rozszerzono `/api/health`
- Zmieniono `app.run()` - cloud-ready config
- Zmieniono komunikaty błędów (401)

### `scraper/filman_scraper.py`
- Dodano metodę `inject_cookies(cookies)`
- Import `List` i `Dict` z typing

### `requirements.txt`
- Usunięto `undetected-chromedriver` (używamy standardowego Selenium)
- Dodano `gunicorn>=21.2.0`

### `.gitignore`
- Dodano `session_cookies.json`
- Dodano `chrome_profile/`
- Dodano `*.db`

### `.env.example`
- Dodano komentarze dla production
- Zaktualizowano domyślne wartości

## 🚀 Deployment Flow

### Przed wdrożeniem:
1. ✅ Kod jest cloud-ready
2. ✅ Dependencies zaktualizowane
3. ✅ Gunicorn skonfigurowany
4. ✅ Environment variables zdefiniowane

### Po wdrożeniu:
1. Deploy aplikacji na Render/Heroku
2. Zaloguj się na filman.cc w przeglądarce
3. Wyeksportuj cookies (użyj `export_cookies.html`)
4. Wyślij cookies do `/api/update-session`
5. Testuj scraping
6. Ustaw cron dla `/api/keep-alive`

## ⚠️ Breaking Changes

### Brak (backward compatible)
- Stare endpointy działają bez zmian
- Lokalne użycie (z profilem Chrome) nadal działa
- Nowe funkcje są opcjonalne

## 🔐 Bezpieczeństwo

### Dodane:
- `session_cookies.json` w `.gitignore`
- Walidacja JSON w `/api/update-session`
- Error handling dla cookie injection

### TODO (opcjonalne):
- [ ] Dodać API key authentication
- [ ] Ograniczyć dostęp do `/api/update-session` (IP whitelist)
- [ ] Szyfrować `session_cookies.json`
- [ ] Rate limiting dla endpointów

## 📊 Testing

### Lokalne testy:
```bash
# Test 1: Cookie injection
python test_cookie_injection.py

# Test 2: Complete flow
python test_cloud_flow.py

# Test 3: Manual API test
curl http://localhost:5001/api/health
```

### Production testy:
```bash
# Health check
curl https://your-app.onrender.com/api/health

# Update session
curl -X POST https://your-app.onrender.com/api/update-session \
  -H "Content-Type: application/json" \
  -d @cookies.json

# Keep-alive
curl https://your-app.onrender.com/api/keep-alive
```

## 📈 Performance

### Optymalizacje:
- Single Gunicorn worker (unika konfliktów Selenium)
- Timeout 120s (wystarczający dla scrapingu)
- Persistent cookies (unika re-logowania)
- Keep-alive (utrzymuje sesję aktywną)

### Limity:
- Free tier Render: 512MB RAM, może być za mało dla Chrome
- Rozważ Starter plan ($7/mo) dla stabilności

## 🐛 Known Issues

1. **Chrome/Chromium na Render**: Może wymagać dodatkowego buildpacka
2. **Cookies expiration**: Musisz okresowo aktualizować (brak auto-refresh)
3. **Single worker**: Nie obsługuje wielu równoczesnych requestów

## 📚 Dokumentacja

- `CLOUD_DEPLOYMENT.md` - Szczegółowa instrukcja wdrożenia
- `README_CLOUD.md` - Przegląd zmian i użycie
- `CHANGES.md` - Ten plik (changelog)

## 🎉 Podsumowanie

Aplikacja jest teraz w pełni gotowa do wdrożenia w chmurze z możliwością:
- ✅ Zdalnej aktualizacji sesji bez redeploymentu
- ✅ Keep-alive dla free tier
- ✅ Production-ready configuration
- ✅ Comprehensive error handling
- ✅ Easy cookie management
