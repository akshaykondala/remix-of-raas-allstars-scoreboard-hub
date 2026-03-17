import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Trophy, Users, Eye, Calendar, Clock, Instagram, ExternalLink, ChevronDown, Ticket, PartyPopper, Play, X, Crown } from 'lucide-react';
import { Competition, SimulationData, Team } from '../lib/types';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { isCurrentlyLive } from '@/lib/utils';
import { buildRankMap } from '@/lib/sorting';

function getInstagramEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/instagram\.com\/(?:reel|p)\/([\w-]+)/);
  if (!match) return null;
  return `https://www.instagram.com/reel/${match[1]}/embed/`;
}
interface CompetitionDetailProps {
  competition: Competition;
  onClose: () => void;
  onSimulationSet?: (competitionName: string, competitionId: string, predictions: {
    first: string;
    second: string;
    third: string;
  }) => void;
  simulationData?: SimulationData;
  teams?: Team[];
  onTeamClick?: (team: Team) => void;
  zIndex?: number;
  rankingMap?: Map<string, number>;
}
interface SimulationDropdownProps {
  teams: Array<{
    id: string | number;
    name: string;
  }>;
  selectedTeam: string;
  onSelect: (team: string) => void;
  placeholder: string;
  position: 'first' | 'second' | 'third';
}
function SimulationDropdown({
  teams,
  selectedTeam,
  onSelect,
  placeholder,
  position
}: SimulationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const getBackgroundColor = () => {
    switch (position) {
      case 'first':
        return 'from-yellow-600/20 to-yellow-400/10 border-yellow-600/30';
      case 'second':
        return 'from-slate-500/20 to-slate-400/10 border-slate-500/30';
      case 'third':
        return 'from-orange-600/20 to-orange-400/10 border-orange-600/30';
    }
  };
  const getNumberColor = () => {
    switch (position) {
      case 'first':
        return 'bg-yellow-600';
      case 'second':
        return 'bg-slate-500';
      case 'third':
        return 'bg-orange-600';
    }
  };
  return <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className={`w-full flex items-center gap-3 bg-gradient-to-r ${getBackgroundColor()} rounded-lg px-3 py-3 border text-left min-h-[48px]`}>
        <div className={`w-6 h-6 ${getNumberColor()} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
          {position === 'first' ? '1' : position === 'second' ? '2' : '3'}
        </div>
        <span className="text-white font-semibold flex-1 truncate text-sm">
          {(() => {
          const team = teams.find(t => t.id === selectedTeam);
          if (!team) return placeholder;
          return team.name || placeholder;
        })()}
        </span>
        <ChevronDown className={`h-4 w-4 text-white transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
          {teams.map(team => <button key={team.id} onClick={() => {
        onSelect(String(team.id));
        setIsOpen(false);
      }} className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-sm truncate">
              {team.name}
            </button>)}
        </div>}
    </div>;
}
export function CompetitionDetail({
  competition,
  onClose,
  onSimulationSet,
  simulationData,
  teams = [],
  onTeamClick,
  rankingMap = new Map()
}: CompetitionDetailProps) {
  const [predictions, setPredictions] = useState<{
    first: string;
    second: string;
    third: string;
  }>({
    first: '',
    second: '',
    third: ''
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [open, setOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Use rankingMap passed from parent (single source of truth)

  const snapScrollTop = () => {
    const el = scrollRef.current;
    if (el && el.scrollTop > 0 && el.scrollTop < 3) {
      el.scrollTop = 0;
    }
  };

  const handleTouchStart = () => {
    snapScrollTop();
  };

  const handleScroll = () => {
    snapScrollTop();
  };
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setOpen(false);
      // Delay the onClose to allow animation to complete
      setTimeout(onClose, 150);
    }
  };

  // Settable current date for testing; switch to `new Date()` for production
  const CURRENT_DATE = new Date();
  const isLive = isCurrentlyLive(competition.date, competition.time);
  const formatTime = (time?: string): string => {
    if (!time) return 'TBA';
    // Strip date prefix if Directus returned a full ISO datetime
    const t = time.includes('T') ? time.split('T')[1] : time;
    // Already in 12-hour format (contains AM/PM) — just normalize it
    if (/AM|PM/i.test(t)) {
      const match = t.match(/^(\d{1,2}:\d{2})\s*(AM|PM)/i);
      return match ? `${match[1]} ${match[2].toUpperCase()}` : t;
    }
    // 24-hour format: convert to 12-hour AM/PM
    const match24 = t.match(/^(\d{1,2}):(\d{2})/);
    if (!match24) return t;
    let hours = parseInt(match24[1], 10);
    const minutes = match24[2];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const isFutureCompetition = (() => {
    if (!competition.date) return true; // No date = assume future/upcoming
    const [year, month, day] = competition.date.split('-').map(Number);
    const compDate = new Date(year, month - 1, day);
    return compDate > CURRENT_DATE;
  })();
  useEffect(() => {
    if (simulationData?.[competition.id]) {
      setPredictions(simulationData[competition.id].predictions);
    } else {
      setPredictions({
        first: '',
        second: '',
        third: ''
      });
    }
  }, [simulationData, competition]);
  const handlePredictionChange = (position: 'first' | 'second' | 'third', team: string) => {
    setPredictions(prev => ({
      ...prev,
      [position]: team
    }));
  };
  const detailLineupSize = Array.isArray(competition.lineup) ? competition.lineup.length : 0;
  const detailHasThirdPlace = detailLineupSize > 6;

  const handleSaveSimulation = () => {
    if (predictions.first && predictions.second && (detailHasThirdPlace ? predictions.third : true) && onSimulationSet) {
      onSimulationSet(competition.name, competition.id, predictions);
      setShowSuccessMessage(true);
      setTimeout(() => {
        handleOpenChange(false);
        setShowSuccessMessage(false);
      }, 1500);
    }
  };
  const handleTeamClick = useCallback((teamId: string | number) => {
    const team = teams.find(t => t.id === String(teamId) || t.id === teamId);
    if (team && onTeamClick) {
      onTeamClick(team);
    }
  }, [teams, onTeamClick]);

  const canSaveSimulation = predictions.first && predictions.second && (detailHasThirdPlace ? predictions.third : true) && predictions.first !== predictions.second && (!detailHasThirdPlace || (predictions.first !== predictions.third && predictions.second !== predictions.third));

  const getAvailableTeams = useCallback((position: 'first' | 'second' | 'third') => {
    const lineup = competition.lineup || [];
    const toTeam = (team: any) => ({
      id: typeof team.id === 'string' ? team.id : String(team.id),
      name: team.name || `Team ${team.id}`
    });
    switch (position) {
      case 'first':
        return lineup.map(toTeam);
      case 'second':
        return lineup.filter(team => {
          const teamId = typeof team.id === 'string' ? team.id : String(team.id);
          return teamId !== predictions.first;
        }).map(toTeam);
      case 'third':
        return lineup.filter(team => {
          const teamId = typeof team.id === 'string' ? team.id : String(team.id);
          return teamId !== predictions.first && teamId !== predictions.second;
        }).map(toTeam);
      default:
        return lineup.map(toTeam);
    }
  }, [competition.lineup, predictions.first, predictions.second]);

  const getPlacingTeam = useCallback((teamId: string | number) => {
    if (!teamId || !teams.length) return null;
    return teams.find(team => team.id === String(teamId) || team.id === teamId);
  }, [teams]);

  const firstPlaceTeam = useMemo(() => getPlacingTeam(competition.firstplace), [getPlacingTeam, competition.firstplace]);
  const secondPlaceTeam = useMemo(() => getPlacingTeam(competition.secondplace), [getPlacingTeam, competition.secondplace]);
  const thirdPlaceTeam = useMemo(() => getPlacingTeam(competition.thirdplace), [getPlacingTeam, competition.thirdplace]);
  return <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700/50 h-[98vh] max-h-[98vh] rounded-t-3xl">
        {/* Drag Handle - already included in DrawerContent */}
        
        <div ref={scrollRef} onScroll={handleScroll} onTouchStart={handleTouchStart} className="overflow-y-auto flex-1 scrollbar-hide">
          {/* Modern Header with Hero Profile */}
          <DrawerHeader className={`relative p-6 pb-4 pt-[44px] px-[22px] ${isLive ? 'bg-gradient-to-br from-red-600/25 via-red-500/15 to-transparent' : 'bg-gradient-to-br from-purple-600/20 via-blue-600/15 to-transparent'}`}>
            {/* Hero Competition Presentation */}
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Large Competition Logo — static, no animations */}
              <div className="relative">
                {competition.logo ? <div className={`w-20 h-20 rounded-2xl overflow-hidden shadow-2xl border-2 ${isLive ? 'border-red-400/50' : competition.ras ? 'border-amber-400/50' : 'border-white/20'}`}>
                    <img src={competition.logo} alt={competition.name} className="w-full h-full object-cover" />
                  </div> : <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl border-2 ${isLive ? 'bg-gradient-to-br from-red-500 to-orange-600 border-red-400/50' : competition.ras ? 'bg-gradient-to-br from-amber-400 to-purple-600 border-amber-400/50' : 'bg-gradient-to-br from-purple-500 to-blue-600 border-white/20'}`}>
                    <Trophy className="h-10 w-10 text-white" />
                  </div>}
              </div>
              
              {/* Competition Name & Info */}
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <DrawerTitle className={`text-2xl font-black bg-gradient-to-r bg-clip-text text-transparent ${isLive ? 'from-white via-red-100 to-orange-100' : 'from-white via-purple-100 to-blue-100'}`}>
                    {competition.name}
                  </DrawerTitle>
                </div>
                
                {/* Elegant flowing info text */}
                <p className="text-white/70 text-sm font-medium tracking-wide">
                  {competition.city && <span>{competition.city}</span>}
                  {competition.city && ' · '}
                  <span>{formatDate(competition.date)}</span>
                </p>
                
                {/* Secondary info line */}
                <p className="text-white/50 text-xs tracking-wider uppercase">
                  <span className={competition.bid_status ? 'text-amber-400/90' : 'text-slate-400'}>
                    {competition.bid_status ? 'Bid Competition' : 'Non-Bid'}
                  </span>
                  <span className="mx-2 text-white/30">•</span>
                  <span className={isLive ? 'text-red-400/90' : isFutureCompetition ? 'text-blue-400/90' : 'text-emerald-400/90'}>
                    {isLive ? 'Live Now' : isFutureCompetition ? 'Upcoming' : 'Completed'}
                  </span>
                </p>
              </div>
            </div>
          </DrawerHeader>

          {/* Quick Info Section */}
          <div className="px-4 pb-4 py-[24px]">
            <div className="flex flex-col gap-2">
              {/* Competition Time */}
              {isLive ? (
                /* LIVE NOW state */
                competition.livestreamLink ? (
                  <a
                    href={competition.livestreamLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-gradient-to-r from-red-500/30 to-red-600/20 border-2 border-red-400/60 rounded-xl px-4 py-3 hover:from-red-500/40 hover:to-red-600/30 transition-all duration-200 cursor-pointer shadow-lg shadow-red-500/20"
                  >
                    <div className="bg-red-500/30 rounded-full p-2">
                      <div className="w-4 h-4 rounded-full bg-red-400 animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <div className="text-red-200 font-bold text-sm flex items-center gap-1.5">
                        <span className="animate-pulse">●</span> LIVE NOW
                      </div>
                      <div className="text-red-400/80 text-xs">{formatTime(competition.time)} · Watch Live →</div>
                    </div>
                    <ExternalLink className="h-3 w-3 text-red-300" />
                  </a>
                ) : (
                  <div className="flex items-center gap-3 bg-gradient-to-r from-red-500/20 to-red-600/10 border-2 border-red-400/50 rounded-xl px-4 py-3 shadow-lg shadow-red-500/15">
                    <div className="bg-red-500/20 rounded-full p-2">
                      <div className="w-4 h-4 rounded-full bg-red-400 animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <div className="text-red-200 font-bold text-sm flex items-center gap-1.5">
                        <span className="animate-pulse">●</span> LIVE NOW
                      </div>
                      <div className="text-red-400/70 text-xs">{formatTime(competition.time)} · {competition.timezone || 'Local time'}</div>
                    </div>
                  </div>
                )
              ) : competition.livestreamLink ? (
                <a 
                  href={competition.livestreamLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-gradient-to-r from-red-500/20 to-red-600/10 border border-red-400/30 rounded-xl px-4 py-3 hover:from-red-500/30 hover:to-red-600/20 transition-all duration-200 cursor-pointer"
                >
                  <div className="bg-red-500/20 rounded-full p-2">
                    <Clock className="h-4 w-4 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-red-300 font-semibold text-sm">
                      {formatTime(competition.time)}
                    </div>
                    <div className="text-red-400/70 text-xs">
                      {competition.timezone || 'Time zone TBA'} • Watch Live
                    </div>
                  </div>
                  <ExternalLink className="h-3 w-3 text-red-400/70" />
                </a>
              ) : (
                <div className="flex items-center gap-3 bg-slate-800/40 border border-slate-700/50 rounded-xl px-4 py-3">
                  <div className="bg-purple-500/20 rounded-full p-2">
                    <Clock className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-semibold text-sm">
                      {formatTime(competition.time)}
                    </div>
                    <div className="text-slate-400 text-xs">
                      {competition.timezone || 'Time zone TBA'}
                    </div>
                  </div>
                </div>
              )}

              {/* Ticket Links Row */}
              <div className="grid grid-cols-2 gap-2">
                {/* Show Tickets */}
                <a href={competition.showTicketsLink || '#'} target="_blank" rel="noopener noreferrer" onClick={e => !competition.showTicketsLink && e.preventDefault()} className={`flex items-center gap-2 rounded-xl px-3 py-3 transition-all duration-200 ${competition.showTicketsLink ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/10 border border-blue-400/30 hover:from-blue-500/30 hover:to-blue-600/20 cursor-pointer' : 'bg-slate-800/30 border border-slate-700/30 opacity-50 cursor-not-allowed'}`}>
                  <div className={`rounded-full p-1.5 ${competition.showTicketsLink ? 'bg-blue-500/20' : 'bg-slate-600/20'}`}>
                    <Ticket className={`h-4 w-4 ${competition.showTicketsLink ? 'text-blue-400' : 'text-slate-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-xs ${competition.showTicketsLink ? 'text-blue-300' : 'text-slate-500'}`}>
                      Show Tickets
                    </div>
                  </div>
                  {competition.showTicketsLink && <ExternalLink className="h-3 w-3 text-blue-400/70" />}
                </a>

                {/* Afterparty Tickets */}
                <a href={competition.afterpartyTicketsLink || '#'} target="_blank" rel="noopener noreferrer" onClick={e => !competition.afterpartyTicketsLink && e.preventDefault()} className={`flex items-center gap-2 rounded-xl px-3 py-3 transition-all duration-200 ${competition.afterpartyTicketsLink ? 'bg-gradient-to-r from-pink-500/20 to-pink-600/10 border border-pink-400/30 hover:from-pink-500/30 hover:to-pink-600/20 cursor-pointer' : 'bg-slate-800/30 border border-slate-700/30 opacity-50 cursor-not-allowed'}`}>
                  <div className={`rounded-full p-1.5 ${competition.afterpartyTicketsLink ? 'bg-pink-500/20' : 'bg-slate-600/20'}`}>
                    <PartyPopper className={`h-4 w-4 ${competition.afterpartyTicketsLink ? 'text-pink-400' : 'text-slate-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-xs ${competition.afterpartyTicketsLink ? 'text-pink-300' : 'text-slate-500'}`}>
                      AP Tickets
                    </div>
                  </div>
                  {competition.afterpartyTicketsLink && <ExternalLink className="h-3 w-3 text-pink-400/70" />}
                </a>
              </div>

              {/* Watch Show Video Link - Past Competitions Only */}
              {!isFutureCompetition && !isLive && (
                <a
                  href={competition.videoLink || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => !competition.videoLink && e.preventDefault()}
                  className={`flex items-center gap-2 rounded-xl px-3 py-3 transition-all duration-200 ${
                    competition.videoLink
                      ? 'bg-gradient-to-r from-green-500/20 to-green-600/10 border border-green-400/30 hover:from-green-500/30 hover:to-green-600/20 cursor-pointer'
                      : 'bg-slate-800/30 border border-slate-700/30 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className={`rounded-full p-1.5 ${competition.videoLink ? 'bg-green-500/20' : 'bg-slate-600/20'}`}>
                    <Play className={`h-4 w-4 ${competition.videoLink ? 'text-green-400' : 'text-slate-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-xs ${competition.videoLink ? 'text-green-300' : 'text-slate-500'}`}>
                      Watch Show
                    </div>
                  </div>
                  {competition.videoLink && <ExternalLink className="h-3 w-3 text-green-400/70" />}
                </a>
              )}
            </div>
          </div>

          {(() => {
            const igUrl = getInstagramEmbedUrl(competition.videoLink) || getInstagramEmbedUrl(competition.livestreamLink);
            if (igUrl && open) {
              return (
                <div className="flex justify-center px-4 pb-6">
                  <div className="w-full max-w-[400px] rounded-2xl overflow-hidden border border-slate-600/40">
                    <iframe
                      src={igUrl}
                      className="w-full border-0"
                      style={{ aspectRatio: '9/16', minHeight: '600px' }}
                      allowFullScreen
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                      title="Instagram Reel"
                    />
                  </div>
                </div>
              );
            }

            // RAS fallback removed — nationals now renders full layout

            return (
              <>
                {/* Lineup Section */}
                <div className="px-4 pb-4">
                  {competition.ras ? (
                    <>
                      <h3 className="text-base font-bold text-white mb-3 flex items-center">
                        <div className="bg-amber-500/20 rounded-full p-1.5 mr-2">
                          <Trophy className="h-3.5 w-3.5 text-amber-400" />
                        </div>
                        <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                          Nationals Lineup
                        </span>
                        <span className="ml-2 text-xs text-amber-400/60 font-medium">
                          {(competition.lineup || []).length} Teams
                        </span>
                      </h3>
                      <div className="bg-gradient-to-br from-amber-900/20 via-slate-800/50 to-amber-900/10 border border-amber-500/20 rounded-xl p-3 shadow-lg shadow-amber-500/5">
                        <div className="grid gap-2">
                          {(() => {
                            // Sort lineup by bid points descending
                            const sortedLineup = [...(competition.lineup || [])].sort((a, b) => {
                              const aId = typeof a.id === 'object' ? (a.id as any).id : String(a.id);
                              const bId = typeof b.id === 'object' ? (b.id as any).id : String(b.id);
                              const aTeam = teams.find(t => t.id === aId);
                              const bTeam = teams.find(t => t.id === bId);
                              return (bTeam?.bidPoints || 0) - (aTeam?.bidPoints || 0);
                            });
                            return sortedLineup.map((team, index) => {
                              const teamIdStr = typeof team.id === 'object' ? (team.id as any).id : String(team.id);
                              const fullTeam = teams.find(t => t.id === teamIdStr);
                              const bidPoints = fullTeam?.bidPoints || 0;
                              return (
                                <div
                                  key={index}
                                  onClick={() => handleTeamClick(teamIdStr)}
                                  className="flex items-center gap-3 bg-gradient-to-r from-amber-500/10 to-transparent border-l-2 border-amber-400/40 rounded-lg px-3 py-3 text-slate-300 cursor-pointer hover:from-amber-500/20 hover:to-amber-400/5 transition-all duration-200 active:scale-[0.98]"
                                >
                                  {/* Rank number */}
                                  <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-300 text-xs font-bold flex-shrink-0 ring-1 ring-amber-400/30">
                                    {index + 1}
                                  </div>
                                  {/* Team logo */}
                                  {fullTeam?.logo ? (
                                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-amber-400/30">
                                      <img src={fullTeam.logo} alt={team.name} className="w-full h-full object-cover" />
                                    </div>
                                  ) : (
                                    <div className="w-8 h-8 bg-amber-600/20 rounded-full flex items-center justify-center text-sm font-bold text-amber-300 flex-shrink-0 ring-2 ring-amber-400/30">
                                      {(team.name || 'T').charAt(0)}
                                    </div>
                                  )}
                                  {/* Team name */}
                                  <span className="font-semibold text-sm text-white truncate flex-1">
                                    {team.name || `Team ${team.id}`}
                                  </span>
                                  {/* Qualified badge */}
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/70 flex-shrink-0">
                                    Qualified
                                  </span>
                                  {/* Bid points */}
                                  <span className="text-xs font-bold bg-amber-500/20 text-amber-300 rounded-full px-2 py-0.5 ring-1 ring-amber-400/20 flex-shrink-0">
                                    {bidPoints} pts
                                  </span>
                                </div>
                              );
                            });
                          })()}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-base font-bold text-white mb-3 flex items-center">
                        <div className="bg-purple-500/20 rounded-full p-1.5 mr-2">
                          <Users className="h-3.5 w-3.5 text-purple-400" />
                        </div>
                        Competition Lineup
                      </h3>
                      <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-600/40 rounded-xl p-3">
                        <div className="grid gap-1.5">
                          {(() => {
                            const rankMap = buildRankMap(teams, rankingMap);
                            return (competition.lineup || []).map((team, index) => {
                              const teamIdStr = typeof team.id === 'object' ? (team.id as any).id : String(team.id);
                              const fullTeam = teams.find(t => t.id === teamIdStr);
                              const rank = rankMap.get(teamIdStr);
                              return (
                                <div key={index} onClick={() => handleTeamClick(teamIdStr)} className="flex items-center gap-2 bg-slate-700/30 rounded-lg px-2.5 py-2 text-slate-300 text-sm cursor-pointer hover:bg-slate-600/50 transition-colors active:scale-[0.98]">
                                  {fullTeam?.logo ? (
                                    <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-slate-500/50">
                                      <img src={fullTeam.logo} alt={team.name} className="w-full h-full object-cover" />
                                    </div>
                                  ) : (
                                    <div className="w-6 h-6 bg-slate-600/50 rounded-full flex items-center justify-center text-xs font-bold text-slate-400 flex-shrink-0">
                                      {(team.name || 'T').charAt(0)}
                                    </div>
                                  )}
                                  <span className="font-medium text-sm truncate flex-1">
                                    {team.name || `Team ${team.id}`}
                                  </span>
                                  {rank && (
                                    <span className="ml-auto text-xs font-bold bg-purple-500/20 text-purple-300 rounded-full px-2 py-0.5">
                                      #{rank}
                                    </span>
                                  )}
                                </div>
                              );
                            });
                          })()}
                        </div>
                      </div>
                    </>
                  )}
                </div>

              {/* Placings Section */}
              <div className="px-4 pb-4">
                <h3 className="text-base font-bold text-white mb-3 flex items-center">
                  <div className={`${competition.ras ? 'bg-amber-500/20' : 'bg-yellow-500/20'} rounded-full p-1.5 mr-2`}>
                    <Trophy className={`h-3.5 w-3.5 ${competition.ras ? 'text-amber-400' : 'text-yellow-400'}`} />
                  </div>
                  {competition.ras ? 'National Champions' : `Top ${detailHasThirdPlace ? '3' : '2'} Placings`}
                </h3>
                
                {isFutureCompetition && !competition.ras ? <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-600/40 rounded-xl p-3 space-y-3">
                    <p className="text-slate-400 text-xs mb-2 text-center">Select teams for predictions:</p>
                    <SimulationDropdown teams={getAvailableTeams('first')} selectedTeam={predictions.first} onSelect={team => handlePredictionChange('first', team)} placeholder="Select 1st place team" position="first" />
                    <SimulationDropdown teams={getAvailableTeams('second')} selectedTeam={predictions.second} onSelect={team => handlePredictionChange('second', team)} placeholder="Select 2nd place team" position="second" />
                    {detailHasThirdPlace && <SimulationDropdown teams={getAvailableTeams('third')} selectedTeam={predictions.third} onSelect={team => handlePredictionChange('third', team)} placeholder="Select 3rd place team" position="third" />}
                    
                    {canSaveSimulation && <button onClick={handleSaveSimulation} className={`w-full px-4 py-3 rounded-lg transition-colors font-semibold min-h-[44px] ${showSuccessMessage ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                        {showSuccessMessage ? 'Prediction Saved!' : 'Save Prediction'}
                      </button>}
                  </div> : isFutureCompetition && competition.ras ? <div className="space-y-3">
                    {/* 1st Place - National Champion */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/20 via-yellow-600/15 to-amber-700/20 border-2 border-amber-500/40 rounded-2xl p-5">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/5 to-transparent animate-ras-shimmer" />
                      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
                      <div className="relative flex flex-col items-center text-center space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-amber-300/80 text-xs font-semibold uppercase tracking-widest">National Champion</span>
                        </div>
                        <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400/40 flex items-center justify-center">
                          <span className="text-amber-300 text-2xl font-black">?</span>
                        </div>
                        <span className="text-foreground text-xl font-black tracking-wide">TBD</span>
                        <div className="bg-amber-500/15 px-3 py-1 rounded-full border border-amber-400/30">
                          <span className="text-amber-300 text-xs font-bold">1st Place</span>
                        </div>
                      </div>
                    </div>
                    {/* 2nd Place - Runner Up */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-slate-400/10 via-slate-500/10 to-slate-600/10 border border-slate-400/30 rounded-xl p-4">
                      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-400/40 to-transparent" />
                      <div className="relative flex flex-col items-center text-center space-y-2">
                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Runner Up</span>
                        <div className="w-12 h-12 rounded-full bg-slate-500/20 border-2 border-slate-400/30 flex items-center justify-center">
                          <span className="text-slate-300 text-xl font-black">?</span>
                        </div>
                        <span className="text-foreground text-lg font-bold">TBD</span>
                        <div className="bg-slate-500/15 px-3 py-1 rounded-full border border-slate-400/25">
                          <span className="text-slate-300 text-xs font-bold">2nd Place</span>
                        </div>
                      </div>
                    </div>
                  </div> : <div className="space-y-2">
                    {firstPlaceTeam && <div onClick={() => handleTeamClick(firstPlaceTeam.id)} className="flex items-center gap-3 bg-gradient-to-r from-yellow-600/20 to-yellow-400/10 border border-yellow-600/30 rounded-xl p-3 cursor-pointer hover:from-yellow-600/30 hover:to-yellow-400/20 transition-all duration-200 active:scale-[0.98]">
                        <div className="w-7 h-7 bg-yellow-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">1</div>
                        {firstPlaceTeam.logo ? <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-yellow-500/50">
                            <img src={firstPlaceTeam.logo} alt={firstPlaceTeam.name} className="w-full h-full object-cover" />
                          </div> : <div className="w-8 h-8 bg-yellow-600/30 rounded-full flex items-center justify-center text-yellow-300 text-sm font-bold flex-shrink-0">
                            {firstPlaceTeam.name.charAt(0)}
                          </div>}
                        <div className="text-white font-semibold text-sm truncate flex-1">{firstPlaceTeam.name}</div>
                        {competition.bid_status && (
                          <div className="bg-yellow-500/20 px-2 py-0.5 rounded-full border border-yellow-400/30 flex-shrink-0">
                            <span className="text-yellow-300 text-xs font-bold">+4 pts</span>
                          </div>
                        )}
                      </div>}
                    {secondPlaceTeam && <div onClick={() => handleTeamClick(secondPlaceTeam.id)} className="flex items-center gap-3 bg-gradient-to-r from-slate-500/20 to-slate-400/10 border border-slate-500/30 rounded-xl p-3 cursor-pointer hover:from-slate-500/30 hover:to-slate-400/20 transition-all duration-200 active:scale-[0.98]">
                        <div className="w-7 h-7 bg-slate-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">2</div>
                        {secondPlaceTeam.logo ? <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-slate-400/50">
                            <img src={secondPlaceTeam.logo} alt={secondPlaceTeam.name} className="w-full h-full object-cover" />
                          </div> : <div className="w-8 h-8 bg-slate-500/30 rounded-full flex items-center justify-center text-slate-300 text-sm font-bold flex-shrink-0">
                            {secondPlaceTeam.name.charAt(0)}
                          </div>}
                        <div className="text-white font-semibold text-sm truncate flex-1">{secondPlaceTeam.name}</div>
                        {competition.bid_status && (
                          <div className="bg-slate-500/20 px-2 py-0.5 rounded-full border border-slate-400/30 flex-shrink-0">
                            <span className="text-slate-300 text-xs font-bold">+2 pts</span>
                          </div>
                        )}
                      </div>}
                    {thirdPlaceTeam && <div onClick={() => handleTeamClick(thirdPlaceTeam.id)} className="flex items-center gap-3 bg-gradient-to-r from-orange-600/20 to-orange-400/10 border border-orange-600/30 rounded-xl p-3 cursor-pointer hover:from-orange-600/30 hover:to-orange-400/20 transition-all duration-200 active:scale-[0.98]">
                        <div className="w-7 h-7 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">3</div>
                        {thirdPlaceTeam.logo ? <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-orange-500/50">
                            <img src={thirdPlaceTeam.logo} alt={thirdPlaceTeam.name} className="w-full h-full object-cover" />
                          </div> : <div className="w-8 h-8 bg-orange-600/30 rounded-full flex items-center justify-center text-orange-300 text-sm font-bold flex-shrink-0">
                            {thirdPlaceTeam.name.charAt(0)}
                          </div>}
                        <div className="text-white font-semibold text-sm truncate flex-1">{thirdPlaceTeam.name}</div>
                        {competition.bid_status && (
                          <div className="bg-orange-500/20 px-2 py-0.5 rounded-full border border-orange-400/30 flex-shrink-0">
                            <span className="text-orange-300 text-xs font-bold">+1 pt</span>
                          </div>
                        )}
                      </div>}
                    {!firstPlaceTeam && !secondPlaceTeam && !thirdPlaceTeam && <div className="text-slate-400 text-sm text-center py-6 bg-slate-800/30 rounded-xl border border-slate-600/30">
                        No results available yet
                      </div>}
                  </div>}
              </div>

              {/* Judges Section */}
              <div className="px-4 pb-4">
                <h3 className="text-base font-bold text-white mb-3 flex items-center">
                  <div className="bg-purple-500/20 rounded-full p-1.5 mr-2">
                    <Eye className="h-3.5 w-3.5 text-purple-400" />
                  </div>
                  Judging Panel
                </h3>
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-600/40 rounded-xl p-3">
                  {(competition.judges || []).filter(j => j && j.name).length === 0 ? (
                    <div className="text-center py-3">
                      <span className="text-slate-400 text-sm font-medium italic">TBD</span>
                    </div>
                  ) : (
                    <div className="grid gap-2">
                      {(competition.judges || []).filter(j => j && j.name).sort((a, b) => (a.category || '').localeCompare(b.category || '')).map((judge, index) => <div key={index} className="flex items-center gap-2 bg-slate-700/30 rounded-lg px-2.5 py-2">
                          <div className="w-7 h-7 bg-purple-500/20 rounded-full flex items-center justify-center">
                            <Eye className="h-3.5 w-3.5 text-purple-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-slate-200 text-sm font-medium truncate">{judge.name}</div>
                            <div className="text-slate-400 text-xs truncate">{judge.category}</div>
                          </div>
                        </div>)}
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Instagram Link */}
              {competition.instagramlink && <div className="px-4 pb-6">
                  <a href={competition.instagramlink} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500/15 to-purple-500/10 border border-pink-400/30 rounded-xl p-3 hover:from-pink-500/20 hover:to-purple-500/15 transition-all duration-300 active:scale-[0.98]">
                    <Instagram className="h-4 w-4 text-pink-400" />
                    <span className="text-pink-400 font-semibold text-sm">Follow on Instagram</span>
                    <ExternalLink className="h-3.5 w-3.5 text-pink-400/60" />
                  </a>
                </div>}
              </>
            );
          })()}
          
          {/* Bottom padding for safe area */}
          <div className="pb-20"></div>
        </div>
      </DrawerContent>
    </Drawer>;
}