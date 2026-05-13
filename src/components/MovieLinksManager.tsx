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
import { useMovieLinks, useAddMovieLink, useDeleteMovieLink } from '@/hooks/useEpisodes';
import { stopLenis, startLenis } from '@/lib/smoothScroll';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { useWakeLock } from '@/hooks/useWakeLock';

const A = {
  border: 'rgba(255,248,230,0.12)',
  text: '#f3efe6',
  text2: '#b8b1a3',
  amber: '#d4a056',
  red: '#ef4444',
  bg: '#0a0a0c',
};

interface MovieLinksManagerProps {
  tmdbId: number;
  movieTitle: string;
}

export const MovieLinksManager = ({ tmdbId, movieTitle }: MovieLinksManagerProps) => {
  const { isAdmin } = useAuth();
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
        const updatedLinks = movieLink.links!.filter((_, idx) => idx !== linkIndex);

        if (updatedLinks.length === 0) {
          await deleteMovieLink.mutateAsync({ tmdbId, linkId });
          return;
        }

        const movieRef = doc(db, 'episodes', linkId);
        const mainLink = updatedLinks[0];

        await setDoc(movieRef, {
          ...movieLink,
          link: mainLink.url,
          quality: mainLink.quality || '720p',
          language: mainLink.version || 'PL',
          links: updatedLinks,
          updatedAt: new Date(),
        }, { merge: true });

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
    <div style={{ borderTop: `1px solid ${A.border}`, paddingTop: 40, marginTop: 40 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 32 }}>
        <h2 style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: A.text2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Zarządzanie linkami
        </h2>
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
                <DialogTitle style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 16, textTransform: 'uppercase' }}>Dodaj link</DialogTitle>
                <DialogDescription style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: A.text2 }}>
                  {movieTitle} - Dodaj źródło filmu
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 overflow-visible mt-4">
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
                  disabled={!link.trim() || addMovieLink.isPending}
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
                  DODAJ LINK
                </button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading ? (
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: A.text2 }} className="animate-pulse py-8 text-center">
          ŁADOWANIE ZASOBÓW...
        </div>
      ) : links && links.length > 0 ? (
        <div style={{ borderTop: `1px solid ${A.border}` }}>
          {links.map((link) => (
            <div
              key={link.id}
              style={{ borderBottom: `1px solid ${A.border}`, padding: '32px 0' }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                  <h3 style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 14, color: A.text, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>DOSTĘPNE ODTWARZACZE</h3>
                  <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: A.text2, marginTop: 8 }}>
                    {link.links && link.links.length > 0
                      ? `${link.links.length} ŹRÓDEŁ`
                      : 'BRAK ŹRÓDEŁ'}
                  </p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(link.id)}
                    style={{ background: 'transparent', border: 'none', color: A.red, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, cursor: 'pointer', padding: 0 }}
                  >
                    [USUŃ WSZYSTKIE]
                  </button>
                )}
              </div>

              {/* Links list */}
              {link.links && link.links.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {link.links.map((streamLink, idx) => (
                    <div
                      key={idx}
                      style={{ border: `1px solid ${A.border}`, padding: '16px', display: 'flex', alignItems: 'center', gap: 16 }}
                      className="group/link hover:bg-white/5 transition-colors"
                    >
                      <button
                        onClick={(e) => handlePlayClick(streamLink.url, e)}
                        style={{ background: 'transparent', border: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', textAlign: 'left', flex: 1 }}
                      >
                        <div style={{ color: A.amber, fontSize: 18 }}>▶</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: A.text, textTransform: 'uppercase' }}>{streamLink.provider}</div>
                          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: A.text2, textTransform: 'uppercase' }}>
                            {streamLink.version && <span>{streamLink.version}</span>}
                            {streamLink.quality && (
                              <>
                                {streamLink.version && <span> • </span>}
                                <span style={{ color: A.amber }}>{streamLink.quality}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </button>
                      {isAdmin && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSingleLink(link.id, idx);
                          }}
                          style={{ background: 'transparent', border: 'none', color: A.red, fontFamily: '"JetBrains Mono", monospace', fontSize: 12, cursor: 'pointer', padding: '0 8px' }}
                          className="opacity-0 group-hover/link:opacity-100 transition-opacity"
                        >
                          [X]
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : link.link ? (
                <a
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '16px',
                    border: `1px solid ${A.border}`,
                    textDecoration: 'none',
                  }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <div style={{ color: A.amber, fontSize: 18 }}>▶</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: A.text, textTransform: 'uppercase' }}>ODTWÓRZ FILM</div>
                    <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: A.text2, textTransform: 'uppercase' }}>
                      {link.quality} • {link.language}
                    </div>
                  </div>
                </a>
              ) : (
                <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: A.text2, textAlign: 'center', padding: '24px 0', textTransform: 'uppercase' }}>Brak dostępnych źródeł</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: A.text2, textAlign: 'center', padding: '40px 0', textTransform: 'uppercase', borderTop: `1px solid ${A.border}`, borderBottom: `1px solid ${A.border}` }}>
          <p>Brak zasobów.</p>
          {isAdmin && (
            <p style={{ marginTop: 8 }}>Możesz dodać pierwszy link.</p>
          )}
        </div>
      )}

      {/* Player Modal */}
      <Dialog open={playerOpen} onOpenChange={setPlayerOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0" style={{ border: `1px solid ${A.border}`, borderRadius: 0, background: '#000' }}>
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
        <AlertDialogContent style={{ background: A.bg, border: `1px solid ${A.border}`, borderRadius: 0 }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ fontFamily: '"JetBrains Mono", monospace', color: A.text, fontSize: 14 }}>USUNĄĆ LINK?</AlertDialogTitle>
            <AlertDialogDescription style={{ fontFamily: '"JetBrains Mono", monospace', color: A.text2, fontSize: 11 }}>
              Czy na pewno chcesz usunąć ten link? Ta operacja jest nieodwracalna.
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
              Czy na pewno chcesz usunąć wszystkie linki tego filmu? Ta operacja jest nieodwracalna.
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
