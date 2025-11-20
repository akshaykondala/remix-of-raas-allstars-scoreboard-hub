
import { useState, useEffect } from 'react';
import { X, Trophy, Users, Eye, Camera, ChevronDown, Calendar, MapPin, Instagram, ExternalLink, Star, Award, Clock, Target } from 'lucide-react';
import { Competition, SimulationData, Team } from '../lib/types';

interface CompetitionDetailProps {
  competition: Competition;
  onClose: () => void;
  onSimulationSet?: (competitionName: string, competitionId: string, predictions: { first: string; second: string; third: string }) => void;
  simulationData?: SimulationData;
  teams?: Team[];
  onTeamClick?: (team: Team) => void;
  zIndex?: number;
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

function SimulationDropdown({ teams, selectedTeam, onSelect, placeholder, position }: SimulationDropdownProps) {
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

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-3 bg-gradient-to-r ${getBackgroundColor()} rounded-lg px-3 py-3 border text-left min-h-[48px]`}
      >
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
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => {
                onSelect(String(team.id));
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-sm truncate"
            >
              {team.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function CompetitionDetail({ competition, onClose, onSimulationSet, simulationData, teams = [], onTeamClick, zIndex = 80 }: CompetitionDetailProps) {
  console.log('[DEBUG] CompetitionDetail props:', { competition, onClose, onSimulationSet, simulationData, teams, onTeamClick: !!onTeamClick });
  console.log('[DEBUG] CompetitionDetail lineup:', competition?.lineup);
  console.log('[DEBUG] onTeamClick function exists:', typeof onTeamClick === 'function');
  const [predictions, setPredictions] = useState<{ first: string; second: string; third: string }>({
    first: '',
    second: '',
    third: ''
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 200); // Match the animation duration
  };

  // Settable current date for testing; switch to `new Date()` for production
  // TODO: when we are ready to go live, switch to `new Date()`
  const CURRENT_DATE = new Date(); // February is month 1 (0-indexed)

  const formatDate = (dateString: string) => {
    // Parse as local date to avoid timezone shift
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-').map(Number);
    // month is 0-indexed in JS Date
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Use CURRENT_DATE to determine if competition is in the future
  const isFutureCompetition = (() => {
    const [year, month, day] = competition.date.split('-').map(Number);
    const compDate = new Date(year, month - 1, day);
    return compDate > CURRENT_DATE;
  })();

  // Initialize predictions from simulation data if this is the competition being simulated
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
    setPredictions(prev => ({ ...prev, [position]: team }));
  };

  const handleSaveSimulation = () => {
    if (predictions.first && predictions.second && predictions.third && onSimulationSet) {
      onSimulationSet(competition.name, competition.id, predictions);
      setShowSuccessMessage(true);
      setTimeout(() => {
        onClose();
        setShowSuccessMessage(false);
      }, 1500);
    }
  };

  const handleTeamClick = (teamId: string | number) => {
    console.log('🔍 CompetitionDetail handleTeamClick called with:', teamId);
    console.log('🔍 Available teams:', teams);
    const team = teams.find(t => t.id === String(teamId) || t.id === teamId);
    console.log('🔍 Found team:', team);
    if (team && onTeamClick) {
      console.log('✅ Calling onTeamClick with team:', team);
      onTeamClick(team);
    } else {
      console.log('❌ Cannot call onTeamClick:', { team, onTeamClick: !!onTeamClick });
    }
  };

  const canSaveSimulation = predictions.first && predictions.second && predictions.third && 
    predictions.first !== predictions.second && 
    predictions.first !== predictions.third && 
    predictions.second !== predictions.third;

  const getAvailableTeams = (position: 'first' | 'second' | 'third') => {
    switch (position) {
      case 'first':
        return competition.lineup.map(team => ({
          id: typeof team.id === 'string' ? team.id : String(team.id),
          name: team.name || `Team ${team.id}`
        }));
      case 'second':
        return competition.lineup.filter(team => {
          const teamId = typeof team.id === 'string' ? team.id : String(team.id);
          return teamId !== predictions.first;
        }).map(team => ({
          id: typeof team.id === 'string' ? team.id : String(team.id),
          name: team.name || `Team ${team.id}`
        }));
      case 'third':
        return competition.lineup.filter(team => {
          const teamId = typeof team.id === 'string' ? team.id : String(team.id);
          return teamId !== predictions.first && teamId !== predictions.second;
        }).map(team => ({
          id: typeof team.id === 'string' ? team.id : String(team.id),
          name: team.name || `Team ${team.id}`
        }));
      default:
        return competition.lineup.map(team => ({
          id: typeof team.id === 'string' ? team.id : String(team.id),
          name: team.name || `Team ${team.id}`
        }));
    }
  };

  // Function to resolve team IDs to team objects for placings
  const getPlacingTeam = (teamId: string | number) => {
    if (!teamId || !teams.length) return null;
    return teams.find(team => team.id === String(teamId) || team.id === teamId);
  };

  // Get the actual placing teams
  const firstPlaceTeam = getPlacingTeam(competition.firstplace);
  const secondPlaceTeam = getPlacingTeam(competition.secondplace);
  const thirdPlaceTeam = getPlacingTeam(competition.thirdplace);

  return (
    <div className="fixed inset-0 flex" style={{ zIndex }}>
      <div className={`bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-slate-600/30 shadow-2xl w-full max-h-full overflow-hidden ${isExiting ? 'animate-slide-out-right' : 'animate-slide-in-right'}`}>
        <div className="max-h-[95vh] overflow-y-auto scrollbar-hide">
          {/* Modern Header with Hero Profile */}
          <div className="relative bg-gradient-to-br from-purple-600/20 via-blue-600/15 to-slate-800/20 p-6">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full p-2 transition-all duration-200 z-10"
            >
              <X size={18} />
            </button>
            
            {/* Hero Competition Presentation */}
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Large Competition Logo */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl blur-xl"></div>
                {competition.logo ? (
                  <div className="relative w-24 h-24 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl">
                    <img src={competition.logo} alt={competition.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="relative w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl border-2 border-white/20">
                    <Trophy className="h-12 w-12 text-white" />
                  </div>
                )}
              </div>
              
              {/* Competition Name & Info */}
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-white via-purple-100 to-blue-100 bg-clip-text text-transparent mb-2">{competition.name}</h1>
                {competition.city && (
                  <p className="text-white text-lg font-medium mb-2">{competition.city}</p>
                )}
                
                {/* Modern Info Badges */}
                <div className="flex flex-wrap justify-center gap-2 mb-3">
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm border border-white/20 text-white">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(competition.date)}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm border border-blue-400/30">
                    <Users className="h-3.5 w-3.5 text-blue-300" />
                    <span className="text-blue-200">{competition.lineup.length} Teams</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm border border-purple-400/30">
                    <Eye className="h-3.5 w-3.5 text-purple-300" />
                    <span className="text-purple-200">{competition.judges.length} Judges</span>
                  </div>
                  
                  <div className={`flex items-center gap-1.5 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm border text-sm font-medium ${
                    competition.bid_status 
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30 text-green-300' 
                      : 'bg-gradient-to-r from-slate-500/20 to-slate-400/20 border-slate-400/30 text-slate-300'
                  }`}>
                    <Trophy className="h-3.5 w-3.5" />
                    <span>{competition.bid_status ? 'BID EVENT' : 'NON-BID EVENT'}</span>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                  isFutureCompetition 
                    ? 'bg-blue-500/20 to-cyan-500/20 border-blue-400/40 text-blue-300' 
                    : 'bg-green-500/20 to-emerald-500/20 border-green-400/40 text-green-300'
                } border`}>
                  <Clock className="h-4 w-4" />
                  {isFutureCompetition ? 'UPCOMING COMPETITION' : 'COMPLETED'}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-purple-500/15 to-purple-600/10 border border-purple-400/30 rounded-2xl p-4 text-center">
                <div className="bg-purple-500/20 rounded-full p-3 w-fit mx-auto mb-3">
                  <Users className="h-5 w-5 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-white mb-1">{competition.lineup.length}</div>
                <div className="text-purple-300 text-sm font-medium">Teams</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500/15 to-blue-600/10 border border-blue-400/30 rounded-2xl p-4 text-center">
                <div className="bg-blue-500/20 rounded-full p-3 w-fit mx-auto mb-3">
                  <Eye className="h-5 w-5 text-blue-400" />
                </div>
                <div className="text-2xl font-black text-white mb-1">{competition.judges.length}</div>
                <div className="text-blue-300 text-sm font-medium">Judges</div>
              </div>
              
              <div className={`rounded-2xl p-4 text-center border ${
                competition.bid_status 
                  ? 'bg-gradient-to-br from-green-500/15 to-emerald-600/10 border-green-400/30' 
                  : 'bg-gradient-to-br from-slate-500/15 to-slate-600/10 border-slate-400/30'
              }`}>
                <div className={`rounded-full p-3 w-fit mx-auto mb-3 ${
                  competition.bid_status ? 'bg-green-500/20' : 'bg-slate-500/20'
                }`}>
                  <Trophy className={`h-5 w-5 ${competition.bid_status ? 'text-green-400' : 'text-slate-400'}`} />
                </div>
                <div className={`text-2xl font-black mb-1 ${competition.bid_status ? 'text-green-300' : 'text-slate-300'}`}>
                  {competition.bid_status ? 'YES' : 'NO'}
                </div>
                <div className={`text-sm font-medium ${competition.bid_status ? 'text-green-300' : 'text-slate-300'}`}>
                  Bid Event
                </div>
              </div>
            </div>
          </div>

          {/* Lineup Section */}
          <div className="px-6 pb-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <div className="bg-purple-500/20 rounded-full p-2 mr-3">
                <Users className="h-4 w-4 text-purple-400" />
              </div>
              Competition Lineup
            </h3>
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-600/40 rounded-2xl p-4">
              <div className="grid gap-2">
                {competition.lineup.map((team, index) => (
                  <div 
                    key={index} 
                    onClick={() => handleTeamClick(typeof team.id === 'string' ? team.id : String(team.id))}
                    className="flex items-center gap-3 bg-slate-700/30 rounded-lg px-3 py-2 text-slate-300 text-sm cursor-pointer hover:bg-slate-600/50 transition-colors"
                  >
                    <div className="w-6 h-6 bg-slate-600/50 rounded-full flex items-center justify-center text-xs font-bold text-slate-400">
                      {index + 1}
                    </div>
                    <span className="font-medium">
                      {team.name || `Team ${team.id}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Placings Section */}
          <div className="px-6 pb-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <div className="bg-yellow-500/20 rounded-full p-2 mr-3">
                <Trophy className="h-4 w-4 text-yellow-400" />
              </div>
              Top 3 Placings
            </h3>
            
            {isFutureCompetition ? (
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-600/40 rounded-2xl p-4 space-y-4">
                <p className="text-slate-400 text-sm mb-4 text-center">Select teams for predictions:</p>
                <SimulationDropdown
                  teams={getAvailableTeams('first')}
                  selectedTeam={predictions.first}
                  onSelect={(team) => handlePredictionChange('first', team)}
                  placeholder="Select 1st place team"
                  position="first"
                />
                <SimulationDropdown
                  teams={getAvailableTeams('second')}
                  selectedTeam={predictions.second}
                  onSelect={(team) => handlePredictionChange('second', team)}
                  placeholder="Select 2nd place team"
                  position="second"
                />
                <SimulationDropdown
                  teams={getAvailableTeams('third')}
                  selectedTeam={predictions.third}
                  onSelect={(team) => handlePredictionChange('third', team)}
                  placeholder="Select 3rd place team"
                  position="third"
                />
                
                {canSaveSimulation && (
                  <button
                    onClick={handleSaveSimulation}
                    className={`w-full px-4 py-4 rounded-lg transition-colors font-semibold min-h-[48px] ${
                      showSuccessMessage 
                        ? 'bg-green-600 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {showSuccessMessage ? 'Prediction Saved!' : 'Save Prediction'}
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {firstPlaceTeam && (
                  <div 
                    onClick={() => handleTeamClick(firstPlaceTeam.id)}
                    className="flex items-center gap-3 bg-gradient-to-r from-yellow-600/20 to-yellow-400/10 border border-yellow-600/30 rounded-2xl p-4 cursor-pointer hover:from-yellow-600/30 hover:to-yellow-400/20 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                    <div className="flex-1">
                      <div className="text-white font-semibold text-base">{firstPlaceTeam.name}</div>
                      <div className="text-yellow-400 text-sm">{firstPlaceTeam.university}</div>
                    </div>
                    <div className="bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-400/30">
                      <span className="text-yellow-300 text-sm font-bold">+4 pts</span>
                    </div>
                  </div>
                )}
                {secondPlaceTeam && (
                  <div 
                    onClick={() => handleTeamClick(secondPlaceTeam.id)}
                    className="flex items-center gap-3 bg-gradient-to-r from-slate-500/20 to-slate-400/10 border border-slate-500/30 rounded-2xl p-4 cursor-pointer hover:from-slate-500/30 hover:to-slate-400/20 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-slate-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                    <div className="flex-1">
                      <div className="text-white font-semibold text-base">{secondPlaceTeam.name}</div>
                      <div className="text-slate-400 text-sm">{secondPlaceTeam.university}</div>
                    </div>
                    <div className="bg-slate-500/20 px-3 py-1 rounded-full border border-slate-400/30">
                      <span className="text-slate-300 text-sm font-bold">+2 pts</span>
                    </div>
                  </div>
                )}
                {thirdPlaceTeam && (
                  <div 
                    onClick={() => handleTeamClick(thirdPlaceTeam.id)}
                    className="flex items-center gap-3 bg-gradient-to-r from-orange-600/20 to-orange-400/10 border border-orange-600/30 rounded-2xl p-4 cursor-pointer hover:from-orange-600/30 hover:to-orange-400/20 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                    <div className="flex-1">
                      <div className="text-white font-semibold text-base">{thirdPlaceTeam.name}</div>
                      <div className="text-orange-400 text-sm">{thirdPlaceTeam.university}</div>
                    </div>
                    <div className="bg-orange-500/20 px-3 py-1 rounded-full border border-orange-400/30">
                      <span className="text-orange-300 text-sm font-bold">+1 pt</span>
                    </div>
                  </div>
                )}
                {!firstPlaceTeam && !secondPlaceTeam && !thirdPlaceTeam && (
                  <div className="text-slate-400 text-sm text-center py-8 bg-slate-800/30 rounded-2xl border border-slate-600/30">
                    No results available yet
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Judges Section */}
          <div className="px-6 pb-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <div className="bg-purple-500/20 rounded-full p-2 mr-3">
                <Eye className="h-4 w-4 text-purple-400" />
              </div>
              Judging Panel
            </h3>
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-600/40 rounded-2xl p-4">
              <div className="grid gap-3">
                {competition.judges
                  .sort((a, b) => a.category.localeCompare(b.category))
                  .map((judge, index) => (
                  <div key={index} className="flex items-center gap-3 bg-slate-700/30 rounded-lg px-3 py-2">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Eye className="h-4 w-4 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-slate-200 text-sm font-medium">{judge.name}</div>
                      <div className="text-slate-400 text-xs">{judge.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Instagram Link */}
          {competition.instagramlink && (
            <div className="px-6 pb-6">
              <a
                href={competition.instagramlink}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 bg-gradient-to-r from-pink-500/15 to-purple-500/10 border border-pink-400/30 rounded-2xl p-4 hover:from-pink-500/20 hover:to-purple-500/15 transition-all duration-300 hover:scale-[1.02]"
              >
                <Instagram className="h-5 w-5 text-pink-400" />
                <span className="text-pink-400 font-semibold text-base">Follow on Instagram</span>
                <ExternalLink className="h-4 w-4 text-pink-400/60" />
              </a>
            </div>
          )}
        </div>
      </div>


    </div>
  );
}
