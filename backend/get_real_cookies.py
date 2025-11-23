"""
Script to login manually and export real cookies for testing
"""
from scraper.filman_scraper import FilmanScraper
import json
import os

def main():
    print("=" * 60)
    print("  MANUAL LOGIN - Cookie Extraction")
    print("=" * 60)
    print()
    
    # Create scraper in non-headless mode for manual login
    scraper = FilmanScraper(
        headless=False,
        debug=True,
        profile_dir=os.path.join(os.path.dirname(__file__), 'scraper', 'chrome_profile')
    )
    
    try:
        # Check if already logged in
        if scraper.check_if_logged_in():
            print("✓ Already logged in!")
        else:
            print("Not logged in. Starting manual login...")
            if not scraper.login_manual():
                print("✗ Login failed!")
                return
        
        # Extract cookies from Selenium
        print("\n" + "=" * 60)
        print("  Extracting cookies...")
        print("=" * 60)
        
        selenium_cookies = scraper.driver.get_cookies()
        
        # Convert to our format
        cookies = []
        for cookie in selenium_cookies:
            cookies.append({
                'name': cookie['name'],
                'value': cookie['value'],
                'domain': cookie.get('domain', '.filman.cc')
            })
        
        print(f"\n✓ Extracted {len(cookies)} cookies")
        
        # Save to file
        cookies_file = os.path.join(os.path.dirname(__file__), 'real_cookies.json')
        with open(cookies_file, 'w') as f:
            json.dump({'cookies': cookies}, f, indent=2)
        
        print(f"✓ Saved to: {cookies_file}")
        
        # Display for manual copy
        print("\n" + "=" * 60)
        print("  JSON for /api/update-session:")
        print("=" * 60)
        print(json.dumps({'cookies': cookies}, indent=2))
        
        print("\n" + "=" * 60)
        print("  Next steps:")
        print("=" * 60)
        print("1. Start the API: python app.py")
        print("2. Send cookies: curl -X POST http://localhost:5001/api/update-session \\")
        print("                      -H 'Content-Type: application/json' \\")
        print("                      -d @real_cookies.json")
        print("3. Test scraping!")
        print()
        
    finally:
        input("\nPress Enter to close browser and exit...")
        scraper.close()

if __name__ == "__main__":
    main()
