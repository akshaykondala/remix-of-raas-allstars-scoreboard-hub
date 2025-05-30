
import { Trophy, Target, Users } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  university: string;
  bidPoints: number;
  qualified: boolean;
  color: string;
  founded: string;
}

interface TeamCardProps {
  team: Team;
  rank: number;
  isQualified: boolean;
  cutoffPoints: number;
  onClick: () => void;
}

export const TeamCard = ({ team, rank, isQualified, cutoffPoints, onClick }: TeamCardProps) => {
  const getRankDisplay = () => {
    if (rank === 1) return { text: '1st', color: 'text-yellow-400', bg: 'bg-yellow-400/20' };
    if (rank === 2) return { text: '2nd', color: 'text-slate-300', bg: 'bg-slate-300/20' };
    if (rank === 3) return { text: '3rd', color: 'text-orange-400', bg: 'bg-orange-400/20' };
    return { text: `${rank}th`, color: 'text-blue-400', bg: 'bg-blue-400/20' };
  };

  const rankDisplay = getRankDisplay();

  return (
    <div 
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-lg p-4 sm:p-5 cursor-pointer transform transition-all duration-200 
        hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] touch-manipulation
        ${isQualified 
          ? 'bg-slate-800 border border-green-500/30 hover:border-green-500/50' 
          : 'bg-slate-800 border border-red-500/30 hover:border-red-500/50'
        }
      `}
    >
      {/* Rank Badge */}
      <div className={`absolute top-3 left-3 ${rankDisplay.bg} ${rankDisplay.color} px-2 py-1 rounded text-xs font-bold`}>
        {rankDisplay.text}
      </div>

      {/* Qualification Status */}
      <div className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-semibold ${
        isQualified 
          ? 'bg-green-600 text-white' 
          : 'bg-red-600 text-white'
      }`}>
        {isQualified ? 'QUALIFIED' : 'NOT QUALIFIED'}
      </div>

      {/* Team Color Strip */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${team.color}`}></div>

      <div className="ml-3 sm:ml-4">
        {/* Team Info */}
        <div className="flex items-start justify-between mb-3 mt-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{team.name}</h3>
            <p className="text-slate-400 text-sm">{team.university}</p>
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
            
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-slate-500" />
              <span className="text-slate-400 text-sm">Est. {team.founded}</span>
            </div>
          </div>

          {rank <= 3 && (
            <Trophy className={`h-5 w-5 ${rankDisplay.color}`} />
          )}
        </div>

        {/* Points to Cutoff */}
        {!isQualified && (
          <div className="mt-2 text-sm text-red-400">
            Need {cutoffPoints - team.bidPoints} more points to qualify
          </div>
        )}
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
    </div>
  );
};
