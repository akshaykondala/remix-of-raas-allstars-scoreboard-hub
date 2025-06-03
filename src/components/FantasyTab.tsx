
import { useState } from 'react';
import { Trophy, Target, TrendingUp, Users, Zap } from 'lucide-react';

interface FantasyTeam {
  id: string;
  name: string;
  owner: string;
  points: number;
  dancers: string[];
  weeklyChange: number;
}

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

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Fantasy League</h2>
        <p className="text-slate-400 text-sm">
          Build your dream team and compete with friends
        </p>
      </div>

      {/* Top 3 Fantasy Teams */}
      <section className="bg-slate-900 rounded-2xl border border-slate-700 p-4 mb-6">
        <h3 className="text-lg font-bold text-white mb-4 text-center">Top 3 Fantasy Teams</h3>
        <div className="flex gap-3 justify-center">
          {sortedTeams.slice(0, 3).map((team, index) => (
            <div 
              key={team.id}
              onClick={() => setSelectedTeam(team)}
              className="flex-1 max-w-[120px] bg-slate-800 border border-slate-600 rounded-xl p-3 cursor-pointer transform transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <div className="text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  index === 0 ? 'bg-yellow-600' : 
                  index === 1 ? 'bg-slate-600' : 
                  'bg-orange-600'
                }`}>
                  <Trophy className={`h-6 w-6 ${
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
                <div className="text-white font-semibold text-sm leading-tight mb-1">
                  {team.name}
                </div>
                <div className="flex items-center justify-center gap-1 text-xs">
                  <Target className="h-3 w-3 text-blue-400" />
                  <span className="text-white font-semibold">{team.points}</span>
                </div>
              </div>
            </div>
          ))}
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
