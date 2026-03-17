
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TeamCard } from '@/components/TeamCard';
import { TeamDetail } from '@/components/TeamDetail';
import { CompetitionDetail } from '@/components/CompetitionDetail';
import { CompetitionsTab } from '@/components/CompetitionsTab';
import { FantasyTab } from '@/components/FantasyTab';
import LoadingScreen from '@/components/LoadingScreen';
import { Trophy, Target, Calendar, Users, Zap, RotateCcw, WifiOff } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchTeams, fetchFromDirectus } from '@/lib/api';
import { Team, SimulationData, Competition } from '@/lib/types';
import { mapCompetitionTeamsFull } from '../lib/competitionMapping';
import { fetchTiebreakerRanking, normalizeName } from '@/lib/fetchTiebreakerRanking';
import { createTeamComparator } from '@/lib/sorting';



const CUTOFF_POINTS = 5;

const Index = () => {
  const navigate = useNavigate();
  
  // Modal stack management
  interface ModalEntry {
    id: string;
    type: 'team' | 'competition';
    data: any;
    zIndex: number;
  }
  
  const [showLoading, setShowLoading] = useState(true);
  const [animationReady, setAnimationReady] = useState(false);
  const [dbReady, setDbReady] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const headerLogoRef = useRef<HTMLImageElement>(null);
  const [modalStack, setModalStack] = useState<ModalEntry[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [simulationData, setSimulationData] = useState<SimulationData>({});
  const [activeTab, setActiveTab] = useState<string>('standings');
  const [teamsData, setTeamsData] = useState<Team[]>([]);
  const [originalTeamsData, setOriginalTeamsData] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [teamSearchQuery, setTeamSearchQuery] = useState('');
  const [tiebreakerRankingMap, setTiebreakerRankingMap] = useState<Map<string, number>>(new Map());
  const [sheetOriginalNames, setSheetOriginalNames] = useState<Map<string, string>>(new Map());

  const handleLoadingComplete = useCallback(() => setAnimationReady(true), []);

  // Only dismiss loading screen once BOTH animation AND DB fetch are done
  useEffect(() => {
    if (animationReady && dbReady) {
      setShowLoading(false);
    }
  }, [animationReady, dbReady]);

  // Modal stack utility functions
  const pushModal = (type: 'team' | 'competition', data: any) => {
    const newModal: ModalEntry = {
      id: `${type}-${Date.now()}-${Math.random()}`,
      type,
      data,
      zIndex: 50 + (modalStack.length * 10)
    };
    setModalStack(prev => [...prev, newModal]);
  };

  const popModal = () => {
    setModalStack(prev => prev.slice(0, -1));
  };

  const clearModalStack = () => {
    setModalStack([]);
  };

  // Helper functions to get current modals
  const getCurrentTeam = () => modalStack.find(modal => modal.type === 'team')?.data || null;
  const getCurrentCompetition = () => modalStack.find(modal => modal.type === 'competition')?.data || null;

  // Fetch teams and competitions from database
  const loadData = useCallback(async () => {
    setFetchError(false);
    setLoading(true);
    
    // AbortController to cancel in-flight requests on timeout
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn('[App] Load timeout reached (20s)');
      abortController.abort();
      setFetchError(true);
      setLoading(false);
      setDbReady(true);
    }, 20000);
    
    // If already aborted by timeout, bail out early
    if (abortController.signal.aborted) return;
    
    try {
      const [teams, competitionsData, sheetResult] = await Promise.all([
        fetchTeams(),
        fetchFromDirectus('competitions'),
        fetchTiebreakerRanking()
      ]);
      
      // If timeout fired while awaiting, don't overwrite error state
      if (abortController.signal.aborted) return;
      setTiebreakerRankingMap(sheetResult.rankingMap);
      setSheetOriginalNames(sheetResult.originalNames);
      
      // Map competitions data FIRST
      let mappedCompetitions: any[] = [];
      if (competitionsData) {
        const API_URL = import.meta.env.VITE_DIRECTUS_URL;
        mappedCompetitions = competitionsData.map((comp: any) => ({
          id: comp.id,
          name: comp.name,
          city: comp.city,
          date: comp.date ? comp.date.split('T')[0] : comp.date,
          logo: comp.logo
            ? (typeof comp.logo === 'string'
                ? (comp.logo.startsWith('http') ? comp.logo : `${API_URL}/assets/${comp.logo}`)
                : (comp.logo && typeof comp.logo === 'object' && comp.logo.url ? comp.logo.url : `${API_URL}/assets/${comp.logo.id}`))
            : '',
          lineup: comp.lineup || [],
          firstplace: comp.firstplace,
          secondplace: comp.secondplace,
          thirdplace: comp.thirdplace,
          judges: Array.isArray(comp.judges)
            ? comp.judges.map((judge: any) => typeof judge === 'string' ? { name: judge, category: 'Judge' } : judge)
            : [],
          instagramlink: comp.instagramlink || '',
          time: (() => {
            const raw = comp.time || (comp.date && comp.date.includes('T') ? comp.date.split('T')[1] : '') || '';
            let t = raw.includes('T') ? raw.split('T')[1] : raw;
            t = t.replace(/\.\d+Z?$/, '').replace(/Z$/, '');
            return t;
          })(),
          timezone: comp.timezone || '',
          showTicketsLink: comp.showtickets || '',
          afterpartyTicketsLink: comp.aptickets || '',
          livestreamLink: comp.livelink || '',
          bid_status: comp.bid_status || false,
          ras: comp.ras === true || comp.ras === 'true',
          media: { photos: [], videos: [] }
        }));
        setCompetitions(mappedCompetitions);
      }
      
      // Map teams data AFTER competitions are available
      if (teams) {
        const API_URL = import.meta.env.VITE_DIRECTUS_URL;
        const mappedTeams = teams.map((team: any) => {
          const competitionResults: any[] = (() => {
            if (mappedCompetitions.length === 0) return [];
            
            const results = mappedCompetitions.map((competition: any) => {
              let placement = 'N/A';
              let pointsEarned = 0;
              
              const teamId = String(team.id);
              const teamName = team.name;

              if (String(competition.firstplace) === teamId || competition.firstplace === teamName) {
                placement = '1st';
                pointsEarned = 4;
              } else if (String(competition.secondplace) === teamId || competition.secondplace === teamName) {
                placement = '2nd';
                pointsEarned = 2;
              } else if (String(competition.thirdplace) === teamId || competition.thirdplace === teamName) {
                const lineupSize = Array.isArray(competition.lineup) ? competition.lineup.length : 0;
                if (lineupSize > 6) {
                  placement = '3rd';
                  pointsEarned = 1;
                }
              }
              
              if (placement === 'N/A') {
                const inLineup = Array.isArray(competition.lineup) && competition.lineup.some((entry: any) => {
                  const entryTeamId = entry?.teams_id?.id ?? entry?.teams_id ?? entry?.id ?? entry;
                  return String(entryTeamId) === teamId ||
                         (entry?.teams_id?.name && entry.teams_id.name === teamName);
                });

                if (!inLineup) return null;
                const [y, m, d] = (competition.date || '').split('-').map(Number);
                const compDate = new Date(y, m - 1, d);
                const now = new Date();
                now.setHours(0, 0, 0, 0);
                placement = compDate >= now ? 'Upcoming' : 'Competed';
              }
              
              return {
                competitionId: competition.id,
                competitionName: competition.name,
                placement,
                bidPointsEarned: competition.bid_status === true ? pointsEarned : 0,
                cumulativeBidPoints: 0,
                date: competition.date || '',
                isBidCompetition: competition.bid_status === true
              };
            }).filter(Boolean).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
            
            return results;
          })();

          // Calculate cumulative bid points
          let runningTotal = 0;
          competitionResults.forEach((result) => {
            runningTotal += result.bidPointsEarned;
            result.cumulativeBidPoints = runningTotal;
          });

          // Calculate bidPoints from competition placings
          const calculatedBidPoints = competitionResults.reduce((sum: number, r: any) => sum + r.bidPointsEarned, 0);

          return {
            id: team.id,
            name: team.name,
            founded: team.founded || team.est || 0,
            university: team.university,
            city: team.city,
            logo: team.logo
              ? (typeof team.logo === 'string'
                  ? (team.logo.startsWith('http') ? team.logo : `${API_URL}/assets/${team.logo}`)
                  : (team.logo.url ? team.logo.url : `${API_URL}/assets/${team.logo.id}`))
              : '',
            color: team.color || team.theme || 'bg-slate-600',
            theme: team.theme || '',
            bidPoints: calculatedBidPoints,
            qualified: team.qualified ?? false,
            competitions_attending: Array.isArray(team.competitions_attending) 
              ? team.competitions_attending.map((comp: any) => 
                  typeof comp === 'string' ? comp : comp.name || comp.id || comp
                )
              : [],
            achievements: Array.isArray(team.achievements) ? team.achievements : (team.achievements ? [team.achievements] : []),
            history: team.history || [],
            instagramlink: team.instagramlink || '',
            genderComposition: team.genderComposition || team.gender_comp,
            contactInfo: {
              email: team.contactInfo?.email || team.contact_info || team.email || '',
              phone: team.contactInfo?.phone || team.phone || '',
              website: team.contactInfo?.website || team.website || '',
              captains: Array.isArray(team.contactInfo?.captains) ? team.contactInfo.captains : 
                       Array.isArray(team.captains) ? team.captains : 
                       (typeof (team.contactInfo?.captains || team.captains) === 'string' && 
                        (team.contactInfo?.captains || team.captains).includes('[') && 
                        (team.contactInfo?.captains || team.captains).includes(']')) 
                          ? (team.contactInfo?.captains || team.captains).replace(/[\[\]]/g, '').split(',').map((c: string) => c.trim())
                          : (team.contactInfo?.captains || team.captains ? [team.contactInfo?.captains || team.captains] : [])
            },
            competitionResults,
          };
        });
        setTeamsData(mappedTeams);
        setOriginalTeamsData(mappedTeams);
      } else {
        setFetchError(true);
      }
      
      if ((!teams || teams.length === 0) && (!competitionsData || competitionsData.length === 0)) {
        setFetchError(true);
      }
    } catch (error) {
      console.error('[App] Data load failed:', error);
      setFetchError(true);
      setTeamsData([]);
      setCompetitions([]);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
      setDbReady(true);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calculate bid points based on competition results
  const calculateBidPoints = (teams: Team[], competitions: any[]) => {
    const pointsMap: { [teamId: string]: number } = {};
    
    // Initialize all teams with bid points calculated from competition results
    teams.forEach(team => {
      const originalTeam = originalTeamsData.find(ot => ot.id === team.id);
      const basePoints = (originalTeam?.competitionResults || [])
        .reduce((sum, r) => sum + r.bidPointsEarned, 0);
      pointsMap[team.id] = basePoints;
    });

    // Add points from completed competitions (currently no placings data)
    // competitions.forEach(comp => {
    //   // Points will be added from simulation data instead
    // });

    // Add simulation points if active (only for bid competitions)
    Object.values(simulationData).forEach(simulation => {
      const comp = competitions.find(c => c.id === simulation.competitionId);
      if (!comp?.bid_status) return;
      // simulation.predictions contains team IDs, not names
      if (simulation.predictions.first) {
        pointsMap[simulation.predictions.first] = (pointsMap[simulation.predictions.first] || 0) + 4;
      }
      if (simulation.predictions.second) {
        pointsMap[simulation.predictions.second] = (pointsMap[simulation.predictions.second] || 0) + 2;
      }
      if (simulation.predictions.third) {
        const lineupSize = Array.isArray(comp.lineup) ? comp.lineup.length : 0;
        if (lineupSize > 6) {
          pointsMap[simulation.predictions.third] = (pointsMap[simulation.predictions.third] || 0) + 1;
        }
      }
    });

    return teams.map(team => ({
      ...team,
      bidPoints: pointsMap[team.id] || 0,
      qualified: team.qualified
    }));
  };

  // Re-enable the useEffect that recalculates bid points
  const isInitialLoad = useRef(true);
  
  useEffect(() => {
    if (teamsData.length > 0 && originalTeamsData.length > 0) {
      if (isInitialLoad.current) {
        // Initial load - just set the teams without recalculating
        isInitialLoad.current = false;
      } else {
        // Simulation data changed - recalculate bid points
        const updatedTeams = calculateBidPoints(teamsData, competitions);
        setTeamsData(updatedTeams);
      }
    }
  }, [simulationData, originalTeamsData, competitions]);

  // Tiebreaker: primary by bid points, then by Google Sheet ranking, then alphabetical
  const tiebreakerSort = useMemo(() => createTeamComparator(tiebreakerRankingMap, sheetOriginalNames), [tiebreakerRankingMap, sheetOriginalNames]);

  const sortedTeams = useMemo(() => [...teamsData].sort(tiebreakerSort), [teamsData, tiebreakerSort]);
  const teamSortOrder = useMemo(() => new Map(sortedTeams.map((t, i) => [t.id, i])), [sortedTeams]);
  const rankedTeams = useMemo(() => sortedTeams.filter(t => t.bidPoints > 0), [sortedTeams]);
  const topThreeTeams = useMemo(() => rankedTeams.slice(0, 3), [rankedTeams]);
  const topNineTeams = useMemo(() => rankedTeams.slice(0, 9), [rankedTeams]);
  const qualifiedOtherTeams = useMemo(() => rankedTeams.slice(3, 9), [rankedTeams]);
  const notQualifiedTeams = useMemo(() => rankedTeams.slice(9), [rankedTeams]);

  const handleSimulationSet = useCallback((competitionName: string, competitionId: string, predictions: { first: string; second: string; third: string }) => {
    setSimulationData(prev => ({
      ...prev,
      [competitionId]: { competitionName, competitionId, predictions }
    }));
    setActiveTab('standings');
  }, []);

  const handleCompetitionClick = useCallback((competitionData: any) => {
    let competitionId = '';
    if (typeof competitionData === 'string') {
      competitionId = competitionData;
    } else if (competitionData && typeof competitionData === 'object') {
      competitionId = competitionData.id || competitionData;
    } else if (typeof competitionData === 'number') {
      competitionId = String(competitionData);
    } else {
      return;
    }
    
    const competition = competitions.find(comp => String(comp.id) === String(competitionId));
    if (competition) {
      const mappedCompetition = mapCompetitionTeamsFull(competition, teamsData);
      pushModal('competition', mappedCompetition);
    }
  }, [competitions, teamsData]);

  const handleTeamClick = useCallback((team: Team) => {
    pushModal('team', team);
  }, []);

  const clearSimulation = () => {
    setSimulationData({});
    setTeamsData(originalTeamsData); // Restore original teams data
  };


  const goToSimulation = () => {
    const simulationCount = Object.keys(simulationData).length;
    if (simulationCount === 1) {
      const singleSimulation = Object.values(simulationData)[0];
      setActiveTab('comps');
    } else {
      setActiveTab('comps');
    }
  };

  const simulationCount = Object.keys(simulationData).length;
  const simulationNames = Object.values(simulationData).map(sim => sim.competitionName);

  // Determine if a team is locked in (has enough points to guarantee top 9)
  const isLockedIn = (team: any, rank: number) => {
    // A team is locked in if they're in top 6 with significant point lead
    // or if the gap between them and 10th place is too large to overcome
    const tenthPlacePoints = sortedTeams[9]?.bidPoints || 0;
    return rank <= 6 && team.bidPoints >= tenthPlacePoints + 8; // 8+ point lead is generally safe
  };

  return (
    <>
    {showLoading && <LoadingScreen onComplete={handleLoadingComplete} headerLogoRef={headerLogoRef} dataReady={dbReady} />}
    <div className="min-h-screen max-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-black overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-900/20 rounded-full blur-3xl transform-gpu"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-slate-800/30 rounded-full blur-3xl transform-gpu"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-800/20 rounded-full blur-3xl transform-gpu"></div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full relative z-10 h-screen flex flex-col">

        <TabsContent value="standings" className="mt-0 flex-1 overflow-y-auto scrollbar-hide pb-32">
          {/* Header with Centered Logo */}
          <div className="relative pb-8" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.5rem)' }}>
            <div className="flex justify-center">
              <img 
                ref={headerLogoRef}
                src="/lovable-uploads/fac2918d-a107-444b-8ce2-b83e59b5b3c7.png" 
                alt="Raas All Stars Logo" 
                className="h-12 w-auto"
                style={{ opacity: showLoading ? 0 : 1, transition: 'opacity 0.3s ease' }}
              />
            </div>
          </div>
          {fetchError && teamsData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6">
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8 max-w-sm w-full text-center backdrop-blur-sm">
                <WifiOff className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-slate-200 mb-2">Unable to Load Data</h2>
                <p className="text-slate-400 text-sm mb-6">
                  Please check your internet connection and try again.
                </p>
                <button
                  onClick={() => {
                    setDbReady(false);
                    setShowLoading(true);
                    setAnimationReady(false);
                    loadData();
                  }}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-xl transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </button>
              </div>
            </div>
          ) : loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-slate-400 mt-2">Loading teams...</p>
            </div>
          ) : (
            <>
              {/* Simulation Alert */}
              {simulationCount > 0 && (
            <div className="mx-4 mb-6">
              <div className="bg-gradient-to-r from-blue-600/80 to-purple-600/80 backdrop-blur-sm border border-blue-500/50 rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    <div>
                      <h3 className="text-white font-bold text-sm">Simulation Mode</h3>
                      <p className="text-blue-100 text-xs">
                        {simulationCount === 1 
                          ? `Viewing predicted results for ${simulationNames[0]}`
                          : `Viewing predictions for ${simulationCount} competitions: ${simulationNames.join(', ')}`
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={goToSimulation}
                      className="bg-blue-600/70 hover:bg-blue-600/90 text-white px-6 py-4 rounded-lg text-xs transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
                    >
                      Edit
                    </button>
                    <button
                      onClick={clearSimulation}
                      className="bg-white/20 hover:bg-white/30 text-white px-6 py-4 rounded-lg text-xs flex items-center gap-2 transition-colors min-h-[48px]"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Exit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top 3 Flowing Podium - Reduced Brightness */}
          <section className="px-4 pb-8">
            <div className="relative">
              
              <div className="relative flex gap-4 justify-center items-end py-8">
                {/* 2nd Place */}
                <div className="flex-1 max-w-[95px]">
                  <div 
                    onClick={() => pushModal('team', topThreeTeams[1])}
                    className="relative group cursor-pointer"
                  >
                    <div className="relative bg-gradient-to-br from-slate-600/80 to-slate-800/95 rounded-3xl p-4 h-32 flex flex-col items-center justify-between border border-slate-500/20 group-hover:border-slate-400/40 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2" style={{ boxShadow: '0 0 20px 6px rgba(100, 116, 139, 0.3), 0 0 40px 12px rgba(71, 85, 105, 0.15)' }}>
                      
                      {/* Featured Profile Picture */}
                      <div className="relative -mt-6 mb-2">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center border-2 border-slate-400/50 group-hover:border-slate-300/70 transition-all duration-500" style={{ boxShadow: '0 0 15px 4px rgba(148, 163, 184, 0.4)' }}>
                          {topThreeTeams[1]?.logo ? (
                            <img src={topThreeTeams[1].logo} alt={topThreeTeams[1].name} className="w-full h-full object-cover" />
                          ) : (
                            <Trophy className="h-8 w-8 text-slate-200" />
                          )}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-slate-300 font-bold text-xs mb-0.5">2nd</div>
                        <div className="text-white font-semibold text-xs leading-tight mb-2">{topThreeTeams[1]?.name}</div>
                        <div className="relative">
                          <div className="relative bg-gradient-to-br from-slate-200/90 to-slate-300/80 px-3 py-1.5 rounded-xl" style={{ boxShadow: '0 0 10px 3px rgba(148, 163, 184, 0.25)' }}>
                            <span className="text-slate-800 font-black text-lg leading-none">{topThreeTeams[1]?.bidPoints}</span>
                            <span className="text-slate-600 font-semibold text-[8px] uppercase tracking-wider ml-0.5">pts</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1st Place - Hero Profile */}
                <div className="flex-1 max-w-[110px] -mt-8">
                  <div 
                    onClick={() => pushModal('team', topThreeTeams[0])}
                    className="relative group cursor-pointer"
                  >
                    <div className="relative bg-gradient-to-br from-yellow-400/90 to-orange-500/95 rounded-3xl p-5 h-40 flex flex-col items-center justify-between border border-yellow-300/40 group-hover:border-yellow-200/60 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-3" style={{ boxShadow: '0 0 30px 8px rgba(245, 158, 11, 0.4), 0 0 60px 16px rgba(234, 88, 12, 0.2)' }}>
                      
                      {/* Hero Profile Picture */}
                      <div className="relative -mt-8 mb-3">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-yellow-200 to-yellow-400 flex items-center justify-center border-3 border-yellow-300/60 group-hover:border-yellow-200/80 transition-all duration-500" style={{ boxShadow: '0 0 20px 6px rgba(250, 204, 21, 0.5)' }}>
                          {topThreeTeams[0]?.logo ? (
                            <img src={topThreeTeams[0].logo} alt={topThreeTeams[0].name} className="w-full h-full object-cover" />
                          ) : (
                            <Trophy className="h-10 w-10 text-yellow-700" />
                          )}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-yellow-800 font-bold text-sm mb-0.5">1st</div>
                        <div className="text-yellow-900 font-bold text-sm leading-tight mb-2">{topThreeTeams[0]?.name}</div>
                        <div className="relative">
                          <div className="relative bg-gradient-to-br from-yellow-100 to-amber-200 px-4 py-2 rounded-xl border border-yellow-300/50" style={{ boxShadow: '0 0 12px 4px rgba(245, 158, 11, 0.3)' }}>
                            <span className="text-amber-900 font-black text-xl leading-none">{topThreeTeams[0]?.bidPoints}</span>
                            <span className="text-amber-700 font-bold text-[9px] uppercase tracking-wider ml-1">pts</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="flex-1 max-w-[95px]">
                  <div 
                    onClick={() => pushModal('team', topThreeTeams[2])}
                    className="relative group cursor-pointer"
                  >
                    <div className="relative bg-gradient-to-br from-orange-500/80 to-red-600/95 rounded-3xl p-4 h-32 flex flex-col items-center justify-between border border-orange-400/20 group-hover:border-orange-300/40 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2" style={{ boxShadow: '0 0 20px 6px rgba(249, 115, 22, 0.35), 0 0 40px 12px rgba(220, 38, 38, 0.15)' }}>
                      
                      {/* Featured Profile Picture */}
                      <div className="relative -mt-6 mb-2">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center border-2 border-orange-400/50 group-hover:border-orange-300/70 transition-all duration-500" style={{ boxShadow: '0 0 15px 4px rgba(249, 115, 22, 0.4)' }}>
                          {topThreeTeams[2]?.logo ? (
                            <img src={topThreeTeams[2].logo} alt={topThreeTeams[2].name} className="w-full h-full object-cover" />
                          ) : (
                            <Trophy className="h-8 w-8 text-orange-800" />
                          )}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-orange-200 font-bold text-xs mb-0.5">3rd</div>
                        <div className="text-orange-100 font-semibold text-xs leading-tight mb-2">{topThreeTeams[2]?.name}</div>
                        <div className="relative">
                          <div className="relative bg-gradient-to-br from-orange-200/90 to-amber-300/80 px-3 py-1.5 rounded-xl" style={{ boxShadow: '0 0 10px 3px rgba(251, 146, 60, 0.25)' }}>
                            <span className="text-orange-900 font-black text-lg leading-none">{topThreeTeams[2]?.bidPoints}</span>
                            <span className="text-orange-700 font-semibold text-[8px] uppercase tracking-wider ml-0.5">pts</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Seamless Team List */}
          <main className="px-4">
            {/* Qualified Teams (4-9) */}
            <div className="space-y-2 mb-6">
              {qualifiedOtherTeams.map((team, index) => {
                const rank = index + 4;
                return (
                  <div 
                    key={team.id}
                    onClick={() => pushModal('team', team)}
                    className="group relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover-scale hover-glow active:scale-[0.98]"
                  >
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/5 to-blue-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative flex items-center gap-4">
                      {/* Rank Badge */}
                      <div className="w-8 h-8 bg-blue-500/20 border border-blue-400/30 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-300 font-bold text-sm">{rank}</span>
                      </div>
                      {/* Team Logo with glow */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-white/10 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          {team.logo ? (
                            <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                          ) : (
                            <Trophy className="h-6 w-6 text-slate-400" />
                          )}
                        </div>
                      </div>
                      
                      {/* Team Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-base truncate group-hover:text-blue-100 transition-colors duration-300">{team.name}</h3>
                        <p className="text-slate-400 text-sm truncate group-hover:text-slate-300 transition-colors duration-300">{team.university}</p>
                      </div>
                      
                      {/* Modern Points Display */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                        <div className="relative bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-blue-400/20 group-hover:border-blue-300/40 transition-all duration-300">
                          <div className="flex flex-col items-center">
                            <div className="text-blue-300 font-black text-lg leading-none group-hover:text-blue-200 transition-colors duration-300">{team.bidPoints}</div>
                            <div className="text-blue-400/70 font-medium text-[10px] uppercase tracking-widest">points</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cutoff Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-500/50 to-transparent"></div>
              </div>
              <div className="relative flex justify-center">
                <div className="bg-slate-900 px-6 py-2 border border-slate-600/30 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                    <span className="text-slate-400 font-medium text-xs uppercase tracking-wider">RAS Cutoff</span>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Non-Qualified Teams */}
            <div className="space-y-2">
              {notQualifiedTeams.map((team, index) => {
                const rank = index + 10;
                return (
                  <div 
                    key={team.id}
                    onClick={() => pushModal('team', team)}
                    className="group relative bg-slate-800/20 backdrop-blur-sm border border-slate-700/20 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover-scale-sm active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-4">
                      {/* Muted rank */}
                      <div className="w-10 h-10 bg-slate-600/20 border border-slate-500/20 rounded-xl flex items-center justify-center">
                        <span className="text-slate-500 font-bold text-sm">{rank}</span>
                      </div>
                      
                      {/* Team Logo */}
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-700/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                        {team.logo ? (
                          <img src={team.logo} alt={team.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                        ) : (
                          <Trophy className="h-6 w-6 text-slate-500" />
                        )}
                      </div>
                      
                      {/* Team Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-slate-300 font-semibold text-base truncate group-hover:text-slate-200 transition-colors duration-300">{team.name}</h3>
                        <p className="text-slate-500 text-sm truncate group-hover:text-slate-400 transition-colors duration-300">{team.university}</p>
                      </div>
                      
                      {/* Muted Points Display */}
                      <div className="bg-slate-600/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-slate-500/20">
                        <div className="flex flex-col items-center">
                          <div className="text-slate-400 font-black text-lg leading-none">{team.bidPoints}</div>
                          <div className="text-slate-500/70 font-medium text-[10px] uppercase tracking-widest">points</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </main>
            </>
          )}
        </TabsContent>

        {activeTab === 'comps' && (
        <TabsContent value="comps" className="mt-0 flex-1 overflow-y-auto scrollbar-hide pb-32" forceMount>
          {fetchError && competitions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6">
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8 max-w-sm w-full text-center backdrop-blur-sm">
                <WifiOff className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-slate-200 mb-2">Unable to Load Data</h2>
                <p className="text-slate-400 text-sm mb-6">Please check your internet connection and try again.</p>
                <button onClick={() => { setDbReady(false); setShowLoading(true); setAnimationReady(false); loadData(); }} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-xl transition-colors">
                  <RotateCcw className="w-4 h-4" /> Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="px-4">
              <CompetitionsTab
                competitions={competitions}
                onSimulationSet={handleSimulationSet}
                simulationData={simulationData}
                teams={teamsData}
                onTeamClick={handleTeamClick}
                teamSortOrder={teamSortOrder}
              />
            </div>
          )}
        </TabsContent>
        )}

        {activeTab === 'teams' && (
        <TabsContent value="teams" className="mt-0 flex-1 overflow-y-auto scrollbar-hide pb-32" forceMount>
          {fetchError && teamsData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6">
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8 max-w-sm w-full text-center backdrop-blur-sm">
                <WifiOff className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-slate-200 mb-2">Unable to Load Data</h2>
                <p className="text-slate-400 text-sm mb-6">Please check your internet connection and try again.</p>
                <button onClick={() => { setDbReady(false); setShowLoading(true); setAnimationReady(false); loadData(); }} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-xl transition-colors">
                  <RotateCcw className="w-4 h-4" /> Try Again
                </button>
              </div>
            </div>
          ) : (
          <div className="px-4 pb-6" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 1.5rem)' }}>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-slate-400 mt-2">Loading teams...</p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between gap-4">
                  <h2 className="text-xl font-bold text-white">All Teams</h2>
                  <input
                    type="text"
                    placeholder="Search teams..."
                    value={teamSearchQuery}
                    onChange={(e) => setTeamSearchQuery(e.target.value)}
                    className="px-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>
                <div className="space-y-3">
                  {[...teamsData]
                    .filter(team => 
                      team.name.toLowerCase().includes(teamSearchQuery.toLowerCase()) ||
                      team.university.toLowerCase().includes(teamSearchQuery.toLowerCase())
                    )
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((team) => (
                    <div 
                      key={team.id}
                      onClick={() => pushModal('team', team)}
                      className="group relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover-scale-sm active:scale-[0.99]"
                    >
                      <div className="flex flex-col items-center justify-center text-center gap-3">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-700/40 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                          {team.logo ? (
                            <img src={team.logo} alt={team.name} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300" />
                          ) : (
                            <Trophy className="h-7 w-7 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 w-full">
                          <h3 className="text-white font-semibold text-lg truncate group-hover:text-blue-200 transition-colors duration-300">{team.name}</h3>
                          <p className="text-slate-400 text-sm truncate">{team.university}</p>
                          {team.qualified ? (
                            <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-500/20 border border-green-400/30 text-green-400">
                              Qualified for RAS
                            </span>
                          ) : team.bubble ? (
                            <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 border border-amber-400/30 text-amber-400">
                              On the Bubble
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          )}
        </TabsContent>
        )}

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700/50 shadow-lg z-50 flex-shrink-0" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <TabsList className="grid grid-cols-3 bg-transparent border-none rounded-none w-full h-16 p-0">
            <TabsTrigger 
              value="standings" 
              className="text-slate-400 data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400 rounded-none text-xs flex-col gap-1 h-full border-none min-h-[44px]"
            >
              <Trophy className="h-4 w-4" />
              Standings
            </TabsTrigger>
            <TabsTrigger 
              value="comps" 
              className="text-slate-400 data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400 rounded-none text-xs flex-col gap-1 h-full border-none min-h-[44px]"
            >
              <Calendar className="h-4 w-4" />
              Comps
            </TabsTrigger>
            <TabsTrigger 
              value="teams" 
              className="text-slate-400 data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400 rounded-none text-xs flex-col gap-1 h-full border-none min-h-[44px]"
            >
              <Users className="h-4 w-4" />
              Teams
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      {/* Modal Stack Rendering */}
      {modalStack.map((modal, index) => {
        if (modal.type === 'competition') {
          return (
            <CompetitionDetail 
              key={modal.id}
              competition={modal.data} 
              onClose={popModal}
              onSimulationSet={handleSimulationSet}
              simulationData={simulationData}
              teams={teamsData}
              onTeamClick={handleTeamClick}
              zIndex={modal.zIndex}
              teamSortOrder={teamSortOrder}
            />
          );
        }
        
        if (modal.type === 'team') {
          return (
            <TeamDetail 
              key={modal.id}
              team={modal.data} 
              onClose={popModal}
              onCompetitionClick={handleCompetitionClick}
              competitions={competitions}
              zIndex={modal.zIndex}
            />
          );
        }
        
        return null;
      })}
    </div>
    </>
  );
};

export default Index;
