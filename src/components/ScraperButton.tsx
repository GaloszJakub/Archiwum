import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Search, Loader2, Download, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface Episode {
  episode: string;
  title: string;
  url: string;
}

interface ScraperButtonProps {
  movieId: string;
  title: string;
  type: 'movie' | 'series';
  year?: number;
}

export function ScraperButton({ movieId, title, type, year }: ScraperButtonProps) {
  const { user, isAdmin } = useAuth();
  const { t } = useTranslation();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisodes, setSelectedEpisodes] = useState<Set<string>>(new Set());
  const [seasons, setSeasons] = useState<string[]>([]);
  const [showManualSearch, setShowManualSearch] = useState(false);
  const [manualTitle, setManualTitle] = useState('');

  // Scraper is available for admins (works via Tailscale Funnel)
  if (!isAdmin) return null;

  const API_URL = import.meta.env.VITE_SCRAPER_API_URL || 'http://localhost:5001/api';

  const handleSearch = async (customTitle?: string) => {
    setIsSearching(true);
    const searchTitle = customTitle || title;
    
    try {
      const response = await fetch(`${API_URL}/scrape/search`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: searchTitle,
          type: type === 'series' ? 'serial' : 'film',
          year: year
        })
      });

      const data = await response.json();

      if (data.success && data.episodes && data.episodes.length > 0) {
        setEpisodes(data.episodes || []);
        
        if (type === 'series') {
          const uniqueSeasons = [...new Set(
            data.episodes.map((ep: Episode) => ep.episode.match(/S(\d+)/)?.[0] || '')
          )].filter(Boolean) as string[];
          setSeasons(uniqueSeasons);
        } else if (type === 'movie' && data.episodes.length === 1) {
          setSelectedEpisodes(new Set([data.episodes[0].episode]));
        }
        
        setIsOpen(true);
        setShowManualSearch(false);
        toast.success(`Znaleziono ${data.episodes.length} odcinków`, {
          description: 'Wybierz odcinki do pobrania linków',
          icon: <CheckCircle2 className="w-5 h-5" />,
        });
      } else {
        // Nie znaleziono wyników - pokaż dialog ręcznego wyszukiwania
        if (!customTitle) {
          setShowManualSearch(true);
          setManualTitle(title);
          toast.warning('Nie znaleziono wyników', {
            description: 'Spróbuj wpisać tytuł ręcznie',
            icon: <AlertCircle className="w-5 h-5" />,
          });
        } else {
          toast.error('Nie znaleziono wyników', {
            description: 'Spróbuj innego tytułu',
            icon: <XCircle className="w-5 h-5" />,
          });
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Nie można połączyć się z scraperem', {
        description: 'Sprawdź czy backend działa na porcie 5001',
        icon: <AlertCircle className="w-5 h-5" />,
        duration: 5000,
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleManualSearch = () => {
    if (manualTitle.trim()) {
      handleSearch(manualTitle.trim());
    }
  };

  const toggleEpisode = (episodeNum: string) => {
    const newSelected = new Set(selectedEpisodes);
    if (newSelected.has(episodeNum)) {
      newSelected.delete(episodeNum);
    } else {
      newSelected.add(episodeNum);
    }
    setSelectedEpisodes(newSelected);
  };

  const selectSeason = (season: string) => {
    const seasonEpisodes = episodes
      .filter(ep => ep.episode.startsWith(season))
      .map(ep => ep.episode);
    
    const newSelected = new Set(selectedEpisodes);
    seasonEpisodes.forEach(ep => newSelected.add(ep));
    setSelectedEpisodes(newSelected);
  };

  const selectAll = () => {
    setSelectedEpisodes(new Set(episodes.map(ep => ep.episode)));
  };

  const deselectAll = () => {
    setSelectedEpisodes(new Set());
  };

  const handleScrape = async () => {
    if (selectedEpisodes.size === 0) {
      toast.warning('Wybierz przynajmniej jeden odcinek', {
        icon: <AlertCircle className="w-5 h-5" />,
      });
      return;
    }

    setIsScraping(true);
    try {
      // Przygotuj listę odcinków do scrapowania
      const episodesToScrape = episodes.filter(ep => 
        selectedEpisodes.has(ep.episode)
      );

      // Wywołaj scraper
      const response = await fetch(`${API_URL}/scrape/links`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          episodes: episodesToScrape
        })
      });

      const data = await response.json();

      if (data.success) {
        for (const result of data.results) {
          if (!result.links || result.links.length === 0) {
            continue;
          }
          
          if (type === 'series') {
            const match = result.episode.match(/S(\d+)E(\d+)/i);
            if (!match) continue;
            
            const seasonNumber = parseInt(match[1]);
            const episodeNumber = parseInt(match[2]);
            const docId = `${movieId.replace('tmdb_', '')}_s${seasonNumber}_e${episodeNumber}`;
            const mainLink = result.links[0];
            
            const episodeRef = doc(db, 'episodes', docId);
            await setDoc(episodeRef, {
              tmdbId: parseInt(movieId.replace('tmdb_', '')),
              type: 'tv',
              seasonNumber,
              episodeNumber,
              title: `Odcinek ${episodeNumber}`,
              link: mainLink.url,
              quality: mainLink.quality || '720p',
              language: mainLink.version || 'PL',
              // Dodaj wszystkie linki jako array
              links: result.links.map((link: any) => ({
                url: link.url,
                provider: link.provider,
                quality: link.quality || '720p',
                version: link.version || 'PL',
                dateAdded: link.date_added || ''
              })),
              addedBy: user?.uid,
              addedAt: new Date(),
              updatedAt: new Date()
            });
          } else {
            const docId = `${movieId.replace('tmdb_', '')}_movie`;
            const mainLink = result.links[0];
            const movieRef = doc(db, 'episodes', docId);
            await setDoc(movieRef, {
              tmdbId: parseInt(movieId.replace('tmdb_', '')),
              type: 'movie',
              seasonNumber: null,
              episodeNumber: null,
              title: title,
              link: mainLink.url,
              quality: mainLink.quality || '720p',
              language: mainLink.version || 'PL',
              // Dodaj wszystkie linki jako array
              links: result.links.map((link: any) => ({
                url: link.url,
                provider: link.provider,
                quality: link.quality || '720p',
                version: link.version || 'PL',
                dateAdded: link.date_added || ''
              })),
              addedBy: user?.uid,
              addedAt: new Date(),
              updatedAt: new Date()
            });
          }
        }

        toast.success(`Pobrano linki dla ${data.results.length} odcinków`, {
          description: 'Strona zostanie odświeżona za chwilę...',
          icon: <CheckCircle2 className="w-5 h-5" />,
          duration: 3000,
        });

        setIsOpen(false);
        setSelectedEpisodes(new Set());
        
        // Auto-refresh po 2 sekundach
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error('Nie udało się pobrać linków', {
          description: data.error || 'Sprawdź logi w konsoli',
          icon: <XCircle className="w-5 h-5" />,
        });
      }
    } catch (error) {
      console.error('Scrape error:', error);
      toast.error('Nie można pobrać linków', {
        description: 'Sprawdź czy backend działa i czy jesteś zalogowany',
        icon: <AlertCircle className="w-5 h-5" />,
        duration: 5000,
      });
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => handleSearch()}
        disabled={isSearching}
        variant="outline"
        size="sm"
      >
        {isSearching ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Wyszukiwanie...
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Przeszukaj
          </>
        )}
      </Button>

      {/* Manual Search Dialog */}
      <Dialog open={showManualSearch} onOpenChange={setShowManualSearch}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Wpisz tytuł ręcznie</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Nie znaleziono wyników dla "{title}". Spróbuj wpisać tytuł w innej formie.
            </p>
            <Input
              value={manualTitle}
              onChange={(e) => setManualTitle(e.target.value)}
              placeholder="Wpisz tytuł..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleManualSearch();
                }
              }}
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowManualSearch(false)}
              >
                Anuluj
              </Button>
              <Button
                onClick={handleManualSearch}
                disabled={isSearching || !manualTitle.trim()}
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Szukam...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Szukaj
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Episodes Selection Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>
              Wybierz {type === 'series' ? 'odcinki' : 'film'} do pobrania
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 flex-1 overflow-y-auto">
            {type === 'movie' && episodes.length === 1 ? (
              <div className="space-y-4">
                <div className="bg-primary/10 border-2 border-primary rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedEpisodes.has(episodes[0].episode)}
                        onCheckedChange={() => toggleEpisode(episodes[0].episode)}
                        className="h-6 w-6"
                      />
                      <div>
                        <h3 className="text-xl font-bold">{episodes[0].title}</h3>
                        <p className="text-sm text-muted-foreground">Gotowy do pobrania linków</p>
                      </div>
                    </div>
                    <Download className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Kliknij "Pobierz linki" aby pobrać wszystkie dostępne linki streamingowe dla tego filmu.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex gap-2 flex-wrap">
                  <Button onClick={selectAll} variant="outline" size="sm">
                    {t('common.selectAll')}
                  </Button>
                  <Button onClick={deselectAll} variant="outline" size="sm">
                    {t('common.deselectAll')}
                  </Button>
                  
                  {type === 'series' && seasons.map(season => (
                    <Button
                      key={season}
                      onClick={() => selectSeason(season)}
                      variant="outline"
                      size="sm"
                    >
                      Zaznacz {season}
                    </Button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {episodes.map((ep) => (
                    <div
                      key={ep.episode}
                      className="flex items-center space-x-2 p-2 border rounded hover:bg-accent cursor-pointer"
                      onClick={() => toggleEpisode(ep.episode)}
                    >
                      <Checkbox
                        checked={selectedEpisodes.has(ep.episode)}
                        onCheckedChange={() => toggleEpisode(ep.episode)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{ep.episode}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {ep.title}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

          </div>

          <div className="flex items-center justify-between pt-4 border-t flex-shrink-0">
            <div className="text-sm text-muted-foreground">
              Wybrano: {selectedEpisodes.size} / {episodes.length}
            </div>
            <Button
              onClick={handleScrape}
              disabled={isScraping || selectedEpisodes.size === 0}
            >
              {isScraping ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Pobieranie...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Pobierz linki ({selectedEpisodes.size})
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
