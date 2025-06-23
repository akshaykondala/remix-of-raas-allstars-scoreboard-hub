
import { useState, useRef, useEffect } from 'react';
import { TeamCard } from '@/components/TeamCard';
import { TeamDetail } from '@/components/TeamDetail';
import { CompetitionsTab } from '@/components/CompetitionsTab';
import { FantasyTab } from '@/components/FantasyTab';
import { Trophy, Target, Calendar, Users, Zap, RotateCcw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Team {
  id: string;
  name: string;
  university: string;
  bidPoints: number;
  qualified: boolean;
  locked?: boolean;
  logo?: string;
  color: string;
  history: string[];
  achievements: string[];
  founded: string;
}

interface SimulationData {
  [competitionId: string]: {
    competitionName: string;
    competitionId: string;
    predictions: {
      first: string;
      second: string;
      third: string;
    };
  };
}

const initialTeams: Team[] = [
  {
    id: '1',
    name: 'Texas Raas',
    university: 'University of Texas at Austin',
    bidPoints: 8,
    qualified: true,
    locked: true,
    color: 'bg-orange-600',
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
    bidPoints: 88,
    qualified: true,
    locked: true,
    color: 'bg-blue-600',
    history: [
      'Gatoraas represents the Southeast with pride and energy',
      'Rising team with incredible growth in recent years',
      'Fan favorite for high-energy performances'
    ],
    achievements: ['Raas All Stars 2023 - 8th Place', 'Regional Champions 2022'],
    founded: '2008',
     logo: '/src/logos/uf-gatoraas.jpeg'
  },
  {
    id: '4',
    name: 'UCLA Nashaa',
    university: 'University of California, Los Angeles',
    bidPoints: 85,
    qualified: true,
    color: 'bg-blue-800',
    history: [
      'UCLA Nashaa brings West Coast flair to traditional Raas',
      'Known for creative themes and storytelling',
      'Strong alumni network and support system'
    ],
    achievements: ['Raas All Stars 2023 - 5th Place', 'West Coast Champions 2022'],
    founded: '2004'
  },
  {
    id: '5',
    name: 'Michigan Maize Mirchi',
    university: 'University of Michigan',
    bidPoints: 83,
    qualified: true,
    color: 'bg-yellow-600',
    history: [
      'Maize Mirchi combines Midwest values with passionate dance',
      'Consistent top 10 finisher',
      'Known for team spirit and sportsmanship'
    ],
    achievements: ['Raas All Stars 2023 - 7th Place', 'Midwest Champions 2022'],
    founded: '2006'
  },
  {
    id: '6',
    name: 'NYU Bhangra',
    university: 'New York University',
    bidPoints: 81,
    qualified: true,
    color: 'bg-purple-700',
    history: [
      'Representing NYC with urban energy and traditional roots',
      'Known for innovative music mixing',
      'Strong performance in recent competitions'
    ],
    achievements: ['Raas All Stars 2023 - 9th Place', 'Northeast Regional 2022'],
    founded: '2007'
  },
  {
    id: '7',
    name: 'Georgia Tech Raas',
    university: 'Georgia Institute of Technology',
    bidPoints: 79,
    qualified: true,
    color: 'bg-yellow-700',
    history: [
      'GT Raas brings engineering precision to dance',
      'Technical excellence in formations',
      'Growing stronger each season'
    ],
    achievements: ['Regional Qualifier 2023', 'Southeast Champions 2021'],
    founded: '2009'
  },
  {
    id: '8',
    name: 'Penn Aatish',
    university: 'University of Pennsylvania',
    bidPoints: 77,
    qualified: true,
    color: 'bg-red-800',
    history: [
      'Penn Aatish represents Ivy League excellence',
      'Known for academic and artistic balance',
      'Strong tradition of mentorship'
    ],
    achievements: ['Raas All Stars 2022 - 10th Place', 'Regional Finalist 2023'],
    founded: '2005'
  },
  {
    id: '9',
    name: 'UIUC Roshni',
    university: 'University of Illinois Urbana-Champaign',
    bidPoints: 75,
    qualified: true,
    color: 'bg-orange-800',
    history: [
      'UIUC Roshni lights up the stage with every performance',
      'Midwest representation with heart',
      'Known for emotional storytelling'
    ],
    achievements: ['Regional Champions 2023', 'Raas All Stars Debut 2023'],
    founded: '2010'
  },
  {
    id: '10',
    name: 'Rutgers Raas',
    university: 'Rutgers University',
    bidPoints: 72,
    qualified: false,
    color: 'bg-red-600',
    history: [
      'Rutgers Raas brings East Coast energy',
      'Consistent regional competitor',
      'Building towards All Stars qualification'
    ],
    achievements: ['Regional Semi-Finalist 2023', 'State Champions 2022'],
    founded: '2008'
  },
  {
    id: '11',
    name: 'USC Zeher',
    university: 'University of Southern California',
    bidPoints: 70,
    qualified: false,
    color: 'bg-yellow-800',
    history: [
      'USC Zeher represents Southern California pride',
      'Rising team with strong potential',
      'Known for innovative choreography'
    ],
    achievements: ['West Coast Semi-Finalist 2023', 'Regional Qualifier 2022'],
    founded: '2011'
  },
  {
    id: '12',
    name: 'Case Western Raas',
    university: 'Case Western Reserve University',
    bidPoints: 68,
    qualified: false,
    color: 'bg-blue-700',
    history: [
      'Case Western brings dedication and precision',
      'Consistent improvement year over year',
      'Strong team chemistry and work ethic'
    ],
    achievements: ['Regional Competitor 2023', 'University Champions 2022'],
    founded: '2012'
  }
];

// Teams with no bid points
const noBidTeams: Team[] = [
  {
    id: '13',
    name: 'Virginia Tech Moksh',
    university: 'Virginia Polytechnic Institute',
    bidPoints: 0,
    qualified: false,
    color: 'bg-orange-700',
    history: ['Emerging team with strong potential', 'Building competitive program'],
    achievements: ['Regional Participation 2023'],
    founded: '2019'
  },
  {
    id: '14',
    name: 'UNC Tareel Taal',
    university: 'University of North Carolina',
    bidPoints: 0,
    qualified: false,
    color: 'bg-blue-500',
    history: ['New competitive team', 'Growing dance program'],
    achievements: ['University Performance 2023'],
    founded: '2020'
  },
  {
    id: '15',
    name: 'Ohio State Raag',
    university: 'The Ohio State University',
    bidPoints: 0,
    qualified: false,
    color: 'bg-red-500',
    history: ['Developing team with Big Ten pride', 'Focus on technical improvement'],
    achievements: ['Regional Participation 2023'],
    founded: '2018'
  }
];

const CUTOFF_POINTS = 5;

const Index = () => {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [simulationData, setSimulationData] = useState<SimulationData>({});
  const [activeTab, setActiveTab] = useState<string>('standings');
  const [teamsData, setTeamsData] = useState<Team[]>(initialTeams);

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

  // Update teams when simulation data changes
  useEffect(() => {
    const updatedTeams = calculateBidPoints(initialTeams, []);
    setTeamsData(updatedTeams);
  }, [simulationData]);

  const qualifiedTeams = teamsData.filter(team => team.qualified).length;
  const sortedTeams = [...teamsData].sort((a, b) => b.bidPoints - a.bidPoints);
  const topThreeTeams = sortedTeams.slice(0, 3);
  const topNineTeams = sortedTeams.slice(0, 9);
  const qualifiedOtherTeams = sortedTeams.slice(3, 9);
  const notQualifiedTeams = sortedTeams.slice(9);

  const sortedNoBidTeams = [...noBidTeams].sort((a, b) => a.name.localeCompare(b.name));

  const handleSimulationSet = (competitionName: string, competitionId: string, predictions: { first: string; second: string; third: string }) => {
    setSimulationData(prev => ({
      ...prev,
      [competitionId]: { competitionName, competitionId, predictions }
    }));
    setActiveTab('standings');
  };

  const clearSimulation = () => {
    setSimulationData({});
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
          <div className="flex justify-center items-center px-4 py-2">
            <img 
              src="/lovable-uploads/fac2918d-a107-444b-8ce2-b83e59b5b3c7.png" 
              alt="Raas All Stars Logo" 
              className="h-12 w-auto"
            />
          </div>
        </div>

        <TabsContent value="standings" className="mt-2 flex-1 overflow-y-auto scrollbar-hide pb-20">
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
                  onClick={() => setSelectedTeam(topThreeTeams[1])}
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
                  onClick={() => setSelectedTeam(topThreeTeams[0])}
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
                  onClick={() => setSelectedTeam(topThreeTeams[2])}
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
              {qualifiedOtherTeams.map((team, index) => {
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
                        onClick={() => setSelectedTeam(team)}
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
                  onClick={() => setSelectedTeam(team)}
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
        </TabsContent>

        <TabsContent value="comps" className="mt-0 flex-1 overflow-y-auto scrollbar-hide pb-20">
          <div className="px-4">
            <CompetitionsTab 
              onSimulationSet={handleSimulationSet}
              simulationData={simulationData}
            />
          </div>
        </TabsContent>

        <TabsContent value="fantasy" className="mt-0 flex-1 overflow-y-auto scrollbar-hide pb-20">
          <FantasyTab />
        </TabsContent>

        <TabsContent value="teams" className="mt-0 flex-1 overflow-y-auto scrollbar-hide pb-20">
          <div className="px-4 py-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">All Teams</h2>
              <p className="text-slate-400 text-sm">
                A display of every team in the circuit
              </p>
            </div>

            <div className="grid gap-3">
              {sortedNoBidTeams.map((team, index) => (
                <div 
                  key={team.id}
                  onClick={() => setSelectedTeam(team)}
                  className="relative overflow-hidden rounded-lg p-4 sm:p-5 cursor-pointer transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] touch-manipulation bg-slate-800 border border-slate-600"
                >
                  {/* Rank Badge */}
                  <div className="absolute top-3 left-3 bg-slate-400/20 text-slate-400 px-2 py-1 rounded text-xs font-bold">
                    {teamsData.length + index + 1}th
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
        />
      )}
    </div>
  );
};

export default Index;
