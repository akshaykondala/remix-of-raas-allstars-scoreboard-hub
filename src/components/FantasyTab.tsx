
import { useState } from 'react';
import { Trophy, Target, TrendingUp, Users, Zap } from 'lucide-react';
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

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Fantasy League</h2>
        <p className="text-slate-400 text-sm">
          Build your dream team and compete with friends
        </p>
      </div>

      {/* Top 3 Fantasy Teams - Consistent with Board tab */}
      <section className="px-4 py-6">
        <h2 className="text-xl font-bold text-white mb-6 text-center">Top 3 Fantasy Teams</h2>
        <div className="flex gap-4 justify-center items-end">
          {/* 2nd Place */}
          <div 
            onClick={() => setSelectedTeam(topThreeTeams[1])}
            className="flex-1 max-w-[100px] cursor-pointer transform transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="bg-gradient-to-b from-slate-600 to-slate-700 rounded-2xl p-4 h-32 flex flex-col items-center justify-between border border-slate-500 shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-b from-slate-400 to-slate-500 rounded-full flex items-center justify-center shadow-md">
                <Trophy className="h-6 w-6 text-slate-200" />
              </div>
              <div className="text-center">
                <div className="text-slate-300 font-bold text-xs mb-1">2nd</div>
                <div className="text-white font-semibold text-xs leading-tight mb-1">{topThreeTeams[1]?.name}</div>
                <div className="flex items-center justify-center gap-1">
                  <Target className="h-3 w-3 text-slate-300" />
                  <span className="text-white font-semibold text-xs">{topThreeTeams[1]?.points}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 1st Place - Taller */}
          <div 
            onClick={() => setSelectedTeam(topThreeTeams[0])}
            className="flex-1 max-w-[120px] cursor-pointer transform transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="bg-gradient-to-b from-yellow-500 to-yellow-600 rounded-2xl p-4 h-40 flex flex-col items-center justify-between shadow-xl border border-yellow-400">
              <div className="w-14 h-14 bg-gradient-to-b from-yellow-300 to-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <Trophy className="h-8 w-8 text-yellow-700" />
              </div>
              <div className="text-center">
                <div className="text-yellow-800 font-bold text-sm mb-1">1st</div>
                <div className="text-yellow-900 font-bold text-sm leading-tight mb-1">{topThreeTeams[0]?.name}</div>
                <div className="flex items-center justify-center gap-1">
                  <Target className="h-3 w-3 text-yellow-800" />
                  <span className="text-yellow-900 font-bold text-sm">{topThreeTeams[0]?.points}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3rd Place */}
          <div 
            onClick={() => setSelectedTeam(topThreeTeams[2])}
            className="flex-1 max-w-[100px] cursor-pointer transform transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="bg-gradient-to-b from-orange-500 to-orange-600 rounded-2xl p-4 h-32 flex flex-col items-center justify-between border border-orange-400 shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-b from-orange-300 to-orange-400 rounded-full flex items-center justify-center shadow-md">
                <Trophy className="h-6 w-6 text-orange-700" />
              </div>
              <div className="text-center">
                <div className="text-orange-800 font-bold text-xs mb-1">3rd</div>
                <div className="text-orange-900 font-semibold text-xs leading-tight mb-1">{topThreeTeams[2]?.name}</div>
                <div className="flex items-center justify-center gap-1">
                  <Target className="h-3 w-3 text-orange-800" />
                  <span className="text-orange-900 font-semibold text-xs">{topThreeTeams[2]?.points}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Leaderboard */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-2">Full Leaderboard</h3>
        <p className="text-slate-400 text-sm mb-4">All fantasy teams ranked by points</p>
      </div>

      <div className="grid gap-3">
        {sortedTeams.map((team, index) => (
          <div 
            key={team.id}
            onClick={() => setSelectedTeam(team)}
            className="bg-slate-900 border border-slate-700 rounded-xl p-4 cursor-pointer transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:border-blue-600"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                  #{index + 1}
                </div>
                <div>
                  <h4 className="text-white font-bold">{team.name}</h4>
                  <p className="text-slate-400 text-sm">by {team.owner}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-white font-bold">
                  <Target className="h-4 w-4 text-blue-400" />
                  {team.points}
                </div>
                <div className={`flex items-center gap-1 text-xs ${
                  team.weeklyChange >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  <TrendingUp className="h-3 w-3" />
                  {team.weeklyChange >= 0 ? '+' : ''}{team.weeklyChange}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-slate-300">
              <Users className="h-3 w-3 text-blue-400" />
              <span>{team.dancers.length} dancers</span>
            </div>
          </div>
        ))}
      </div>

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
