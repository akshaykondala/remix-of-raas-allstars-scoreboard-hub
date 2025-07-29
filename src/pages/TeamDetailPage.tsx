import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Trophy, Calendar, Target, MapPin, Instagram, ExternalLink, Star, Award } from 'lucide-react';
import { Team, Competition } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { fetchTeams, fetchFromDirectus } from '@/lib/api';

// Fallback teams data to ensure routing always works
const fallbackTeams: Team[] = [
  {
    id: '1',
    name: 'Texas Raas',
    university: 'University of Texas at Austin',
    bidPoints: 8,
    qualified: true,
    locked: true,
    color: 'bg-orange-600',
    city: 'Austin, TX',
    instagramlink: 'https://www.instagram.com/texasraas/',
    competitions_attending: ['comp1', 'comp2'],
    history: [
      'Founded in 2005, Texas Raas has been a powerhouse in collegiate Raas',
      'Multiple-time Raas All Stars qualifier',
      'Known for innovative choreography and strong storytelling'
    ],
    achievements: ['Raas All Stars 2023 - 2nd Place', 'Raas All Stars 2022 - 4th Place'],
    founded: '2005',
    logo: '/src/logos/texas-raas.jpg'
  },
  {
    id: '2',
    name: 'CMU Raasta',
    university: 'Carnegie Mellon University',
    bidPoints: 92,
    qualified: true,
    locked: true,
    color: 'bg-red-700',
    city: 'Pittsburgh, PA',
    instagramlink: 'https://www.instagram.com/cmuraasta/',
    competitions_attending: ['comp1'],
    history: [
      'CMU Raasta brings technical precision to every performance',
      'Consistently ranked in top 10 nationally',
      'Known for clean formations and synchronized movements'
    ],
    achievements: ['Raas All Stars 2023 - 6th Place', 'Raas All Stars 2021 - 3rd Place'],
    founded: '2003',
    logo: '/src/logos/cmu-raasta.jpg'
  },
  {
    id: '3',
    name: 'UF Gatoraas',
    university: 'University of Florida',
    bidPoints: 6,
    qualified: true,
    locked: false,
    color: 'bg-blue-600',
    city: 'Gainesville, FL',
    instagramlink: 'https://www.instagram.com/ufgatoraas/',
    competitions_attending: [],
    history: [
      'UF Gatoraas represents the University of Florida with pride',
      'Known for high-energy performances and crowd engagement',
      'Consistent top performer in regional competitions'
    ],
    achievements: ['Raas All Stars 2023 - 8th Place', 'Raas Chaos 2024 - 3rd Place'],
    founded: '2008',
    logo: '/src/logos/uf-gatoraas.jpeg'
  },
  {
    id: '4',
    name: 'UCLA Nashaa',
    university: 'University of California, Los Angeles',
    bidPoints: 4,
    qualified: false,
    locked: false,
    color: 'bg-blue-800',
    city: 'Los Angeles, CA',
    instagramlink: 'https://www.instagram.com/uclanashaa/',
    competitions_attending: [],
    history: [
      'UCLA Nashaa brings West Coast energy to the Raas circuit',
      'Known for innovative choreography and modern interpretations',
      'Strong presence in California competitions'
    ],
    achievements: ['Bollywood Berkeley 2024 - 1st Place', 'Spring Nationals 2023 - 5th Place'],
    founded: '2010',
    logo: ''
  },
  {
    id: '5',
    name: 'Michigan Maize Mirchi',
    university: 'University of Michigan',
    bidPoints: 3,
    qualified: false,
    locked: false,
    color: 'bg-yellow-600',
    city: 'Ann Arbor, MI',
    instagramlink: 'https://www.instagram.com/michiganmaizemirchi/',
    competitions_attending: [],
    history: [
      'Michigan Maize Mirchi represents the Midwest with pride',
      'Known for synchronized formations and technical precision',
      'Consistent performer in regional competitions'
    ],
    achievements: ['Midwest Magic 2024 - 1st Place', 'Raas All Stars 2022 - 7th Place'],
    founded: '2007',
    logo: ''
  },
  {
    id: '6',
    name: 'NYU Bhangra',
    university: 'New York University',
    bidPoints: 2,
    qualified: false,
    locked: false,
    color: 'bg-purple-700',
    city: 'New York, NY',
    instagramlink: 'https://www.instagram.com/nyubhangra/',
    competitions_attending: [],
    history: [
      'NYU Bhangra brings the energy of New York City',
      'Known for creative storytelling and emotional performances',
      'Strong presence in East Coast competitions'
    ],
    achievements: ['East Coast Showdown 2024 - 2nd Place', 'Raas All Stars 2021 - 9th Place'],
    founded: '2006',
    logo: ''
  },
  {
    id: '7',
    name: 'Georgia Tech Raas',
    university: 'Georgia Institute of Technology',
    bidPoints: 1,
    qualified: false,
    locked: false,
    color: 'bg-yellow-500',
    city: 'Atlanta, GA',
    instagramlink: 'https://www.instagram.com/gatechraas/',
    competitions_attending: [],
    history: [
      'Georgia Tech Raas represents the Southeast with pride',
      'Known for technical excellence and innovative choreography',
      'Rising star in the collegiate Raas circuit'
    ],
    achievements: ['Raas Chaos 2024 - 5th Place', 'Spring Nationals 2023 - 8th Place'],
    founded: '2012',
    logo: ''
  },
  {
    id: '8',
    name: 'Penn Aatish',
    university: 'University of Pennsylvania',
    bidPoints: 1,
    qualified: false,
    locked: false,
    color: 'bg-red-600',
    city: 'Philadelphia, PA',
    instagramlink: 'https://www.instagram.com/pennaatish/',
    competitions_attending: [],
    history: [
      'Penn Aatish brings Ivy League excellence to Raas',
      'Known for sophisticated choreography and storytelling',
      'Consistent performer in regional competitions'
    ],
    achievements: ['East Coast Showdown 2024 - 3rd Place', 'Raas All Stars 2022 - 10th Place'],
    founded: '2009',
    logo: ''
  },
  {
    id: '9',
    name: 'UIUC Roshni',
    university: 'University of Illinois at Urbana-Champaign',
    bidPoints: 0,
    qualified: false,
    locked: false,
    color: 'bg-orange-500',
    city: 'Champaign, IL',
    instagramlink: 'https://www.instagram.com/uiucroshni/',
    competitions_attending: [],
    history: [
      'UIUC Roshni represents the heart of Illinois',
      'Known for energetic performances and crowd engagement',
      'Emerging talent in the collegiate Raas circuit'
    ],
    achievements: ['Midwest Magic 2024 - 3rd Place', 'Spring Nationals 2023 - 9th Place'],
    founded: '2015',
    logo: ''
  }
];

export const TeamDetailPage = () => {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const [teams, setTeams] = useState<Team[]>([]); // Start empty, load from API
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  
  console.log('TeamDetailPage - teamId from URL:', teamId);
  console.log('TeamDetailPage - available teams:', teams.map(t => ({ id: t.id, name: t.name })));
  
  const team = teams.find(t => t.id === teamId);
  console.log('TeamDetailPage - found team:', team?.name || 'NOT FOUND');

  // Fetch additional data to enhance fallback data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [teamsData, competitionsData] = await Promise.all([
          fetchTeams(),
          fetchFromDirectus('competitions')
        ]);
        
        console.log('TeamDetailPage - Fetched teams from API:', teamsData);
        
        // Use API data if available, otherwise use fallback
        if (teamsData && teamsData.length > 0) {
          console.log('Setting teams from API:', teamsData.map(t => ({ id: t.id, name: t.name })));
          setTeams(teamsData);
        } else {
          console.log('Using fallback teams data');
          setTeams(fallbackTeams);
        }
        
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
            placings: {
              first: comp.firstplace || '',
              second: comp.secondplace || '',
              third: comp.thirdplace || ''
            },
            judges: Array.isArray(comp.judges)
              ? comp.judges.map((judge: any) => typeof judge === 'string' ? { name: judge, category: 'Judge' } : judge)
              : [],
            instagramlink: comp.instagramlink || '',
            media: { photos: [], videos: [] }
          }));
          setCompetitions(mappedCompetitions);
        } else {
          // Fallback competitions
          setCompetitions([
            {
              id: 'comp1',
              name: 'Raas All Stars 2024',
              city: 'New York, NY',
              date: '2024-03-15',
              logo: '',
              lineup: [],
              placings: { first: '', second: '', third: '' },
              judges: [],
              instagramlink: '',
              media: { photos: [], videos: [] }
            }
          ]);
        }
      } catch (error) {
        console.error('Error loading additional data:', error);
        // Keep fallback data on error
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
    console.log('Team not found. Available teams:', teams.map(t => ({ id: t.id, name: t.name })));
    console.log('Looking for team ID:', teamId);
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

  return (
    <div className="min-h-screen bg-slate-900 animate-slide-in-right">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
        <div className="px-4 py-3">
          <Button 
            onClick={() => navigate('/')} 
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
            {team.qualified && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 text-green-400 text-sm font-semibold mt-3">
                <Star className="h-4 w-4" />
                QUALIFIED
              </div>
            )}
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
                    <span className="text-slate-200 leading-relaxed">{achievement}</span>
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
  );
};