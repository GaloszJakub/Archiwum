"""
This module provides the FilmanScraper class for scraping movie and series data from filman.cc.
It uses undetected-chromedriver to bypass Cloudflare protection.
"""
import os
import re
import time
import traceback
import logging
import base64
import json
from typing import List, Dict, Optional

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

try:
    import psutil
except ImportError:
    psutil = None
    print("[FilmanScraper] Warning: 'psutil' library not found. Force-killing browser processes on close will not be available.")



class FilmanScraper:
    """
    Scrapes TV show episode links from filman.cc using undetected-chromedriver.
    It's designed to handle login, save sessions to a profile, and extract streaming links.
    """
    
    BASE_URL = "https://filman.cc"
    LOGIN_URL = "https://filman.cc/logowanie"
    
    LOGIN_USERNAME_SELECTOR = "input[name='username']"
    LOGIN_PASSWORD_SELECTOR = "input[name='password']"
    LOGIN_BUTTON_SELECTOR = "button[type='submit']"
    
    SEARCH_INPUT_SELECTOR = "input[name='phrase']"
    
    SEARCH_RESULTS_CONTAINER = "#advanced-search"
    SEARCH_RESULTS_SELECTOR = ".poster"
    SEARCH_RESULT_LINK_SELECTOR = "a.img-responsive"
    SEARCH_RESULT_TITLE_SELECTOR = ".film_title"
    
    EPISODES_LIST_CONTAINER = "#episode-list"
    EPISODES_LIST_SELECTOR = "#episode-list ul li"
    EPISODE_LINK_SELECTOR = "a"
    
    STREAMING_LINKS_TABLE = "#links tbody tr"
    STREAMING_LINK_SELECTOR = "a[data-iframe]"
    
    DEFAULT_TIMEOUT = 15
    LOAD_DELAY = 2
    MANUAL_CAPTCHA_TIMEOUT = 300
    
    def __init__(self, headless: bool = False, debug: bool = False, 
                 username: str = None, password: str = None, profile_dir: str = None):
        """
        Initializes the scraper.

        Args:
            headless: Run in headless mode. Set to False for the first login to save the session.
            debug: Enable verbose logging.
            username: Filman.cc username (optional).
            password: Filman.cc password (optional).
            profile_dir: Directory for the Chrome profile. Defaults to './chrome_profile'.
        """
        self.headless = headless
        self.debug = debug
        self.username = username
        self.password = password
        self.driver: Optional[uc.Chrome] = None
        self.is_logged_in = False
        
        # Configure basic logging to see uc's output
        logging.basicConfig(level=logging.INFO)
        
        if profile_dir is None:
            script_dir = os.path.dirname(os.path.abspath(__file__))
            self.profile_dir = os.path.join(script_dir, 'chrome_profile')
        else:
            self.profile_dir = profile_dir
        
        if not os.path.exists(self.profile_dir):
            os.makedirs(self.profile_dir)
            self._log(f"✓ Created profile directory: {self.profile_dir}")
        else:
            self._log(f"✓ Using existing profile: {self.profile_dir}")
        
    def _log(self, message: str):
        """Prints a log message if debug mode is enabled."""
        if self.debug:
            print(f"[FilmanScraper] {message}")

    def _init_driver(self):
        """Initializes the Chrome driver with standard Selenium."""
        try:
            self._log(f"Initializing Chrome driver with profile: {self.profile_dir}")

            options = Options()

            if self.headless:
                options.add_argument('--headless=new')

            options.add_argument('--no-sandbox')
            options.add_argument('--disable-dev-shm-usage')
            options.add_argument('--disable-blink-features=AutomationControlled')
            
            # Używamy profilu Chrome - to DZIAŁA ze zwykłym Selenium!
            options.add_argument(f'--user-data-dir={self.profile_dir}')
            options.add_argument('--profile-directory=Default')
            
            # Dodaj user-agent żeby wyglądać jak normalny Chrome
            options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
            
            self.driver = webdriver.Chrome(options=options)
            
            # Usuń właściwości webdriver
            self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            
            self._log("✓ Chrome driver initialized.")
        except Exception as e:
            self._log(f"✗ Failed to initialize driver: {e}")
            # Ensure driver is None if initialization fails
            self.driver = None 
            raise
    
    def _wait_for_element(self, by: By, selector: str, timeout: int = None) -> Optional[any]:
        """Waits for a single element to be present on the page."""
        timeout = timeout or self.DEFAULT_TIMEOUT
        try:
            return WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located((by, selector))
            )
        except TimeoutException:
            self._log(f"Timeout waiting for element: {selector}")
            return None
    
    def inject_cookies(self, cookies: List[Dict[str, str]]):
        """
        Injects cookies into the browser session.
        
        Args:
            cookies: List of cookie dictionaries with 'name', 'value', and optionally 'domain'
        """
        try:
            if not self.driver:
                self._init_driver()
            
            if not self.driver:
                raise Exception("Driver not available for cookie injection")
            
            # Navigate to the domain first (required for adding cookies)
            self.driver.get(self.BASE_URL)
            time.sleep(1)
            
            # Add each cookie
            for cookie in cookies:
                try:
                    # Ensure required fields
                    if 'name' not in cookie or 'value' not in cookie:
                        self._log(f"Skipping invalid cookie: {cookie}")
                        continue
                    
                    # Add domain if not present
                    if 'domain' not in cookie:
                        cookie['domain'] = '.filman.cc'
                    
                    self.driver.add_cookie(cookie)
                    self._log(f"✓ Added cookie: {cookie['name']}")
                except Exception as e:
                    self._log(f"Failed to add cookie {cookie.get('name', 'unknown')}: {e}")
            
            # Refresh to apply cookies
            self.driver.refresh()
            time.sleep(2)
            
            self._log("✓ Cookies injected successfully")
        except Exception as e:
            self._log(f"Error injecting cookies: {e}")
            raise
    
    def check_if_logged_in(self) -> bool:
        """
        Checks for an active login session by looking for a "Logout" link.
        """
        try:
            self._log("Checking for existing login session...")
            if not self.driver:
                self._init_driver()

            # If driver is still None after init attempt, we can't proceed.
            if not self.driver:
                self._log("✗ Driver not available, cannot check login status.")
                return False
            
            self.driver.get(self.BASE_URL)
            time.sleep(2)
            
            logout_elements = self.driver.find_elements(By.XPATH, "//a[contains(@href, 'wyloguj') or contains(text(), 'Wyloguj')]")
            user_menu_elements = self.driver.find_elements(By.CSS_SELECTOR, ".user-menu, .user-panel, .user-info, .user-name")
            
            if logout_elements or user_menu_elements:
                self._log("✓ Already logged in.")
                self.is_logged_in = True
                return True
            
            self._log("✗ Not logged in.")
            return False
        except Exception as e:
            self._log(f"Error while checking login status: {e}")
            return False
    
    def login_manual(self) -> bool:
        """
        Handles manual login by opening the login page and waiting for the user.
        Pre-fills the form if username/password were provided.
        """
        try:
            # Defensive check: ensure driver is initialized.
            if not self.driver:
                self._log("Driver not found, attempting to initialize for login.")
                self._init_driver()

            # If driver is still None, we cannot proceed.
            if not self.driver:
                self._log("✗ Cannot open login page because driver is not available.")
                return False

            self._log("=== MANUAL LOGIN REQUIRED ===")
            self.driver.get(self.LOGIN_URL)
            time.sleep(2)
            
            if '/logowanie' not in self.driver.current_url:
                self._log("✓ Already logged in (redirected from login page).")
                self.is_logged_in = True
                return True
            
            if self.username and self.password:
                self._log("Attempting to auto-fill login form...")
                try:
                    username_field = self._wait_for_element(By.CSS_SELECTOR, self.LOGIN_USERNAME_SELECTOR, 5)
                    password_field = self._wait_for_element(By.CSS_SELECTOR, self.LOGIN_PASSWORD_SELECTOR, 5)
                    if username_field and password_field:
                        username_field.clear()
                        username_field.send_keys(self.username)
                        password_field.clear()
                        password_field.send_keys(self.password)
                        self._log("✓ Form fields filled.")
                    else:
                        self._log("Could not find login fields to fill.")
                except Exception as e:
                    self._log(f"Failed to auto-fill form: {e}. Please fill it manually.")
            
            print("\n" + "="*60)
            print("ACTION REQUIRED: Please log in manually in the browser window.")
            print(f"Waiting for up to {self.MANUAL_CAPTCHA_TIMEOUT} seconds.")
            print("="*60 + "\n")
            
            try:
                # 1. Czekamy, aż formularz logowania zniknie
                WebDriverWait(self.driver, self.MANUAL_CAPTCHA_TIMEOUT).until(
                    EC.invisibility_of_element_located((By.CSS_SELECTOR, self.LOGIN_USERNAME_SELECTOR))
                )
                self._log("✓ Login form disappeared, waiting for confirmation...")

                # 2. Czekamy na pojawienie się elementu potwierdzającego zalogowanie (np. link "Wyloguj")
                logout_selector = "//a[contains(@href, 'wyloguj') or contains(text(), 'Wyloguj')]"
                WebDriverWait(self.driver, 15).until(
                    EC.presence_of_element_located((By.XPATH, logout_selector))
                )
                
                self._log("✓ Login confirmed by presence of logout link.")
                self.is_logged_in = True
                print("\n✓ LOGIN SUCCESSFUL!\n")
                return True
            except TimeoutException:
                # Jeśli powyższe zawiodło, zróbmy ostateczne sprawdzenie
                if self.check_if_logged_in(): 
                    self._log("✓ Login confirmed by secondary check.")
                    return True
                print("\n✗ TIMEOUT - Manual login failed or took too long.\n")
                return False
        except Exception as e:
            self._log(f"An error occurred during manual login: {e}")
            return False
    
    def search_series(self, series_name: str, content_type: str = None) -> bool:
        """Performs a search on the website."""
        try:
            self._log(f"Searching for: {series_name}")
            if not self.driver:
                self._init_driver()
            
            self.driver.get(self.BASE_URL)
            time.sleep(self.LOAD_DELAY)
            
            search_input = self._wait_for_element(By.CSS_SELECTOR, self.SEARCH_INPUT_SELECTOR)
            if not search_input:
                self._log("✗ Search input field not found.")
                return False
            
            search_input.clear()
            search_input.send_keys(series_name)
            search_input.send_keys(Keys.RETURN)
            time.sleep(self.LOAD_DELAY)
            
            self._log("✓ Search submitted.")
            return True
        except Exception as e:
            self._log(f"✗ Error during search: {e}")
            return False
    
    def get_search_results(self, content_type: str = None) -> List[Dict[str, str]]:
        """
        Retrieves all results from the search page.
        """
        results = []
        try:
            self._log("Fetching search results...")
            self._wait_for_element(By.CSS_SELECTOR, self.SEARCH_RESULTS_CONTAINER, 5)
            
            poster_elements = self.driver.find_elements(By.CSS_SELECTOR, self.SEARCH_RESULTS_SELECTOR)
            self._log(f"Found {len(poster_elements)} results on the page.")
            
            for poster in poster_elements:
                try:
                    link_elem = poster.find_element(By.CSS_SELECTOR, self.SEARCH_RESULT_LINK_SELECTOR)
                    url = link_elem.get_attribute('href')
                    
                    parent = poster.find_element(By.XPATH, "..")
                    title = parent.find_element(By.CSS_SELECTOR, self.SEARCH_RESULT_TITLE_SELECTOR).text.strip()
                    
                    year = ""
                    try:
                        year = parent.find_element(By.CSS_SELECTOR, ".film_year").text.strip()
                    except NoSuchElementException:
                        pass # Year is optional
                    
                    item_type = "serial" if "/s/" in url or "/serial/" in url else "film" if "/m/" in url or "/film/" in url else "unknown"
                    
                    if content_type and item_type != content_type.lower():
                        continue
                    
                    results.append({'title': title, 'url': url, 'type': item_type, 'year': year})
                except NoSuchElementException:
                    continue
            
            return results
        except Exception as e:
            self._log(f"✗ Error fetching search results: {e}")
            return results
    
    def select_result_by_index(self, index: int = 0, content_type: str = None) -> bool:
        """Clicks a search result by its index."""
        try:
            self._log(f"Selecting result at index {index} (type: {content_type or 'any'})...")
            
            poster_elements = self.driver.find_elements(By.CSS_SELECTOR, self.SEARCH_RESULTS_SELECTOR)
            
            filtered_posters = []
            if content_type:
                for poster in poster_elements:
                    try:
                        url = poster.find_element(By.CSS_SELECTOR, self.SEARCH_RESULT_LINK_SELECTOR).get_attribute('href')
                        if (content_type.lower() == "serial" and ("/s/" in url or "/serial/" in url)) or \
                           (content_type.lower() == "film" and ("/m/" in url or "/film/" in url)):
                            filtered_posters.append(poster)
                    except NoSuchElementException:
                        continue
            else:
                filtered_posters = poster_elements
            
            if not filtered_posters or len(filtered_posters) <= index:
                self._log(f"✗ Result at index {index} not found (found {len(filtered_posters)} matching items).")
                return False
            
            target_poster = filtered_posters[index]
            link = target_poster.find_element(By.CSS_SELECTOR, self.SEARCH_RESULT_LINK_SELECTOR)
            link.click()
            time.sleep(self.LOAD_DELAY)
            
            # Movies might load slower, add a small extra delay
            if "/m/" in self.driver.current_url or "/film/" in self.driver.current_url:
                time.sleep(2)
            
            self._log(f"✓ Clicked on result #{index}.")
            return True
        except Exception as e:
            self._log(f"✗ Error selecting result: {e}")
            return False
    
    def extract_episodes(self) -> List[Dict[str, str]]:
        """
        Extracts episodes from a series page, or a single "episode" for a movie.
        """
        episodes = []
        try:
            self._log("Extracting episode list...")
            current_url = self.driver.current_url
            is_movie = "/m/" in current_url or "/film/" in current_url
            
            if is_movie:
                self._log("✓ Movie detected, creating a single entry.")
                try:
                    movie_title = self.driver.find_element(By.CSS_SELECTOR, "h1, .film-title, .page-title").text.strip()
                except NoSuchElementException:
                    movie_title = "Film"
                
                episodes.append({'episode': 'FILM', 'title': movie_title, 'url': current_url})
                return episodes

            self._log("Series detected, extracting from list...")
            self._wait_for_element(By.CSS_SELECTOR, self.EPISODES_LIST_CONTAINER)
            episode_elements = self.driver.find_elements(By.CSS_SELECTOR, self.EPISODES_LIST_SELECTOR)
            
            for element in episode_elements:
                try:
                    if element.find_elements(By.TAG_NAME, 'span'): # Skip season headers
                        continue
                    
                    link_elem = element.find_element(By.CSS_SELECTOR, self.EPISODE_LINK_SELECTOR)
                    episode_url = link_elem.get_attribute('href')
                    full_text = link_elem.text.strip()
                    
                    match = re.match(r'\[([^\]]+)\]\s*(.*)', full_text)
                    if match:
                        episode_number = match.group(1).upper()
                        episode_title = match.group(2).strip()
                        episodes.append({'episode': episode_number, 'title': episode_title, 'url': episode_url})
                    else:
                        episodes.append({'episode': full_text, 'title': '', 'url': episode_url})
                except NoSuchElementException:
                    continue
            
            self._log(f"✓ Extracted {len(episodes)} episodes.")
            return episodes
        except Exception as e:
            self._log(f"✗ Error extracting episodes: {e}")
            traceback.print_exc()
            return episodes
    
    def extract_streaming_links(self, episode_url: str) -> List[Dict[str, str]]:
        """
        Navigates to an episode page and extracts streaming links from allowed providers.
        """
        links = []
        ALLOWED_PROVIDERS = ['doodstream', 'voe.sx', 'savefiles', 'vid-guard', 'streamup']
        
        try:
            self._log(f"Navigating to episode page: {episode_url}")
            main_window_handle = self.driver.current_window_handle
            
            self.driver.get(episode_url)
            time.sleep(self.LOAD_DELAY)
            
            link_rows = self.driver.find_elements(By.CSS_SELECTOR, self.STREAMING_LINKS_TABLE)
            self._log(f"Found {len(link_rows)} potential streaming links.")

            for idx, row in enumerate(link_rows):
                try:
                    cells = row.find_elements(By.TAG_NAME, 'td')
                    if len(cells) < 3: continue

                    # Get link from first column only (td.link-to-video)
                    link_elem = row.find_element(By.CSS_SELECTOR, 'td.link-to-video ' + self.STREAMING_LINK_SELECTOR)
                    provider = link_elem.text.strip().lower().split()[0] if link_elem.text else 'unknown'
                    
                    if not any(allowed in provider for allowed in ALLOWED_PROVIDERS):
                        self._log(f"  - Skipping link {idx+1}/{len(link_rows)}: Provider '{provider}' not allowed.")
                        continue
                    
                    version = cells[1].text.strip()
                    quality = cells[2].text.strip()
                    self._log(f"  + Processing link {idx+1}: {provider} | {version} | {quality}")
                    
                    # Extract URL from data-iframe attribute (base64 encoded JSON)
                    streaming_url = None
                    try:
                        data_iframe = link_elem.get_attribute('data-iframe')
                        if data_iframe:
                            # Decode base64 and parse JSON
                            decoded = base64.b64decode(data_iframe).decode('utf-8')
                            iframe_data = json.loads(decoded)
                            streaming_url = iframe_data.get('src')
                            self._log(f"    ✓ Extracted URL from data-iframe: {streaming_url}")
                        else:
                            self._log("    ✗ No data-iframe attribute found")
                    except Exception as decode_error:
                        self._log(f"    ✗ Error decoding data-iframe: {decode_error}")
                    
                    if streaming_url:
                        links.append({
                            'provider': provider, 'url': streaming_url, 'quality': quality, 'version': version
                        })
                except Exception as e:
                    self._log(f"    ✗ Error processing a link: {e}")
            
            self._log(f"✓ Extracted {len(links)} streaming links from allowed providers.")
            return links
        except Exception as e:
            self._log(f"✗ A fatal error occurred during streaming link extraction: {e}")
            traceback.print_exc()
            return links
    
    def scrape_series(self, series_name: str, content_type: str = "serial", result_index: int = 0,
                     include_streaming_links: bool = False, auto_relogin_headless: bool = True) -> List[Dict[str, any]]:
        """
        Main method to search, select, and scrape content.
        """
        try:
            if not self.driver:
                self._init_driver()
            
            if not self.is_logged_in and not self.check_if_logged_in():
                if self.headless and auto_relogin_headless:
                    self._log("⚠ Headless mode without login. Switching to GUI for manual login.")
                    self.close()
                    
                    original_headless, self.headless = self.headless, False
                    self._init_driver()
                    if not self.login_manual():
                        self._log("✗ Login failed, aborting.")
                        return []
                    
                    self._log("✓ Login successful. Switching back to headless mode.")
                    self.close()
                    self.headless = original_headless
                    self._init_driver()
                    
                    if not self.check_if_logged_in():
                        self._log("✗ Session not persisted after relogin. Aborting.")
                        return []
                    self._log("✓ Session active in new headless browser.")
                else:
                    self._log("Not logged in. Starting manual login.")
                    if not self.login_manual():
                        self._log("✗ Login failed, aborting.")
                        return []
            
            if not self.search_series(series_name):
                return []
            
            search_results = self.get_search_results(content_type)
            if self.debug and search_results:
                print("\n--- Search Results ---")
                for i, r in enumerate(search_results):
                    print(f"{i}. [{r['type']}] {r['title']} ({r['year']})")
                print(f"--> Selecting result #{result_index}\n")
            
            if not self.select_result_by_index(result_index, content_type):
                return []
            
            episodes = self.extract_episodes()
            
            if include_streaming_links and episodes:
                self._log(f"\n=== Fetching streaming links for {len(episodes)} episodes ===")
                for i, episode in enumerate(episodes):
                    self._log(f"\n[{i+1}/{len(episodes)}] Scraping: {episode.get('episode', 'N/A')} - {episode.get('title', 'N/A')}")
                    episode['streaming_links'] = self.extract_streaming_links(episode['url'])
                self._log("\n=== Finished fetching streaming links ===")
            
            return episodes
        except Exception as e:
            self._log(f"A critical error occurred in scrape_series: {e}")
            traceback.print_exc()
            return []
    
    def close(self):
        """Closes the browser gracefully."""
        if self.driver:
            self._log("Closing browser...")
            try:
                self.driver.quit()
                self._log("✓ Browser closed.")
            except Exception as e:
                self._log(f"⚠ An error occurred during driver.quit(): {e}")
            finally:
                self.driver = None
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()
