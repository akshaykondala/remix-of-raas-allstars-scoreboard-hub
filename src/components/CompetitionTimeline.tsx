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
    <div className={`w-full ${isPast ? 'opacity-40' : ''}`}>
      {/* Minimal calendar strip */}
      <div 
        className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className="flex transition-transform duration-300 ease-out py-6"
          style={{ transform: `translateX(calc(50% - ${activeWeekIndex * 72 + 36}px))` }}
        >
          {weekendGroups.map((group, index) => {
            const isActive = index === activeWeekIndex;
            const distance = Math.abs(index - activeWeekIndex);
            
            return (
              <button
                key={`${group.day}-${group.month}`}
                onClick={() => setActiveWeekIndex(index)}
                className={`flex-shrink-0 w-[72px] flex flex-col items-center transition-all duration-300`}
                style={{
                  opacity: isActive ? 1 : Math.max(0.25, 1 - distance * 0.25),
                  transform: `scale(${isActive ? 1 : Math.max(0.75, 1 - distance * 0.1)})`
                }}
              >
                <span className={`text-[10px] uppercase tracking-widest transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {group.monthShort}
                </span>
                <span className={`text-3xl font-light tracking-tight transition-colors ${
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {group.day}
                </span>
                {group.competitions.length > 1 && (
                  <div className="mt-1.5 flex gap-1">
                    {group.competitions.map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1 h-1 rounded-full transition-colors ${
                          isActive ? 'bg-primary' : 'bg-muted-foreground/50'
                        }`} 
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Thin separator line */}
      <div className="w-16 h-px bg-border mx-auto mb-6" />

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
      className={`relative bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-primary/30 transition-all duration-200 ${isPast ? 'opacity-60' : ''}`}
    >
      {/* Simulate button */}
      {onSimulationStart && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSimulationStart();
          }}
          className="absolute top-3 right-3 bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1 rounded-md text-xs transition-colors font-medium z-10"
        >
          Simulate
        </button>
      )}

      <div className="flex flex-col items-center text-center">
        {/* Competition logo */}
        {competition.logo ? (
          <div className="w-14 h-14 rounded-full overflow-hidden border border-border mb-3">
            <img
              src={competition.logo}
              alt={`${competition.name} logo`}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <span className="text-lg font-medium text-primary">{competition.name.charAt(0)}</span>
          </div>
        )}

        {/* Competition name */}
        <h3 className="text-sm font-medium text-foreground mb-1 line-clamp-2">
          {competition.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-muted-foreground text-xs mb-2">
          <MapPin className="h-3 w-3" />
          <span>{competition.city}</span>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>{Array.isArray(competition.lineup) ? competition.lineup.length : 0}</span>
          </div>
          
          {competition.bid_status && (
            <div className="flex items-center gap-1 text-amber-500 text-[10px]">
              <Star className="h-2.5 w-2.5 fill-current" />
              <span>Bid</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
