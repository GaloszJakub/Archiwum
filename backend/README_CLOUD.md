# FilmanScraper - Cloud-Ready Version

## 🚀 Zmiany wprowadzone dla wdrożenia w chmurze

### 1. Cookie Injection System
- **Nowy endpoint**: `POST /api/update-session` - przyjmuje cookies w formacie JSON
- **Persistent storage**: Cookies są zapisywane w pliku `session_cookies.json`
- **Auto-injection**: Cookies są automatycznie wstrzykiwane przy inicjalizacji scrapera
- **Metoda w scraperze**: `inject_cookies()` - dodaje cookies do sesji Selenium

### 2. Keep-Alive Endpoint
- **Endpoint**: `GET /api/keep-alive`
- **Funkcja**: Zapobiega uśpieniu serwera i odświeża sesję
- **Użycie**: Pinguj co 10-15 minut przez zewnętrzny cron

### 3. Enhanced Health Check
- **Endpoint**: `GET /api/health`
- **Zwraca**: Status API, stan logowania, obecność cookies
- **Użycie**: Monitoring stanu aplikacji

### 4. Production-Ready Configuration
- **PORT**: Używa zmiennej środowiskowej `PORT` (Render/Heroku)
- **Host**: `0.0.0.0` - nasłuchuje na wszystkich interfejsach
- **Headless**: Domyślnie `True` w produkcji
- **Gunicorn**: Dodany do requirements.txt z konfiguracją

### 5. Error Handling
- **401 Unauthorized**: Zwracane gdy brak cookies lub sesja wygasła
- **Jasne komunikaty**: Informują jak zaktualizować sesję

## 📦 Pliki

### Nowe pliki:
- `session_cookies.json` - Przechowuje cookies (gitignored)
- `gunicorn.conf.py` - Konfiguracja Gunicorn
- `CLOUD_DEPLOYMENT.md` - Szczegółowa instrukcja wdrożenia
- `test_cookie_injection.py` - Skrypt testowy
- `export_cookies.html` - Helper do eksportu cookies z przeglądarki
- `README_CLOUD.md` - Ten plik

### Zmodyfikowane pliki:
- `app.py` - Dodano cookie injection, keep-alive, cloud config
- `scraper/filman_scraper.py` - Dodano metodę `inject_cookies()`
- `requirements.txt` - Dodano gunicorn, usunięto undetected-chromedriver
- `.gitignore` - Dodano session_cookies.json

## 🔧 Jak używać

### Lokalnie (development):
```bash
cd backend
python app.py
```

### W chmurze (production):
```bash
# Render.com automatycznie uruchomi:
gunicorn app:app
```

### Aktualizacja cookies:
```bash
# 1. Wyeksportuj cookies z przeglądarki (użyj export_cookies.html)
# 2. Wyślij do API:
curl -X POST https://your-app.onrender.com/api/update-session \
  -H "Content-Type: application/json" \
  -d @cookies.json
```

## 🎯 Workflow

1. **Deploy aplikacji** na Render.com
2. **Zaloguj się** na filman.cc w przeglądarce
3. **Wyeksportuj cookies** używając `export_cookies.html`
4. **Zaktualizuj sesję** przez `/api/update-session`
5. **Testuj scraping** przez `/api/scrape/search` i `/api/scrape/links`
6. **Ustaw cron** do pingowania `/api/keep-alive` co 10-15 minut

## ⚠️ Ważne uwagi

- **Cookies wygasają** - musisz je okresowo aktualizować (np. co tydzień)
- **Single worker** - Gunicorn używa 1 workera (Selenium nie jest thread-safe)
- **Timeout** - Zwiększony do 120s dla długich operacji scrapingu
- **Headless mode** - Zawsze włączony w produkcji (brak GUI)

## 🔐 Bezpieczeństwo

- `session_cookies.json` jest w `.gitignore` - nie commituj cookies!
- Używaj HTTPS w produkcji
- Rozważ dodanie autoryzacji do endpointów (API key, JWT)
- Ogranicz dostęp do `/api/update-session` (tylko z zaufanych IP)

## 📊 Monitoring

Użyj zewnętrznych serwisów do monitoringu:
- **UptimeRobot** - sprawdzanie dostępności
- **Cron-job.org** - automatyczne pingowanie keep-alive
- **Render Dashboard** - logi i metryki

## 🐛 Troubleshooting

**Problem**: 401 Unauthorized  
**Rozwiązanie**: Zaktualizuj cookies przez `/api/update-session`

**Problem**: Timeout podczas scrapingu  
**Rozwiązanie**: Zwiększ timeout w `gunicorn.conf.py`

**Problem**: Serwer się uspił  
**Rozwiązanie**: Ustaw cron do pingowania `/api/keep-alive`

**Problem**: Chrome/Chromium not found  
**Rozwiązanie**: Upewnij się, że Render ma zainstalowany Chrome (dodaj buildpack)

## 📚 Dodatkowe zasoby

- [Render.com Docs](https://render.com/docs)
- [Gunicorn Docs](https://docs.gunicorn.org/)
- [Selenium Docs](https://selenium-python.readthedocs.io/)
