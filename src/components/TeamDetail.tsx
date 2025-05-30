
import { X, Trophy, Calendar, Target, Users } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  university: string;
  bidPoints: number;
  qualified: boolean;
  color: string;
  history: string[];
  achievements: string[];
  founded: string;
}

interface TeamDetailProps {
  team: Team;
  onClose: () => void;
}

export const TeamDetail = ({ team, onClose }: TeamDetailProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="flex items-start space-x-4">
            <div className={`w-16 h-16 ${team.color} rounded-lg flex items-center justify-center`}>
              <span className="text-white font-bold text-xl">{team.name.split(' ')[0][0]}</span>
            </div>
            
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">{team.name}</h2>
              <p className="text-purple-200 text-lg">{team.university}</p>
              
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold mt-3 ${
                team.qualified 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}>
                {team.qualified ? 'QUALIFIED FOR RAAS ALL STARS' : 'NOT QUALIFIED'}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4">Team Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <Target className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{team.bidPoints}</div>
              <div className="text-purple-200 text-sm">Bid Points</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <Calendar className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{team.founded}</div>
              <div className="text-purple-200 text-sm">Founded</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <Users className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">Active</div>
              <div className="text-purple-200 text-sm">Status</div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Trophy className="h-5 w-5 text-yellow-400 mr-2" />
            Recent Achievements
          </h3>
          <div className="space-y-2">
            {team.achievements.map((achievement, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-3">
                <span className="text-purple-200">{achievement}</span>
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Team History</h3>
          <div className="space-y-3">
            {team.history.map((item, index) => (
              <p key={index} className="text-purple-200 leading-relaxed">
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
