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
    const groups: {
      [key: string]: Competition[];
    } = {};
    comps.forEach(comp => {
      const dateKey = comp.date.split('T')[0];
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(comp);
    });
    return Object.entries(groups).map(([dateKey, comps]) => {
      const date = new Date(dateKey);
      return {
        date,
        day: date.getDate(),
        month: monthNames[date.getMonth()],
        monthShort: monthShortNames[date.getMonth()],
        year: date.getFullYear(),
        competitions: comps
      };
    }).sort((a, b) => a.date.getTime() - b.date.getTime());
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
  const getDayOfWeek = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };
  return <div className="w-full cursor-grab active:cursor-grabbing select-none" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>
      {/* Past label if applicable */}
      {isPast && <div className="text-center mb-2">
          
        </div>}

      {/* Calendar strip - clean minimal design */}
      <div className="flex items-center justify-center gap-6 py-4">
        {weekendGroups.map((group, index) => {
          const isActive = index === activeWeekIndex;
          const distance = Math.abs(index - activeWeekIndex);
          
          // Only show nearby dates for cleaner look
          if (distance > 2) return null;
          
          return (
            <button
              key={`${group.day}-${group.month}-${group.year}`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveWeekIndex(index);
              }}
              className="flex flex-col items-center transition-all duration-300 focus:outline-none"
              style={{
                opacity: isActive ? 1 : 0.4 - distance * 0.1,
              }}
            >
              <span className={`text-xs uppercase tracking-widest font-medium mb-1 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {group.monthShort}
              </span>
              <span className={`text-2xl font-bold transition-all ${isActive ? 'text-foreground scale-110' : 'text-muted-foreground'}`}>
                {group.day}
              </span>
              {isActive && group.competitions.length > 1 && (
                <div className="mt-1.5 flex gap-1">
                  {group.competitions.map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-primary" />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Competition cards */}
      <div className="overflow-hidden mt-4">
        <div className="flex transition-transform duration-300 ease-out" style={{
        transform: `translateX(-${activeWeekIndex * 100}%)`
      }}>
          {weekendGroups.map(group => <div key={`cards-${group.day}-${group.month}`} className="w-full flex-shrink-0 px-4">
              <div className={`flex gap-4 ${group.competitions.length > 1 ? 'overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide' : 'justify-center'}`}>
                {group.competitions.map(competition => <div key={competition.id} className={`flex-shrink-0 snap-center ${group.competitions.length > 1 ? 'w-72' : 'w-80'}`}>
                    <TimelineCompetitionCard competition={competition} onClick={() => onCompetitionClick(competition)} onSimulationStart={!isPast && onSimulationStart ? () => onSimulationStart(competition) : undefined} isPast={isPast} />
                  </div>)}
              </div>
            </div>)}
        </div>
      </div>
    </div>;
}
interface TimelineCompetitionCardProps {
  competition: Competition;
  onClick: () => void;
  onSimulationStart?: () => void;
  isPast?: boolean;
}
function TimelineCompetitionCard({
  competition,
  onClick,
  onSimulationStart,
  isPast
}: TimelineCompetitionCardProps) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`
        relative overflow-hidden rounded-3xl p-6 cursor-pointer
        transition-all duration-300 ease-out
        bg-gradient-to-b from-white/10 to-white/[0.02]
        backdrop-blur-sm
        border border-white/10
        hover:border-white/20 hover:from-white/15 hover:to-white/[0.05]
        hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20
        ${isPast ? 'opacity-60' : ''}
      `}
    >
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Simulate button */}
      {onSimulationStart && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSimulationStart();
          }}
          className="absolute top-4 right-4 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-200 hover:scale-105 shadow-lg shadow-primary/30"
        >
          Simulate
        </button>
      )}

      <div className="relative flex flex-col items-center text-center">
        {/* Competition logo */}
        {competition.logo ? (
          <div className="w-20 h-20 rounded-2xl overflow-hidden mb-5 ring-2 ring-white/20 shadow-xl">
            <img
              src={competition.logo}
              alt={`${competition.name} logo`}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center mb-5 ring-2 ring-white/20 shadow-xl">
            <span className="text-2xl font-bold text-white">{competition.name.charAt(0)}</span>
          </div>
        )}

        {/* Competition name */}
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight">
          {competition.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-2 text-white/70 text-sm mb-4">
          <MapPin className="h-4 w-4" />
          <span className="font-medium">{competition.city}</span>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-5 text-sm">
          <div className="flex items-center gap-2 text-white/60">
            <Users className="h-4 w-4" />
            <span className="font-semibold">{Array.isArray(competition.lineup) ? competition.lineup.length : 0} teams</span>
          </div>
          
          {competition.bid_status && (
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wide">
              <Star className="h-4 w-4 fill-current" />
              <span>Bid</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}