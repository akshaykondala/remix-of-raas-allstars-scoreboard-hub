
import { useState, useEffect } from 'react';
import { X, Trophy, Users, Eye, Camera, ChevronDown } from 'lucide-react';
import { Competition, SimulationData, Team } from '../lib/types';

interface CompetitionDetailProps {
  competition: Competition;
  onClose: () => void;
  onSimulationSet?: (competitionName: string, competitionId: string, predictions: { first: string; second: string; third: string }) => void;
  simulationData?: SimulationData;
  teams?: Team[]; // <-- add teams prop
}

interface SimulationDropdownProps {
  teams: any[]; // now array of team objects
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
          {teams.find(t => t.id === selectedTeam)?.name || placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 text-white transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => {
                onSelect(team.id);
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

export function CompetitionDetail({ competition, onClose, onSimulationSet, simulationData, teams = [] }: CompetitionDetailProps) {
  console.log('[DEBUG] CompetitionDetail props:', { competition, onClose, onSimulationSet, simulationData, teams });
  console.log('[DEBUG] CompetitionDetail lineup:', competition?.lineup);
  const [predictions, setPredictions] = useState<{ first: string; second: string; third: string }>({
    first: '',
    second: '',
    third: ''
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Settable current date for testing; switch to `new Date()` for production
  // TODO: when we are ready to go live, switch to `new Date()`
  const CURRENT_DATE = new Date(2025, 1, 24); // February is month 1 (0-indexed)

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
        first: competition.placings.first || '',
        second: competition.placings.second || '',
        third: competition.placings.third || ''
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

  const canSaveSimulation = predictions.first && predictions.second && predictions.third && 
    predictions.first !== predictions.second && 
    predictions.first !== predictions.third && 
    predictions.second !== predictions.third;

  const getAvailableTeams = (position: 'first' | 'second' | 'third') => {
    switch (position) {
      case 'first':
        return competition.lineup;
      case 'second':
        return competition.lineup.filter(team => {
          const teamId = typeof team === 'string' ? team : (team as any).id;
          return teamId !== predictions.first;
        });
      case 'third':
        return competition.lineup.filter(team => {
          const teamId = typeof team === 'string' ? team : (team as any).id;
          return teamId !== predictions.first && teamId !== predictions.second;
        });
      default:
        return competition.lineup;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden">
              <img 
                src={competition.logo} 
                alt={`${competition.name} logo`}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{competition.name}</h2>
              <p className="text-slate-400 text-sm">{competition.city}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Date */}
          <div>
            <h3 className="text-white font-semibold mb-2">Date</h3>
            <p className="text-slate-300">{formatDate(competition.date)}</p>
          </div>

          {/* Lineup */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-400" />
              Lineup ({competition.lineup.length} teams)
            </h3>
            <div className="grid gap-2">
              {competition.lineup.map((team, index) => (
                <div key={index} className="bg-slate-800 rounded-lg px-3 py-2 text-slate-300 text-sm flex items-center gap-2">
                  <span>{typeof team === 'string' ? team : (team as any).name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Placings */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-400" />
              Top 3 Placings
            </h3>
            
            {isFutureCompetition ? (
              <div className="space-y-4">
                <p className="text-slate-400 text-sm mb-4">Select teams for predictions:</p>
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
              <div className="space-y-2">
                <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-600/20 to-yellow-400/10 rounded-lg px-3 py-2 border border-yellow-600/30">
                  <div className="w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                  <span className="text-white font-semibold">
                    {typeof competition.placings.first === 'string' ? competition.placings.first : (competition.placings.first as any).name}
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-gradient-to-r from-slate-500/20 to-slate-400/10 rounded-lg px-3 py-2 border border-slate-500/30">
                  <div className="w-6 h-6 bg-slate-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                  <span className="text-white font-semibold">
                    {typeof competition.placings.second === 'string' ? competition.placings.second : (competition.placings.second as any).name}
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-gradient-to-r from-orange-600/20 to-orange-400/10 rounded-lg px-3 py-2 border border-orange-600/30">
                  <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                  <span className="text-white font-semibold">
                    {typeof competition.placings.third === 'string' ? competition.placings.third : (competition.placings.third as any).name}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Judges */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Eye className="h-4 w-4 text-purple-400" />
              Judges
            </h3>
            <div className="grid gap-2">
              {competition.judges
                .sort((a, b) => a.category.localeCompare(b.category))
                .map((judge, index) => (
                <div key={index} className="bg-slate-800 rounded-lg px-3 py-2">
                  <div className="text-slate-300 text-sm font-medium">{judge.name}</div>
                  <div className="text-slate-500 text-xs">{judge.category}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Instagram Link Button */}
        {competition.instagramlink && (
          <div className="flex justify-center pb-6">
            <a
              href={competition.instagramlink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold px-5 py-3 rounded-full shadow-lg hover:scale-105 transition-transform text-lg"
            >
              {/* Instagram SVG icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="6" fill="url(#ig-gradient)"/>
                <defs>
                  <linearGradient id="ig-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F58529"/>
                    <stop offset="0.5" stopColor="#DD2A7B"/>
                    <stop offset="1" stopColor="#515BD4"/>
                  </linearGradient>
                </defs>
                <path d="M16.98 3H7.02C4.25 3 3 4.25 3 7.02V16.98C3 19.75 4.25 21 7.02 21H16.98C19.75 21 21 19.75 21 16.98V7.02C21 4.25 19.75 3 16.98 3ZM12 8.38C14 8.38 15.62 10 15.62 12C15.62 14 14 15.62 12 15.62C10 15.62 8.38 14 8.38 12C8.38 10 10 8.38 12 8.38ZM19.12 16.98C19.12 18.12 18.12 19.12 16.98 19.12H7.02C5.88 19.12 4.88 18.12 4.88 16.98V7.02C4.88 5.88 5.88 4.88 7.02 4.88H16.98C18.12 4.88 19.12 5.88 19.12 7.02V16.98ZM17.25 7.25C16.56 7.25 16 6.69 16 6C16 5.31 16.56 4.75 17.25 4.75C17.94 4.75 18.5 5.31 18.5 6C18.5 6.69 17.94 7.25 17.25 7.25Z" fill="white"/>
              </svg>
              Instagram
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
