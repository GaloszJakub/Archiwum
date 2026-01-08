import { useEffect } from 'react';
import { getLenis } from '@/lib/smoothScroll';

interface UseScrollToEpisodeProps {
    targetEpisode?: number;
    tmdbId: number;
    seasonNumber: number;
    shouldScroll: boolean;
}

export const useScrollToEpisode = ({
    targetEpisode,
    tmdbId,
    seasonNumber,
    shouldScroll
}: UseScrollToEpisodeProps) => {
    useEffect(() => {
        if (shouldScroll && targetEpisode) {
            let attempts = 0;
            const maxAttempts = 20;

            const scrollToEpisode = () => {
                const elementId = `episode-${tmdbId}-s${seasonNumber}-e${targetEpisode}`;
                const element = document.getElementById(elementId);

                if (element) {
                    const lenis = getLenis();
                    if (lenis) {
                        lenis.scrollTo(element, { offset: -100, duration: 1.5 });
                    } else {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }



                    
                    const highlightClasses = ['!bg-green-500/5'];

                    element.classList.add(...highlightClasses);
                } else if (attempts < maxAttempts) {
                    attempts++;
                    setTimeout(scrollToEpisode, 100);
                }
            };

            setTimeout(scrollToEpisode, 500);
        }
    }, [targetEpisode, tmdbId, seasonNumber, shouldScroll]);
};
