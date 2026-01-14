import { MapPin, Star } from 'lucide-react';
import { Competition } from '@/lib/types';

interface CompetitionCardProps {
  competition: Competition;
  onClick: () => void;
}

export function CompetitionCard({ competition, onClick }: CompetitionCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/30 cursor-pointer transition-all duration-200 hover:bg-card hover:border-primary/30 active:scale-[0.98] touch-manipulation"
    >
      {/* Logo */}
      {competition.logo ? (
        <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-border/50">
          <img
            src={competition.logo}
            alt={competition.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 ring-1 ring-border/50">
          <span className="text-sm font-bold text-primary">
            {competition.name.charAt(0)}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground truncate">
            {competition.name}
          </h3>
          {competition.bid_status && (
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="text-xs truncate">{competition.city}</span>
        </div>
      </div>
    </div>
  );
}
