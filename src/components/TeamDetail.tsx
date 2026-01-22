import { useState } from 'react';
import { Trophy, Calendar, Target, Users, MapPin, Instagram, ExternalLink, Star, Award, Mail, Phone, Globe, User, Clock } from 'lucide-react';
import { Team, Competition } from '@/lib/types';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';

interface TeamDetailProps {
  team: Team;
  onClose: () => void;
  onCompetitionClick?: (competitionData: any) => void;
  competitions?: Competition[];
  zIndex?: number;
}

export const TeamDetail = ({ team, onClose, onCompetitionClick, competitions = [] }: TeamDetailProps) => {
  const [open, setOpen] = useState(true);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setOpen(false);
      setTimeout(onClose, 300);
    }
  };

  const handleCompetitionClick = (competitionId: string | number) => {
    if (onCompetitionClick) {
      onCompetitionClick(competitionId);
    }
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700/50 h-[98vh] max-h-[98vh] rounded-t-3xl">
        <div className="overflow-y-auto flex-1 scrollbar-hide">
          {/* Modern Header with Hero Profile */}
          <DrawerHeader className="relative bg-gradient-to-br from-blue-600/20 via-purple-600/15 to-transparent p-6 pb-4 py-[20px] px-[22px]">
            {/* Hero Team Presentation */}
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Large Team Logo */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
                {team.logo ? (
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
                    <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white/20">
                    <span className="text-white font-bold text-2xl">{team.name.split(' ')[0][0]}</span>
                  </div>
                )}
              </div>
              
              {/* Team Name & Info - Seamless text style */}
              <div className="space-y-1">
                <DrawerTitle className="text-2xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  {team.name}
                </DrawerTitle>
                
                {/* Elegant flowing info text */}
                <p className="text-white/70 text-sm font-medium tracking-wide">
                  {team.university}
                  {team.city && <span> · {team.city}</span>}
                </p>
                
                {/* Secondary info line */}
                <p className="text-white/50 text-xs tracking-wider uppercase">
                  <span className="text-purple-400/90">{team.genderComposition}</span>
                  <span className="mx-2 text-white/30">•</span>
                  <span className="text-blue-400/90">Est. {team.founded}</span>
                  {team.qualified && (
                    <>
                      <span className="mx-2 text-white/30">•</span>
                      <span className="text-emerald-400/90">Qualified for RAS</span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </DrawerHeader>

          {/* Enhanced Stats Section */}
          <div className="px-4 pb-4 pt-2 space-y-3">
            {/* Prominent Bid Points Display - Only show if team has points */}
            {team.bidPoints > 0 && (
              <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-orange-500/20 border border-amber-400/40 rounded-2xl p-4">
                {/* Decorative glow */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-orange-400/15 rounded-full blur-2xl"></div>
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl p-2.5 shadow-lg shadow-amber-500/25">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-amber-200/70 text-xs font-medium uppercase tracking-wider">Season Points</div>
                      <div className="text-white/60 text-xs">Bid Qualification Progress</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-300 bg-clip-text text-transparent">
                      {team.bidPoints}
                    </div>
                    <div className="text-amber-300/60 text-xs font-medium">points</div>
                  </div>
                </div>
              </div>
            )}

            {/* Competitions count - Always show */}
            <div className="bg-gradient-to-br from-purple-500/15 to-purple-600/10 border border-purple-400/30 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="bg-purple-500/20 rounded-lg p-2">
                    <Calendar className="h-4 w-4 text-purple-400" />
                  </div>
                  <span className="text-purple-200/80 text-sm font-medium">Competitions This Season</span>
                </div>
                <div className="text-xl font-bold text-white">{team.competitions_attending?.length || 0}</div>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          {team.contactInfo && (
            <div className="px-4 pb-4">
              <h3 className="text-base font-bold text-white mb-3 flex items-center">
                <div className="bg-green-500/20 rounded-full p-1.5 mr-2">
                  <Mail className="h-3.5 w-3.5 text-green-400" />
                </div>
                Contact Information
              </h3>
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-600/40 rounded-xl p-3 space-y-2.5">
                {team.contactInfo?.captains && Array.isArray(team.contactInfo.captains) && team.contactInfo.captains.length > 0 && (
                  <div className="flex items-start gap-2.5">
                    <div className="bg-blue-500/20 rounded-lg p-1.5 flex-shrink-0">
                      <User className="h-3.5 w-3.5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-0.5">
                        {team.contactInfo.captains.length > 1 ? 'Team Captains' : 'Team Captain'}
                      </div>
                      <div className="space-y-0.5">
                        {[...team.contactInfo.captains].sort((a, b) => a.localeCompare(b)).map((captain, index) => (
                          <div key={index} className="text-white font-semibold text-sm">{captain}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {team.contactInfo.email && (
                  <div className="flex items-center gap-2.5">
                    <div className="bg-green-500/20 rounded-lg p-1.5">
                      <Mail className="h-3.5 w-3.5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">Email</div>
                      <a href={`mailto:${team.contactInfo.email}`} className="text-green-400 font-semibold text-sm hover:text-green-300 transition-colors">
                        {team.contactInfo.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {team.contactInfo.phone && (
                  <div className="flex items-center gap-2.5">
                    <div className="bg-purple-500/20 rounded-lg p-1.5">
                      <Phone className="h-3.5 w-3.5 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">Phone</div>
                      <a href={`tel:${team.contactInfo.phone}`} className="text-purple-400 font-semibold text-sm hover:text-purple-300 transition-colors">
                        {team.contactInfo.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {team.contactInfo.website && (
                  <div className="flex items-center gap-2.5">
                    <div className="bg-cyan-500/20 rounded-lg p-1.5">
                      <Globe className="h-3.5 w-3.5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">Website</div>
                      <a href={team.contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-cyan-400 font-semibold text-sm hover:text-cyan-300 transition-colors flex items-center gap-1">
                        Visit Website
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Competition Timeline with Results */}
          {team.competitionResults && team.competitionResults.length > 0 && (
            <div className="px-4 pb-4">
              <h3 className="text-base font-bold text-white mb-3 flex items-center">
                <div className="bg-blue-500/20 rounded-full p-1.5 mr-2">
                  <Calendar className="h-3.5 w-3.5 text-blue-400" />
                </div>
                Season Journey
              </h3>
              <div className="space-y-3">
                {team.competitionResults.map((result, index) => {
                  const isFirst = result.placement?.includes('1st');
                  const isSecond = result.placement?.includes('2nd');
                  const isThird = result.placement?.includes('3rd');
                  const earnedPoints = result.bidPointsEarned > 0;
                  
                  return (
                    <div 
                      key={index}
                      onClick={() => handleCompetitionClick(result.competitionId)}
                      className={`relative bg-gradient-to-r ${
                        earnedPoints 
                          ? 'from-green-500/10 to-emerald-500/5 border-green-400/30' 
                          : 'from-slate-800/60 to-slate-700/40 border-slate-600/40'
                      } border rounded-xl p-3 cursor-pointer hover:scale-[1.02] transition-transform duration-200`}
                    >
                      {/* Timeline connector */}
                      {index < team.competitionResults!.length - 1 && (
                        <div className="absolute left-5 top-full w-0.5 h-3 bg-slate-600"></div>
                      )}
                      
                      <div className="flex items-start gap-3">
                        {/* Competition number & status */}
                        <div className="flex flex-col items-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            earnedPoints 
                              ? 'bg-green-500/20 text-green-400 border border-green-400/40' 
                              : 'bg-slate-600/30 text-slate-400 border border-slate-500/40'
                          }`}>
                            {index + 1}
                          </div>
                        </div>
                        
                        {/* Competition details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1.5">
                            <div>
                              <h4 className="text-white font-semibold text-sm mb-0.5 hover:text-blue-300 transition-colors duration-200">{result.competitionName}</h4>
                              {result.date && (
                                <p className="text-slate-400 text-xs">{new Date(result.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                              )}
                            </div>
                            
                            {/* Placement badge */}
                            <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              isFirst ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/40' :
                              isSecond ? 'bg-slate-400/20 text-slate-300 border border-slate-400/40' :
                              isThird ? 'bg-orange-500/20 text-orange-400 border border-orange-400/40' :
                              'bg-slate-600/20 text-slate-400 border border-slate-500/40'
                            }`}>
                              {result.placement || 'N/A'}
                            </div>
                          </div>
                          
                          {/* Points breakdown */}
                          <div className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1">
                              <span className="text-slate-400">Points:</span>
                              <span className={`font-bold ${earnedPoints ? 'text-green-400' : 'text-slate-500'}`}>
                                +{result.bidPointsEarned}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-slate-400">Total:</span>
                              <span className="text-blue-400 font-bold">{result.cumulativeBidPoints} pts</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Enhanced Achievements */}
          {team.achievements && team.achievements.length > 0 && (
            <div className="px-4 pb-4">
              <h3 className="text-base font-bold text-white mb-3 flex items-center">
                <div className="bg-yellow-500/20 rounded-full p-1.5 mr-2">
                  <Trophy className="h-3.5 w-3.5 text-yellow-400" />
                </div>
                Recent Achievements
              </h3>
              <div className="space-y-2">
                {team.achievements.slice(0, 3).map((achievement, index) => (
                  <div key={index} className="bg-gradient-to-r from-yellow-500/15 to-orange-500/10 border border-yellow-400/30 rounded-xl p-3">
                    <div className="flex items-start gap-2.5">
                      <div className="bg-yellow-500/20 rounded-lg p-1.5 flex-shrink-0">
                        <Award className="h-3.5 w-3.5 text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <span className="text-slate-200 text-sm leading-relaxed font-medium">{achievement.name}</span>
                        {achievement.link && (
                          <a 
                            href={achievement.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 mt-1.5 text-red-400 hover:text-red-300 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                            <span className="text-xs">Watch on YouTube</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {team.achievements.length > 3 && (
                  <div className="text-xs text-slate-400 text-center py-1.5">+{team.achievements.length - 3} more achievements</div>
                )}
              </div>
            </div>
          )}

          {/* Team History Section */}
          {team.history && team.history.length > 0 && (
            <div className="px-4 pb-4">
              <h3 className="text-base font-bold text-white mb-3 flex items-center">
                <div className="bg-blue-500/20 rounded-full p-1.5 mr-2">
                  <Star className="h-3.5 w-3.5 text-blue-400" />
                </div>
                Team History
              </h3>
              <div className="space-y-2">
                {team.history.map((historyItem, index) => (
                  <div key={index} className="bg-gradient-to-r from-blue-500/15 to-indigo-500/10 border border-blue-400/30 rounded-xl p-3">
                    <div className="flex items-start gap-2.5">
                      <div className="bg-blue-500/20 rounded-lg p-1.5 flex-shrink-0">
                        <Star className="h-3.5 w-3.5 text-blue-400" />
                      </div>
                      <span className="text-slate-200 text-sm leading-relaxed font-medium">{historyItem}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Instagram Link */}
          {team.instagramlink && (
            <div className="px-4 pb-6">
              <a 
                href={team.instagramlink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2.5 bg-gradient-to-r from-pink-500/15 to-purple-500/10 border border-pink-400/30 rounded-xl p-3 hover:from-pink-500/20 hover:to-purple-500/15 transition-all duration-300 hover:scale-[1.02]"
              >
                <Instagram className="h-4 w-4 text-pink-400" />
                <span className="text-pink-400 font-semibold text-sm">Follow on Instagram</span>
                <ExternalLink className="h-3.5 w-3.5 text-pink-400/60" />
              </a>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
