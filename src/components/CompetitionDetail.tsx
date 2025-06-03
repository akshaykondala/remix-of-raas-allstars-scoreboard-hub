
import { X, Trophy, Users, Eye, Camera } from 'lucide-react';
import { Competition } from './CompetitionsTab';

interface CompetitionDetailProps {
  competition: Competition;
  onClose: () => void;
}

export function CompetitionDetail({ competition, onClose }: CompetitionDetailProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden">
              <img 
                src={competition.logo} 
                alt={`${competition.name} logo`}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{competition.name}</h2>
              <p className="text-slate-400 text-sm">{competition.city}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Date */}
          <div>
            <h3 className="text-white font-semibold mb-2">Date</h3>
            <p className="text-slate-300">{formatDate(competition.date)}</p>
          </div>

          {/* Lineup */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-400" />
              Lineup ({competition.lineup.length} teams)
            </h3>
            <div className="grid gap-2">
              {competition.lineup.map((team, index) => (
                <div key={index} className="bg-slate-800 rounded-lg px-3 py-2 text-slate-300 text-sm">
                  {team}
                </div>
              ))}
            </div>
          </div>

          {/* Placings */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-400" />
              Top 3 Placings
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-600/20 to-yellow-400/10 rounded-lg px-3 py-2 border border-yellow-600/30">
                <div className="w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                <span className="text-white font-semibold">{competition.placings.first}</span>
              </div>
              <div className="flex items-center gap-3 bg-gradient-to-r from-slate-500/20 to-slate-400/10 rounded-lg px-3 py-2 border border-slate-500/30">
                <div className="w-6 h-6 bg-slate-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                <span className="text-white font-semibold">{competition.placings.second}</span>
              </div>
              <div className="flex items-center gap-3 bg-gradient-to-r from-orange-600/20 to-orange-400/10 rounded-lg px-3 py-2 border border-orange-600/30">
                <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                <span className="text-white font-semibold">{competition.placings.third}</span>
              </div>
            </div>
          </div>

          {/* Judges */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Eye className="h-4 w-4 text-purple-400" />
              Judges
            </h3>
            <div className="grid gap-2">
              {competition.judges.map((judge, index) => (
                <div key={index} className="bg-slate-800 rounded-lg px-3 py-2 text-slate-300 text-sm">
                  {judge}
                </div>
              ))}
            </div>
          </div>

          {/* Media */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Camera className="h-4 w-4 text-green-400" />
              Media
            </h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-slate-400 text-sm mb-2">Photos</h4>
                <div className="grid grid-cols-2 gap-2">
                  {competition.media.photos.map((photo, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                      <img 
                        src={`https://images.unsplash.com/${photo}?w=200&h=200&fit=crop&crop=center`}
                        alt={`Competition photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {competition.media.videos.length > 0 && (
                <div>
                  <h4 className="text-slate-400 text-sm mb-2">Videos</h4>
                  <div className="text-slate-500 text-sm">Videos coming soon...</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
