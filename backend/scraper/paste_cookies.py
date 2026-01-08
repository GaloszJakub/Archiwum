import json
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
COOKIES_FILE = os.path.join(SCRIPT_DIR, 'cookies.json')

def paste_cookies():
    print("=" * 60)
    print("MANUAL COOKIE IMPORTER")
    print("=" * 60)
    print("Twoje dane pochodzą z niewłaściwego rozszerzenia (HotCleaner?).")
    print("Musisz użyć rozszerzenia, które eksportuje CZYSTĄ LISTĘ JSON.")
    print()
    print("ZALECANE ROZSZERZENIE: 'Cookie-Editor' (autor: Cookie-Editor)")
    print("Ikona: Ciastko z odgryzionym kawałkiem.")
    print("Link: https://chrome.google.com/webstore/detail/cookie-editor/hlngmmqlayXe...")
    print()
    print("INSTRUKCJA:")
    print("1. Zainstaluj właściwe rozszerzenie 'Cookie-Editor'.")
    print("2. Wejdź na filman.cc (zalogowany).")
    print("3. Kliknij ikonę ciastka -> przycisk 'Export' -> 'Export as JSON'.")
    print("4. JSON powinien zaczynać się od '[' (nawias kwadratowy), a nie '{'.")
    print("=" * 60)
    print()
    
    print("Wklej tutaj POPRAWNY JSON (naciśnij Enter, potem Ctrl+Z i Enter w nowej linii):")
    
    lines = []
    try:
        while True:
            line = input()
            lines.append(line)
    except EOFError:
        pass
        
    raw_data = "\n".join(lines).strip()
    
    if not raw_data:
        print("Pusto. Anulowano.")
        return

    try:
        # Obsługa formatu Netscape (np. z wget/curl export)
        if raw_data.startswith("# Netscape") or "\t" in raw_data:
            print("Wykryto format Netscape/Text. Próba konwersji...")
            cookies = []
            for line in raw_data.splitlines():
                if line.startswith("#") or not line.strip(): continue
                parts = line.split('\t')
                if len(parts) >= 6:
                    cookies.append({
                        'domain': parts[0],
                        'name': parts[5],
                        'value': parts[6].strip() if len(parts) > 6 else ""
                    })
        else:
            # Próba JSON
            if raw_data.startswith('{'):
                try:
                    data = json.loads(raw_data)
                    if "url" in data and "data" in data:
                        print("\n!!! BŁĄD !!!")
                        print("Wkleiłeś dane z rozszerzenia 'Flash/HotCleaner'. ONO NIE DZIAŁA.")
                        print("Zainstaluj standardowy 'Cookie-Editor' i spróbuj ponownie.")
                        return
                except:
                    pass
            
            # Próba naprawy uciętego tablicą
            if not raw_data.startswith('[') and '[' in raw_data:
                raw_data = raw_data[raw_data.find('['):]
                
            cookies = json.loads(raw_data)
        
        if not isinstance(cookies, list):
            print("BŁĄD: To nie jest lista ciasteczek. Użyj opcji 'Export as JSON' w 'Cookie-Editor'.")
            return

        with open(COOKIES_FILE, 'w', encoding='utf-8') as f:
            json.dump(cookies, f, indent=2)
            
        print()
        print(f"[+] SUKCES! Zapisano {len(cookies)} ciasteczek do {COOKIES_FILE}")
        print("Teraz uruchom scraper!")
        
    except json.JSONDecodeError:
        print("BŁĄD SKŁADNI JSON. Upewnij się, że skopiowałeś całość.")
    except Exception as e:
        print(f"BŁĄD: {e}")

if __name__ == "__main__":
    paste_cookies()
