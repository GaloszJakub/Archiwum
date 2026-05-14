import { useState, useEffect } from 'react';
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
import { useWakeLock } from '@/hooks/useWakeLock';
import { useWatchedEpisodes, useMarkEpisodeWatched } from '@/hooks/useWatchedEpisodes';
import { useScrollToEpisode } from '@/hooks/useScrollToEpisode';

const A = {
  border: 'rgba(255,248,230,0.12)',
  text: '#f3efe6',
  text2: '#b8b1a3',
  amber: '#d4a056',
  red: '#ef4444',
};

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
  const [open, setOpen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [link, setLink] = useState('');
  const [quality, setQuality] = useState('1080p');
  const [language, setLanguage] = useState('PL');
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

  useWakeLock(open);

  useEffect(() => {
    if (open) {
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
  }, [open]);

  useScrollToEpisode({
    targetEpisode,
    tmdbId,
    seasonNumber,
    shouldScroll: !isEpisodesLoading && !isSeasonDetailsLoading && !!seasonDetails?.episodes
  });

  const handlePlayClick = (url: string, episodeNumber: number, e: React.MouseEvent) => {
    e.preventDefault();
    // Open in new tab — iframe causes crashes with some hosts (Doodstream)
    window.open(url, '_blank');

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
        loading: 'Usuwanie...',
        success: 'Usunięte',
        error: 'Błąd',
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
        loading: 'Usuwanie...',
        success: 'Usunięto',
        error: 'Błąd',
      }
    );
  };

  const episodeOptions = Array.from({ length: episodeCount }, (_, i) => i + 1);
  const episodesMap = new Map(episodes?.map(ep => [ep.episodeNumber, ep]) || []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 14, color: A.text, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{seasonName}</h3>
        {isAdmin && (
          <Dialog open={open} onOpenChange={setOpen} modal={true}>
            <DialogTrigger asChild>
              <button 
                style={{ 
                  background: 'transparent', 
                  border: `1px solid ${A.border}`, 
                  color: A.amber, 
                  padding: '6px 12px', 
                  fontFamily: '"JetBrains Mono", monospace', 
                  fontSize: 11, 
                  textTransform: 'uppercase', 
                  cursor: 'pointer' 
                }} 
                className="hover:bg-white/5 transition-colors"
              >
                + DODAJ LINK
              </button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto" style={{ background: A.bg, border: `1px solid ${A.border}`, borderRadius: 0, color: A.text }}>
              <DialogHeader>
                <DialogTitle style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 16, textTransform: 'uppercase' }}>Dodaj link do odcinka</DialogTitle>
                <DialogDescription style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: A.text2 }}>
                  {seasonName} - Dodaj lub zaktualizuj źródło
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 overflow-visible mt-4">
                <div>
                  <Label htmlFor="episode" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11 }}>ODCINEK</Label>
                  <Select
                    value={selectedEpisode.toString()}
                    onValueChange={(value) => setSelectedEpisode(parseInt(value))}
                  >
                    <SelectTrigger id="episode" style={{ borderRadius: 0, border: `1px solid ${A.border}`, background: 'transparent' }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      className="max-h-[300px]"
                      position="popper"
                      sideOffset={5}
                      style={{ borderRadius: 0, border: `1px solid ${A.border}`, background: A.bg }}
                    >
                      {episodeOptions.map((ep) => (
                        <SelectItem key={ep} value={ep.toString()} style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, borderRadius: 0 }}>
                          Odcinek {ep}
                          {episodesMap.has(ep) && ' [ZAPISANY]'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="link" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11 }}>ADRES URL</Label>
                  <Input
                    id="link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://..."
                    type="url"
                    style={{ borderRadius: 0, border: `1px solid ${A.border}`, background: 'transparent', fontFamily: '"JetBrains Mono", monospace' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quality" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11 }}>JAKOŚĆ</Label>
                    <Select value={quality} onValueChange={setQuality}>
                      <SelectTrigger id="quality" style={{ borderRadius: 0, border: `1px solid ${A.border}`, background: 'transparent', fontFamily: '"JetBrains Mono", monospace', fontSize: 11 }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent style={{ borderRadius: 0, border: `1px solid ${A.border}`, background: A.bg }}>
                        <SelectItem value="2160p" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, borderRadius: 0 }}>4K (2160p)</SelectItem>
                        <SelectItem value="1080p" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, borderRadius: 0 }}>FHD (1080p)</SelectItem>
                        <SelectItem value="720p" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, borderRadius: 0 }}>HD (720p)</SelectItem>
                        <SelectItem value="480p" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, borderRadius: 0 }}>SD (480p)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="language" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11 }}>JĘZYK</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language" style={{ borderRadius: 0, border: `1px solid ${A.border}`, background: 'transparent', fontFamily: '"JetBrains Mono", monospace', fontSize: 11 }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent style={{ borderRadius: 0, border: `1px solid ${A.border}`, background: A.bg }}>
                        <SelectItem value="PL" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, borderRadius: 0 }}>Polski</SelectItem>
                        <SelectItem value="ENG" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, borderRadius: 0 }}>Angielski</SelectItem>
                        <SelectItem value="PL/ENG" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, borderRadius: 0 }}>PL/ENG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <button
                  onClick={handleAddLink}
                  disabled={!link.trim() || addEpisodeLink.isPending}
                  style={{
                    width: '100%',
                    padding: '12px 0',
                    background: link.trim() ? A.amber : 'transparent',
                    border: `1px solid ${A.amber}`,
                    color: link.trim() ? A.bg : A.amber,
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 12,
                    textTransform: 'uppercase',
                    cursor: link.trim() ? 'pointer' : 'not-allowed',
                    marginTop: 16
                  }}
                  className="transition-colors hover:opacity-90"
                >
                  {episodesMap.has(selectedEpisode) ? 'ZAKTUALIZUJ LINK' : 'ZAPISZ LINK'}
                </button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isEpisodesLoading || isSeasonDetailsLoading ? (
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: A.text2 }} className="animate-pulse">
          ŁADOWANIE ODCINKÓW...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border" style={{ borderColor: A.border }}>
          {seasonDetails?.episodes?.map((tmdbEpisode, index) => {
            const dbEpisode = episodesMap.get(tmdbEpisode.episode_number);
            const isWatched = watchedEpisodesSet.has(`${seasonNumber}_${tmdbEpisode.episode_number}`);

            return (
              <div
                key={tmdbEpisode.id}
                id={`episode-${tmdbId}-s${seasonNumber}-e${tmdbEpisode.episode_number}`}
                style={{
                  borderRight: (index + 1) % 3 !== 0 ? `1px solid ${A.border}` : 'none',
                  borderBottom: `1px solid ${A.border}`,
                  padding: '24px',
                  background: isWatched ? 'rgba(212,160,86,0.02)' : 'transparent',
                  opacity: dbEpisode ? 1 : 0.6,
                }}
                className="group flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: isWatched ? A.amber : A.text2, letterSpacing: '0.1em', marginBottom: 8, textTransform: 'uppercase' }}>
                      Odcinek {tmdbEpisode.episode_number}
                    </div>
                    <h4 style={{ fontSize: 16, fontWeight: 500, color: A.text, margin: 0, lineHeight: 1.3 }} className="line-clamp-2">
                      {tmdbEpisode.name || `Odcinek ${tmdbEpisode.episode_number}`}
                    </h4>
                  </div>
                  <div className="flex gap-2">
                    {isAdmin && !dbEpisode && (
                      <button
                        onClick={() => {
                          setSelectedEpisode(tmdbEpisode.episode_number);
                          setOpen(true);
                        }}
                        style={{ background: 'transparent', border: 'none', color: A.amber, fontFamily: '"JetBrains Mono", monospace', fontSize: 16, cursor: 'pointer', padding: 0 }}
                        title="Dodaj link"
                      >
                        [+]
                      </button>
                    )}
                    {isAdmin && dbEpisode && (
                      <button
                        onClick={() => handleDelete(tmdbEpisode.episode_number)}
                        style={{ background: 'transparent', border: 'none', color: A.red, fontFamily: '"JetBrains Mono", monospace', fontSize: 12, cursor: 'pointer', padding: 0 }}
                        title="Usuń wszystkie linki"
                      >
                        [X]
                      </button>
                    )}
                  </div>
                </div>

                {dbEpisode ? (
                  <div className="mt-auto space-y-2 pt-4">
                    {dbEpisode.links && dbEpisode.links.length > 0 ? (
                      dbEpisode.links.map((linkItem, idx) => (
                        <div key={idx} className="flex items-center justify-between group/link border-b last:border-0 pb-2 last:pb-0" style={{ borderColor: A.border }}>
                          <button
                            onClick={(e) => handlePlayClick(linkItem.url, tmdbEpisode.episode_number, e)}
                            style={{ background: 'transparent', border: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', textAlign: 'left', flex: 1 }}
                            className="hover:opacity-70 transition-opacity"
                          >
                            <span style={{ color: A.amber, fontSize: 14 }}>▶</span>
                            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: A.text, textTransform: 'uppercase' }}>
                              {linkItem.provider}
                              {linkItem.version && <span style={{ color: A.text2 }}> • {linkItem.version}</span>}
                            </span>
                          </button>
                          {isAdmin && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteLink(tmdbEpisode.episode_number, idx);
                              }}
                              style={{ background: 'transparent', border: 'none', color: A.red, fontFamily: '"JetBrains Mono", monospace', fontSize: 10, cursor: 'pointer', padding: '0 4px' }}
                              className="opacity-0 group-hover/link:opacity-100 transition-opacity"
                            >
                              [X]
                            </button>
                          )}
                        </div>
                      ))
                    ) : dbEpisode.link ? (
                      <button
                        onClick={(e) => handlePlayClick(dbEpisode.link!, tmdbEpisode.episode_number, e)}
                        style={{
                          width: '100%',
                          background: 'transparent',
                          border: `1px solid ${A.amber}`,
                          color: A.amber,
                          padding: '8px 0',
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: 11,
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                        }}
                        className="hover:bg-white/5 transition-colors"
                      >
                        ▶ ODTWÓRZ
                      </button>
                    ) : null}
                  </div>
                ) : (
                  <div className="mt-auto pt-4">
                    <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: A.text2, margin: 0, textTransform: 'uppercase' }}>
                      Brak źródeł
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Single Link Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent style={{ background: A.bg, border: `1px solid ${A.border}`, borderRadius: 0 }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ fontFamily: '"JetBrains Mono", monospace', color: A.text, fontSize: 14 }}>USUNĄĆ LINK?</AlertDialogTitle>
            <AlertDialogDescription style={{ fontFamily: '"JetBrains Mono", monospace', color: A.text2, fontSize: 11 }}>
              Ta operacja jest nieodwracalna.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{ borderRadius: 0, border: `1px solid ${A.border}`, fontFamily: '"JetBrains Mono", monospace', fontSize: 11 }}>ANULUJ</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteLink} style={{ borderRadius: 0, background: A.red, color: '#fff', fontFamily: '"JetBrains Mono", monospace', fontSize: 11 }}>USUŃ</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete All Links Dialog */}
      <AlertDialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
        <AlertDialogContent style={{ background: A.bg, border: `1px solid ${A.border}`, borderRadius: 0 }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ fontFamily: '"JetBrains Mono", monospace', color: A.text, fontSize: 14 }}>USUNĄĆ WSZYSTKIE LINKI?</AlertDialogTitle>
            <AlertDialogDescription style={{ fontFamily: '"JetBrains Mono", monospace', color: A.text2, fontSize: 11 }}>
              Czy na pewno chcesz usunąć wszystkie źródła dla tego odcinka?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{ borderRadius: 0, border: `1px solid ${A.border}`, fontFamily: '"JetBrains Mono", monospace', fontSize: 11 }}>ANULUJ</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAll} style={{ borderRadius: 0, background: A.red, color: '#fff', fontFamily: '"JetBrains Mono", monospace', fontSize: 11 }}>USUŃ WSZYSTKIE</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
