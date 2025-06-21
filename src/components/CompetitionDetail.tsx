
import { useState } from 'react';
import { X, Trophy, Users, Eye, Camera, ChevronDown } from 'lucide-react';
import { Competition } from './CompetitionsTab';

interface CompetitionDetailProps {
  competition: Competition;
  onClose: () => void;
  onSimulationSet?: (competitionName: string, predictions: { first: string; second: string; third: string }) => void;
}

interface SimulationDropdownProps {
  teams: string[];
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
          {selectedTeam || placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 text-white transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
          {teams.map((team) => (
            <button
              key={team}
              onClick={() => {
                onSelect(team);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-sm truncate"
            >
              {team}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function CompetitionDetail({ competition, onClose, onSimulationSet }: CompetitionDetailProps) {
  const [predictions, setPredictions] = useState<{ first: string; second: string; third: string }>({
    first: competition.placings.first || '',
    second: competition.placings.second || '',
    third: competition.placings.third || ''
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    }); 
  };

  const isFutureCompetition = !competition.placings.first;

  const handlePredictionChange = (position: 'first' | 'second' | 'third', team: string) => {
    setPredictions(prev => ({ ...prev, [position]: team }));
  };

  const handleSaveSimulation = () => {
    if (predictions.first && predictions.second && predictions.third && onSimulationSet) {
      onSimulationSet(competition.name, predictions);
      onClose();
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
        return competition.lineup.filter(team => team !== predictions.first);
      case 'third':
        return competition.lineup.filter(team => team !== predictions.first && team !== predictions.second);
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
            className="text-slate-400 hover:text-white transition-colors p-2"
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
                <div key={index} className="bg-slate-800 rounded-lg px-3 py-2 text-slate-300 text-sm">
                  {team}
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
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors font-semibold"
                  >
                    Save Predictions
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-600/20 to-yellow-400/10 rounded-lg px-3 py-2 border border-yellow-600/30">
                  <div className="w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                  <span className="text-white font-semibold">{competition.placings.first}</span>
                </div>
                <div className="flex items-center gap-3 bg-gradient-to-r from-slate-500/20 to-slate-400/10 rounded-lg px-3 py-2 border border-slate-500/30">
                  <div className="w-6 h-6 bg-slate-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                  <span className="text-white font-semibold">{competition.placings.second}</span>
                </div>
                <div className="flex items-center gap-3 bg-gradient-to-r from-orange-600/20 to-orange-400/10 rounded-lg px-3 py-2 border border-orange-600/30">
                  <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                  <span className="text-white font-semibold">{competition.placings.third}</span>
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
              {competition.judges.map((judge, index) => (
                <div key={index} className="bg-slate-800 rounded-lg px-3 py-2 text-slate-300 text-sm">
                  {judge}
                </div>
              ))}
            </div>
          </div>

          {/* Media */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Camera className="h-4 w-4 text-green-400" />
              Media
            </h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-slate-400 text-sm mb-2">Photos</h4>
                <div className="grid grid-cols-2 gap-2">
                  {competition.media.photos.map((photo, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                      <img 
                        src={`https://images.unsplash.com/${photo}?w=200&h=200&fit=crop&crop=center`}
                        alt={`Competition photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {competition.media.videos.length > 0 && (
                <div>
                  <h4 className="text-slate-400 text-sm mb-2">Videos</h4>
                  <div className="text-slate-500 text-sm">Videos coming soon...</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
