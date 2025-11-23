# 🚀 Quick Start - Cloud Deployment

## 5-minutowy przewodnik wdrożenia

### 1️⃣ Deploy na Render.com (2 min)

1. Zaloguj się na [render.com](https://render.com)
2. Kliknij **"New +"** → **"Web Service"**
3. Połącz swoje repozytorium GitHub
4. Wybierz folder: `backend`
5. Konfiguracja:
   ```
   Name: filman-scraper-api
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn app:app --config gunicorn.conf.py
   ```
6. Environment Variables:
   ```
   HEADLESS_MODE = True
   FLASK_DEBUG = False
   ```
7. Kliknij **"Create Web Service"**
8. Poczekaj ~5 minut na build

### 2️⃣ Pobierz cookies z przeglądarki (1 min)

1. Otwórz [filman.cc](https://filman.cc) i zaloguj się
2. Otwórz DevTools (F12) → Console
3. Wklej i uruchom:
   ```javascript
   copy(JSON.stringify({
     cookies: document.cookie.split('; ').map(c => {
       const [name, value] = c.split('=');
       return {name, value, domain: '.filman.cc'};
     })
   }))
   ```
4. Cookies są skopiowane do schowka!

**Alternatywnie**: Otwórz `backend/export_cookies.html` na filman.cc

### 3️⃣ Zaktualizuj sesję (1 min)

Wyślij cookies do swojej aplikacji:

```bash
curl -X POST https://your-app.onrender.com/api/update-session \
  -H "Content-Type: application/json" \
  -d '{"cookies": [WKLEJ_TUTAJ_COOKIES]}'
```

Lub użyj Postman/Insomnia:
- Method: `POST`
- URL: `https://your-app.onrender.com/api/update-session`
- Body (JSON): Wklej skopiowane cookies

### 4️⃣ Testuj! (1 min)

```bash
# Health check
curl https://your-app.onrender.com/api/health

# Szukaj serialu
curl -X POST https://your-app.onrender.com/api/scrape/search \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Breaking Bad",
    "type": "serial",
    "year": 2008
  }'
```

### 5️⃣ Keep-Alive (opcjonalne)

Ustaw cron na [cron-job.org](https://cron-job.org):
- URL: `https://your-app.onrender.com/api/keep-alive`
- Interval: Co 10 minut
- Method: GET

---

## ✅ Gotowe!

Twoja aplikacja działa w chmurze i jest gotowa do scrapingu!

## 🔄 Aktualizacja cookies (gdy wygasną)

Powtórz kroki 2️⃣ i 3️⃣ - zajmie to ~2 minuty.

## 📖 Więcej informacji

- Szczegóły: `CLOUD_DEPLOYMENT.md`
- Zmiany: `CHANGES.md`
- Dokumentacja: `README_CLOUD.md`

## 🆘 Problemy?

**401 Unauthorized**: Cookies wygasły → Zaktualizuj (kroki 2️⃣ + 3️⃣)  
**Timeout**: Zwiększ timeout w Render settings  
**Chrome not found**: Dodaj Chrome buildpack w Render  

## 💡 Pro Tips

1. **Zapisz cookies lokalnie** w pliku `cookies.json` dla łatwej aktualizacji
2. **Monitoruj logi** w Render Dashboard
3. **Testuj lokalnie** przed deploymentem: `python app.py`
4. **Backup cookies** - zapisz je bezpiecznie (nie commituj!)

---

**Potrzebujesz pomocy?** Sprawdź `CLOUD_DEPLOYMENT.md` dla szczegółów.
