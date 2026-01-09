import { useState, useRef } from 'react';
import { MapPin, Users, Star, CircleDot, ChevronLeft, ChevronRight } from 'lucide-react';
import { Competition } from '@/lib/types';

interface CompetitionTimelineProps {
  competitions: Competition[];
  onCompetitionClick: (competition: Competition) => void;
  onSimulationStart?: (competition: Competition) => void;
  isPast?: boolean;
}

interface WeekendGroup {
  date: Date;
  displayDate: string;
  weekLabel: string;
  competitions: Competition[];
}

export function CompetitionTimeline({ 
  competitions, 
  onCompetitionClick, 
  onSimulationStart,
  isPast = false 
}: CompetitionTimelineProps) {
  const [activeWeekIndex, setActiveWeekIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Group competitions by weekend (same date)
  const groupByWeekend = (comps: Competition[]): WeekendGroup[] => {
    const groups: { [key: string]: Competition[] } = {};
    
    comps.forEach(comp => {
      const dateKey = comp.date.split('T')[0]; // Get just the date part
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(comp);
    });

    return Object.entries(groups)
      .map(([dateKey, comps]) => {
        const date = new Date(dateKey);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        return {
          date,
          displayDate: `${monthNames[date.getMonth()]} ${date.getDate()}`,
          weekLabel: `Week ${getWeekNumber(date)}`,
          competitions: comps
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const getWeekNumber = (date: Date): number => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - startOfYear.getTime();
    return Math.ceil((diff / (1000 * 60 * 60 * 24) + 1) / 7);
  };

  const weekendGroups = groupByWeekend(competitions);

  const scrollToWeek = (index: number) => {
    setActiveWeekIndex(index);
    if (scrollRef.current) {
      const weekElements = scrollRef.current.querySelectorAll('[data-week]');
      if (weekElements[index]) {
        weekElements[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  };

  const handlePrev = () => {
    if (activeWeekIndex > 0) {
      scrollToWeek(activeWeekIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeWeekIndex < weekendGroups.length - 1) {
      scrollToWeek(activeWeekIndex + 1);
    }
  };

  if (weekendGroups.length === 0) return null;

  return (
    <div className="w-full">
      {/* Wheel Navigation */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={handlePrev}
          disabled={activeWeekIndex === 0}
          className="p-2 rounded-full bg-slate-800 border border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        {/* Date wheel indicators */}
        <div className="flex items-center gap-1 overflow-hidden">
          {weekendGroups.map((group, index) => {
            const isActive = index === activeWeekIndex;
            const isNear = Math.abs(index - activeWeekIndex) <= 2;
            
            if (!isNear) return null;
            
            return (
              <button
                key={group.displayDate}
                onClick={() => scrollToWeek(index)}
                className={`flex flex-col items-center transition-all duration-300 ${
                  isActive 
                    ? 'scale-110' 
                    : 'scale-90 opacity-50 hover:opacity-75'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                  isActive 
                    ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30' 
                    : 'bg-slate-800 border-slate-600'
                }`}>
                  <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                    {group.displayDate.split(' ')[1]}
                  </span>
                </div>
                <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-blue-400' : 'text-slate-500'}`}>
                  {group.displayDate.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
        
        <button
          onClick={handleNext}
          disabled={activeWeekIndex === weekendGroups.length - 1}
          className="p-2 rounded-full bg-slate-800 border border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Timeline track */}
      <div className="relative mb-6 px-4">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 transform -translate-y-1/2" />
        
        <div className="relative flex justify-between items-center">
          {weekendGroups.map((group, index) => {
            const isActive = index === activeWeekIndex;
            const isPastWeek = index < activeWeekIndex;
            
            return (
              <button
                key={group.displayDate}
                onClick={() => scrollToWeek(index)}
                className="relative flex flex-col items-center group"
              >
                {/* Competition count bubble */}
                {group.competitions.length > 1 && (
                  <div className={`absolute -top-5 text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-all ${
                    isActive ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'
                  }`}>
                    {group.competitions.length}
                  </div>
                )}
                
                {/* Timeline dot */}
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-blue-500 ring-4 ring-blue-500/30 scale-150' 
                    : isPastWeek
                      ? 'bg-slate-500'
                      : 'bg-slate-600 group-hover:bg-slate-500'
                }`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Competition cards for active week */}
      <div 
        ref={scrollRef}
        className="overflow-hidden"
      >
        <div className="px-4" data-week>
          <div className="text-center mb-4">
            <h4 className="text-white font-bold text-lg">
              {weekendGroups[activeWeekIndex]?.displayDate}, {weekendGroups[activeWeekIndex]?.date.getFullYear()}
            </h4>
            <p className="text-slate-400 text-sm">
              {weekendGroups[activeWeekIndex]?.competitions.length} Competition{weekendGroups[activeWeekIndex]?.competitions.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Competition cards in a flex/grid layout */}
          <div className={`flex gap-4 ${
            weekendGroups[activeWeekIndex]?.competitions.length > 1 
              ? 'overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide' 
              : 'justify-center'
          }`}>
            {weekendGroups[activeWeekIndex]?.competitions.map((competition) => (
              <div 
                key={competition.id}
                className="flex-shrink-0 snap-center w-72"
              >
                <TimelineCompetitionCard
                  competition={competition}
                  onClick={() => onCompetitionClick(competition)}
                  onSimulationStart={!isPast && onSimulationStart ? () => onSimulationStart(competition) : undefined}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Week counter */}
      <div className="flex justify-center mt-4">
        <div className="flex items-center gap-1">
          {weekendGroups.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === activeWeekIndex ? 'bg-blue-500 w-6' : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface TimelineCompetitionCardProps {
  competition: Competition;
  onClick: () => void;
  onSimulationStart?: () => void;
}

function TimelineCompetitionCard({ competition, onClick, onSimulationStart }: TimelineCompetitionCardProps) {
  return (
    <div
      onClick={onClick}
      className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600/50 rounded-2xl p-4 cursor-pointer hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
    >
      {/* Simulate button */}
      {onSimulationStart && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSimulationStart();
          }}
          className="absolute top-3 right-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs transition-colors font-semibold z-10"
        >
          Simulate
        </button>
      )}

      <div className="flex flex-col items-center text-center">
        {/* Competition logo */}
        {competition.logo ? (
          <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-slate-600 mb-3 shadow-lg">
            <img
              src={competition.logo}
              alt={`${competition.name} logo`}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-3 shadow-lg">
            <span className="text-2xl font-bold text-white">{competition.name.charAt(0)}</span>
          </div>
        )}

        {/* Competition name */}
        <h3 className="text-base font-semibold text-white mb-2 line-clamp-2">
          {competition.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-slate-400 text-xs mb-3">
          <MapPin className="h-3 w-3" />
          <span>{competition.city}</span>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1 text-slate-400">
            <Users className="h-3.5 w-3.5" />
            <span>{Array.isArray(competition.lineup) ? competition.lineup.length : 0}</span>
          </div>
          
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
            competition.bid_status 
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30' 
              : 'bg-slate-500/20 text-slate-500 border border-slate-500/30'
          }`}>
            {competition.bid_status ? (
              <Star className="h-3 w-3 fill-current" />
            ) : (
              <CircleDot className="h-3 w-3" />
            )}
            <span>{competition.bid_status ? 'Bid' : 'Non-Bid'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
