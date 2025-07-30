
import { useState } from 'react';
import { X, Trophy, Calendar, Target, Users, MapPin, Instagram, ExternalLink, Palette, Star, Award, Mail, Phone, Globe, User, Clock } from 'lucide-react';
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
        {/* Modern Header with Hero Profile */}
        <div className="relative bg-gradient-to-br from-blue-600/20 via-purple-600/15 to-slate-800/20 p-6">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full p-2 transition-all duration-200 z-10"
          >
            <X size={18} />
          </button>
          
          {/* Hero Team Presentation */}
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Large Team Logo */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
              {team.logo ? (
                <div className="relative w-24 h-24 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl">
                  <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl border-2 border-white/20">
                  <span className="text-white font-bold text-2xl">{team.name.split(' ')[0][0]}</span>
                </div>
              )}
            </div>
            
            {/* Team Name & Info */}
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-2">{team.name}</h1>
              <p className="text-slate-300 text-lg font-medium mb-2">{team.university}</p>
              
              {/* Modern Info Badges */}
              <div className="flex flex-wrap justify-center gap-2 mb-3">
                {team.city && (
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm border border-white/20">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{team.city}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm border border-purple-400/30">
                  <Users className="h-3.5 w-3.5 text-purple-300" />
                  <span className="text-purple-200">{team.genderComposition}</span>
                </div>
                
                <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm border border-blue-400/30">
                  <Clock className="h-3.5 w-3.5 text-blue-300" />
                  <span className="text-blue-200">Est. {team.founded}</span>
                </div>
              </div>
              
              {/* Status Badge */}
              {team.qualified && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/40 text-green-300 text-sm font-bold">
                  <Star className="h-4 w-4" />
                  QUALIFIED FOR RAS
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-500/15 to-blue-600/10 border border-blue-400/30 rounded-2xl p-4 text-center">
              <div className="bg-blue-500/20 rounded-full p-3 w-fit mx-auto mb-3">
                <Target className="h-5 w-5 text-blue-400" />
              </div>
              <div className="text-2xl font-black text-white mb-1">{team.bidPoints}</div>
              <div className="text-blue-300 text-sm font-medium">Bid Points</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/15 to-purple-600/10 border border-purple-400/30 rounded-2xl p-4 text-center">
              <div className="bg-purple-500/20 rounded-full p-3 w-fit mx-auto mb-3">
                <Calendar className="h-5 w-5 text-purple-400" />
              </div>
              <div className="text-2xl font-black text-white mb-1">{team.competitions_attending?.length || 0}</div>
              <div className="text-purple-300 text-sm font-medium">Competitions</div>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        {team.contactInfo && (
          <div className="px-6 pb-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <div className="bg-green-500/20 rounded-full p-2 mr-3">
                <Mail className="h-4 w-4 text-green-400" />
              </div>
              Contact Information
            </h3>
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-600/40 rounded-2xl p-4 space-y-3">
              {team.contactInfo.captain && (
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500/20 rounded-lg p-2">
                    <User className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">Team Captain</div>
                    <div className="text-white font-semibold">{team.contactInfo.captain}</div>
                  </div>
                </div>
              )}
              
              {team.contactInfo.email && (
                <div className="flex items-center gap-3">
                  <div className="bg-green-500/20 rounded-lg p-2">
                    <Mail className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">Email</div>
                    <a href={`mailto:${team.contactInfo.email}`} className="text-green-400 font-semibold hover:text-green-300 transition-colors">
                      {team.contactInfo.email}
                    </a>
                  </div>
                </div>
              )}
              
              {team.contactInfo.phone && (
                <div className="flex items-center gap-3">
                  <div className="bg-purple-500/20 rounded-lg p-2">
                    <Phone className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">Phone</div>
                    <a href={`tel:${team.contactInfo.phone}`} className="text-purple-400 font-semibold hover:text-purple-300 transition-colors">
                      {team.contactInfo.phone}
                    </a>
                  </div>
                </div>
              )}
              
              {team.contactInfo.website && (
                <div className="flex items-center gap-3">
                  <div className="bg-cyan-500/20 rounded-lg p-2">
                    <Globe className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">Website</div>
                    <a href={team.contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors flex items-center gap-1">
                      Visit Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Competitions Section */}
        {team.competitions_attending && team.competitions_attending.length > 0 && (
          <div className="px-6 pb-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <div className="bg-blue-500/20 rounded-full p-2 mr-3">
                <Calendar className="h-4 w-4 text-blue-400" />
              </div>
              Competition Schedule
            </h3>
            <div className="space-y-3">
              {team.competitions_attending.map((competitionId, index) => {
                const competition = competitions.find(comp => comp.id === competitionId);
                const competitionName = competition?.name || `Competition ${competitionId}`;
                
                return (
                  <div 
                    key={index} 
                    className={`group rounded-2xl p-4 transition-all duration-300 ${
                      competition 
                        ? 'bg-gradient-to-r from-slate-800/60 to-slate-700/40 border border-slate-600/40 cursor-pointer hover:from-slate-700/80 hover:to-slate-600/60 hover:scale-[1.02]' 
                        : 'bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-600/40'
                    }`}
                    onClick={() => {
                      if (competition) {
                        onCompetitionClick?.(competition);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${competition ? 'bg-blue-400' : 'bg-red-400'}`}></div>
                        <span className={`text-sm font-semibold ${
                          competition ? 'text-white' : 'text-red-400'
                        }`}>
                          {competitionName}
                        </span>
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

        {/* Enhanced Achievements */}
        {team.achievements && team.achievements.length > 0 && (
        <div className="px-6 pb-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <div className="bg-yellow-500/20 rounded-full p-2 mr-3">
              <Trophy className="h-4 w-4 text-yellow-400" />
            </div>
            Recent Achievements
          </h3>
          <div className="space-y-3">
            {team.achievements.slice(0, 3).map((achievement, index) => (
              <div key={index} className="bg-gradient-to-r from-yellow-500/15 to-orange-500/10 border border-yellow-400/30 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-yellow-500/20 rounded-lg p-2 flex-shrink-0">
                    <Award className="h-4 w-4 text-yellow-400" />
                  </div>
                  <span className="text-slate-200 text-sm leading-relaxed font-medium">{achievement}</span>
                </div>
              </div>
            ))}
            {team.achievements.length > 3 && (
              <div className="text-sm text-slate-400 text-center py-2">+{team.achievements.length - 3} more achievements</div>
            )}
          </div>
        </div>
        )}

        {/* Enhanced Instagram Link */}
        {team.instagramlink && (
          <div className="px-6 pb-6">
            <a 
              href={team.instagramlink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-3 bg-gradient-to-r from-pink-500/15 to-purple-500/10 border border-pink-400/30 rounded-2xl p-4 hover:from-pink-500/20 hover:to-purple-500/15 transition-all duration-300 hover:scale-[1.02]"
            >
              <Instagram className="h-5 w-5 text-pink-400" />
              <span className="text-pink-400 font-semibold text-base">Follow on Instagram</span>
              <ExternalLink className="h-4 w-4 text-pink-400/60" />
            </a>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
