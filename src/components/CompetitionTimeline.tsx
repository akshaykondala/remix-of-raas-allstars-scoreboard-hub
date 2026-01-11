import { useState, useRef, useEffect } from 'react';
import { MapPin, Users, Star, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
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

const DOT_WIDTH = 80; // Width of each timeline dot item in pixels

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
  const [containerWidth, setContainerWidth] = useState(0);

  // Measure container width for centering calculation
  useEffect(() => {
    const updateWidth = () => {
      if (timelineRef.current) {
        setContainerWidth(timelineRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

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

  // Calculate the transform to center the active dot
  const calculateTimelineTransform = () => {
    const centerOffset = containerWidth / 2 - DOT_WIDTH / 2;
    const translateX = centerOffset - (activeWeekIndex * DOT_WIDTH);
    return translateX;
  };

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

        {/* Sliding Timeline Container */}
        <div 
          ref={timelineRef}
          className="mx-10 overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {/* Timeline content that slides */}
          <div 
            className="relative transition-transform duration-500 ease-out"
            style={{ transform: `translateX(${calculateTimelineTransform()}px)` }}
          >
            {/* Main horizontal timeline line */}
            <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-border/50 via-border to-border/50" style={{ top: '50%', width: `${weekendGroups.length * DOT_WIDTH + 200}px`, marginLeft: '-100px' }} />
            <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent blur-sm" style={{ top: '50%', width: `${weekendGroups.length * DOT_WIDTH + 200}px`, marginLeft: '-100px' }} />
            
            <div className="relative flex items-center py-6">
              {weekendGroups.map((group, index) => {
                const isActive = index === activeWeekIndex;
                const compCount = group.competitions.length;
                
                return (
                  <button
                    key={`${group.day}-${group.month}-${group.year}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveWeekIndex(index);
                    }}
                    className="relative flex flex-col items-center transition-all duration-300 focus:outline-none group"
                    style={{ width: `${DOT_WIDTH}px` }}
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

function TimelineCompetitionCard({
  competition,
  onClick,
  onSimulationStart,
  isPast
}: TimelineCompetitionCardProps) {
  const teamCount = Array.isArray(competition.lineup) ? competition.lineup.length : 0;
  
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`
        relative overflow-hidden cursor-pointer
        transition-all duration-500 ease-out group
        hover:-translate-y-2 hover:scale-[1.02]
        ${isPast ? 'opacity-60' : ''}
      `}
    >
      {/* Outer glow on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
      
      {/* Main card */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-card via-card to-card/80 border border-white/10 group-hover:border-primary/30 transition-all duration-500">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-60 group-hover:opacity-100 transition-opacity" />
        
        {/* Decorative circles */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors duration-500" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-colors duration-500" />

        {/* Content */}
        <div className="relative p-5">
          {/* Header Row */}
          <div className="flex items-start gap-4 mb-4">
            {/* Logo with fun styling */}
            <div className="relative flex-shrink-0">
              {/* Logo glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500 scale-110" />
              
              {competition.logo ? (
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-white/10 group-hover:ring-primary/50 shadow-xl transition-all duration-300 group-hover:shadow-primary/20">
                  <img
                    src={competition.logo}
                    alt={`${competition.name} logo`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center ring-2 ring-white/10 group-hover:ring-primary/50 shadow-xl transition-all duration-300">
                  <span className="text-2xl font-black text-foreground">
                    {competition.name.charAt(0)}
                  </span>
                </div>
              )}
              
              {/* Bid sparkle indicator */}
              {competition.bid_status && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <Star className="w-3 h-3 text-white fill-white" />
                </div>
              )}
            </div>

            {/* Title and location */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-black text-foreground line-clamp-2 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300">
                {competition.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1.5 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary/70" />
                <span className="text-sm font-medium truncate">{competition.city}</span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-3 mb-4">
            {/* Team count pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Users className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-bold text-foreground">{teamCount} teams</span>
            </div>
            
            {/* Bid badge */}
            {competition.bid_status && (
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
                <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
                <span className="text-xs font-bold text-yellow-400">BID</span>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-3">
            {/* Simulate button */}
            {onSimulationStart && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSimulationStart();
                }}
                className="relative flex-1 overflow-hidden bg-gradient-to-r from-primary to-accent text-primary-foreground py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Simulate
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>
            )}
            
            {/* View details button */}
            <button 
              className={`${onSimulationStart ? 'w-12' : 'flex-1'} h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 group-hover:bg-primary/10 group-hover:border-primary/30 transition-all duration-300`}
            >
              {!onSimulationStart && <span className="text-sm font-semibold text-foreground">View Details</span>}
              <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}