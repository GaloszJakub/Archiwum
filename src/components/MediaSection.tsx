import { useRef } from 'react';
import { MovieCard } from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { tmdbService } from '@/lib/tmdb';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface MediaSectionProps {
    title: string;
    items: any[];
    type: 'movie' | 'tv';
    isLoading?: boolean;
}

export const MediaSection = ({ title, items, type, isLoading }: MediaSectionProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === 'left' ? -current.clientWidth + 100 : current.clientWidth - 100;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="h-8 w-48 bg-muted animate-pulse rounded" />
                <div className="flex gap-4 overflow-hidden">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="min-w-[160px] h-[240px] bg-muted animate-pulse rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (items.length === 0) return null;

    return (
        <section className="space-y-4 relative group">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-2xl font-bold">{title}</h2>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden md:flex h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm border-white/10 hover:bg-white/10"
                        onClick={() => scroll('left')}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden md:flex h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm border-white/10 hover:bg-white/10"
                        onClick={() => scroll('right')}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory px-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {items.map((item) => (
                    <motion.div
                        key={item.id}
                        className="min-w-[150px] sm:min-w-[180px] snap-start"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => navigate(type === 'movie' ? `/movie/${item.id}` : `/series/${item.id}`)}
                    >
                        <MovieCard
                            id={item.id.toString()}
                            title={type === 'movie' ? item.title : item.name}
                            posterUrl={tmdbService.getImageUrl(item.poster_path)}
                            year={
                                type === 'movie'
                                    ? item.release_date
                                        ? new Date(item.release_date).getFullYear()
                                        : undefined
                                    : item.first_air_date
                                        ? new Date(item.first_air_date).getFullYear()
                                        : undefined
                            }
                            rating={item.vote_average}
                            tmdbId={item.id}
                            type={type}
                            posterPath={item.poster_path}
                        />
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
