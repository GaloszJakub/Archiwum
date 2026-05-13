import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, X, Star, Search } from 'lucide-react';
import {
    useSearchTVShows,
    useDiscoverTVShows,
} from '@/hooks/useTMDB';
import { tmdbService } from '@/lib/tmdb';

const A = {
    bg: '#0a0a0c',
    surface: '#14141a',
    surface2: '#1c1c23',
    border: 'rgba(255,248,230,0.06)',
    border2: 'rgba(255,248,230,0.10)',
    text: '#f3efe6',
    text2: '#b8b1a3',
    muted: '#847d6f',
    subtle: '#58524a',
    amber: '#d4a056',
};

const Series = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || '');
    const [sortBy] = useState('popularity.desc');
    const observerTarget = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const genreFromUrl = searchParams.get('genre') || '';
        if (genreFromUrl !== selectedGenre) {
            setSelectedGenre(genreFromUrl);
        }
    }, [searchParams]);

    const { data: searchData, isLoading: searchLoading, fetchNextPage: fetchNextSearch, hasNextPage: hasNextSearch, isFetchingNextPage: isFetchingSearch } = useSearchTVShows(debouncedQuery);
    const { data: discoverData, isLoading: discoverLoading, fetchNextPage: fetchNextDiscover, hasNextPage: hasNextDiscover, isFetchingNextPage: isFetchingDiscover } = useDiscoverTVShows({ with_genres: selectedGenre, sort_by: sortBy });

    const gridItems = debouncedQuery
        ? (searchData?.pages.flatMap((p) => p.results) || [])
        : (discoverData?.pages.flatMap((p) => p.results) || []);

    const isGridLoading = debouncedQuery ? searchLoading : discoverLoading;
    const fetchNextPage = debouncedQuery ? fetchNextSearch : fetchNextDiscover;
    const hasNextPage = debouncedQuery ? hasNextSearch : hasNextDiscover;
    const isFetchingNextPage = debouncedQuery ? isFetchingSearch : isFetchingDiscover;

    useEffect(() => {
        const t = setTimeout(() => setDebouncedQuery(searchQuery), 400);
        return () => clearTimeout(t);
    }, [searchQuery]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => { if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage(); },
            { threshold: 0.1 }
        );
        const el = observerTarget.current;
        if (el) observer.observe(el);
        return () => { if (el) observer.unobserve(el); };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const quickGenres = [
        { id: '', name: 'Wszystkie' },
        { id: '18', name: 'Dramat' },
        { id: '35', name: 'Komedia' },
        { id: '80', name: 'Kryminał' },
        { id: '10765', name: 'Sci-Fi' },
        { id: '16', name: 'Animacja' },
        { id: '99', name: 'Dokument' },
    ];

    return (
        <div
            style={{
                padding: '32px 24px 100px',
                fontFamily: '"Inter Tight", "Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
            }}
        >
            {/* Header */}
            <h1
                style={{
                    fontFamily: '"Instrument Serif", serif',
                    fontStyle: 'italic',
                    fontSize: 36,
                    fontWeight: 400,
                    color: A.text,
                    lineHeight: 1,
                    marginBottom: 24,
                }}
            >
                Seriale
            </h1>

            {/* Search */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '0 14px',
                    height: 40,
                    background: A.surface,
                    border: `1px solid ${A.border}`,
                    borderRadius: 999,
                    marginBottom: 20,
                }}
            >
                <Search size={16} color={A.muted} />
                <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Szukaj seriali…"
                    style={{
                        flex: 1,
                        border: 'none',
                        background: 'transparent',
                        outline: 'none',
                        fontSize: 14,
                        color: A.text,
                        fontFamily: 'inherit',
                    }}
                />
                {searchQuery && (
                    <button
                        onClick={() => { setSearchQuery(''); setDebouncedQuery(''); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                    >
                        <X size={14} color={A.muted} />
                    </button>
                )}
            </div>

            {/* Genre chips */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide" style={{ marginBottom: 28, paddingBottom: 4 }}>
                {quickGenres.map((g) => {
                    const active = selectedGenre === g.id;
                    return (
                        <button
                            key={g.id}
                            onClick={() => {
                                setSelectedGenre(g.id);
                                setSearchQuery('');
                                setDebouncedQuery('');
                                if (g.id) {
                                    setSearchParams({ genre: g.id });
                                } else {
                                    setSearchParams({});
                                }
                            }}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                height: 28,
                                padding: '0 12px',
                                borderRadius: 999,
                                fontSize: 12,
                                fontWeight: 500,
                                letterSpacing: '0.01em',
                                whiteSpace: 'nowrap',
                                cursor: 'pointer',
                                border: `1px solid ${active ? A.text : A.border2}`,
                                background: active ? A.text : A.surface,
                                color: active ? '#0a0a0c' : A.text2,
                                fontFamily: 'inherit',
                                transition: 'all 150ms ease',
                                flexShrink: 0,
                            }}
                        >
                            {g.name}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <div>
                {isGridLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
                        <Loader2 className="animate-spin" size={28} color={A.amber} />
                    </div>
                ) : gridItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 0', color: A.muted, fontSize: 14 }}>
                        Brak wyników
                    </div>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
                        {Array.from(new Map(gridItems.map((s) => [s.id, s])).values()).map((show) => (
                            <div key={show.id} onClick={() => navigate(`/series/${show.id}`)} style={{ cursor: 'pointer' }}>
                                <div style={{ borderRadius: 4, overflow: 'hidden' }}>
                                    <img
                                        src={tmdbService.getImageUrl(show.poster_path)}
                                        alt={show.name}
                                        style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', display: 'block' }}
                                        loading="lazy"
                                    />
                                </div>
                                <div style={{ marginTop: 8 }}>
                                    <div style={{
                                        fontFamily: '"Inter Tight", sans-serif',
                                        fontWeight: 500,
                                        fontSize: 14,
                                        color: A.text,
                                        lineHeight: 1.2,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}>{show.name}</div>
                                    <div style={{ fontSize: 11, color: A.muted, marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <span>{show.first_air_date?.slice(0, 4)}</span>
                                        {show.vote_average > 0 && (
                                            <>
                                                <span style={{ color: A.subtle }}>·</span>
                                                <span style={{ color: A.amber, display: 'inline-flex', alignItems: 'center', gap: 2, fontFamily: '"JetBrains Mono", monospace' }}>
                                                    <Star size={9} fill={A.amber} color={A.amber} />{show.vote_average.toFixed(1)}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {hasNextPage && (
                    <div ref={observerTarget} style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
                        {isFetchingNextPage && <Loader2 className="animate-spin" size={24} color={A.amber} />}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Series;
