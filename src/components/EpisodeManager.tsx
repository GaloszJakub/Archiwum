import { useState, useEffect } from 'react';
import { Plus, ExternalLink, Trash2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useSeasonEpisodes, useAddEpisodeLink, useDeleteEpisodeLink } from '@/hooks/useEpisodes';
import { stopLenis, startLenis } from '@/lib/smoothScroll';
import { useSeasonDetails } from '@/hooks/useTMDB';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface EpisodeManagerProps {
  tmdbId: number;
  seasonNumber: number;
  episodeCount: number;
  seasonName: string;
}

export const EpisodeManager = ({ tmdbId, seasonNumber, episodeCount, seasonName }: EpisodeManagerProps) => {
  const { isAdmin } = useAuth();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [link, setLink] = useState('');
  const [quality, setQuality] = useState('1080p');
  const [language, setLanguage] = useState('PL');
  const [playerOpen, setPlayerOpen] = useState(false);
  const [currentPlayerUrl, setCurrentPlayerUrl] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<{ episodeNumber: number; linkIndex: number } | null>(null);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [episodeToDelete, setEpisodeToDelete] = useState<number | null>(null);

  const { data: episodes, isLoading } = useSeasonEpisodes(tmdbId, seasonNumber);
  const { data: seasonDetails } = useSeasonDetails(tmdbId, seasonNumber);
  const addEpisodeLink = useAddEpisodeLink();
  const deleteEpisodeLink = useDeleteEpisodeLink();

  // Block body scroll when dialog is open
  useEffect(() => {
    if (open || playerOpen) {
      // Stop Lenis smooth scroll
      stopLenis();
      // Block body scroll
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      startLenis();
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      startLenis();
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [open, playerOpen]);

  const handlePlayClick = (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentPlayerUrl(url);
    setPlayerOpen(true);
  };

  const handleAddLink = async () => {
    if (!link.trim()) return;

    // Get episode title from TMDB
    const episodeTitle = seasonDetails?.episodes?.find(
      ep => ep.episode_number === selectedEpisode
    )?.name || '';

    try {
      await addEpisodeLink.mutateAsync({
        tmdbId,
        seasonNumber,
        episodeNumber: selectedEpisode,
        link: link.trim(),
        options: {
          title: episodeTitle,
          quality,
          language,
        },
      });

      setLink('');
      setOpen(false);
      toast.success(t('common.success'), {
        description: `${t('details.episode')} ${selectedEpisode} - ${quality}`,
      });
    } catch (error) {
      console.error('Error adding episode link:', error);
      toast.error(t('common.error'), {
        description: 'Spróbuj ponownie',
      });
    }
  };

  const handleDelete = (episodeNumber: number) => {
    setEpisodeToDelete(episodeNumber);
    setDeleteAllDialogOpen(true);
  };

  const confirmDeleteAll = async () => {
    if (episodeToDelete === null) return;

    setDeleteAllDialogOpen(false);
    const episodeNum = episodeToDelete;
    setEpisodeToDelete(null);

    toast.promise(
      deleteEpisodeLink.mutateAsync({
        tmdbId,
        seasonNumber,
        episodeNumber: episodeNum,
      }),
      {
        loading: 'Usuwanie wszystkich linków...',
        success: 'Wszystkie linki usunięte',
        error: 'Błąd podczas usuwania',
      }
    );
  };

  const handleDeleteLink = (episodeNumber: number, linkIndex: number) => {
    setLinkToDelete({ episodeNumber, linkIndex });
    setDeleteDialogOpen(true);
  };

  const confirmDeleteLink = async () => {
    if (!linkToDelete) return;
    
    const { episodeNumber, linkIndex } = linkToDelete;
    const episode = episodesMap.get(episodeNumber);
    if (!episode || !episode.links) return;

    setDeleteDialogOpen(false);
    setLinkToDelete(null);

    toast.promise(
      (async () => {
        // Usuń link z array
        const updatedLinks = episode.links!.filter((_, idx) => idx !== linkIndex);
        
        // Jeśli to był ostatni link, usuń cały dokument
        if (updatedLinks.length === 0) {
          await deleteEpisodeLink.mutateAsync({
            tmdbId,
            seasonNumber,
            episodeNumber,
          });
          return;
        }

        // Zaktualizuj dokument z nową listą linków
        const episodeId = `${tmdbId}_s${seasonNumber}_e${episodeNumber}`;
        const episodeRef = doc(db, 'episodes', episodeId);
        
        // Zaktualizuj główny link na pierwszy z pozostałych
        const mainLink = updatedLinks[0];
        
        await setDoc(episodeRef, {
          ...episode,
          link: mainLink.url,
          quality: mainLink.quality || '720p',
          language: mainLink.version || 'PL',
          links: updatedLinks,
          updatedAt: new Date(),
        }, { merge: true });

        // Odśwież dane
        await deleteEpisodeLink.mutateAsync({
          tmdbId,
          seasonNumber,
          episodeNumber,
        });
      })(),
      {
        loading: 'Usuwanie linku...',
        success: 'Link usunięty',
        error: 'Błąd podczas usuwania linku',
      }
    );
  };

  const episodeOptions = Array.from({ length: episodeCount }, (_, i) => i + 1);
  const episodesMap = new Map(episodes?.map(ep => [ep.episodeNumber, ep]) || []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{seasonName}</h3>
        {isAdmin && (
          <Dialog open={open} onOpenChange={setOpen} modal={true}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Dodaj link
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Dodaj link do odcinka</DialogTitle>
                <DialogDescription>
                  {seasonName} - Dodaj lub zaktualizuj link do odcinka
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 overflow-visible">
                <div>
                  <Label htmlFor="episode">Odcinek</Label>
                  <Select
                    value={selectedEpisode.toString()}
                    onValueChange={(value) => setSelectedEpisode(parseInt(value))}
                  >
                    <SelectTrigger id="episode">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent 
                      className="max-h-[300px]" 
                      position="popper" 
                      sideOffset={5}
                    >
                      {episodeOptions.map((ep) => (
                        <SelectItem key={ep} value={ep.toString()}>
                          Odcinek {ep}
                          {episodesMap.has(ep) && ' ✓'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="link">Link do odcinka</Label>
                  <Input
                    id="link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://..."
                    type="url"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quality">Jakość</Label>
                    <Select value={quality} onValueChange={setQuality}>
                      <SelectTrigger id="quality">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2160p">4K (2160p)</SelectItem>
                        <SelectItem value="1080p">Full HD (1080p)</SelectItem>
                        <SelectItem value="720p">HD (720p)</SelectItem>
                        <SelectItem value="480p">SD (480p)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="language">Język</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PL">Polski</SelectItem>
                        <SelectItem value="ENG">Angielski</SelectItem>
                        <SelectItem value="PL/ENG">PL/ENG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handleAddLink}
                  disabled={!link.trim() || addEpisodeLink.isPending}
                  className="w-full"
                >
                  {episodesMap.has(selectedEpisode) ? 'Zaktualizuj link' : 'Dodaj link'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-4 text-foreground-secondary">Ładowanie...</div>
      ) : episodes && episodes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {episodes.map((episode) => (
            <div
              key={episode.id}
              className="bg-background rounded-lg p-4 border border-border hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold">Odcinek {episode.episodeNumber}</h4>
                  {episode.title && episode.title !== `Odcinek ${episode.episodeNumber}` && (
                    <p className="text-sm text-foreground-secondary line-clamp-1 mt-0.5">
                      {episode.title}
                    </p>
                  )}
                   {/*<div className="flex items-center gap-2 mt-1">
                    {episode.quality && (
                      <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded">
                        {episode.quality}
                      </span>
                    )}
                    {episode.language && (
                      <span className="text-xs px-2 py-0.5 bg-background-secondary rounded">
                        {episode.language}
                      </span>
                    )}
                  </div> */}
                </div> 
                {isAdmin && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(episode.episodeNumber)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                )}
              </div>
              {/* Wyświetl wszystkie linki jeśli są dostępne */}
              {episode.links && episode.links.length > 0 ? (
                <div className="space-y-1 mt-2">
                  {episode.links.map((link, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-1 hover:bg-primary/5 p-1 rounded transition-colors group/link"
                    >
                      <button
                        onClick={(e) => handlePlayClick(link.url, e)}
                        className="flex items-start gap-1.5 text-xs text-primary hover:underline flex-1 min-w-0 text-left"
                      >
                        <Play className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        <span className="flex-1 min-w-0 break-words">
                          <span className="font-medium">{link.provider}</span>
                          {link.version && <span className="text-foreground-secondary"> • {link.version}</span>}
                          {link.quality && <span className="text-foreground-secondary"> • {link.quality}</span>}
                        </span>
                      </button>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0"
                        title="Otwórz w nowej karcie"
                      >
                        <ExternalLink className="w-2.5 h-2.5 text-muted-foreground hover:text-primary transition-colors" />
                      </a>
                      {isAdmin && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLink(episode.episodeNumber, idx);
                          }}
                          className="h-5 w-5 flex-shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-2.5 h-2.5 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : episode.link ? (
                <a
                  href={episode.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline mt-2"
                >
                  <Play className="w-4 h-4" />
                  Odtwórz
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <p className="text-xs text-foreground-secondary mt-2">Brak dostępnych linków</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-foreground-secondary">
          <p>Brak dodanych linków do odcinków</p>
          {isAdmin && (
            <p className="text-sm mt-2">Kliknij "Dodaj link" aby dodać pierwszy odcinek</p>
          )}
        </div>
      )}

      {/* Player Modal */}
      <Dialog open={playerOpen} onOpenChange={setPlayerOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0">
          <div className="relative w-full h-full bg-black">
            <iframe
              src={currentPlayerUrl}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              title="Video Player"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Single Link Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usunąć link?</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunąć ten link? Ta operacja jest nieodwracalna.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteLink}>Usuń</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete All Links Dialog */}
      <AlertDialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usunąć wszystkie linki?</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunąć wszystkie linki tego odcinka? Ta operacja jest nieodwracalna.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAll}>Usuń wszystkie</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
