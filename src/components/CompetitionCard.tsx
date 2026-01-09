
import { MapPin, Calendar, Users, Trophy, Star, CircleDot } from 'lucide-react';
import { Competition } from '@/lib/types';

interface CompetitionCardProps {
  competition: Competition;
  onClick: () => void;
}

export function CompetitionCard({ competition, onClick }: CompetitionCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl p-5 cursor-pointer transform transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl active:scale-[0.98] touch-manipulation bg-card/80 border border-border/70 w-full max-w-sm shadow-lg hover:shadow-primary/20 hover:border-primary/30 animate-enter"
    >
      {/* Accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent pointer-events-none" />

      {/* Centered competition logo - main focal point */}
      <div className="relative flex flex-col items-center text-center">
        {competition.logo && (
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-primary/20 mb-4 shadow-xl">
            <img
              src={competition.logo}
              alt={`${competition.name} logo`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Competition name */}
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 px-2">
          {competition.name}
        </h3>

        {/* Location and date */}
        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-3 flex-wrap justify-center">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{competition.city}</span>
          </span>
          <span className="text-muted-foreground/40">•</span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(competition.date)}</span>
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span className="font-semibold">
              {Array.isArray(competition.lineup) ? competition.lineup.length : 0}
            </span>
          </div>

          {/* Bid Status Badge */}
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${
              competition.bid_status
                ? 'bg-primary/15 text-primary border-primary/25'
                : 'bg-muted/60 text-muted-foreground border-border/60'
            }`}
          >
            {competition.bid_status ? (
              <Star className="h-3 w-3 fill-current" />
            ) : (
              <CircleDot className="h-3 w-3" />
            )}
            <span className="font-semibold">{competition.bid_status ? 'Bid' : 'Non-Bid'}</span>
          </div>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
    </div>
  );
}
