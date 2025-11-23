
import os
from scraper.filman_scraper import FilmanScraper
from dotenv import load_dotenv

def main():
    """
    Uruchamia scraper w trybie graficznym w celu ręcznego zalogowania
    i zapisania sesji do profilu przeglądarki.
    """
    load_dotenv()
    
    filman_username = os.getenv('FILMAN_USERNAME')
    filman_password = os.getenv('FILMAN_PASSWORD')
    
    # WAŻNE: Używamy tej samej ścieżki profilu co app.py!
    profile_dir = os.path.join(os.path.dirname(__file__), 'scraper', 'chrome_profile')
    
    print("--- Skrypt logowania do Filman.cc ---")
    print("Ten skrypt otworzy przeglądarkę, abyś mógł się zalogować.")
    print(f"Twoja sesja zostanie zapisana w profilu: {profile_dir}")
    print("Po zalogowaniu możesz zamknąć przeglądarkę.")
    print("-" * 40)
    
    # Używamy `with`, aby przeglądarka zamknęła się automatycznie
    # `headless=False` jest kluczowe dla logowania
    with FilmanScraper(headless=False, debug=True, username=filman_username, password=filman_password, profile_dir=profile_dir) as scraper:
        # Sprawdzamy, czy już jesteśmy zalogowani
        if scraper.check_if_logged_in():
            print("\n✓ Wygląda na to, że jesteś już zalogowany.")
            print("Możesz zamknąć to okno i uruchomić serwer API (app.py).")
            # Czekamy na input użytkownika, żeby okno nie zniknęło od razu
            input("Naciśnij Enter, aby zamknąć przeglądarkę...")
        else:
            # Jeśli nie, rozpoczynamy proces logowania
            print("\n[AKCJA] Otwieram przeglądarkę. Zaloguj się na stronie.")
            scraper.login_manual()

    print("\n✓ Sesja logowania powinna być zapisana.")
    print("Możesz teraz uruchomić główną aplikację za pomocą 'python app.py'.")

if __name__ == '__main__':
    main()
