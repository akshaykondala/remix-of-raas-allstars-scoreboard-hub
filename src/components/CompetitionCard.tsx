import { MapPin, Calendar, Users, Star } from 'lucide-react';
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

  const teamCount = Array.isArray(competition.lineup) ? competition.lineup.length : 0;

  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] touch-manipulation"
    >
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-card via-card to-card/90" />
      
      {/* Colorful accent border */}
      <div className="absolute inset-0 rounded-2xl border border-primary/20 group-hover:border-primary/50 transition-colors duration-300" />
      
      {/* Top accent gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />
      
      {/* Decorative glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="relative p-4">
        {/* Header with logo and bid badge */}
        <div className="flex items-start gap-3 mb-3">
          {/* Logo */}
          {competition.logo ? (
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden ring-2 ring-primary/30 shadow-lg group-hover:ring-primary/50 transition-all duration-300">
                <img
                  src={competition.logo}
                  alt={`${competition.name} logo`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {/* Bid indicator on logo */}
              {competition.bid_status && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Star className="w-3 h-3 text-white fill-white" />
                </div>
              )}
            </div>
          ) : (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center ring-2 ring-primary/30">
              <span className="text-xl font-bold text-primary">
                {competition.name.charAt(0)}
              </span>
            </div>
          )}

          {/* Title and location */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-300">
              {competition.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary/70 flex-shrink-0" />
              <span className="text-sm truncate">{competition.city}</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-border/50">
          {/* Date */}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 text-primary/70" />
            <span className="text-xs sm:text-sm font-medium">{formatDate(competition.date)}</span>
          </div>

          {/* Team count and bid status */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
              <Users className="h-3 w-3 text-primary" />
              <span className="text-xs font-semibold text-primary">{teamCount}</span>
            </div>

            {competition.bid_status && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                <span className="text-xs font-semibold text-amber-500">Bid</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hover shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
    </div>
  );
}
