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
  return <div className="w-full cursor-grab active:cursor-grabbing select-none" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>
      {/* Past label if applicable */}
      {isPast && <div className="text-center mb-2" />}

      {/* Competition Weekend Timeline */}
      <div className="relative py-8 px-6">
        {/* Main horizontal timeline line */}
        <div className="absolute left-12 right-12 h-px bg-gradient-to-r from-transparent via-border/80 to-transparent" style={{ top: 'calc(50% + 12px)' }} />
        
        {/* Glow effect on line */}
        <div className="absolute left-12 right-12 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-sm" style={{ top: 'calc(50% + 12px)' }} />
        
        <div className="relative flex items-start justify-between max-w-lg mx-auto">
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
                className="relative flex flex-col items-center transition-all duration-300 focus:outline-none group z-10 min-w-[60px]"
              >
                {/* Date label */}
                <span className={`text-xs font-semibold transition-all duration-300 mb-3 ${
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
                      <div className="absolute inset-0 w-5 h-5 -m-0.5 rounded-full bg-primary/40 animate-pulse" />
                      <div className="absolute inset-0 w-7 h-7 -m-1.5 rounded-full bg-primary/20 animate-pulse" style={{ animationDelay: '150ms' }} />
                    </>
                  )}
                  
                  {/* Main weekend dot */}
                  <div className={`relative w-4 h-4 rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary shadow-lg shadow-primary/60 ring-2 ring-primary/30 ring-offset-2 ring-offset-background' 
                      : 'bg-muted-foreground/40 group-hover:bg-primary/60 group-hover:shadow-md group-hover:shadow-primary/30'
                  }`}>
                    {/* Inner shine */}
                    <div className={`absolute inset-0.5 rounded-full bg-gradient-to-br from-white/30 to-transparent ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'} transition-opacity duration-300`} />
                  </div>
                </div>
                
                {/* Competition count dots */}
                <div className={`mt-4 flex gap-1.5 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'}`}>
                  {Array.from({ length: compCount }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        isActive 
                          ? 'bg-primary shadow-sm shadow-primary/50' 
                          : 'bg-muted-foreground/50 group-hover:bg-primary/50'
                      }`}
                      style={{ transitionDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>
                
                {/* Competition count label */}
                <span className={`mt-1.5 text-[10px] font-medium transition-colors duration-300 ${
                  isActive ? 'text-primary' : 'text-muted-foreground/60 group-hover:text-muted-foreground'
                }`}>
                  {compCount} comp{compCount > 1 ? 's' : ''}
                </span>
              </button>
            );
          })}
        </div>
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
        relative overflow-hidden cursor-pointer animate-enter
        transition-all duration-500 ease-out group
        hover:-translate-y-1 hover:scale-[1.02]
        ${isPast ? 'opacity-70' : ''}
      `}
    >
      {/* Main card with glassmorphism */}
      <div className="relative rounded-2xl overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-card via-card/90 to-card/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-accent/5" />
        
        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-primary/40 transition-colors duration-500" />
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[inset_0_0_20px_rgba(14,165,233,0.15)]" />
        
        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 via-primary/5 to-transparent rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/15 via-transparent to-transparent rounded-tr-full" />

        {/* Content */}
        <div className="relative p-5">
          {/* Header with logo and simulate button */}
          <div className="flex items-start justify-between mb-4">
            {/* Logo */}
            {competition.logo ? (
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 blur-xl rounded-xl scale-90 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-16 h-16 rounded-xl overflow-hidden ring-1 ring-white/20 shadow-lg group-hover:ring-primary/50 transition-all duration-300">
                  <img
                    src={competition.logo}
                    alt={`${competition.name} logo`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center ring-1 ring-white/20 shadow-lg">
                <span className="text-xl font-bold text-foreground">
                  {competition.name.charAt(0)}
                </span>
              </div>
            )}

            {/* Simulate button */}
            {onSimulationStart && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSimulationStart();
                }}
                className="relative overflow-hidden bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-primary/40 hover:scale-105 active:scale-95"
              >
                <span className="relative z-10">Simulate</span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
              </button>
            )}
            
            {/* Bid badge (if no simulate button) */}
            {!onSimulationStart && competition.bid_status && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/30 text-xs font-bold uppercase tracking-wide backdrop-blur-sm">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span>Bid</span>
              </div>
            )}
          </div>

          {/* Competition info */}
          <div className="space-y-3">
            {/* Name */}
            <h3 className="text-lg font-bold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-300">
              {competition.name}
            </h3>

            {/* Location with icon */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                <MapPin className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-medium">{competition.city}</span>
            </div>

            {/* Bottom stats bar */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  {Array.isArray(competition.lineup) ? competition.lineup.length : 0} teams
                </span>
              </div>

              {/* Bid badge in stats (when simulate button is present) */}
              {onSimulationStart && competition.bid_status && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold">
                  <Star className="h-3 w-3 fill-current" />
                  <span>Bid</span>
                </div>
              )}
              
              {/* Arrow indicator */}
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-300">
                <svg className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}