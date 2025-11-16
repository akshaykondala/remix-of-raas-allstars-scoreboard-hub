
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
      className="relative overflow-hidden rounded-2xl p-5 cursor-pointer transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] touch-manipulation bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600/50 w-full max-w-sm shadow-md hover:shadow-blue-500/10"
    >
      {/* Centered competition logo - main focal point */}
      <div className="flex flex-col items-center text-center">
        {competition.logo && (
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-slate-600 mb-4 shadow-lg">
            <img
              src={competition.logo}
              alt={`${competition.name} logo`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Competition name - less prominent */}
        <h3 className="text-base sm:text-lg font-medium text-slate-300 mb-2 px-2">
          {competition.name}
        </h3>

        {/* Location and date - subdued */}
        <div className="flex items-center gap-2 text-slate-500 text-xs mb-3 flex-wrap justify-center">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{competition.city}</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(competition.date)}</span>
          </span>
        </div>

        {/* Stats - minimal */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Users className="h-3.5 w-3.5" />
            <span>{Array.isArray(competition.lineup) ? competition.lineup.length : 0}</span>
          </div>
          
          {/* Bid Status Badge - smaller */}
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
            competition.bid_status 
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30' 
              : 'bg-slate-500/20 text-slate-500 border border-slate-500/30'
          }`}>
            {competition.bid_status ? (
              <Star className="h-3 w-3 fill-current" />
            ) : (
              <CircleDot className="h-3 w-3" />
            )}
            <span>{competition.bid_status ? 'Bid' : 'Non-Bid'}</span>
          </div>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
    </div>
  );
}
