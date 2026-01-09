import { useState, useRef } from 'react';
import { MapPin, Users, Star, CircleDot } from 'lucide-react';
import { Competition } from '@/lib/types';

interface CompetitionTimelineProps {
  competitions: Competition[];
  onCompetitionClick: (competition: Competition) => void;
  onSimulationStart?: (competition: Competition) => void;
  isPast?: boolean;
}

interface WeekendGroup {
  date: Date;
  day: number;
  month: string;
  monthShort: string;
  year: number;
  competitions: Competition[];
}

export function CompetitionTimeline({ 
  competitions, 
  onCompetitionClick, 
  onSimulationStart,
  isPast = false 
}: CompetitionTimelineProps) {
  const [activeWeekIndex, setActiveWeekIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const mouseStartX = useRef(0);
  const isDragging = useRef(false);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const groupByWeekend = (comps: Competition[]): WeekendGroup[] => {
    const groups: { [key: string]: Competition[] } = {};
    
    comps.forEach(comp => {
      const dateKey = comp.date.split('T')[0];
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(comp);
    });

    return Object.entries(groups)
      .map(([dateKey, comps]) => {
        const date = new Date(dateKey);
        return {
          date,
          day: date.getDate(),
          month: monthNames[date.getMonth()],
          monthShort: monthShortNames[date.getMonth()],
          year: date.getFullYear(),
          competitions: comps
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const weekendGroups = groupByWeekend(competitions);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && activeWeekIndex < weekendGroups.length - 1) {
        setActiveWeekIndex(prev => prev + 1);
      } else if (diff < 0 && activeWeekIndex > 0) {
        setActiveWeekIndex(prev => prev - 1);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseStartX.current = e.clientX;
    isDragging.current = true;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    const diff = mouseStartX.current - e.clientX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && activeWeekIndex < weekendGroups.length - 1) {
        setActiveWeekIndex(prev => prev + 1);
      } else if (diff < 0 && activeWeekIndex > 0) {
        setActiveWeekIndex(prev => prev - 1);
      }
    }
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  if (weekendGroups.length === 0) return null;

  const activeGroup = weekendGroups[activeWeekIndex];

  return (
    <div className={`w-full ${isPast ? 'opacity-50' : ''}`}>
      {/* Calendar strip - shows dates you can swipe through */}
      <div 
        className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none mb-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(calc(50% - ${activeWeekIndex * 80 + 40}px))` }}
        >
          {weekendGroups.map((group, index) => {
            const isActive = index === activeWeekIndex;
            const distance = Math.abs(index - activeWeekIndex);
            
            return (
              <button
                key={`${group.day}-${group.month}`}
                onClick={() => setActiveWeekIndex(index)}
                className={`flex-shrink-0 w-20 flex flex-col items-center py-3 transition-all duration-300 ${
                  isActive ? '' : 'opacity-40'
                }`}
                style={{
                  transform: `scale(${isActive ? 1 : Math.max(0.7, 1 - distance * 0.15)})`
                }}
              >
                <span className={`text-[10px] uppercase tracking-wider mb-1 ${
                  isActive ? 'text-blue-400' : 'text-slate-500'
                }`}>
                  {group.monthShort}
                </span>
                <span className={`text-2xl font-bold transition-colors ${
                  isActive ? 'text-white' : 'text-slate-600'
                }`}>
                  {group.day}
                </span>
                {group.competitions.length > 1 && (
                  <div className={`mt-1 flex gap-0.5`}>
                    {group.competitions.map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-blue-400' : 'bg-slate-600'}`} 
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Fade edges to hint at more content */}
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-slate-950 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-slate-950 to-transparent pointer-events-none" />
      </div>

      {/* Active date header */}
      <div className="text-center mb-4 px-4">
        <span className="text-slate-400 text-sm">
          {activeGroup?.month} {activeGroup?.day}, {activeGroup?.year}
        </span>
      </div>

      {/* Competition cards */}
      <div 
        className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${activeWeekIndex * 100}%)` }}
        >
          {weekendGroups.map((group) => (
            <div 
              key={`cards-${group.day}-${group.month}`}
              className="w-full flex-shrink-0 px-4"
            >
              <div className={`flex gap-3 ${
                group.competitions.length > 1 
                  ? 'overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide' 
                  : 'justify-center'
              }`}>
                {group.competitions.map((competition) => (
                  <div 
                    key={competition.id}
                    className={`flex-shrink-0 snap-center ${group.competitions.length > 1 ? 'w-64' : 'w-72'}`}
                  >
                    <TimelineCompetitionCard
                      competition={competition}
                      onClick={() => onCompetitionClick(competition)}
                      onSimulationStart={!isPast && onSimulationStart ? () => onSimulationStart(competition) : undefined}
                      isPast={isPast}
                    />
                  </div>
                ))}
              </div>
            </div>
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
  isPast?: boolean;
}

function TimelineCompetitionCard({ competition, onClick, onSimulationStart, isPast }: TimelineCompetitionCardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600/50 rounded-2xl p-4 cursor-pointer hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${isPast ? 'grayscale-[30%]' : ''}`}
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
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-600 mb-3 shadow-lg">
            <img
              src={competition.logo}
              alt={`${competition.name} logo`}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-3 shadow-lg">
            <span className="text-xl font-bold text-white">{competition.name.charAt(0)}</span>
          </div>
        )}

        {/* Competition name */}
        <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2">
          {competition.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-slate-400 text-xs mb-2">
          <MapPin className="h-3 w-3" />
          <span>{competition.city}</span>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1 text-slate-400">
            <Users className="h-3 w-3" />
            <span>{Array.isArray(competition.lineup) ? competition.lineup.length : 0}</span>
          </div>
          
          <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] ${
            competition.bid_status 
              ? 'bg-yellow-500/20 text-yellow-400' 
              : 'bg-slate-500/20 text-slate-500'
          }`}>
            {competition.bid_status ? (
              <Star className="h-2.5 w-2.5 fill-current" />
            ) : (
              <CircleDot className="h-2.5 w-2.5" />
            )}
            <span>{competition.bid_status ? 'Bid' : 'Non-Bid'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
