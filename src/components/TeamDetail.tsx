
import { useState } from 'react';
import { X, Trophy, Calendar, Target, Users, MapPin, Instagram, ExternalLink, Palette, Star, Award } from 'lucide-react';
import { Team, Competition } from '@/lib/types';

interface TeamDetailProps {
  team: Team;
  onClose: () => void;
  onCompetitionClick?: (competitionData: any) => void;
  competitions?: Competition[];
}

export const TeamDetail = ({ team, onClose, onCompetitionClick, competitions = [] }: TeamDetailProps) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 200); // Match the animation duration
  };
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className={`bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-slate-600/30 shadow-2xl w-full max-h-full overflow-hidden ${isExiting ? 'animate-slide-out-right' : 'animate-slide-in-right'}`}>
        <div className="max-h-[95vh] overflow-y-auto scrollbar-hide">
        {/* Compact Header */}
        <div className="relative bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-4">
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full p-1.5 transition-all duration-200"
          >
            <X size={16} />
          </button>
          
          <div className="flex items-center space-x-3 pr-10">
            {/* Compact Team Logo */}
            {team.logo ? (
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/20 shadow-lg flex-shrink-0">
                <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-white font-bold text-lg">{team.name.split(' ')[0][0]}</span>
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent mb-1 break-words leading-tight">{team.name}</h2>
              <div className="text-slate-300 text-sm mb-2">{team.university}</div>
              {team.city && (
                <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full text-xs w-fit">
                  <MapPin className="h-3 w-3" />
                  <span>{team.city}</span>
                </div>
              )}
              
              {/* Compact Status Badge */}
              {team.qualified && (
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 text-green-400 text-xs font-semibold mt-2">
                  <Star className="h-3 w-3" />
                  QUALIFIED
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Compact Stats */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-400/20 rounded-xl p-3 text-center">
              <div className="bg-blue-500/20 rounded-full p-2 w-fit mx-auto mb-2">
                <Target className="h-4 w-4 text-blue-400" />
              </div>
              <div className="text-xl font-bold text-white mb-1">{team.bidPoints}</div>
              <div className="text-blue-300 text-xs">Bid Points</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-400/20 rounded-xl p-3 text-center">
              <div className="bg-purple-500/20 rounded-full p-2 w-fit mx-auto mb-2">
                <Calendar className="h-4 w-4 text-purple-400" />
              </div>
              <div className="text-xl font-bold text-white mb-1">{team.competitions_attending?.length || 0}</div>
              <div className="text-purple-300 text-xs">Competitions</div>
            </div>
          </div>
        </div>

        {/* Compact Competitions Section */}
        {team.competitions_attending && team.competitions_attending.length > 0 && (
          <div className="px-4 pb-4">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center">
              <div className="bg-blue-500/20 rounded-full p-1 mr-2">
                <Calendar className="h-3 w-3 text-blue-400" />
              </div>
              Competitions
            </h3>
            <div className="space-y-2">
              {team.competitions_attending.map((competitionId, index) => {
                const competition = competitions.find(comp => comp.id === competitionId);
                const competitionName = competition?.name || `Competition ${competitionId}`;
                
                return (
                  <div 
                    key={index} 
                    className={`group rounded-lg p-2 transition-all duration-200 ${
                      competition 
                        ? 'bg-gradient-to-r from-slate-800/50 to-slate-700/30 border border-slate-600/30 cursor-pointer hover:from-slate-700/70 hover:to-slate-600/50' 
                        : 'bg-gradient-to-r from-red-900/20 to-red-800/10 border border-red-600/30'
                    }`}
                    onClick={() => {
                      if (competition) {
                        onCompetitionClick?.(competition);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${competition ? 'bg-blue-400' : 'bg-red-400'}`}></div>
                        <span className={`text-xs font-medium ${
                          competition ? 'text-white' : 'text-red-400'
                        }`}>
                          {competitionName}
                        </span>
                      </div>
                      {competition && (
                        <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-white transition-colors" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Compact Achievements */}
        {team.achievements && team.achievements.length > 0 && (
        <div className="px-4 pb-4">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center">
            <div className="bg-yellow-500/20 rounded-full p-1 mr-2">
              <Trophy className="h-3 w-3 text-yellow-400" />
            </div>
            Achievements
          </h3>
          <div className="space-y-2">
            {team.achievements.slice(0, 3).map((achievement, index) => (
              <div key={index} className="bg-gradient-to-r from-yellow-500/10 to-orange-500/5 border border-yellow-400/20 rounded-lg p-2">
                <div className="flex items-start gap-2">
                  <Award className="h-3 w-3 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-200 text-xs leading-relaxed">{achievement}</span>
                </div>
              </div>
            ))}
            {team.achievements.length > 3 && (
              <div className="text-xs text-slate-400 text-center">+{team.achievements.length - 3} more</div>
            )}
          </div>
        </div>
        )}

        {/* Minimal Instagram Link */}
        {team.instagramlink && (
          <div className="px-4 pb-4">
            <a 
              href={team.instagramlink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500/10 to-purple-500/5 border border-pink-400/20 rounded-lg p-3 hover:from-pink-500/15 hover:to-purple-500/10 transition-all duration-300"
            >
              <Instagram className="h-4 w-4 text-pink-400" />
              <span className="text-pink-400 font-medium text-sm">Instagram</span>
              <ExternalLink className="h-3 w-3 text-pink-400/60" />
            </a>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
