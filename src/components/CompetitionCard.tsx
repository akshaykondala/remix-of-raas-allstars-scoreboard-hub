
import { MapPin, Calendar, Users } from 'lucide-react';
import { Competition } from './CompetitionsTab';

interface CompetitionCardProps {
  competition: Competition;
  onClick: () => void;
}

export function CompetitionCard({ competition, onClick }: CompetitionCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div 
      onClick={onClick}
      className="bg-slate-900 border border-slate-700 rounded-xl p-4 cursor-pointer transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:border-blue-600"
    >
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
          <img 
            src={competition.logo} 
            alt={`${competition.name} logo`}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-lg mb-1 truncate">
            {competition.name}
          </h3>
          
          <div className="flex items-center gap-4 text-sm text-slate-400 mb-2">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{competition.city}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(competition.date)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-slate-300">
            <Users className="h-3 w-3 text-blue-400" />
            <span>{competition.lineup.length} teams</span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xs text-slate-400 mb-1">Winner</div>
          <div className="text-white font-semibold text-sm">
            {competition.placings.first}
          </div>
        </div>
      </div>
    </div>
  );
}
