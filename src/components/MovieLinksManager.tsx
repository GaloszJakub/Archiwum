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
import { useMovieLinks, useAddMovieLink, useDeleteMovieLink } from '@/hooks/useEpisodes';
import { stopLenis, startLenis } from '@/lib/smoothScroll';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface MovieLinksManagerProps {
  tmdbId: number;
  movieTitle: string;
}

export const MovieLinksManager = ({ tmdbId, movieTitle }: MovieLinksManagerProps) => {
  const { isAdmin } = useAuth();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState('');
  const [quality, setQuality] = useState('1080p');
  const [language, setLanguage] = useState('PL');
  const [playerOpen, setPlayerOpen] = useState(false);
  const [currentPlayerUrl, setCurrentPlayerUrl] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<{ linkId: string; linkIndex: number } | null>(null);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<string | null>(null);

  const { data: links, isLoading } = useMovieLinks(tmdbId);
  const addMovieLink = useAddMovieLink();
  const deleteMovieLink = useDeleteMovieLink();

  // Block body scroll when dialog is open
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

  const handlePlayClick = (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentPlayerUrl(url);
    setPlayerOpen(true);
  };

  const handleAddLink = async () => {
    if (!link.trim()) return;

    try {
      await addMovieLink.mutateAsync({
        tmdbId,
        link: link.trim(),
        options: {
          title: movieTitle,
          quality,
          language,
        },
      });

      setLink('');
      setOpen(false);
      toast.success('Link dodany', {
        description: `${quality} - ${language}`,
      });
    } catch (error) {
      console.error('Error adding movie link:', error);
      toast.error('Błąd podczas dodawania linku', {
        description: 'Spróbuj ponownie',
      });
    }
  };

  const handleDelete = (linkId: string) => {
    setMovieToDelete(linkId);
    setDeleteAllDialogOpen(true);
  };

  const confirmDeleteAll = async () => {
    if (!movieToDelete) return;

    setDeleteAllDialogOpen(false);
    const linkId = movieToDelete;
    setMovieToDelete(null);

    toast.promise(
      deleteMovieLink.mutateAsync({ tmdbId, linkId }),
      {
        loading: 'Usuwanie wszystkich linków...',
        success: 'Wszystkie linki usunięte',
        error: 'Błąd podczas usuwania',
      }
    );
  };

  const handleDeleteSingleLink = (linkId: string, linkIndex: number) => {
    setLinkToDelete({ linkId, linkIndex });
    setDeleteDialogOpen(true);
  };

  const confirmDeleteLink = async () => {
    if (!linkToDelete) return;
    
    const { linkId, linkIndex } = linkToDelete;
    const movieLink = links?.find(l => l.id === linkId);
    if (!movieLink || !movieLink.links) return;

    setDeleteDialogOpen(false);
    setLinkToDelete(null);

    toast.promise(
      (async () => {
        // Usuń link z array
        const updatedLinks = movieLink.links!.filter((_, idx) => idx !== linkIndex);
        
        // Jeśli to był ostatni link, usuń cały dokument
        if (updatedLinks.length === 0) {
          await deleteMovieLink.mutateAsync({ tmdbId, linkId });
          return;
        }

        // Zaktualizuj dokument z nową listą linków
        const movieRef = doc(db, 'episodes', linkId);
        
        // Zaktualizuj główny link na pierwszy z pozostałych
        const mainLink = updatedLinks[0];
        
        await setDoc(movieRef, {
          ...movieLink,
          link: mainLink.url,
          quality: mainLink.quality || '720p',
          language: mainLink.version || 'PL',
          links: updatedLinks,
          updatedAt: new Date(),
        }, { merge: true });

        // Odśwież dane
        await deleteMovieLink.mutateAsync({ tmdbId, linkId });
      })(),
      {
        loading: 'Usuwanie linku...',
        success: 'Link usunięty',
        error: 'Błąd podczas usuwania linku',
      }
    );
  };

  if (!isAdmin && (!links || links.length === 0)) {
    return null;
  }

  return (
    <div className="bg-background-secondary rounded-xl p-6 lg:p-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{t('details.manageLinks')}</h2>
        {isAdmin && (
          <Dialog open={open} onOpenChange={setOpen} modal={true}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                {t('details.addLink')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t('details.addLink')}</DialogTitle>
                <DialogDescription>
                  {movieTitle}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 overflow-visible">
                <div>
                  <Label htmlFor="link">Link do filmu</Label>
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
                  disabled={!link.trim() || addMovieLink.isPending}
                  className="w-full"
                >
                  {t('details.addLink')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-4 text-foreground-secondary">Ładowanie...</div>
      ) : links && links.length > 0 ? (
        <div className="space-y-4">
          {links.map((link) => (
            <div
              key={link.id}
              className="bg-background rounded-xl p-6 border-2 border-border hover:border-primary/50 transition-colors"
            >
              {/* Nagłówek z liczbą linków */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                <div>
                  <h3 className="text-lg font-bold">Dostępne odtwarzacze</h3>
                  <p className="text-sm text-muted-foreground">
                    {link.links && link.links.length > 0 
                      ? `${link.links.length} ${link.links.length === 1 ? 'link' : 'linki'} streamingowe`
                      : 'Brak linków'}
                  </p>
                </div>
                {isAdmin && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(link.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Usuń wszystkie
                  </Button>
                )}
              </div>

              {/* Wyświetl wszystkie linki jeśli są dostępne */}
              {link.links && link.links.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {link.links.map((streamLink, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-4 bg-background-secondary hover:bg-primary/5 rounded-lg border border-border hover:border-primary/50 transition-all group/link"
                    >
                      <button
                        onClick={(e) => handlePlayClick(streamLink.url, e)}
                        className="flex items-center gap-3 flex-1 min-w-0 text-left"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center group-hover/link:bg-primary/30 transition-colors">
                          <Play className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate">{streamLink.provider}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            {streamLink.version && <span>{streamLink.version}</span>}
                            {streamLink.quality && (
                              <>
                                {streamLink.version && <span>•</span>}
                                <span className="text-primary font-medium">{streamLink.quality}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </button>
                      <a
                        href={streamLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 p-2 hover:bg-background rounded transition-colors"
                        title="Otwórz w nowej karcie"
                      >
                        <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                      </a>
                      {isAdmin && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSingleLink(link.id, idx);
                          }}
                          className="h-8 w-8 flex-shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : link.link ? (
                <a
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-background-secondary hover:bg-primary/5 rounded-lg border border-border hover:border-primary/50 transition-all"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Play className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Odtwórz film</div>
                    <div className="text-xs text-muted-foreground">
                      {link.quality} • {link.language}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
              ) : (
                <p className="text-center py-8 text-muted-foreground">Brak dostępnych linków</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-foreground-secondary">
          <p>{t('details.noLinks')}</p>
          {isAdmin && (
            <p className="text-sm mt-2">{t('details.addFirstLink')}</p>
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
              Czy na pewno chcesz usunąć wszystkie linki tego filmu? Ta operacja jest nieodwracalna.
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
