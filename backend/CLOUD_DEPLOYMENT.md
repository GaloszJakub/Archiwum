# Cloud Deployment Guide

## Przygotowanie do wdrożenia na Render.com / Heroku

### 1. Konfiguracja zmiennych środowiskowych

Ustaw następujące zmienne w panelu Render/Heroku:

```
PORT=10000                    # Render automatycznie ustawia
HEADLESS_MODE=True           # Zawsze True w chmurze
FLASK_DEBUG=False            # False w produkcji
```

### 2. Aktualizacja cookies sesji

Po wdrożeniu, musisz zaktualizować cookies sesji za pomocą endpointu `/api/update-session`.

#### Metoda 1: Cookie String

```bash
curl -X POST https://your-app.onrender.com/api/update-session \
  -H "Content-Type: application/json" \
  -d '{
    "cookie_string": "session_id=abc123; user_token=xyz789; ..."
  }'
```

#### Metoda 2: Lista cookies

```bash
curl -X POST https://your-app.onrender.com/api/update-session \
  -H "Content-Type: application/json" \
  -d '{
    "cookies": [
      {"name": "session_id", "value": "abc123", "domain": ".filman.cc"},
      {"name": "user_token", "value": "xyz789", "domain": ".filman.cc"}
    ]
  }'
```

### 3. Jak pobrać cookies z przeglądarki

1. Zaloguj się na filman.cc w przeglądarce
2. Otwórz DevTools (F12)
3. Przejdź do zakładki "Application" > "Cookies" > "https://filman.cc"
4. Skopiuj wszystkie cookies (szczególnie te związane z sesją)

Lub użyj tego kodu w konsoli przeglądarki:

```javascript
// Skopiuj wszystkie cookies jako JSON
copy(JSON.stringify(document.cookie.split('; ').map(c => {
  const [name, value] = c.split('=');
  return {name, value, domain: '.filman.cc'};
})))
```

### 4. Endpointy API

#### Health Check
```
GET /api/health
```
Sprawdza status API i sesji logowania.

#### Keep-Alive
```
GET /api/keep-alive
```
Zapobiega uśpieniu serwera i odświeża sesję.

#### Update Session
```
POST /api/update-session
Body: {"cookie_string": "..."} lub {"cookies": [...]}
```
Aktualizuje cookies sesji.

#### Scrape Search
```
POST /api/scrape/search
Body: {"title": "Breaking Bad", "type": "serial", "year": 2008}
```

#### Scrape Links
```
POST /api/scrape/links
Body: {"episodes": [{"episode": "S01E01", "url": "..."}]}
```

### 5. Automatyczne odświeżanie sesji

Możesz użyć zewnętrznego serwisu (np. cron-job.org) do pingowania endpointu `/api/keep-alive` co 10-15 minut, aby:
- Zapobiec uśpieniu serwera na darmowym planie
- Utrzymać aktywną sesję na stronie docelowej

### 6. Render.com - Build & Start Commands

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
gunicorn app:app
```

### 7. Troubleshooting

**Problem: 401 Unauthorized**
- Cookies wygasły lub są nieprawidłowe
- Zaktualizuj cookies przez `/api/update-session`

**Problem: Scraper nie działa**
- Sprawdź logi serwera
- Upewnij się, że HEADLESS_MODE=True
- Sprawdź czy Chrome/Chromium jest dostępny na serwerze

**Problem: Timeout**
- Zwiększ timeout w konfiguracji Render (domyślnie 30s)
- Rozważ przetwarzanie w tle dla długich operacji
