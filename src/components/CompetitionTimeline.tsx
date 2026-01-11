import { useState, useRef, useEffect } from 'react';
import { MapPin, Star, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const timelineRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Auto-scroll timeline to keep active dot centered
  useEffect(() => {
    const activeDot = dotRefs.current[activeWeekIndex];
    const container = timelineRef.current;
    
    if (activeDot && container) {
      const containerRect = container.getBoundingClientRect();
      const dotRect = activeDot.getBoundingClientRect();
      
      // Calculate the scroll position to center the dot
      const dotCenter = dotRect.left + dotRect.width / 2;
      const containerCenter = containerRect.left + containerRect.width / 2;
      const scrollOffset = dotCenter - containerCenter;
      
      container.scrollBy({
        left: scrollOffset,
        behavior: 'smooth'
      });
    }
  }, [activeWeekIndex]);

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

  const goToPrev = () => {
    if (activeWeekIndex > 0) {
      setActiveWeekIndex(prev => prev - 1);
    }
  };

  const goToNext = () => {
    if (activeWeekIndex < weekendGroups.length - 1) {
      setActiveWeekIndex(prev => prev + 1);
    }
  };

  if (weekendGroups.length === 0) return null;

  return (
    <div 
      className="w-full select-none" 
      onTouchStart={handleTouchStart} 
      onTouchMove={handleTouchMove} 
      onTouchEnd={handleTouchEnd}
    >
      {/* Competition Weekend Timeline with Navigation */}
      <div className="relative py-6 px-2">
        {/* Left Arrow */}
        <button
          onClick={goToPrev}
          disabled={activeWeekIndex === 0}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            activeWeekIndex === 0 
              ? 'opacity-30 cursor-not-allowed bg-muted/20' 
              : 'bg-primary/20 hover:bg-primary/40 text-primary hover:scale-110 cursor-pointer'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={goToNext}
          disabled={activeWeekIndex === weekendGroups.length - 1}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            activeWeekIndex === weekendGroups.length - 1 
              ? 'opacity-30 cursor-not-allowed bg-muted/20' 
              : 'bg-primary/20 hover:bg-primary/40 text-primary hover:scale-110 cursor-pointer'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Scrollable Timeline Container */}
        <div 
          ref={timelineRef}
          className="mx-10 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative min-w-max px-4">
            {/* Main horizontal timeline line */}
            <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-border/50 via-border to-border/50" style={{ top: '50%' }} />
            <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent blur-sm" style={{ top: '50%' }} />
            
            <div className="relative flex items-center gap-8 py-6">
              {weekendGroups.map((group, index) => {
                const isActive = index === activeWeekIndex;
                const compCount = group.competitions.length;
                
                return (
                  <button
                    key={`${group.day}-${group.month}-${group.year}`}
                    ref={(el) => { dotRefs.current[index] = el; }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveWeekIndex(index);
                    }}
                    className="relative flex flex-col items-center transition-all duration-300 focus:outline-none group"
                  >
                    {/* Date label */}
                    <span className={`text-xs font-bold transition-all duration-300 mb-3 whitespace-nowrap ${
                      isActive 
                        ? 'text-primary scale-110' 
                        : 'text-muted-foreground group-hover:text-foreground'
                    }`}>
                      {group.monthShort} {group.day}
                    </span>
                    
                    {/* Weekend dot container */}
                    <div className="relative">
                      {/* Outer glow for active */}
                      {isActive && (
                        <>
                          <div className="absolute inset-0 w-6 h-6 -m-1 rounded-full bg-primary/40 animate-pulse" />
                          <div className="absolute inset-0 w-8 h-8 -m-2 rounded-full bg-primary/20 animate-pulse" style={{ animationDelay: '150ms' }} />
                        </>
                      )}
                      
                      {/* Main weekend dot */}
                      <div className={`relative w-4 h-4 rounded-full transition-all duration-300 ${
                        isActive 
                          ? 'bg-primary shadow-lg shadow-primary/60 ring-2 ring-primary/30 ring-offset-2 ring-offset-background scale-125' 
                          : 'bg-muted-foreground/40 group-hover:bg-primary/60 group-hover:shadow-md group-hover:shadow-primary/30'
                      }`}>
                        <div className={`absolute inset-0.5 rounded-full bg-gradient-to-br from-white/40 to-transparent ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'} transition-opacity duration-300`} />
                      </div>
                    </div>
                    
                    {/* Competition count dots */}
                    <div className={`mt-4 flex gap-1 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'}`}>
                      {Array.from({ length: compCount }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            isActive 
                              ? 'bg-primary shadow-sm shadow-primary/50' 
                              : 'bg-muted-foreground/50 group-hover:bg-primary/50'
                          }`}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Competition cards */}
      <div className="overflow-hidden mt-2">
        <div 
          className="flex transition-transform duration-500 ease-out" 
          style={{ transform: `translateX(-${activeWeekIndex * 100}%)` }}
        >
          {weekendGroups.map(group => (
            <div key={`cards-${group.day}-${group.month}`} className="w-full flex-shrink-0 px-4">
              <div className={`flex gap-4 ${group.competitions.length > 1 ? 'overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide' : 'justify-center'}`}>
                {group.competitions.map(competition => (
                  <div key={competition.id} className={`flex-shrink-0 snap-center ${group.competitions.length > 1 ? 'w-80' : 'w-full max-w-sm'}`}>
                    <TimelineCompetitionCard 
                      competition={competition} 
                      onClick={() => onCompetitionClick(competition)} 
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
  isPast?: boolean;
}

function TimelineCompetitionCard({
  competition,
  onClick,
  isPast
}: TimelineCompetitionCardProps) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`
        relative overflow-hidden cursor-pointer rounded-2xl p-4
        bg-card/60 backdrop-blur-sm border border-border/50
        transition-all duration-300 ease-out group
        hover:bg-card/80 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10
        active:scale-[0.98]
        ${isPast ? 'opacity-50' : ''}
      `}
    >
      {/* Subtle gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />

      <div className="relative flex items-center gap-4">
        {/* Logo */}
        <div className="relative flex-shrink-0">
          {competition.logo ? (
            <div className="w-14 h-14 rounded-xl overflow-hidden ring-1 ring-border/50 group-hover:ring-primary/40 transition-all duration-300">
              <img
                src={competition.logo}
                alt={`${competition.name} logo`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-xl bg-muted/50 flex items-center justify-center ring-1 ring-border/50 group-hover:ring-primary/40 transition-all duration-300">
              <span className="text-xl font-bold text-muted-foreground">
                {competition.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-300">
            {competition.name}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{competition.city}</span>
          </div>
        </div>

        {/* Bid badge */}
        {competition.bid_status && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
            <Star className="h-3 w-3 text-primary fill-primary" />
            <span className="text-xs font-semibold text-primary">Bid</span>
          </div>
        )}
      </div>
    </div>
  );
}