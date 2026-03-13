import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Trophy, Calendar, Target, MapPin, Instagram, ExternalLink, Star, Award } from 'lucide-react';
import { Team, Competition } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { CompetitionDetail } from '@/components/CompetitionDetail';
import { fetchTeams, fetchFromDirectus } from '@/lib/api';
import { mapCompetitionTeamsFull } from '@/lib/competitionMapping';

export const TeamDetailPage = () => {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const [teams, setTeams] = useState<Team[]>([]); // Start empty, load from API
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  
  const team = teams.find(t => t.id === teamId);

  // Handle team clicks from competition detail
  const handleTeamClick = (clickedTeam: Team) => {
    navigate(`/team/${clickedTeam.id}`);
  };

  // Fetch additional data to enhance fallback data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [teamsData, competitionsData] = await Promise.all([
          fetchTeams(),
          fetchFromDirectus('competitions')
        ]);
        
        setTeams(teamsData && teamsData.length > 0 ? teamsData : []);
        
        // Map competitions data
        if (competitionsData) {
          const API_URL = import.meta.env.VITE_DIRECTUS_URL || 'https://your-directus-instance.com';
          const mappedCompetitions = competitionsData.map((comp: any) => ({
            id: comp.id,
            name: comp.name,
            city: comp.city,
            date: comp.date,
            logo: comp.logo
              ? (typeof comp.logo === 'string'
                  ? (comp.logo.startsWith('http') ? comp.logo : `${API_URL}/assets/${comp.logo}`)
                  : (comp.logo.url ? comp.logo.url : `${API_URL}/assets/${comp.logo.id}`))
              : '',
            lineup: Array.isArray(comp.lineup)
              ? comp.lineup.map((team: any) => typeof team === 'string' ? team : team.name)
              : [],
            judges: Array.isArray(comp.judges)
              ? comp.judges.map((judge: any) => typeof judge === 'string' ? { name: judge, category: 'Judge' } : judge)
              : [],
            instagramlink: comp.instagramlink || '',
            bid_status: comp.bid_status || false,
            media: { photos: [], videos: [] }
          }));
          setCompetitions(mappedCompetitions);
        } else {
          setCompetitions([]);
        }
      } catch (error) {
        setTeams([]);
        setCompetitions([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  if (loading || !team) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-white mb-4">Loading team details...</h1>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Team not found</h1>
          <p className="text-slate-400 mb-4">
            Could not find team with ID: {teamId}
          </p>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Teams
          </Button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate('/');
    }, 200); // Wait for animation to complete
  };

  return (
    <div className={`fixed inset-0 z-50 bg-slate-900 translate-x-full ${isExiting ? 'animate-slide-out-right' : 'animate-slide-in-right'}`}>
      <div className="animate-fade-in" style={{ animationDelay: '0.05s' }}>
      {/* Header with Back Button */}
      <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
        <div className="px-4 py-3">
          <Button 
            onClick={handleBack}
            variant="ghost" 
            size="sm"
            className="text-slate-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      {/* Team Header */}
      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 px-4 py-6">
        <div className="flex items-center space-x-4">
          {/* Team Logo */}
          {team.logo ? (
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-600 shadow-lg flex-shrink-0">
              <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-white font-bold text-xl">{team.name.split(' ')[0][0]}</span>
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent mb-2">{team.name}</h1>
            <div className="text-slate-300 mb-2">{team.university}</div>
            {team.city && (
              <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1 rounded-full text-sm w-fit">
                <MapPin className="h-4 w-4" />
                <span>{team.city}</span>
              </div>
            )}
            
            {/* Status Badge */}
            {team.qualified ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 text-green-400 text-sm font-semibold mt-3">
                <Star className="h-4 w-4" />
                QUALIFIED
              </div>
            ) : team.bubble ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 text-amber-400 text-sm font-semibold mt-3">
                <Star className="h-4 w-4" />
                ON THE BUBBLE
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-400/20 rounded-xl p-4 text-center">
            <div className="bg-blue-500/20 rounded-full p-3 w-fit mx-auto mb-3">
              <Target className="h-6 w-6 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{team.bidPoints}</div>
            <div className="text-blue-300 text-sm">Bid Points</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-400/20 rounded-xl p-4 text-center">
            <div className="bg-purple-500/20 rounded-full p-3 w-fit mx-auto mb-3">
              <Calendar className="h-6 w-6 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{team.competitions_attending?.length || 0}</div>
            <div className="text-purple-300 text-sm">Competitions</div>
          </div>
        </div>

        {/* Competitions Section */}
        {team.competitions_attending && team.competitions_attending.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center">
              <div className="bg-blue-500/20 rounded-full p-2 mr-3">
                <Calendar className="h-5 w-5 text-blue-400" />
              </div>
              Competitions Attending
            </h2>
            <div className="space-y-3">
              {team.competitions_attending.map((competitionId, index) => {
                const competition = competitions.find(comp => comp.id === competitionId);
                const competitionName = competition?.name || `Competition ${competitionId}`;
                
                return (
                  <div 
                    key={index} 
                    onClick={() => {
                      if (competition) {
                        // Transform the competition data through the full pipeline
                        const transformedCompetition = mapCompetitionTeamsFull(competition, teams);
                        setSelectedCompetition(transformedCompetition);
                      }
                    }}
                    className={`group rounded-xl p-4 transition-all duration-200 ${
                      competition 
                        ? 'bg-gradient-to-r from-slate-800/80 to-slate-700/50 border border-slate-600/40 cursor-pointer hover:from-slate-700/90 hover:to-slate-600/70' 
                        : 'bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-600/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${competition ? 'bg-blue-400' : 'bg-red-400'}`}></div>
                        <div>
                          <div className={`font-medium ${
                            competition ? 'text-white' : 'text-red-400'
                          }`}>
                            {competitionName}
                          </div>
                          {competition && (
                            <div className="text-slate-400 text-sm mt-1">
                              {competition.city} • {competition.date}
                            </div>
                          )}
                        </div>
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

        {/* Achievements */}
        {team.achievements && team.achievements.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center">
              <div className="bg-yellow-500/20 rounded-full p-2 mr-3">
                <Trophy className="h-5 w-5 text-yellow-400" />
              </div>
              Achievements
            </h2>
            <div className="space-y-3">
              {team.achievements.map((achievement, index) => (
                <div key={index} className="bg-gradient-to-r from-yellow-500/10 to-orange-500/5 border border-yellow-400/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <span className="text-slate-200 leading-relaxed">{achievement.name}</span>
                      {achievement.link && (
                        <a 
                          href={achievement.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 mt-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                          <span className="text-xs">Watch on YouTube</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instagram Link */}
        {team.instagramlink && (
          <div className="mb-6">
            <a 
              href={team.instagramlink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-3 bg-gradient-to-r from-pink-500/10 to-purple-500/5 border border-pink-400/20 rounded-xl p-4 hover:from-pink-500/15 hover:to-purple-500/10 transition-all duration-300"
            >
              <Instagram className="h-5 w-5 text-pink-400" />
              <span className="text-pink-400 font-medium">Follow on Instagram</span>
              <ExternalLink className="h-4 w-4 text-pink-400/60" />
            </a>
          </div>
        )}
      </div>
      </div>

      {/* Competition Detail Modal */}
      {selectedCompetition && (
        <CompetitionDetail 
          competition={selectedCompetition} 
          onClose={() => setSelectedCompetition(null)}
          teams={teams}
          onTeamClick={handleTeamClick}
        />
      )}
    </div>
  );
};