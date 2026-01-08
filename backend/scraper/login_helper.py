"""
Login helper - Opens Chrome for manual login and saves the session.
Run this script first, log in to filman.cc, then the scraper will use the saved session.
"""
import os
import time
import json
import undetected_chromedriver as uc
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
    print("FILMAN.CC LOGIN HELPER (UNDETECTED MODE)")
    print("=" * 60)
    
    # Ensure profile directory exists
    if not os.path.exists(PROFILE_DIR):
        os.makedirs(PROFILE_DIR)
        print(f"[+] Created profile directory: {PROFILE_DIR}")
    
    print("[*] Starting Chrome (this might take a few seconds)...")
    
    # Initialize undetected-chromedriver
    # Note: user_multi_procs=True is often needed to avoid errors
    options = uc.ChromeOptions()
    options.add_argument(f'--user-data-dir={PROFILE_DIR}')
    options.add_argument('--profile-directory=Default')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    
    driver = uc.Chrome(options=options, use_subprocess=True)
    
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
    try:
        save_cookies(driver, COOKIES_FILE)
        print()
        print("[+] Session saved! You can now use the scraper.")
        print("[*] The session is stored in:")
        print(f"    - Profile: {PROFILE_DIR}")
        print(f"    - Cookies: {COOKIES_FILE}")
    except Exception as e:
        print(f"[!] Error saving cookies: {e}")
    
    print()
    driver.quit()
    print("[+] Browser closed. Done!")


if __name__ == "__main__":
    open_login_browser()
