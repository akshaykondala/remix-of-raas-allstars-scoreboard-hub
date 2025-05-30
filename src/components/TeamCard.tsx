
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
    if (rank === 2) return { text: '2nd', color: 'text-gray-300', bg: 'bg-gray-300/20' };
    if (rank === 3) return { text: '3rd', color: 'text-orange-400', bg: 'bg-orange-400/20' };
    return { text: `${rank}th`, color: 'text-purple-300', bg: 'bg-purple-300/20' };
  };

  const rankDisplay = getRankDisplay();

  return (
    <div 
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl
        ${isQualified 
          ? 'bg-gradient-to-r from-green-500/20 to-emerald-600/20 border border-green-400/30' 
          : 'bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-400/30'
        }
        backdrop-blur-sm
      `}
    >
      {/* Rank Badge */}
      <div className={`absolute top-4 left-4 ${rankDisplay.bg} ${rankDisplay.color} px-3 py-1 rounded-full text-sm font-bold`}>
        {rankDisplay.text}
      </div>

      {/* Qualification Status */}
      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
        isQualified 
          ? 'bg-green-500 text-white' 
          : 'bg-red-500 text-white'
      }`}>
        {isQualified ? 'QUALIFIED' : 'NOT QUALIFIED'}
      </div>

      {/* Team Color Strip */}
      <div className={`absolute left-0 top-0 bottom-0 w-2 ${team.color}`}></div>

      <div className="ml-6">
        {/* Team Info */}
        <div className="flex items-start justify-between mb-4 mt-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">{team.name}</h3>
            <p className="text-purple-200 text-sm">{team.university}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-yellow-400" />
              <span className="text-white font-semibold text-lg">{team.bidPoints}</span>
              <span className="text-purple-200 text-sm">bid points</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-300" />
              <span className="text-purple-200 text-sm">Est. {team.founded}</span>
            </div>
          </div>

          {rank <= 3 && (
            <Trophy className={`h-6 w-6 ${rankDisplay.color}`} />
          )}
        </div>

        {/* Points to Cutoff */}
        {!isQualified && (
          <div className="mt-3 text-sm text-red-300">
            Need {cutoffPoints - team.bidPoints} more points to qualify
          </div>
        )}
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};
