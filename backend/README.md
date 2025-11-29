# FilmanScraper API - Cloud-Ready Edition

Flask API do scrapowania danych z filman.cc z obsługą zdalnej aktualizacji sesji.

## 🚀 Quick Start

### Lokalne uruchomienie
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Cloud deployment
Zobacz: **[QUICKSTART.md](QUICKSTART.md)** - 5-minutowy przewodnik

## 📚 Dokumentacja

| Plik | Opis |
|------|------|
| **[TAILSCALE_SETUP.md](TAILSCALE_SETUP.md)** | 🚀 Setup Tailscale Funnel - stały publiczny URL |
| **[QUICK_START_CLOUDFLARE.md](QUICK_START_CLOUDFLARE.md)** | ⚡ (Przestarzałe) 5-minutowy start z Cloudflare Tunnel |
| **[CLOUDFLARE_TUNNEL_SETUP.md](CLOUDFLARE_TUNNEL_SETUP.md)** | 🔧 (Przestarzałe) Pełna dokumentacja Cloudflare Tunnel |
| **[MIGRATION_NGROK_TO_CLOUDFLARE.md](MIGRATION_NGROK_TO_CLOUDFLARE.md)** | 🔄 (Przestarzałe) Migracja z ngrok na Cloudflare |
| **[QUICKSTART.md](QUICKSTART.md)** | 5-minutowy przewodnik wdrożenia cloud |
| **[CLOUD_DEPLOYMENT.md](CLOUD_DEPLOYMENT.md)** | Szczegółowa instrukcja cloud deployment |
| **[README_CLOUD.md](README_CLOUD.md)** | Dokumentacja zmian cloud-ready |
| **[CHANGES.md](CHANGES.md)** | Changelog refaktoryzacji |
| **[api_examples.json](api_examples.json)** | Przykłady requestów API |

## 🔌 API Endpoints

### Core Endpoints

#### `GET /api/health`
Sprawdza status API i sesji logowania.

```bash
curl http://localhost:5001/api/health
```

#### `GET /api/keep-alive`
Zapobiega uśpieniu serwera i odświeża sesję.

```bash
curl http://localhost:5001/api/keep-alive
```

#### `POST /api/update-session`
Aktualizuje cookies sesji (kluczowe dla cloud deployment).

```bash
curl -X POST http://localhost:5001/api/update-session \
  -H "Content-Type: application/json" \
  -d '{"cookie_string": "session=abc; token=xyz"}'
```

### Scraping Endpoints

#### `POST /api/scrape/search`
Wyszukuje serial/film i zwraca listę odcinków.

```bash
curl -X POST http://localhost:5001/api/scrape/search \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Breaking Bad",
    "type": "serial",
    "year": 2008
  }'
```

#### `POST /api/scrape/links`
Pobiera linki streamingowe dla wybranych odcinków.

```bash
curl -X POST http://localhost:5001/api/scrape/links \
  -H "Content-Type: application/json" \
  -d '{
    "episodes": [
      {"episode": "S01E01", "url": "https://filman.cc/..."}
    ]
  }'
```

## 🛠️ Konfiguracja

### Environment Variables

```bash
# Development
FLASK_PORT=5001
FLASK_DEBUG=True
HEADLESS_MODE=False

# Production (Render/Heroku)
PORT=10000              # Auto-set by platform
FLASK_DEBUG=False
HEADLESS_MODE=True
```

### Dependencies

```
selenium>=4.15.0
flask>=3.0.0
flask-cors>=4.0.0
python-dotenv>=1.0.0
psutil>=5.9.0
gunicorn>=21.2.0
```

## 🍪 Cookie Management

### Eksport cookies z przeglądarki

1. **Metoda 1**: Użyj `export_cookies.html`
   - Otwórz plik na filman.cc po zalogowaniu
   - Kliknij "Export jako JSON"
   - Skopiuj wynik

2. **Metoda 2**: Console przeglądarki
   ```javascript
   copy(JSON.stringify({
     cookies: document.cookie.split('; ').map(c => {
       const [name, value] = c.split('=');
       return {name, value, domain: '.filman.cc'};
     })
   }))
   ```

### Aktualizacja sesji

```bash
# Metoda 1: Cookie string
curl -X POST http://localhost:5001/api/update-session \
  -H "Content-Type: application/json" \
  -d '{"cookie_string": "session=abc; token=xyz"}'

# Metoda 2: Cookies array
curl -X POST http://localhost:5001/api/update-session \
  -H "Content-Type: application/json" \
  -d '{
    "cookies": [
      {"name": "session", "value": "abc", "domain": ".filman.cc"}
    ]
  }'
```

## 🧪 Testing

### Test scripts

```bash
# Test cookie injection
python test_cookie_injection.py

# Test complete flow
python test_cloud_flow.py

# Test API manually
python test_api.py
```

### Manual testing

```bash
# 1. Start server
python app.py

# 2. Check health
curl http://localhost:5001/api/health

# 3. Update session (with real cookies)
curl -X POST http://localhost:5001/api/update-session \
  -H "Content-Type: application/json" \
  -d @cookies.json

# 4. Test scraping
curl -X POST http://localhost:5001/api/scrape/search \
  -H "Content-Type: application/json" \
  -d '{"title": "Breaking Bad", "type": "serial", "year": 2008}'
```

## 🌐 Cloud Deployment

### Render.com

1. Połącz repozytorium
2. Ustaw:
   - Build: `pip install -r requirements.txt`
   - Start: `gunicorn app:app --config gunicorn.conf.py`
   - Env: `HEADLESS_MODE=True`, `FLASK_DEBUG=False`
3. Deploy!

Zobacz: **[QUICKSTART.md](QUICKSTART.md)** dla szczegółów

### Heroku

```bash
git push heroku main
```

Używa `Procfile` i `runtime.txt` automatycznie.

## 📊 Architecture

```
┌─────────────────┐
│   Frontend      │
│  (React/Vue)    │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│   Flask API     │
│   (app.py)      │
├─────────────────┤
│ Cookie Storage  │
│ (JSON file)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ FilmanScraper   │
│  (Selenium)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   filman.cc     │
└─────────────────┘
```

## 🔐 Security

- ✅ `session_cookies.json` w `.gitignore`
- ✅ CORS enabled (konfigurowalny)
- ⚠️ Brak authentication (TODO)
- ⚠️ Brak rate limiting (TODO)

### Rekomendacje dla produkcji:
1. Dodaj API key authentication
2. Ogranicz CORS do zaufanych domen
3. Dodaj rate limiting
4. Szyfruj `session_cookies.json`
5. Używaj HTTPS

## 🐛 Troubleshooting

### 401 Unauthorized
**Problem**: Cookies wygasły lub nieprawidłowe  
**Rozwiązanie**: Zaktualizuj cookies przez `/api/update-session`

### Timeout podczas scrapingu
**Problem**: Operacja trwa za długo  
**Rozwiązanie**: Zwiększ timeout w `gunicorn.conf.py`

### Chrome not found (cloud)
**Problem**: Brak Chrome/Chromium na serwerze  
**Rozwiązanie**: Dodaj Chrome buildpack w Render

### Server sleep (free tier)
**Problem**: Serwer się uspił  
**Rozwiązanie**: Ustaw cron do pingowania `/api/keep-alive`

## 📝 License

MIT

## 🤝 Contributing

Pull requests welcome!

## 📧 Support

Sprawdź dokumentację w folderze `backend/`:
- `QUICKSTART.md` - Szybki start
- `CLOUD_DEPLOYMENT.md` - Deployment guide
- `CHANGES.md` - Changelog
- `api_examples.json` - API examples

---

**Made with ❤️ for cloud deployment**
