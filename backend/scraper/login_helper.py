"""
Login helper - Opens Chrome for manual login and saves the session.
Run this script first, log in to filman.cc, then the scraper will use the saved session.
"""
import os
import time
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By


SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROFILE_DIR = os.path.join(SCRIPT_DIR, 'chrome_profile')
COOKIES_FILE = os.path.join(SCRIPT_DIR, 'cookies.json')


def save_cookies(driver, filepath: str):
    """Saves browser cookies to a JSON file."""
    cookies = driver.get_cookies()
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(cookies, f, indent=2)
    print(f"[+] Saved {len(cookies)} cookies to {filepath}")


def open_login_browser():
    """Opens Chrome browser for manual login."""
    print("=" * 60)
    print("FILMAN.CC LOGIN HELPER")
    print("=" * 60)
    
    if not os.path.exists(PROFILE_DIR):
        os.makedirs(PROFILE_DIR)
        print(f"[+] Created profile directory: {PROFILE_DIR}")
    
    options = Options()
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-blink-features=AutomationControlled')
    options.add_argument(f'--user-data-dir={PROFILE_DIR}')
    options.add_argument('--profile-directory=Default')
    options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    
    print("[*] Starting Chrome...")
    driver = webdriver.Chrome(options=options)
    driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    
    print("[*] Opening filman.cc login page...")
    driver.get("https://filman.cc/logowanie")
    
    print()
    print("=" * 60)
    print("ACTION REQUIRED:")
    print("1. Log in to your filman.cc account in the browser window")
    print("2. After successful login, return here and press ENTER")
    print("=" * 60)
    print()
    
    input("Press ENTER after you've logged in...")
    
    # Check if logged in
    try:
        logout_elements = driver.find_elements(By.XPATH, "//a[contains(@href, 'wyloguj') or contains(text(), 'Wyloguj')]")
        if logout_elements:
            print("[+] Login confirmed - found logout link")
        else:
            print("[!] Warning: Could not confirm login (no logout link found)")
    except Exception as e:
        print(f"[!] Warning: Could not verify login status: {e}")
    
    # Save cookies
    save_cookies(driver, COOKIES_FILE)
    
    print()
    print("[+] Session saved! You can now use the scraper.")
    print("[*] The session is stored in:")
    print(f"    - Profile: {PROFILE_DIR}")
    print(f"    - Cookies: {COOKIES_FILE}")
    print()
    
    driver.quit()
    print("[+] Browser closed. Done!")


if __name__ == "__main__":
    open_login_browser()
