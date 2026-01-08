import { useState, useEffect } from 'react';
import { Plus, Trash2, Play } from 'lucide-react';
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
import { stopLenis, startLenis, getLenis } from '@/lib/smoothScroll';
import { useSeasonDetails } from '@/hooks/useTMDB';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { useWakeLock } from '@/hooks/useWakeLock';
import { useWatchedEpisodes, useMarkEpisodeWatched } from '@/hooks/useWatchedEpisodes';
import { useScrollToEpisode } from '@/hooks/useScrollToEpisode';

interface EpisodeManagerProps {
  tmdbId: number;
  seasonNumber: number;
  episodeCount: number;
  seasonName: string;
  seriesName: string;
  targetEpisode?: number;
}

export const EpisodeManager = ({ tmdbId, seasonNumber, episodeCount, seasonName, seriesName, targetEpisode }: EpisodeManagerProps) => {
  const { isAdmin, user } = useAuth();
  // const { t } = useTranslation();
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

  const { data: episodes, isLoading: isEpisodesLoading } = useSeasonEpisodes(tmdbId, seasonNumber);
  const { data: seasonDetails, isLoading: isSeasonDetailsLoading } = useSeasonDetails(tmdbId, seasonNumber);
  const addEpisodeLink = useAddEpisodeLink();
  const deleteEpisodeLink = useDeleteEpisodeLink();

  const { data: watchedEpisodes } = useWatchedEpisodes(tmdbId);
  const markEpisodeWatched = useMarkEpisodeWatched();
  const watchedEpisodesSet = new Set(
    watchedEpisodes?.map(ep => `${ep.seasonNumber}_${ep.episodeNumber}`) || []
  );

  useWakeLock(playerOpen);

  useEffect(() => {
    if (open || playerOpen) {
      stopLenis();
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

  // Scroll to target episode with retry logic
  useScrollToEpisode({
    targetEpisode,
    tmdbId,
    seasonNumber,
    shouldScroll: !isEpisodesLoading && !isSeasonDetailsLoading && !!seasonDetails?.episodes
  });

  const handlePlayClick = (url: string, episodeNumber: number, e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentPlayerUrl(url);
    setPlayerOpen(true);

    if (user) {
      markEpisodeWatched.mutate({ tmdbId, seasonNumber, episodeNumber });
    }
  };

  const handleAddLink = async () => {
    if (!link.trim()) return;

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
      toast.success('Sukces', {
        description: `Odcinek ${selectedEpisode} - ${quality}`,
      });
    } catch (error) {
      console.error('Error adding episode link:', error);
      toast.error('Błąd', {
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
        const updatedLinks = episode.links!.filter((_, idx) => idx !== linkIndex);

        if (updatedLinks.length === 0) {
          await deleteEpisodeLink.mutateAsync({
            tmdbId,
            seasonNumber,
            episodeNumber,
          });
          return;
        }

        const episodeId = `${tmdbId}_s${seasonNumber}_e${episodeNumber}`;
        const episodeRef = doc(db, 'episodes', episodeId);

        const mainLink = updatedLinks[0];

        await setDoc(episodeRef, {
          ...episode,
          link: mainLink.url,
          quality: mainLink.quality || '720p',
          language: mainLink.version || 'PL',
          links: updatedLinks,
          updatedAt: new Date(),
        }, { merge: true });

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

      {isEpisodesLoading || isSeasonDetailsLoading ? (
        <div className="text-center py-4 text-foreground-secondary">Ładowanie...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {seasonDetails?.episodes?.map((tmdbEpisode) => {
            const dbEpisode = episodesMap.get(tmdbEpisode.episode_number);

            return (
              <div
                key={tmdbEpisode.id}
                id={`episode-${tmdbId}-s${seasonNumber}-e${tmdbEpisode.episode_number}`}
                className={`bg-background rounded-xl p-4 border transition-all group ${watchedEpisodesSet.has(`${seasonNumber}_${tmdbEpisode.episode_number}`)
                  ? 'border-green-500/50 shadow-sm shadow-green-500/10'
                  : dbEpisode ? 'border-border shadow-sm' : 'border-border/50 opacity-70'
                  }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-primary">
                        Odcinek {tmdbEpisode.episode_number}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm line-clamp-2 leading-snug">
                      {tmdbEpisode.name || `Odcinek ${tmdbEpisode.episode_number}`}
                    </h4>
                  </div>
                  {isAdmin && dbEpisode && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(tmdbEpisode.episode_number)}
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 -mt-1 -mr-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                  {isAdmin && !dbEpisode && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setSelectedEpisode(tmdbEpisode.episode_number);
                        setOpen(true);
                      }}
                      className="h-8 w-8 text-muted-foreground hover:text-primary -mt-1 -mr-1"
                      title="Dodaj link"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {dbEpisode ? (
                  <div className="space-y-0 mt-auto border-t border-border/50">
                    {dbEpisode.links && dbEpisode.links.length > 0 ? (
                      dbEpisode.links.map((linkItem, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 hover:bg-primary/5 py-3 border-b border-border/50 last:border-0 transition-colors group/link"
                        >
                          <button
                            onClick={(e) => handlePlayClick(linkItem.url, tmdbEpisode.episode_number, e)}
                            className="flex items-center gap-2 text-sm text-primary hover:underline flex-1 min-w-0 text-left"
                          >
                            <Play className="w-4 h-4 flex-shrink-0" />
                            <span className="flex-1 min-w-0 truncate font-medium">
                              {linkItem.provider}
                              {linkItem.version && <span className="text-foreground-secondary ml-1.5 opacity-80 decoration-0 font-normal"> • {linkItem.version}</span>}
                            </span>
                          </button>
                          {isAdmin && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteLink(tmdbEpisode.episode_number, idx);
                              }}
                              className="h-6 w-6 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      ))
                    ) : dbEpisode.link ? (
                      <button
                        onClick={(e) => handlePlayClick(dbEpisode.link!, tmdbEpisode.episode_number, e)}
                        className="w-full flex items-center justify-center gap-2 p-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        Odtwórz
                      </button>
                    ) : null}
                  </div>
                ) : (
                  <div className="mt-auto">
                    <p className="text-[11px] text-muted-foreground italic">Brak dostępnych linków</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Player Modal */}
      <Dialog open={playerOpen} onOpenChange={setPlayerOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0" aria-describedby={undefined}>
          <DialogTitle className="sr-only">Odtwarzacz wideo</DialogTitle>
          <div className="relative w-full h-full bg-black">
            <iframe
              src={currentPlayerUrl}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              title="Video Player"
              sandbox="allow-scripts allow-same-origin allow-presentation"
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
