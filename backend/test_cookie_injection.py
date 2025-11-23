"""
Test script for cookie injection endpoint
"""
import requests
import json

# Zmień na URL swojego serwera
BASE_URL = "http://localhost:5001"
# BASE_URL = "https://your-app.onrender.com"

def test_update_session_with_string():
    """Test aktualizacji sesji za pomocą cookie string"""
    print("Testing /api/update-session with cookie_string...")
    
    # Przykładowy cookie string (zastąp prawdziwymi cookies)
    cookie_string = "session_id=example123; user_token=token456"
    
    response = requests.post(
        f"{BASE_URL}/api/update-session",
        json={"cookie_string": cookie_string}
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_update_session_with_list():
    """Test aktualizacji sesji za pomocą listy cookies"""
    print("Testing /api/update-session with cookies list...")
    
    # Przykładowa lista cookies (zastąp prawdziwymi cookies)
    cookies = [
        {"name": "session_id", "value": "example123", "domain": ".filman.cc"},
        {"name": "user_token", "value": "token456", "domain": ".filman.cc"}
    ]
    
    response = requests.post(
        f"{BASE_URL}/api/update-session",
        json={"cookies": cookies}
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_health():
    """Test health endpoint"""
    print("Testing /api/health...")
    
    response = requests.get(f"{BASE_URL}/api/health")
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_keep_alive():
    """Test keep-alive endpoint"""
    print("Testing /api/keep-alive...")
    
    response = requests.get(f"{BASE_URL}/api/keep-alive")
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

if __name__ == "__main__":
    print("=" * 60)
    print("Cookie Injection Test Script")
    print("=" * 60)
    print()
    
    # Test health
    test_health()
    
    # Test cookie injection (wybierz jedną metodę)
    # test_update_session_with_string()
    test_update_session_with_list()
    
    # Test health ponownie, żeby sprawdzić czy cookies zostały załadowane
    test_health()
    
    # Test keep-alive
    test_keep_alive()
    
    print("=" * 60)
    print("Tests completed!")
    print("=" * 60)
