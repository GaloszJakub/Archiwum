"""
Complete flow test for cloud-ready scraper
Tests: health -> update-session -> scrape
"""
import requests
import json
import sys

# Configuration
BASE_URL = "http://localhost:5001"
# BASE_URL = "https://your-app.onrender.com"

# Example cookies (replace with real ones from export_cookies.html)
EXAMPLE_COOKIES = [
    {"name": "session_id", "value": "example123", "domain": ".filman.cc"},
    {"name": "user_token", "value": "token456", "domain": ".filman.cc"}
]

def print_section(title):
    print("\n" + "=" * 60)
    print(f"  {title}")
    print("=" * 60)

def test_health():
    """Test 1: Health check"""
    print_section("TEST 1: Health Check")
    
    try:
        response = requests.get(f"{BASE_URL}/api/health", timeout=10)
        print(f"✓ Status: {response.status_code}")
        data = response.json()
        print(f"✓ Response: {json.dumps(data, indent=2)}")
        return data.get('status') == 'ok'
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def test_update_session():
    """Test 2: Update session with cookies"""
    print_section("TEST 2: Update Session")
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/update-session",
            json={"cookies": EXAMPLE_COOKIES},
            timeout=10
        )
        print(f"✓ Status: {response.status_code}")
        data = response.json()
        print(f"✓ Response: {json.dumps(data, indent=2)}")
        return data.get('success', False)
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def test_keep_alive():
    """Test 3: Keep-alive"""
    print_section("TEST 3: Keep-Alive")
    
    try:
        response = requests.get(f"{BASE_URL}/api/keep-alive", timeout=30)
        print(f"✓ Status: {response.status_code}")
        data = response.json()
        print(f"✓ Response: {json.dumps(data, indent=2)}")
        return data.get('status') == 'alive'
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def test_scrape_search():
    """Test 4: Scrape search (requires valid cookies)"""
    print_section("TEST 4: Scrape Search")
    
    print("⚠️  This test requires VALID cookies from filman.cc")
    print("    Update EXAMPLE_COOKIES in this script with real cookies")
    print("    or skip this test.\n")
    
    user_input = input("Continue with scrape test? (y/n): ").lower()
    if user_input != 'y':
        print("Skipping scrape test.")
        return None
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/scrape/search",
            json={
                "title": "Breaking Bad",
                "type": "serial",
                "year": 2008
            },
            timeout=60
        )
        print(f"✓ Status: {response.status_code}")
        data = response.json()
        
        if response.status_code == 401:
            print("✗ 401 Unauthorized - Invalid or expired cookies")
            print(f"   Response: {json.dumps(data, indent=2)}")
            return False
        
        print(f"✓ Response: {json.dumps(data, indent=2, ensure_ascii=False)[:500]}...")
        return data.get('success', False)
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def main():
    print("\n" + "🚀" * 30)
    print("  CLOUD-READY SCRAPER - COMPLETE FLOW TEST")
    print("🚀" * 30)
    
    results = {
        'health': False,
        'update_session': False,
        'keep_alive': False,
        'scrape': None
    }
    
    # Test 1: Health
    results['health'] = test_health()
    
    # Test 2: Update Session
    results['update_session'] = test_update_session()
    
    # Test 3: Keep-Alive
    results['keep_alive'] = test_keep_alive()
    
    # Test 4: Scrape (optional)
    results['scrape'] = test_scrape_search()
    
    # Summary
    print_section("SUMMARY")
    print(f"Health Check:    {'✓ PASS' if results['health'] else '✗ FAIL'}")
    print(f"Update Session:  {'✓ PASS' if results['update_session'] else '✗ FAIL'}")
    print(f"Keep-Alive:      {'✓ PASS' if results['keep_alive'] else '✗ FAIL'}")
    
    if results['scrape'] is not None:
        print(f"Scrape Search:   {'✓ PASS' if results['scrape'] else '✗ FAIL'}")
    else:
        print(f"Scrape Search:   ⊘ SKIPPED")
    
    print("\n" + "=" * 60)
    
    # Exit code
    basic_tests_passed = results['health'] and results['update_session'] and results['keep_alive']
    if basic_tests_passed:
        print("✓ All basic tests passed!")
        if results['scrape'] is False:
            print("⚠️  Scrape test failed - check your cookies")
            sys.exit(1)
        sys.exit(0)
    else:
        print("✗ Some tests failed")
        sys.exit(1)

if __name__ == "__main__":
    main()
