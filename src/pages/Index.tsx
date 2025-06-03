
import { useState } from 'react';
import { TeamCard } from '@/components/TeamCard';
import { TeamDetail } from '@/components/TeamDetail';
import { CompetitionsTab } from '@/components/CompetitionsTab';
import { FantasyTab } from '@/components/FantasyTab';
import { TeamSelector, Team } from '@/components/TeamSelector';
import { Trophy, Target, Calendar, Users, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Team {
  id: string;
  name: string;
  university: string;
  bidPoints: number;
  qualified: boolean;
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

const CUTOFF_POINTS = 75;
const QUALIFYING_SPOTS = 9;

const Index = () => {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedSchoolTeam, setSelectedSchoolTeam] = useState<Team | null>(null);
  
  const qualifiedTeams = teams.filter(team => team.qualified).length;
  const sortedTeams = teams.sort((a, b) => b.bidPoints - a.bidPoints);
  const topThreeTeams = sortedTeams.slice(0, 3);
  const otherTeams = sortedTeams.slice(3);

  // Get theme colors based on selected school team
  const getThemeColors = () => {
    if (selectedSchoolTeam) {
      return {
        primary: selectedSchoolTeam.colors.primary,
        secondary: selectedSchoolTeam.colors.secondary,
        accent: selectedSchoolTeam.colors.accent
      };
    }
    return {
      primary: 'bg-blue-600',
      secondary: 'bg-blue-700', 
      accent: 'text-blue-400'
    };
  };

  const themeColors = getThemeColors();

  return (
    <div className="min-h-screen bg-slate-950 pb-safe overflow-x-hidden">
      <Tabs defaultValue="leaderboard" className="w-full">
        {/* Team Selector */}
        <div className="px-4 pt-4">
          <TeamSelector 
            selectedTeam={selectedSchoolTeam}
            onTeamSelect={setSelectedSchoolTeam}
          />
        </div>

        <TabsList className={`grid w-full grid-cols-3 bg-slate-800 border-slate-700 mx-4 mt-4 rounded-xl`}>
          <TabsTrigger 
            value="leaderboard" 
            className={`text-slate-300 data-[state=active]:${themeColors.primary} data-[state=active]:text-white rounded-lg`}
          >
            <Users className="h-4 w-4 mr-2" />
            Teams
          </TabsTrigger>
          <TabsTrigger 
            value="fantasy" 
            className={`text-slate-300 data-[state=active]:${themeColors.primary} data-[state=active]:text-white rounded-lg`}
          >
            <Zap className="h-4 w-4 mr-2" />
            Fantasy
          </TabsTrigger>
          <TabsTrigger 
            value="competitions" 
            className={`text-slate-300 data-[state=active]:${themeColors.primary} data-[state=active]:text-white rounded-lg`}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Comps
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="mt-0">
          {/* Status Bar */}
          <div className="bg-slate-900 border-b border-slate-700 px-4 py-4 mx-4 mt-4 rounded-2xl">
            <div className="text-center">
              <h1 className="text-xl font-bold text-white mb-3">
                RAAS ALL STARS 2024
              </h1>
              <div className="flex justify-center gap-4 text-sm">
                <div className="bg-slate-800 rounded-lg px-3 py-2 border border-slate-600">
                  <span className={`${themeColors.accent} font-semibold`}>{qualifiedTeams}</span>
                  <span className="text-slate-300"> / {QUALIFYING_SPOTS} Qualified</span>
                </div>
                <div className="bg-slate-800 rounded-lg px-3 py-2 border border-slate-600">
                  <span className={`${themeColors.accent} font-semibold`}>{CUTOFF_POINTS}</span>
                  <span className="text-slate-300"> Points Cutoff</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top 3 Teams */}
          <section className="px-4 py-6 bg-slate-900 mx-4 my-4 rounded-2xl border border-slate-700">
            <h2 className="text-lg font-bold text-white mb-4 text-center">Top 3 Teams</h2>
            <div className="flex gap-3 justify-center">
              {topThreeTeams.map((team, index) => (
                <div 
                  key={team.id}
                  onClick={() => setSelectedTeam(team)}
                  className="flex-1 max-w-[110px] bg-slate-800 border border-slate-600 rounded-xl p-3 cursor-pointer transform transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <div className="text-center">
                    <div className={`w-10 h-10 ${team.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <Trophy className={`h-5 w-5 ${
                        index === 0 ? 'text-yellow-400' : 
                        index === 1 ? 'text-slate-300' : 
                        'text-orange-400'
                      }`} />
                    </div>
                    <div className={`text-xs font-bold mb-1 ${
                      index === 0 ? 'text-yellow-400' : 
                      index === 1 ? 'text-slate-300' : 
                      'text-orange-400'
                    }`}>
                      {index === 0 ? '1st' : index === 1 ? '2nd' : '3rd'}
                    </div>
                    <div className="text-white font-semibold text-xs leading-tight mb-1">
                      {team.name}
                    </div>
                    <div className="flex items-center justify-center gap-1 text-xs">
                      <Target className={`h-3 w-3 ${themeColors.accent}`} />
                      <span className="text-white font-semibold">{team.bidPoints}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Main Leaderboard */}
          <main className="px-4 py-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-white mb-2">Full Leaderboard</h2>
              <p className="text-slate-400 text-sm">
                All teams ranked by bid points
              </p>
            </div>

            <div className="grid gap-3">
              {otherTeams.map((team, index) => (
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
            <div className="mt-6">
              <div className="border-t-2 border-dashed border-red-500 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  QUALIFICATION CUTOFF
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="mt-8">
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
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

        <TabsContent value="fantasy" className="mt-0">
          <FantasyTab />
        </TabsContent>

        <TabsContent value="competitions" className="mt-0">
          <CompetitionsTab />
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
