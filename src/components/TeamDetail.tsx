
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-4 sm:p-6 border-b border-slate-700">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-2 -m-2 touch-manipulation"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-start space-x-4 pr-8">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${team.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <span className="text-white font-bold text-base sm:text-lg">{team.name.split(' ')[0][0]}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 break-words">{team.name}</h2>
              <p className="text-slate-400 text-sm sm:text-base break-words">{team.university}</p>
              
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold mt-3 ${
                team.qualified 
                  ? 'bg-green-600 text-white' 
                  : 'bg-red-600 text-white'
              }`}>
                {team.qualified ? 'QUALIFIED FOR RAAS ALL STARS' : 'NOT QUALIFIED'}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-4 sm:p-6 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Team Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 text-center">
              <Target className="h-5 w-5 text-blue-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{team.bidPoints}</div>
              <div className="text-slate-400 text-sm">Bid Points</div>
            </div>
            
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 text-center">
              <Calendar className="h-5 w-5 text-blue-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{team.founded}</div>
              <div className="text-slate-400 text-sm">Founded</div>
            </div>
            
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 text-center">
              <Users className="h-5 w-5 text-green-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">Active</div>
              <div className="text-slate-400 text-sm">Status</div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="p-4 sm:p-6 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Trophy className="h-4 w-4 text-yellow-400 mr-2" />
            Recent Achievements
          </h3>
          <div className="space-y-2">
            {team.achievements.map((achievement, index) => (
              <div key={index} className="bg-slate-900 border border-slate-700 rounded-lg p-3">
                <span className="text-slate-300 text-sm sm:text-base">{achievement}</span>
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        <div className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Team History</h3>
          <div className="space-y-3">
            {team.history.map((item, index) => (
              <p key={index} className="text-slate-300 leading-relaxed text-sm sm:text-base">
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
