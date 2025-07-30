
import { Trophy, Target, Users, Lock, MapPin, Instagram } from 'lucide-react';
import { Team } from '../lib/types';

interface TeamCardProps {
  team: Team;
  rank: number;
  isQualified: boolean;
  cutoffPoints: number;
  onClick: () => void;
  showLockedIn?: boolean;
  genderComposition: string;
}

export const TeamCard = ({ team, rank, isQualified, cutoffPoints, onClick, showLockedIn }: TeamCardProps) => {
  // Debug: Log bidPoints value and type for each team
  console.log('Rendering TeamCard:', team.name, 'bidPoints:', team.bidPoints, 'type:', typeof team.bidPoints);
  const pointsNeeded = Math.max(0, cutoffPoints - team.bidPoints);
  
  return (
    <div 
      onClick={onClick}
      className="relative overflow-hidden rounded-lg p-4 sm:p-5 cursor-pointer transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] touch-manipulation bg-slate-800 border border-slate-600"
    >
      {/* Rank Badge */}
      <div className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-bold ${
        isQualified 
          ? 'bg-blue-600 text-white' 
          : 'bg-slate-400/20 text-slate-400'
      }`}>
        #{rank}
      </div>



      {/* Team Logo */}
      {team.logo && (
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full overflow-hidden border-2 border-slate-600">
          <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
        </div>
      )}



      {/* Locked In Badge - Adjust position if logo is present */}
      {showLockedIn && (
        <div className={`absolute top-3 ${team.logo ? 'right-12' : 'right-3'} bg-green-600/80 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1`}>
          <Lock className="h-3 w-3" />
          LOCKED
        </div>
      )}

      {/* Team Color Strip */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${team.color}`}></div>

      <div className="ml-3 sm:ml-4">
        {/* Team Info */}
        <div className="flex items-start justify-between mb-3 mt-6">
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{team.name}</h3>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <span>{team.university}</span>
              {team.city && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{team.city}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-blue-400" />
              <span className="text-white font-semibold">{team.bidPoints}</span>
              <span className="text-slate-400 text-sm hidden sm:inline">bid points</span>
              <span className="text-slate-400 text-sm sm:hidden">pts</span>
            </div>
          </div>

          {/* Points needed indicator */}
          {!isQualified && pointsNeeded > 0 && (
            <div className="text-right">
              <div className="text-red-400 text-xs">
                Need {pointsNeeded} more
              </div>
            </div>
          )}
        </div>

        {/* Instagram Link */}
        {team.instagramlink && (
          <div className="mt-3 flex items-center gap-2">
            <Instagram className="h-4 w-4 text-pink-400" />
            <a 
              href={team.instagramlink} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-pink-400 hover:text-pink-300 text-sm transition-colors"
            >
              Follow on Instagram
            </a>
          </div>
        )}
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
    </div>
  );
};
