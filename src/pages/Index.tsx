
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TeamCard } from '@/components/TeamCard';
import { TeamDetail } from '@/components/TeamDetail';
import { CompetitionDetail } from '@/components/CompetitionDetail';
import { CompetitionsTab } from '@/components/CompetitionsTab';
import { FantasyTab } from '@/components/FantasyTab';
import { Trophy, Target, Calendar, Users, Zap, RotateCcw, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchTeams, fetchFromDirectus } from '@/lib/api';
import { Team, SimulationData, Competition } from '@/lib/types';
import { mapCompetitionTeamsFull } from '../lib/competitionMapping';

// Fallback teams data in case database connection fails
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
    competitions_attending: [],
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
    competitions_attending: [],
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

const CUTOFF_POINTS = 5;

const Index = () => {
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [simulationData, setSimulationData] = useState<SimulationData>({});
  const [activeTab, setActiveTab] = useState<string>('standings');
  const [teamsData, setTeamsData] = useState<Team[]>(fallbackTeams); // Start with fallback data
  const [loading, setLoading] = useState(false); // Don't show loading initially

  // Fetch teams and competitions from database
  useEffect(() => {
    const loadData = async () => {
      console.log('🔄 Loading fresh data from database...');
      try {
        const [teams, competitionsData] = await Promise.all([
          fetchTeams(),
          fetchFromDirectus('competitions')
        ]);
        
        // Debug: Log raw API data
        console.log('📊 Raw teams data:', teams);
        // Debug: Check for empty data
        if (!teams.length) {
          console.error('❌ No teams loaded from API!');
        }
        
        // Debug: Log raw competitions data
        console.log('📊 Raw competitions data:', competitionsData);
        if (!competitionsData.length) {
          console.error('❌ No competitions loaded from API!');
        }
        
        // Map teams data
        if (teams) {
          const API_URL = import.meta.env.VITE_DIRECTUS_URL;
          const mappedTeams = teams.map((team: any) => ({
            id: team.id,
            name: team.name,
            university: team.university,
            city: team.city,
            logo: team.logo
              ? (typeof team.logo === 'string'
                  ? (team.logo.startsWith('http') ? team.logo : `${API_URL}/assets/${team.logo}`)
                  : (team.logo.url ? team.logo.url : `${API_URL}/assets/${team.logo.id}`))
              : '',
            color: team.color || 'bg-slate-600',
            bidPoints: Number(team.bidPoints || team.bid_points || team.bidpoints || 0),
            qualified: false, // Will be calculated later
            competitions_attending: team.competitions_attending || [],
            achievements: team.achievements || [],
            history: team.history || [],
            instagramlink: team.instagramlink || ''
          }));
          // Debug: Log mapped data
          console.log('🎯 Mapped teams data:', mappedTeams);
          // Debug: Log logo URLs
          console.log('🖼️ Team logo URLs:', mappedTeams.map(t => ({ name: t.name, logo: t.logo })));
          // Debug: Check bidPoints type
          mappedTeams.forEach(team => {
            if (typeof team.bidPoints !== 'number') {
              console.warn(`⚠️ bidPoints for ${team.name} is not a number:`, team.bidPoints);
            }
          });
          setTeamsData(mappedTeams);
        }
        
        // Map competitions data
        if (competitionsData) {
          const API_URL = import.meta.env.VITE_DIRECTUS_URL;
          const mappedCompetitions = competitionsData.map((comp: any) => ({
            id: comp.id,
            name: comp.name,
            city: comp.city,
            date: comp.date,
            logo: comp.logo
              ? (typeof comp.logo === 'string'
                  ? (comp.logo.startsWith('http') ? comp.logo : `${API_URL}/assets/${comp.logo}`)
                  : (comp.logo && typeof comp.logo === 'object' && comp.logo.url ? comp.logo.url : `${API_URL}/assets/${comp.logo.id}`))
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
          // Debug: Log mapped competitions
          console.log('🏆 Mapped competitions:', mappedCompetitions);
          // Debug: Log logo URLs
          console.log('🖼️ Competition logo URLs:', mappedCompetitions.map(c => ({ name: c.name, logo: c.logo })));
          setCompetitions(mappedCompetitions);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to fallback teams if database fails
        setTeamsData(fallbackTeams);
        setCompetitions([]); // Add empty competitions array as fallback
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Calculate bid points based on competition results
  const calculateBidPoints = (teams: Team[], competitions: any[]) => {
    const pointsMap: { [teamName: string]: number } = {};
    
    // Initialize all teams with 0 points
    teams.forEach(team => {
      pointsMap[team.name] = 0;
    });

    // Add points from completed competitions
    competitions.forEach(comp => {
      if (comp.placings.first) {
        pointsMap[comp.placings.first] = (pointsMap[comp.placings.first] || 0) + 4;
      }
      if (comp.placings.second) {
        pointsMap[comp.placings.second] = (pointsMap[comp.placings.second] || 0) + 2;
      }
      if (comp.placings.third) {
        pointsMap[comp.placings.third] = (pointsMap[comp.placings.third] || 0) + 1;
      }
    });

    // Add simulation points if active
    Object.values(simulationData).forEach(simulation => {
      pointsMap[simulation.predictions.first] = (pointsMap[simulation.predictions.first] || 0) + 4;
      pointsMap[simulation.predictions.second] = (pointsMap[simulation.predictions.second] || 0) + 2;
      pointsMap[simulation.predictions.third] = (pointsMap[simulation.predictions.third] || 0) + 1;
    });

    return teams.map(team => ({
      ...team,
      bidPoints: pointsMap[team.name] || 0,
      qualified: (pointsMap[team.name] || 0) >= CUTOFF_POINTS
    }));
  };

  // Remove or comment out the useEffect that recalculates bid points
  // useEffect(() => {
  //   if (teamsData.length > 0) {
  //     const updatedTeams = calculateBidPoints(teamsData, []);
  //     setTeamsData(updatedTeams);
  //   }
  // }, [simulationData]);

  const qualifiedTeams = teamsData.filter(team => team.qualified).length;
  const sortedTeams = [...teamsData].sort((a, b) => b.bidPoints - a.bidPoints);
  const topThreeTeams = sortedTeams.slice(0, 3);
  const topNineTeams = sortedTeams.slice(0, 9);
  const qualifiedOtherTeams = sortedTeams.slice(3, 9);
  const notQualifiedTeams = sortedTeams.slice(9);

  // Debug: Log teamsData before rendering
  console.log('Rendering teamsData:', teamsData);
  console.log('Rendering sortedTeams:', sortedTeams);
  console.log('Rendering topThreeTeams:', topThreeTeams);
  console.log('Rendering qualifiedOtherTeams:', qualifiedOtherTeams);
  console.log('Rendering notQualifiedTeams:', notQualifiedTeams);


  const handleSimulationSet = (competitionName: string, competitionId: string, predictions: { first: string; second: string; third: string }) => {
    setSimulationData(prev => ({
      ...prev,
      [competitionId]: { competitionName, competitionId, predictions }
    }));
    setActiveTab('standings');
  };

  const handleCompetitionClick = (competitionData: any) => {
    // Handle different data types - competitions_attending contains IDs
    let competitionId = '';
    if (typeof competitionData === 'string') {
      competitionId = competitionData;
    } else if (competitionData && typeof competitionData === 'object') {
      competitionId = competitionData.id || competitionData;
    }
    const competition = competitions.find(comp => comp.id === competitionId);
    if (competition) {
      const mappedCompetition = mapCompetitionTeamsFull(competition, teamsData);
      console.log('[DEBUG] TeamDetail click - original lineup:', competition.lineup);
      console.log('[DEBUG] TeamDetail click - mapped lineup:', mappedCompetition.lineup);
      console.log('[DEBUG] TeamDetail click - mapped placings:', mappedCompetition.placings);
      setSelectedCompetition(mappedCompetition);
      setSelectedTeam(null); // Close team detail if open
    } else {
      console.log('Competition not found:', competitionId, 'Available competitions:', competitions.map(c => c.id));
    }
  };

  const clearSimulation = () => {
    setSimulationData({});
  };

  const refreshData = () => {
    console.log('🔄 Manual refresh triggered');
    window.location.reload();
  };

  const goToSimulation = () => {
    const simulationCount = Object.keys(simulationData).length;
    if (simulationCount === 1) {
      const singleSimulation = Object.values(simulationData)[0];
      setActiveTab('comps');
    } else {
      setActiveTab('comps');
    }
  };

  const simulationCount = Object.keys(simulationData).length;
  const simulationNames = Object.values(simulationData).map(sim => sim.competitionName);

  // Determine if a team is locked in (has enough points to guarantee top 9)
  const isLockedIn = (team: any, rank: number) => {
    // A team is locked in if they're in top 6 with significant point lead
    // or if the gap between them and 10th place is too large to overcome
    const tenthPlacePoints = sortedTeams[9]?.bidPoints || 0;
    return rank <= 6 && team.bidPoints >= tenthPlacePoints + 8; // 8+ point lead is generally safe
  };

  return (
    <div className="min-h-screen max-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-black overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-900/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-slate-800/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-800/20 rounded-full blur-3xl"></div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full relative z-10 h-screen flex flex-col">
        {/* Header with Logo */}
        <div className="bg-gradient-to-b from-black/60 via-black/30 to-transparent backdrop-blur-sm flex-shrink-0">
          <div className="flex justify-between items-center px-4 py-2">
            <div className="flex-1"></div>
            <div className="flex items-center gap-4">
              <img 
                src="/lovable-uploads/fac2918d-a107-444b-8ce2-b83e59b5b3c7.png" 
                alt="Raas All Stars Logo" 
                className="h-12 w-auto"
              />
              <button
                onClick={refreshData}
                className="bg-blue-600/70 hover:bg-blue-600/90 text-white p-2 rounded-lg transition-colors"
                title="Refresh data from database"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1"></div>
          </div>
        </div>

        <TabsContent value="standings" className="mt-2 flex-1 overflow-y-auto scrollbar-hide pb-20">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-slate-400 mt-2">Loading teams...</p>
            </div>
          ) : (
            <>
              {/* Simulation Alert */}
              {simulationCount > 0 && (
            <div className="mx-4 mb-6">
              <div className="bg-gradient-to-r from-blue-600/80 to-purple-600/80 backdrop-blur-sm border border-blue-500/50 rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    <div>
                      <h3 className="text-white font-bold text-sm">Simulation Mode</h3>
                      <p className="text-blue-100 text-xs">
                        {simulationCount === 1 
                          ? `Viewing predicted results for ${simulationNames[0]}`
                          : `Viewing predictions for ${simulationCount} competitions: ${simulationNames.join(', ')}`
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={goToSimulation}
                      className="bg-blue-600/70 hover:bg-blue-600/90 text-white px-6 py-4 rounded-lg text-xs transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
                    >
                      Edit
                    </button>
                    <button
                      onClick={clearSimulation}
                      className="bg-white/20 hover:bg-white/30 text-white px-6 py-4 rounded-lg text-xs flex items-center gap-2 transition-colors min-h-[48px]"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Exit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top 3 Teams */}
          <section className="px-4 py-2">
            <div className="flex gap-4 justify-center items-end">
              {/* 2nd Place */}
              <div className="flex-1 max-w-[100px] relative">
                {/* Top 9 outline effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/80 to-purple-600/80 rounded-2xl"></div>
                <div 
                  onClick={() => navigate(`/team/${topThreeTeams[1].id}`)}
                  className="relative bg-gradient-to-b from-slate-600/80 to-slate-700/80 backdrop-blur-sm rounded-2xl p-4 h-36 flex flex-col items-center justify-between border border-slate-500/50 shadow-xl group cursor-pointer"
                >
                  {/* Logo */}
                  <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg bg-gradient-to-b from-slate-400 to-slate-500 flex items-center justify-center">
                    {topThreeTeams[1]?.logo ? (
                      <img src={topThreeTeams[1].logo} alt={topThreeTeams[1].name} className="w-full h-full object-cover" />
                    ) : (
                      <Trophy className="h-7 w-7 text-slate-200" />
                    )}
                  </div>
                  {/* Team Info */}
                  <div className="text-center">
                    <div className="text-slate-300 font-bold text-xs mb-1">2nd</div>
                    <div className="text-white font-semibold text-xs leading-tight mb-1">{topThreeTeams[1]?.name}</div>
                    <div className="flex items-center justify-center gap-1">
                      <Target className="h-3 w-3 text-slate-300" />
                      <span className="text-white font-semibold text-xs">{topThreeTeams[1]?.bidPoints}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 1st Place - Taller */}
              <div className="flex-1 max-w-[120px] relative">
                {/* Top 9 outline effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/80 to-purple-600/80 rounded-2xl"></div>
                <div 
                  onClick={() => navigate(`/team/${topThreeTeams[0].id}`)}
                  className="relative bg-gradient-to-b from-yellow-500/90 to-yellow-600/90 backdrop-blur-sm rounded-2xl p-4 h-40 flex flex-col items-center justify-between shadow-xl border border-yellow-400/50 group cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg bg-gradient-to-b from-yellow-300 to-yellow-400 flex items-center justify-center">
                    {topThreeTeams[0]?.logo ? (
                      <img src={topThreeTeams[0].logo} alt={topThreeTeams[0].name} className="w-full h-full object-cover" />
                    ) : (
                      <Trophy className="h-8 w-8 text-yellow-700" />
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-yellow-800 font-bold text-sm mb-1">1st</div>
                    <div className="text-yellow-900 font-bold text-sm leading-tight mb-1">{topThreeTeams[0]?.name}</div>
                    <div className="flex items-center justify-center gap-1">
                      <Target className="h-3 w-3 text-yellow-800" />
                      <span className="text-yellow-900 font-bold text-sm">{topThreeTeams[0]?.bidPoints}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="flex-1 max-w-[100px] relative">
                {/* Top 9 outline effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/80 to-purple-600/80 rounded-2xl"></div>
                <div 
                  onClick={() => navigate(`/team/${topThreeTeams[2].id}`)}
                  className="relative bg-gradient-to-b from-orange-500/80 to-orange-600/80 backdrop-blur-sm rounded-2xl p-4 h-36 flex flex-col items-center justify-between border border-orange-400/50 shadow-xl group cursor-pointer"
                >
                  {/* Logo */}
                  <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg bg-gradient-to-b from-orange-300 to-orange-400 flex items-center justify-center">
                    {topThreeTeams[2]?.logo ? (
                      <img src={topThreeTeams[2].logo} alt={topThreeTeams[2].name} className="w-full h-full object-cover" />
                    ) : (
                      <Trophy className="h-7 w-7 text-orange-700" />
                    )}
                  </div>
                  {/* Team Info */}
                  <div className="text-center">
                    <div className="text-orange-800 font-bold text-xs mb-1">3rd</div>
                    <div className="text-orange-900 font-semibold text-xs leading-tight mb-1">{topThreeTeams[2]?.name}</div>
                    <div className="flex items-center justify-center gap-1">
                      <Target className="h-3 w-3 text-orange-800" />
                      <span className="text-orange-900 font-semibold text-xs">{topThreeTeams[2]?.bidPoints}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Main Leaderboard */}
          <main className="px-4 py-6">
            <div className="grid gap-3">
              {/* Debug: Log each team before rendering TeamCard */}
              {qualifiedOtherTeams.map((team, index) => {
                console.log('Rendering TeamCard from qualifiedOtherTeams:', team.name, 'bidPoints:', team.bidPoints);
                const rank = index + 4;
                const lockedIn = isLockedIn(team, rank);
                return (
                  <div key={team.id} className="relative">
                    {/* Modern outline for top 9 teams - similar to simulation warning */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/80 to-purple-600/80 rounded-xl"></div>
                    <div className="relative bg-slate-800/95 backdrop-blur-sm border border-blue-500/50 rounded-xl shadow-lg">
                      <TeamCard
                        team={team}
                        rank={rank}
                        isQualified={true}
                        cutoffPoints={CUTOFF_POINTS}
                        onClick={() => navigate(`/team/${team.id}`)}
                        showLockedIn={lockedIn}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modern Cutoff Line */}
            <div className="my-6 relative">
              <div className="flex items-center justify-center">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-500 to-transparent"></div>
                <div className="mx-4 px-4 py-2 bg-slate-800 border border-slate-600 rounded-full">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                    <span className="text-slate-300 font-medium text-sm"> RAS Cutoff</span>
                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-500 to-transparent"></div>
              </div>
            </div>

            <div className="grid gap-3">
              {notQualifiedTeams.map((team, index) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  rank={index + 10}
                  isQualified={false}
                  cutoffPoints={CUTOFF_POINTS}
                  onClick={() => navigate(`/team/${team.id}`)}
                />
              ))}
            </div>

            {/* About Section */}
            <div className="mt-8">
              <div className="bg-gradient-to-r from-slate-800/70 via-slate-800/60 to-slate-800/70 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-2">About Raas All Stars</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  The premier collegiate Raas competition, bringing together 
                  the top 9 university teams from across the nation. Teams earn bid points 
                  throughout the season at regional competitions to qualify for this ultimate 
                  championship event celebrating traditional Gujarati folk dance.
                </p>
              </div>
            </div>
          </main>
            </>
          )}
        </TabsContent>

        <TabsContent value="comps" className="mt-0 flex-1 overflow-y-auto scrollbar-hide pb-20">
          <div className="px-4">
            <CompetitionsTab 
              onSimulationSet={handleSimulationSet}
              simulationData={simulationData}
              teams={teamsData}
            />
          </div>
        </TabsContent>

        <TabsContent value="fantasy" className="mt-0 flex-1 overflow-y-auto scrollbar-hide pb-20">
          <FantasyTab />
        </TabsContent>

        <TabsContent value="teams" className="mt-0 flex-1 overflow-y-auto scrollbar-hide pb-20">
          <div className="px-4 py-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-slate-400 mt-2">Loading teams...</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-2">All Teams</h2>
                  <p className="text-slate-400 text-sm">
                    A display of every team in the circuit
                  </p>
                </div>

                <div className="grid gap-3">
                  {teamsData.map((team, index) => (
                <div 
                  key={team.id}
                  onClick={() => navigate(`/team/${team.id}`)}
                  className="relative overflow-hidden rounded-lg p-4 sm:p-5 cursor-pointer transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] touch-manipulation bg-slate-800 border border-slate-600"
                >
                  {/* Rank Badge */}
                  <div className="absolute top-3 left-3 bg-slate-400/20 text-slate-400 px-2 py-1 rounded text-xs font-bold">
                    {index + 1}
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
                          <span className="text-slate-400 text-sm">Team</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <div className="bg-gradient-to-r from-slate-800/70 via-slate-800/60 to-slate-800/70 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-2">Emerging Programs</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  These teams are building their competitive programs and working towards 
                  earning their first bid points. Every team starts somewhere, and these 
                  programs represent the future growth of collegiate Raas.
                </p>
              </div>
            </div>
              </>
            )}
          </div>
        </TabsContent>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700/50 shadow-lg z-50 flex-shrink-0">
          <TabsList className="grid grid-cols-4 bg-transparent border-none rounded-none w-full h-16 p-0">
            <TabsTrigger 
              value="standings" 
              className="text-slate-400 data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400 rounded-none text-xs flex-col gap-1 h-full border-none min-h-[44px]"
            >
              <Trophy className="h-4 w-4" />
              Standings
            </TabsTrigger>
            <TabsTrigger 
              value="comps" 
              className="text-slate-400 data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400 rounded-none text-xs flex-col gap-1 h-full border-none min-h-[44px]"
            >
              <Calendar className="h-4 w-4" />
              Comps
            </TabsTrigger>
            <TabsTrigger 
              value="fantasy" 
              className="text-slate-400 data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400 rounded-none text-xs flex-col gap-1 h-full border-none min-h-[44px]"
            >
              <Zap className="h-4 w-4" />
              Fantasy
            </TabsTrigger>
            <TabsTrigger 
              value="teams" 
              className="text-slate-400 data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400 rounded-none text-xs flex-col gap-1 h-full border-none min-h-[44px]"
            >
              <Users className="h-4 w-4" />
              Teams
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      {/* Team Detail Modal */}
      {selectedTeam && (
        <TeamDetail 
          team={selectedTeam} 
          onClose={() => setSelectedTeam(null)}
          onCompetitionClick={handleCompetitionClick}
          competitions={competitions}
        />
      )}

      {/* Competition Detail Modal */}
      {selectedCompetition && (
        <CompetitionDetail 
          competition={selectedCompetition} 
          onClose={() => setSelectedCompetition(null)}
          onSimulationSet={handleSimulationSet}
          simulationData={simulationData}
          teams={teamsData} // <-- pass teamsData for name resolution
        />
      )}
    </div>
  );
};

export default Index;
