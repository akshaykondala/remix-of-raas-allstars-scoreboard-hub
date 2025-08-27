
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
      className="relative overflow-hidden rounded-lg p-4 sm:p-5 cursor-pointer transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] touch-manipulation bg-slate-800 border border-slate-600 w-full max-w-sm"
    >
      {/* Left accent strip to mirror TeamCard */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>

      {/* Top-right competition logo */}
      {competition.logo && (
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full overflow-hidden border-2 border-slate-600">
          <img
            src={competition.logo}
            alt={`${competition.name} logo`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="ml-3 sm:ml-4">
        {/* Name */}
        <div className="flex items-start justify-between mb-3 mt-6">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1 truncate">
              {competition.name}
            </h3>
            <div className="flex items-center gap-2 text-slate-400 text-sm flex-wrap">
              <span className="flex items-center gap-1 min-w-0">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{competition.city}</span>
              </span>
              <span className="text-slate-500">•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(competition.date)}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Stats row to mirror TeamCard's points area */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-white font-semibold">
                {Array.isArray(competition.lineup) ? competition.lineup.length : 0}
              </span>
              <span className="text-slate-400 text-sm hidden sm:inline">teams</span>
              <span className="text-slate-400 text-sm sm:hidden">teams</span>
            </div>
            
            {/* Bid Status Badge */}
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              competition.bid_status 
                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30' 
                : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
            }`}>
              {competition.bid_status ? (
                <Star className="h-3 w-3 fill-current" />
              ) : (
                <CircleDot className="h-3 w-3" />
              )}
              <span className="hidden sm:inline">{competition.bid_status ? 'Bid' : 'Non-Bid'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hover overlay to match TeamCard */}
      <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
    </div>
  );
}
