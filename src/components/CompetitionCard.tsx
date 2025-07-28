
import { MapPin, Calendar } from 'lucide-react';
import { Competition } from '@/lib/types';

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
    <div className="w-full flex justify-start">
      <div 
        onClick={onClick}
        className="bg-slate-900 border border-slate-700 rounded-xl p-3 cursor-pointer transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:border-blue-600 w-full max-w-sm"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={competition.logo} 
              alt={`${competition.name} logo`}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-sm mb-1 truncate">
              {competition.name}
            </h3>
            
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <div className="flex items-center gap-1 min-w-0">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{competition.city}</span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(competition.date)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
