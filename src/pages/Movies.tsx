import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SplitText } from '@/components/SplitText';
import { MovieCard } from '@/components/MovieCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import {
    useSearchMovies,
    usePopularMovies,
    useDiscoverMovies,
    useMovieGenres,
    useUpcomingMovies,
    useTopRatedMovies
} from '@/hooks/useTMDB';
import { tmdbService } from '@/lib/tmdb';
import { MediaSection } from '@/components/MediaSection';

const Movies = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [sortBy, setSortBy] = useState('popularity.desc');
    const observerTarget = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const { data: genresData } = useMovieGenres();

    const hasFilters = selectedGenre || selectedYear || sortBy !== 'popularity.desc';
    const showGrid = debouncedQuery || hasFilters;

    // Search & Discover (Grid View)
    const {
        data: searchData,
        isLoading: searchLoading,
        error: searchError,
        fetchNextPage: fetchNextSearchPage,
        hasNextPage: hasNextSearchPage,
        isFetchingNextPage: isFetchingNextSearchPage
    } = useSearchMovies(debouncedQuery);

    const {
        data: discoverData,
        isLoading: discoverLoading,
        error: discoverError,
        fetchNextPage: fetchNextDiscoverPage,
        hasNextPage: hasNextDiscoverPage,
        isFetchingNextPage: isFetchingNextDiscoverPage
    } = useDiscoverMovies({
        with_genres: selectedGenre,
        sort_by: sortBy,
        year: selectedYear ? parseInt(selectedYear) : undefined,
    });

    // Section Data (Carousel View)
    const { data: popularData, isLoading: popularLoading } = usePopularMovies();
    const { data: upcomingData, isLoading: upcomingLoading } = useUpcomingMovies();
    const { data: topRatedData, isLoading: topRatedLoading } = useTopRatedMovies();

    const { data: actionMovies } = useDiscoverMovies({ with_genres: '28' }); // Akcja
    const { data: comedyMovies } = useDiscoverMovies({ with_genres: '35' }); // Komedia
    const { data: horrorMovies } = useDiscoverMovies({ with_genres: '27' }); // Horror
    const { data: dramaMovies } = useDiscoverMovies({ with_genres: '18' });  // Dramat
    const { data: scifiMovies } = useDiscoverMovies({ with_genres: '878' }); // Sci-Fi

    // Grid Data calculation
    const gridMovies = debouncedQuery
        ? (searchData?.pages.flatMap(page => page.results) || [])
        : (discoverData?.pages.flatMap(page => page.results) || []);

    const isGridLoading = debouncedQuery ? searchLoading : discoverLoading;
    const gridError = debouncedQuery ? searchError : discoverError;
    const fetchNextPage = debouncedQuery ? fetchNextSearchPage : fetchNextDiscoverPage;
    const hasNextPage = debouncedQuery ? hasNextSearchPage : hasNextDiscoverPage;
    const isFetchingNextPage = debouncedQuery ? isFetchingNextSearchPage : isFetchingNextDiscoverPage;

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Infinite scroll observer for Grid View
    useEffect(() => {
        if (!showGrid) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [showGrid, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const handleGenreClick = (genreId: string) => {
        setSelectedGenre(genreId);
        setSearchQuery('');
        // If filters were hidden, maybe show them or just switch to grid view implicitly by setting state
        if (!showFilters) setShowFilters(true);
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <SplitText
                        text="Filmy"
                        className="text-3xl lg:text-5xl font-bold"
                    />
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setShowFilters(!showFilters)}
                        className={`bg-background-secondary border-border hover:bg-secondary shrink-0 ${hasFilters ? 'text-primary border-primary' : ''}`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                    </Button>
                </div>

                {/* Mobile-friendly search bar */}
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
                    <Input
                        type="text"
                        placeholder="Szukaj filmów..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-background-secondary border-border w-full"
                    />
                </div>

                {/* Quick genre filters - clicking these enters Grid View */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <Button
                        variant={selectedGenre === '' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedGenre('')}
                        className="shrink-0"
                    >
                        Wszystkie
                    </Button>
                    {genresData?.genres.map((genre) => (
                        <Button
                            key={genre.id}
                            variant={selectedGenre === genre.id.toString() ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleGenreClick(genre.id.toString())}
                            className="shrink-0"
                        >
                            {genre.name}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Filters (collapsible) */}
            {showFilters && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-background-secondary rounded-lg p-4 border border-border"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm text-foreground-secondary mb-2 block">Gatunek</label>
                            <select
                                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground"
                                value={selectedGenre}
                                onChange={(e) => setSelectedGenre(e.target.value)}
                            >
                                <option value="">Wszystkie</option>
                                {genresData?.genres.map((genre) => (
                                    <option key={genre.id} value={genre.id.toString()}>
                                        {genre.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-foreground-secondary mb-2 block">Rok</label>
                            <select
                                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                            >
                                <option value="">Wszystkie</option>
                                {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                    <option key={year} value={year.toString()}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-foreground-secondary mb-2 block">Sortowanie</label>
                            <select
                                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="popularity.desc">Najpopularniejsze</option>
                                <option value="vote_average.desc">Najlepiej oceniane</option>
                                <option value="release_date.desc">Najnowsze</option>
                                <option value="title.asc">Alfabetycznie A-Z</option>
                            </select>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* CONTENT SWITCHER */}
            {showGrid ? (
                // GRID VIEW (Search or Filter active)
                <>
                    {isGridLoading && (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    )}

                    {gridError && (
                        <div className="text-center py-16">
                            <p className="text-foreground-secondary mb-4">
                                Błąd podczas ładowania filmów.
                            </p>
                        </div>
                    )}

                    {!isGridLoading && !gridError && gridMovies.length > 0 && (
                        <motion.div
                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.05 },
                                },
                            }}
                        >
                            {Array.from(new Map(gridMovies.map(m => [m.id, m])).values()).map((movie, index) => (
                                <motion.div
                                    key={`${movie.id}-${index}`}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 },
                                    }}
                                    onClick={() => navigate(`/movie/${movie.id}`)}
                                >
                                    <MovieCard
                                        id={movie.id.toString()}
                                        title={movie.title || 'Unknown'}
                                        posterUrl={tmdbService.getImageUrl(movie.poster_path)}
                                        year={movie.release_date ? new Date(movie.release_date).getFullYear() : undefined}
                                        rating={movie.vote_average}
                                        layoutId={`movie-${movie.id}`}
                                        tmdbId={movie.id}
                                        type="movie"
                                        posterPath={movie.poster_path}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {!isGridLoading && !gridError && gridMovies.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-foreground-secondary">
                                Nie znaleziono filmów dla podanych kryteriów.
                            </p>
                        </div>
                    )}

                    {hasNextPage && !isGridLoading && (
                        <div ref={observerTarget} className="flex justify-center py-8">
                            {isFetchingNextPage && (
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            )}
                        </div>
                    )}
                </>
            ) : (
                // SECTIONS VIEW (Default)
                <div className="space-y-12">
                    <MediaSection
                        title="Popularne teraz"
                        items={popularData?.pages.flatMap(p => p.results) || []}
                        type="movie"
                        isLoading={popularLoading}
                    />
                    <MediaSection
                        title="Nadchodzące premiery"
                        items={upcomingData?.pages.flatMap(p => p.results) || []}
                        type="movie"
                        isLoading={upcomingLoading}
                    />
                    <MediaSection
                        title="Najlepiej oceniane"
                        items={topRatedData?.pages.flatMap(p => p.results) || []}
                        type="movie"
                        isLoading={topRatedLoading}
                    />

                    {/* Genre Sections */}
                    <MediaSection
                        title="Kino Akcji"
                        items={actionMovies?.pages.flatMap(p => p.results) || []}
                        type="movie"
                    />
                    <MediaSection
                        title="Komedie"
                        items={comedyMovies?.pages.flatMap(p => p.results) || []}
                        type="movie"
                    />
                    <MediaSection
                        title="Horrory"
                        items={horrorMovies?.pages.flatMap(p => p.results) || []}
                        type="movie"
                    />
                    <MediaSection
                        title="Dramaty"
                        items={dramaMovies?.pages.flatMap(p => p.results) || []}
                        type="movie"
                    />
                    <MediaSection
                        title="Sci-Fi"
                        items={scifiMovies?.pages.flatMap(p => p.results) || []}
                        type="movie"
                    />
                </div>
            )}
        </div>
    );
};

export default Movies;
