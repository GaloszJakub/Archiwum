import { useNavigate } from 'react-router-dom';
import { tmdbService, MovieDetails as MovieDetailsType } from '@/lib/tmdb';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { AddToCollectionButton } from './AddToCollectionButton';
import { ScraperButton } from './ScraperButton';
import { MetaInfo } from './MetaInfo';

interface MovieDetailsHeaderProps {
  data: MovieDetailsType;
}

export const MovieDetailsHeader = ({ data }: MovieDetailsHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="relative h-[50vh] md:h-[60vh] -mx-6 lg:-mx-8 -mt-6 lg:-mt-8 mb-8 overflow-hidden">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <Button
          variant="ghost"
          onClick={() => navigate('/movies')}
          className="gap-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Powrót
        </Button>
      </div>

      {/* Backdrop Image */}
      <img
        src={tmdbService.getImageUrl(data.backdrop_path || data.poster_path, 'original')}
        alt={data.title}
        className="w-full h-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

      {/* Title and Tagline */}
      <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{data.title}</h1>
          {data.tagline && (
            <p className="text-xl text-foreground-secondary italic mb-6">{data.tagline}</p>
          )}
        </div>
      </div>
    </div>
  );
};
