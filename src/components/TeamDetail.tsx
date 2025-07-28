
import { X, Trophy, Calendar, Target, Users, MapPin, Instagram, ExternalLink, Palette, Star, Award } from 'lucide-react';
import { Team, Competition } from '@/lib/types';

interface TeamDetailProps {
  team: Team;
  onClose: () => void;
  onCompetitionClick?: (competitionData: any) => void;
  competitions?: Competition[];
}

export const TeamDetail = ({ team, onClose, onCompetitionClick, competitions = [] }: TeamDetailProps) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-slate-600/30 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="max-h-[90vh] overflow-y-auto scrollbar-hide">
        {/* Modern Header with Gradient */}
        <div className="relative bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 sm:p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full p-2 transition-all duration-200"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-start space-x-6 pr-12">
            {/* Modern Team Logo */}
            {team.logo ? (
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl flex-shrink-0">
                <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl">
                <span className="text-white font-bold text-2xl">{team.name.split(' ')[0][0]}</span>
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent mb-3 break-words">{team.name}</h2>
              <div className="flex flex-wrap items-center gap-3 text-slate-300 mb-4">
                <span className="text-lg font-medium">{team.university}</span>
                {team.city && (
                  <>
                    <span className="text-slate-500">•</span>
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{team.city}</span>
                    </div>
                  </>
                )}
              </div>
              
              {/* Status Badge */}
              {team.qualified && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 text-green-400 text-sm font-semibold">
                  <Star className="h-4 w-4" />
                  QUALIFIED
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modern Stats Cards */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="group bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-400/20 rounded-2xl p-6 text-center hover:from-blue-500/15 hover:to-blue-600/10 transition-all duration-300">
              <div className="bg-blue-500/20 rounded-full p-3 w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Target className="h-6 w-6 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{team.bidPoints}</div>
              <div className="text-blue-300 text-sm font-medium">Bid Points</div>
            </div>
            
            <div className="group bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-400/20 rounded-2xl p-6 text-center hover:from-purple-500/15 hover:to-purple-600/10 transition-all duration-300">
              <div className="bg-purple-500/20 rounded-full p-3 w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-6 w-6 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{team.competitions_attending?.length || 0}</div>
              <div className="text-purple-300 text-sm font-medium">Competitions</div>
            </div>
          </div>
        </div>

        {/* Modern Competitions Section */}
        {team.competitions_attending && team.competitions_attending.length > 0 && (
          <div className="px-6 sm:px-8 pb-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <div className="bg-blue-500/20 rounded-full p-2 mr-3">
                <Calendar className="h-5 w-5 text-blue-400" />
              </div>
              Competitions Attending
            </h3>
            <div className="space-y-3">
              {team.competitions_attending.map((competitionId, index) => {
                const competition = competitions.find(comp => comp.id === competitionId);
                const competitionName = competition?.name || `Competition ${competitionId}`;
                
                return (
                  <div 
                    key={index} 
                    className={`group rounded-xl p-4 transition-all duration-200 ${
                      competition 
                        ? 'bg-gradient-to-r from-slate-800/50 to-slate-700/30 border border-slate-600/30 cursor-pointer hover:from-slate-700/70 hover:to-slate-600/50 hover:border-slate-500/50' 
                        : 'bg-gradient-to-r from-red-900/20 to-red-800/10 border border-red-600/30 cursor-not-allowed'
                    }`}
                    onClick={() => {
                      if (competition) {
                        onCompetitionClick?.(competition);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${competition ? 'bg-blue-400' : 'bg-red-400'}`}></div>
                        <span className={`font-medium ${
                          competition ? 'text-white' : 'text-red-400'
                        }`}>
                          {competitionName}
                        </span>
                        {!competition && (
                          <span className="text-xs text-red-300 bg-red-900/30 px-2 py-1 rounded-full">(Not found)</span>
                        )}
                      </div>
                      {competition && (
                        <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modern Achievements */}
        {team.achievements && team.achievements.length > 0 && (
        <div className="px-6 sm:px-8 pb-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <div className="bg-yellow-500/20 rounded-full p-2 mr-3">
              <Trophy className="h-5 w-5 text-yellow-400" />
            </div>
            Recent Achievements
          </h3>
          <div className="space-y-3">
            {team.achievements.map((achievement, index) => (
              <div key={index} className="group bg-gradient-to-r from-yellow-500/10 to-orange-500/5 border border-yellow-400/20 rounded-xl p-4 hover:from-yellow-500/15 hover:to-orange-500/10 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  <span className="text-slate-200 leading-relaxed">{achievement}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Modern History */}
        {team.history && team.history.length > 0 && (
          <div className="px-6 sm:px-8 pb-6">
          <h3 className="text-xl font-bold text-white mb-6">Team History</h3>
          <div className="space-y-4">
            {team.history.map((item, index) => (
              <div key={index} className="bg-gradient-to-r from-slate-800/30 to-slate-700/20 border border-slate-600/20 rounded-xl p-5">
                <p className="text-slate-200 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Modern Social Media */}
        {team.instagramlink && (
          <div className="px-6 sm:px-8 pb-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <div className="bg-pink-500/20 rounded-full p-2 mr-3">
                <Instagram className="h-5 w-5 text-pink-400" />
              </div>
              Social Media
            </h3>
            <a 
              href={team.instagramlink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-4 bg-gradient-to-r from-pink-500/10 to-purple-500/5 border border-pink-400/20 rounded-2xl p-5 hover:from-pink-500/15 hover:to-purple-500/10 hover:border-pink-400/40 transition-all duration-300"
            >
              <div className="bg-pink-500/20 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                <Instagram className="h-6 w-6 text-pink-400" />
              </div>
              <div>
                <div className="text-pink-400 font-semibold group-hover:text-pink-300 transition-colors">Follow on Instagram</div>
                <div className="text-pink-300/70 text-sm">Stay updated with latest content</div>
              </div>
              <ExternalLink className="h-5 w-5 text-pink-400/60 group-hover:text-pink-400 transition-colors ml-auto" />
            </a>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
