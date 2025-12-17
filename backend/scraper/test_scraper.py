"""
Test script for FilmanScraper - searches for a movie/series and extracts info.
"""
from filman_scraper import FilmanScraper


def test_scraper():
    print("=" * 60)
    print("FILMAN SCRAPER TEST")
    print("=" * 60)
    
    # Use headless=False to see what's happening
    scraper = FilmanScraper(headless=False, debug=True)
    
    try:
        # Check if logged in using saved session
        if scraper.check_if_logged_in():
            print("\n[+] Session active - logged in!")
        else:
            print("\n[!] Not logged in. Run login_helper.py first.")
            return
        
        # Test search - change the title as needed
        search_query = "Matrix"
        print(f"\n[*] Searching for: {search_query}")
        
        if scraper.search_series(search_query):
            results = scraper.get_search_results()
            print(f"\n[+] Found {len(results)} results:")
            for i, r in enumerate(results[:5]):  # Show first 5
                print(f"  {i}. [{r['type']}] {r['title']} ({r['year']})")
            
            if results:
                print("\n[*] Selecting first result...")
                if scraper.select_result_by_index(0):
                    episodes = scraper.extract_episodes()
                    print(f"\n[+] Extracted {len(episodes)} episode(s)/movie(s)")
                    for ep in episodes[:3]:  # Show first 3
                        print(f"  - {ep['episode']}: {ep['title']}")
        
        print("\n[+] Test completed successfully!")
        
    except Exception as e:
        print(f"\n[!] Error: {e}")
    finally:
        input("\nPress ENTER to close browser...")
        scraper.close()


if __name__ == "__main__":
    test_scraper()
