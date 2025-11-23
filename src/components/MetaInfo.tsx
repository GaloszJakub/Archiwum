import { MovieDetails as MovieDetailsType } from '@/lib/tmdb';
import { Star, Calendar, Clock } from 'lucide-react';
import { AddToCollectionButton } from './AddToCollectionButton';
import { ScraperButton } from './ScraperButton';

interface MetaInfoProps {
  data: MovieDetailsType;
}

export const MetaInfo = ({ data }: MetaInfoProps) => {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <AddToCollectionButton
        tmdbId={data.id}
        type="movie"
        title={data.title}
        posterPath={data.poster_path}
      />
      
      <ScraperButton
        movieId={`tmdb_${data.id}`}
        title={data.title}
        type="movie"
        year={data.release_date ? new Date(data.release_date).getFullYear() : undefined}
      />
      
      {data.vote_average > 0 && (
        <div className="flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-lg">
          <Star className="w-5 h-5 text-primary fill-current" />
          <span className="text-2xl font-bold">{data.vote_average.toFixed(1)}</span>
          <span className="text-foreground-secondary text-sm">/ 10</span>
        </div>
      )}
      
      {data.release_date && (
        <div className="flex items-center gap-2 text-foreground-secondary">
          <Calendar className="w-5 h-5" />
          <span className="text-lg">{new Date(data.release_date).getFullYear()}</span>
        </div>
      )}
      
      {data.runtime && (
        <div className="flex items-center gap-2 text-foreground-secondary">
          <Clock className="w-5 h-5" />
          <span className="text-lg">{data.runtime} min</span>
        </div>
      )}
      
      {data.status && (
        <div className="px-4 py-2 bg-background-secondary rounded-lg text-lg">
          {data.status}
        </div>
      )}
    </div>
  );
};
