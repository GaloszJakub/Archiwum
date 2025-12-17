import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { X, Share, PlusSquare } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // Check if already installed
        const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone ||
            document.referrer.includes('android-app://');

        setIsStandalone(isStandaloneMode);
        if (isStandaloneMode) return;

        // Check if iOS
        const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(ios);

        // If iOS and not standalone, show prompt immediately (or maybe after a delay)
        if (ios && !isStandaloneMode) {
            // Show iOS prompt logic (maybe with delay or storing preference in localStorage)
            const hasSeenPrompt = localStorage.getItem('installPromptSeen');
            if (!hasSeenPrompt) {
                setShowPrompt(true);
            }
        }

        // Android/Desktop install prompt
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setShowPrompt(false);
        }
    };

    const handleClose = () => {
        setShowPrompt(false);
        localStorage.setItem('installPromptSeen', 'true');
    };

    if (!showPrompt || isStandalone) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 pb-16"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-popover border border-border rounded-xl shadow-lg p-6 w-full max-w-sm flex flex-col gap-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                            <div>
                                <h3 className="font-semibold text-foreground">Zainstaluj Archiwum</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {isIOS
                                        ? "Dodaj do ekranu głównego dla lepszego doświadczenia."
                                        : "Zainstaluj aplikację, aby korzystać offline i szybciej."}
                                </p>
                            </div>
                        </div>
                        <button onClick={handleClose} className="text-muted-foreground hover:text-foreground">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {isIOS ? (
                        <div className="text-sm bg-muted/50 p-3 rounded-lg space-y-2">
                            <div className="flex items-center gap-2">
                                1. Kliknij <Share className="w-4 h-4" /> (Udostępnij)
                            </div>
                            <div className="flex items-center gap-2">
                                2. Wybierz <PlusSquare className="w-4 h-4" /> "Do ekranu początkowego"
                            </div>
                        </div>
                    ) : (
                        <Button onClick={handleInstallClick} className="w-full">
                            Zainstaluj
                        </Button>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
