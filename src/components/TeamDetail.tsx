
import { X, Trophy, Calendar, Target, Users, MapPin, Instagram, ExternalLink, Palette } from 'lucide-react';
import { Team } from '../lib/types';

interface TeamDetailProps {
  team: Team;
  onClose: () => void;
  onCompetitionClick?: (competitionData: any) => void;
  competitions?: Competition[];
}

export const TeamDetail = ({ team, onClose, onCompetitionClick, competitions = [] }: TeamDetailProps) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-4 sm:p-6 border-b border-slate-700">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-2 -m-2 touch-manipulation"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-start space-x-4 pr-8">
            {/* Team Logo or Initial */}
            {team.logo ? (
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 border-slate-600 flex-shrink-0">
                <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className={`w-12 h-12 sm:w-16 sm:h-16 ${team.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <span className="text-white font-bold text-lg sm:text-xl">{team.name.split(' ')[0][0]}</span>
            </div>
            )}
            
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 break-words">{team.name}</h2>
              <div className="flex items-center gap-2 text-slate-400 text-sm sm:text-base break-words mb-2">
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
              
              {/* Theme Badge */}
              {team.color && team.color !== 'bg-slate-600' && (
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${team.color} text-white mb-2`}>
                  <Palette className="h-3 w-3" />
                  {team.color.replace('bg-', '').toUpperCase()}
              </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-4 sm:p-6 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Team Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 text-center">
              <Target className="h-5 w-5 text-blue-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{team.bidPoints}</div>
              <div className="text-slate-400 text-sm">Bid Points</div>
            </div>
            
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 text-center">
              <Calendar className="h-5 w-5 text-blue-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{team.competitions_attending?.length || 0}</div>
              <div className="text-slate-400 text-sm">Competitions</div>
            </div>
          </div>
        </div>

        {/* Competitions Attending */}
        {team.competitions_attending && team.competitions_attending.length > 0 && (
          <div className="p-4 sm:p-6 border-b border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Calendar className="h-4 w-4 text-blue-400 mr-2" />
              Competitions Attending
            </h3>
            <div className="space-y-2">
              {team.competitions_attending.map((competitionId, index) => {
                // Find the competition name by ID
                const competition = competitions.find(comp => comp.id === competitionId);
                const competitionName = competition?.name || `Competition ${competitionId}`;
                
                return (
                  <div 
                    key={index} 
                    className={`rounded-lg p-3 transition-colors ${
                      competition 
                        ? 'bg-slate-900 border border-slate-700 cursor-pointer hover:bg-slate-800' 
                        : 'bg-red-900/20 border border-red-600/30 cursor-not-allowed'
                    }`}
                    onClick={() => {
                      if (competition) {
                        onCompetitionClick?.(competition);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm sm:text-base ${
                          competition ? 'text-slate-300' : 'text-red-400'
                        }`}>
                          {competitionName}
                        </span>
                        {!competition && (
                          <span className="text-xs text-red-300">(Not found in database)</span>
                        )}
                      </div>
                      {competition && (
                        <ExternalLink className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Achievements */}
        {team.achievements && team.achievements.length > 0 && (
        <div className="p-4 sm:p-6 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Trophy className="h-4 w-4 text-yellow-400 mr-2" />
            Recent Achievements
          </h3>
          <div className="space-y-2">
            {team.achievements.map((achievement, index) => (
              <div key={index} className="bg-slate-900 border border-slate-700 rounded-lg p-3">
                <span className="text-slate-300 text-sm sm:text-base">{achievement}</span>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* History */}
        {team.history && team.history.length > 0 && (
          <div className="p-4 sm:p-6 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Team History</h3>
          <div className="space-y-3">
            {team.history.map((item, index) => (
              <p key={index} className="text-slate-300 leading-relaxed text-sm sm:text-base">
                {item}
              </p>
            ))}
          </div>
        </div>
        )}

        {/* Instagram Link */}
        {team.instagramlink && (
          <div className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Instagram className="h-4 w-4 text-pink-400 mr-2" />
              Social Media
            </h3>
            <a 
              href={team.instagramlink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg p-3 hover:bg-slate-800 transition-colors"
            >
              <Instagram className="h-4 w-4 text-pink-400" />
              <span className="text-pink-400 hover:text-pink-300">Follow on Instagram</span>
              <ExternalLink className="h-4 w-4 text-slate-400" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
