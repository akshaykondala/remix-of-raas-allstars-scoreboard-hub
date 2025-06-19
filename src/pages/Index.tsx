import { useState } from 'react';
import { TeamCard } from '@/components/TeamCard';
import { TeamDetail } from '@/components/TeamDetail';
import { CompetitionsTab } from '@/components/CompetitionsTab';
import { FantasyTab } from '@/components/FantasyTab';
import { Trophy, Target, Calendar, Users, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Team {
  id: string;
  name: string;
  university: string;
  bidPoints: number;
  qualified: boolean;
  locked?: boolean; // New field for "locked into RAS"
  logo?: string;
  color: string;
  history: string[];
  achievements: string[];
  founded: string;
}

const teams: Team[] = [
  {
    id: '1',
    name: 'Texas Raas',
    university: 'University of Texas at Austin',
    bidPoints: 95,
    qualified: true,
    locked: true, // Locked into RAS
    color: 'bg-orange-600',
    history: [
      'Founded in 2005, Texas Raas has been a powerhouse in collegiate Raas',
      'Multiple-time Raas All Stars qualifier',
      'Known for innovative choreography and strong storytelling'
    ],
    achievements: ['Raas All Stars 2023 - 2nd Place', 'Raas All Stars 2022 - 4th Place'],
    founded: '2005'
  },
  {
    id: '2',
    name: 'CMU Raasta',
    university: 'Carnegie Mellon University',
    bidPoints: 92,
    qualified: true,
    locked: true, // Locked into RAS
    color: 'bg-red-700',
    history: [
      'CMU Raasta brings technical precision to every performance',
      'Consistently ranked in top 10 nationally',
      'Known for clean formations and synchronized movements'
    ],
    achievements: ['Raas All Stars 2023 - 6th Place', 'Raas All Stars 2021 - 3rd Place'],
    founded: '2003'
  },
  {
    id: '3',
    name: 'UF Gatoraas',
    university: 'University of Florida',
    bidPoints: 88,
    qualified: true,
    locked: true, // Locked into RAS
    color: 'bg-blue-600',
    history: [
      'Gatoraas represents the Southeast with pride and energy',
      'Rising team with incredible growth in recent years',
      'Fan favorite for high-energy performances'
    ],
    achievements: ['Raas All Stars 2023 - 8th Place', 'Regional Champions 2022'],
    founded: '2008'
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

const CUTOFF_POINTS = 75;
const QUALIFYING_SPOTS = 9;

const Index = () => {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  
  const qualifiedTeams = teams.filter(team => team.qualified).length;
  const sortedTeams = teams.sort((a, b) => b.bidPoints - a.bidPoints);
  const topThreeTeams = sortedTeams.slice(0, 3);
  const qualifiedOtherTeams = sortedTeams.slice(3).filter(team => team.qualified);
  const notQualifiedTeams = sortedTeams.filter(team => !team.qualified);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black pb-safe overflow-x-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-900/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-slate-800/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-800/20 rounded-full blur-3xl"></div>
      </div>

      <Tabs defaultValue="leaderboard" className="w-full relative z-10">
        {/* Header with Logo - Faded into gradient */}
        <div className="bg-gradient-to-b from-black/95 via-black/80 to-transparent backdrop-blur-sm">
          <div className="flex justify-center items-center px-4 py-4">
            <img 
              src="/lovable-uploads/fac2918d-a107-444b-8ce2-b83e59b5b3c7.png" 
              alt="Raas All Stars Logo" 
              className="h-12 w-auto"
            />
          </div>
        </div>

        {/* Centered Tabs */}
        <div className="flex justify-center px-4 mt-6">
          <TabsList className="grid grid-cols-4 bg-slate-800/80 backdrop-blur-sm border-slate-700/50 rounded-xl w-full max-w-md shadow-lg">
            <TabsTrigger 
              value="leaderboard" 
              className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg text-xs"
            >
              <Users className="h-3 w-3 mr-1" />
              Board
            </TabsTrigger>
            <TabsTrigger 
              value="teams" 
              className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg text-xs"
            >
              <Target className="h-3 w-3 mr-1" />
              Teams
            </TabsTrigger>
            <TabsTrigger 
              value="fantasy" 
              className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg text-xs"
            >
              <Zap className="h-3 w-3 mr-1" />
              Fantasy
            </TabsTrigger>
            <TabsTrigger 
              value="competitions" 
              className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg text-xs"
            >
              <Calendar className="h-3 w-3 mr-1" />
              Comps
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="leaderboard" className="mt-0">
          {/* Status Bar */}
          <div className="bg-gradient-to-r from-slate-800/70 via-slate-800/60 to-slate-800/70 backdrop-blur-sm border border-slate-600/50 px-4 py-4 mx-4 mt-6 rounded-2xl shadow-lg">
            <div className="text-center">
              <h1 className="text-xl font-bold text-white mb-3">
                2024 SEASON STANDINGS
              </h1>
              <div className="flex justify-center gap-4 text-sm">
                <div className="bg-slate-700/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-600/50">
                  <span className="font-semibold">{qualifiedTeams}</span>
                  <span className="text-slate-300"> / {QUALIFYING_SPOTS} Qualified</span>
                </div>
                <div className="bg-slate-700/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-600/50">
                  <span className="font-semibold">{CUTOFF_POINTS}</span>
                  <span className="text-slate-300"> Points Cutoff</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top 3 Teams - Modern Design */}
          <section className="px-4 py-6">
            <h2 className="text-xl font-bold text-white mb-6 text-center">Top 3 Teams</h2>
            <div className="flex gap-4 justify-center items-end">
              {/* 2nd Place */}
              <div 
                onClick={() => setSelectedTeam(topThreeTeams[1])}
                className="flex-1 max-w-[100px] cursor-pointer transform transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <div className="bg-gradient-to-b from-slate-600/80 to-slate-700/80 backdrop-blur-sm rounded-2xl p-4 h-32 flex flex-col items-center justify-between border border-slate-500/50 shadow-xl">
                  <div className="w-12 h-12 bg-gradient-to-b from-slate-400 to-slate-500 rounded-full flex items-center justify-center shadow-md">
                    <Trophy className="h-6 w-6 text-slate-200" />
                  </div>
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
              <div 
                onClick={() => setSelectedTeam(topThreeTeams[0])}
                className="flex-1 max-w-[120px] cursor-pointer transform transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <div className="bg-gradient-to-b from-yellow-500/90 to-yellow-600/90 backdrop-blur-sm rounded-2xl p-4 h-40 flex flex-col items-center justify-between shadow-xl border border-yellow-400/50">
                  <div className="w-14 h-14 bg-gradient-to-b from-yellow-300 to-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                    <Trophy className="h-8 w-8 text-yellow-700" />
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
              <div 
                onClick={() => setSelectedTeam(topThreeTeams[2])}
                className="flex-1 max-w-[100px] cursor-pointer transform transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <div className="bg-gradient-to-b from-orange-500/80 to-orange-600/80 backdrop-blur-sm rounded-2xl p-4 h-32 flex flex-col items-center justify-between border border-orange-400/50 shadow-xl">
                  <div className="w-12 h-12 bg-gradient-to-b from-orange-300 to-orange-400 rounded-full flex items-center justify-center shadow-md">
                    <Trophy className="h-6 w-6 text-orange-700" />
                  </div>
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
            <div className="mb-6">
              <h2 className="text-lg font-bold text-white mb-2">Qualified Teams</h2>
              <p className="text-slate-400 text-sm">
                Remaining teams with All Stars qualification
              </p>
            </div>

            <div className="grid gap-3">
              {qualifiedOtherTeams.map((team, index) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  rank={index + 4}
                  isQualified={team.qualified}
                  cutoffPoints={CUTOFF_POINTS}
                  onClick={() => setSelectedTeam(team)}
                />
              ))}
            </div>

            {/* Cutoff Line */}
            <div className="my-8">
              <div className="border-t-2 border-dashed border-red-500/70 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                  QUALIFICATION CUTOFF ({CUTOFF_POINTS} PTS)
                </div>
              </div>
            </div>

            {/* Not Qualified Teams */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-white mb-2">Not Qualified</h2>
              <p className="text-slate-400 text-sm">
                Teams below the qualification cutoff
              </p>
            </div>

            <div className="grid gap-3">
              {notQualifiedTeams.map((team, index) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  rank={index + qualifiedTeams + 1}
                  isQualified={team.qualified}
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

        <TabsContent value="teams" className="mt-0">
          <div className="px-4 py-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">All Teams</h2>
              <p className="text-slate-400 text-sm">
                Teams that have not earned bid points this season
              </p>
            </div>

            <div className="grid gap-3">
              {noBidTeams.map((team, index) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  rank={teams.length + index + 1}
                  isQualified={team.qualified}
                  cutoffPoints={CUTOFF_POINTS}
                  onClick={() => setSelectedTeam(team)}
                />
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

        <TabsContent value="fantasy" className="mt-0">
          <FantasyTab />
        </TabsContent>

        <TabsContent value="competitions" className="mt-0">
          <div className="px-4">
            <CompetitionsTab />
          </div>
        </TabsContent>
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
