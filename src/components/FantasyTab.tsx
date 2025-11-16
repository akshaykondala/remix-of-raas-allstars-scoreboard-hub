
import { useState } from 'react';
import { Trophy, Target, TrendingUp, Users, Zap, MapPin, Instagram } from 'lucide-react';
import { FantasyTeam } from '../lib/types';

const fantasyTeams: FantasyTeam[] = [
  {
    id: '1',
    name: 'Dancing Dynamos',
    owner: 'Alex Chen',
    points: 892,
    dancers: ['Texas Raas (Captain)', 'CMU Raasta', 'UCLA Nashaa', 'Michigan Maize Mirchi', 'NYU Bhangra'],
    weeklyChange: 45
  },
  {
    id: '2',
    name: 'Raas Rulers',
    owner: 'Priya Patel',
    points: 867,
    dancers: ['CMU Raasta (Captain)', 'Texas Raas', 'UF Gatoraas', 'Penn Aatish', 'Georgia Tech Raas'],
    weeklyChange: 23
  },
  {
    id: '3',
    name: 'Bollywood Bosses',
    owner: 'Ravi Kumar',
    points: 834,
    dancers: ['UF Gatoraas (Captain)', 'UCLA Nashaa', 'Michigan Maize Mirchi', 'UIUC Roshni', 'Rutgers Raas'],
    weeklyChange: -12
  },
  {
    id: '4',
    name: 'Taal Titans',
    owner: 'Neha Singh',
    points: 821,
    dancers: ['UCLA Nashaa (Captain)', 'Texas Raas', 'CMU Raasta', 'NYU Bhangra', 'Case Western Raas'],
    weeklyChange: 18
  },
  {
    id: '5',
    name: 'Garba Guardians',
    owner: 'Arjun Mehta',
    points: 798,
    dancers: ['Michigan Maize Mirchi (Captain)', 'UF Gatoraas', 'Penn Aatish', 'Georgia Tech Raas', 'USC Zeher'],
    weeklyChange: -8
  },
  {
    id: '6',
    name: 'Sangam Squad',
    owner: 'Kavya Reddy',
    points: 776,
    dancers: ['NYU Bhangra (Captain)', 'UIUC Roshni', 'Rutgers Raas', 'Case Western Raas', 'USC Zeher'],
    weeklyChange: 31
  }
];

export function FantasyTab() {
  const [selectedTeam, setSelectedTeam] = useState<FantasyTeam | null>(null);

  const sortedTeams = fantasyTeams.sort((a, b) => b.points - a.points);
  const topThreeTeams = sortedTeams.slice(0, 3);
  const otherTeams = sortedTeams.slice(3);

  return (
    <div className="px-4 py-6">
      <div className="mb-6 text-center px-4">
        <h2 className="text-xl font-bold text-white mb-2">Fantasy League</h2>
      </div>

      {/* Top 3 Fantasy Teams - Flowing Podium Design */}
      <section className="px-4 pb-8">
        <div className="relative">
          {/* Subtle flowing background */}
          <div className="absolute inset-0 top-4 bg-gradient-to-r from-slate-800/5 via-slate-700/10 to-slate-800/5 rounded-3xl blur-2xl"></div>
          <div className="absolute inset-0 top-8 bg-gradient-to-b from-transparent via-slate-700/8 to-slate-800/15 rounded-3xl blur-xl"></div>
          
          <div className="relative flex gap-4 justify-center items-end py-8">
            {/* 2nd Place */}
            <div className="flex-1 max-w-[95px]">
              <div 
                onClick={() => setSelectedTeam(topThreeTeams[1])}
                className="relative group cursor-pointer"
              >
                {/* Enhanced floating effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-500/30 to-slate-700/50 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                
                <div className="relative bg-gradient-to-br from-slate-600/70 to-slate-800/90 backdrop-blur-md rounded-3xl p-4 h-32 flex flex-col items-center justify-between border border-slate-500/20 group-hover:border-slate-400/40 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                  
                  {/* Featured Profile Picture */}
                  <div className="relative -mt-6 mb-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-400/50 to-slate-600/50 rounded-full blur-lg group-hover:blur-xl transition-all duration-500"></div>
                    <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-2xl bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center border-2 border-slate-400/50 group-hover:border-slate-300/70 transition-all duration-500">
                      <Trophy className="h-8 w-8 text-slate-200" />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-slate-300 font-bold text-xs mb-1">2nd</div>
                    <div className="text-white font-semibold text-xs leading-tight mb-1">{topThreeTeams[1]?.name}</div>
                    <div className="relative -mt-1">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-sm"></div>
                      <div className="relative bg-gradient-to-r from-blue-500/30 to-purple-500/30 px-3 py-1 rounded-full border border-blue-400/30">
                        <span className="text-white font-bold text-xs tracking-wider">{topThreeTeams[1]?.points}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 1st Place - Hero Profile */}
            <div className="flex-1 max-w-[110px] -mt-8">
              <div 
                onClick={() => setSelectedTeam(topThreeTeams[0])}
                className="relative group cursor-pointer"
              >
                {/* Epic glowing effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/40 to-orange-500/60 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                
                <div className="relative bg-gradient-to-br from-yellow-400/85 to-orange-500/95 backdrop-blur-md rounded-3xl p-5 h-40 flex flex-col items-center justify-between shadow-2xl border border-yellow-300/40 group-hover:border-yellow-200/60 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-3">
                  
                  {/* Hero Profile Picture */}
                  <div className="relative -mt-8 mb-3">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/60 to-orange-400/60 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-2xl bg-gradient-to-br from-yellow-200 to-yellow-400 flex items-center justify-center border-3 border-yellow-300/60 group-hover:border-yellow-200/80 transition-all duration-500">
                      <Trophy className="h-10 w-10 text-yellow-700" />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-yellow-800 font-bold text-sm mb-1">1st</div>
                    <div className="text-yellow-900 font-bold text-sm leading-tight mb-1">{topThreeTeams[0]?.name}</div>
                    <div className="relative -mt-1">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/40 to-orange-300/40 rounded-full blur-sm"></div>
                      <div className="relative bg-gradient-to-r from-yellow-200/80 to-orange-200/80 px-4 py-1.5 rounded-full border border-yellow-300/60">
                        <span className="text-yellow-900 font-bold text-sm tracking-wider">{topThreeTeams[0]?.points}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex-1 max-w-[95px]">
              <div 
                onClick={() => setSelectedTeam(topThreeTeams[2])}
                className="relative group cursor-pointer"
              >
                {/* Enhanced floating effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-red-600/50 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                
                <div className="relative bg-gradient-to-br from-orange-500/70 to-red-600/90 backdrop-blur-md rounded-3xl p-4 h-32 flex flex-col items-center justify-between border border-orange-400/20 group-hover:border-orange-300/40 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                  
                  {/* Featured Profile Picture */}
                  <div className="relative -mt-6 mb-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400/50 to-red-500/50 rounded-full blur-lg group-hover:blur-xl transition-all duration-500"></div>
                    <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-2xl bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center border-2 border-orange-400/50 group-hover:border-orange-300/70 transition-all duration-500">
                      <Trophy className="h-8 w-8 text-orange-800" />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-orange-200 font-bold text-xs mb-1">3rd</div>
                    <div className="text-orange-100 font-semibold text-xs leading-tight mb-1">{topThreeTeams[2]?.name}</div>
                    <div className="relative -mt-1">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-full blur-sm"></div>
                      <div className="relative bg-gradient-to-r from-orange-400/30 to-red-400/30 px-3 py-1 rounded-full border border-orange-300/30">
                        <span className="text-orange-100 font-bold text-xs tracking-wider">{topThreeTeams[2]?.points}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seamless Team List */}
      <main className="px-4">
        {/* Other Fantasy Teams (4-6) */}
        <div className="space-y-2 mb-6">
          {otherTeams.map((team, index) => {
            const rank = index + 4;
            return (
              <div 
                key={team.id}
                onClick={() => setSelectedTeam(team)}
                className="group relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:bg-slate-800/70 hover:border-slate-600/50 hover:scale-[1.02] active:scale-[0.98]"
              >
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/5 to-blue-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative flex items-center gap-4">
                  {/* Team Logo with glow */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/10 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Trophy className="h-6 w-6 text-slate-400" />
                    </div>
                  </div>
                  
                  {/* Team Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-base truncate group-hover:text-blue-100 transition-colors duration-300">{team.name}</h3>
                    <p className="text-slate-400 text-sm truncate group-hover:text-slate-300 transition-colors duration-300">by {team.owner}</p>
                    <div className="flex items-center gap-1 text-xs text-slate-300 mt-1">
                      <Users className="h-3 w-3 text-blue-400" />
                      <span>{team.dancers.length} dancers</span>
                    </div>
                  </div>
                  
                  {/* Modern Points Display */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                    <div className="relative bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-blue-400/20 group-hover:border-blue-300/40 transition-all duration-300">
                      <div className="flex flex-col items-center">
                        <div className="text-blue-300 font-black text-lg leading-none group-hover:text-blue-200 transition-colors duration-300">{team.points}</div>
                        <div className="text-blue-400/70 font-medium text-[10px] uppercase tracking-widest">points</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Fantasy Team Detail Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{selectedTeam.name}</h3>
                <button
                  onClick={() => setSelectedTeam(null)}
                  className="text-slate-400 hover:text-white p-2 -m-2"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-slate-400 text-sm">Owner: {selectedTeam.owner}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Target className="h-4 w-4 text-blue-400" />
                  <span className="text-white font-bold text-lg">{selectedTeam.points} points</span>
                </div>
                <div className={`flex items-center gap-1 text-sm mt-1 ${
                  selectedTeam.weeklyChange >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  <TrendingUp className="h-3 w-3" />
                  {selectedTeam.weeklyChange >= 0 ? '+' : ''}{selectedTeam.weeklyChange} this week
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  Team Lineup
                </h4>
                <div className="space-y-2">
                  {selectedTeam.dancers.map((dancer, index) => (
                    <div key={index} className="bg-slate-900 border border-slate-700 rounded-lg p-3">
                      <span className="text-slate-300">{dancer}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
