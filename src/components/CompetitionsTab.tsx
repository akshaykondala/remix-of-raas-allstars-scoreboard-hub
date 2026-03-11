import { useEffect, useState } from 'react';
import { CompetitionDetail } from './CompetitionDetail';
import { CompetitionTimeline } from './CompetitionTimeline';
import { ChevronDown } from 'lucide-react';
import { Competition, SimulationData, Team } from '../lib/types';
import { mapCompetitionTeamsFull } from '../lib/competitionMapping';
export interface CompetitionsTabProps {
  competitions: Competition[];
  onSimulationSet?: (competitionName: string, competitionId: string, predictions: {
    first: string;
    second: string;
    third: string;
  }) => void;
  simulationData?: SimulationData;
  teams: any[];
  onTeamClick?: (team: any) => void;
}



interface SimulationDropdownProps {
  teams: Array<{
    id: string;
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
  if (!teams.length) {
    return <div className="text-center text-muted-foreground py-8">
        No teams available
      </div>;
  }
  return <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className={`w-full flex items-center gap-3 bg-gradient-to-r ${getBackgroundColor()} rounded-lg px-3 py-3 border text-left min-h-[48px]`}>
        <div className={`w-6 h-6 ${getNumberColor()} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
          {position === 'first' ? '1' : position === 'second' ? '2' : '3'}
        </div>
        <span className="text-foreground font-semibold flex-1 truncate text-sm">
          {(() => {
          const team = teams.find(t => t.id === selectedTeam);
          if (!team) return placeholder;
          return team.name;
        })()}
        </span>
        <ChevronDown className={`h-4 w-4 text-foreground transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
          {teams.map(team => <button key={team.id} onClick={() => {
        onSelect(team.id);
        setIsOpen(false);
      }} className="w-full text-left px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors text-sm truncate">
              {team.name}
            </button>)}
        </div>}
    </div>;
}
export function CompetitionsTab({
  competitions,
  onSimulationSet,
  simulationData,
  teams,
  onTeamClick
}: CompetitionsTabProps) {
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [simulatingCompetition, setSimulatingCompetition] = useState<Competition | null>(null);
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
  const currentDate = new Date();
  const pastCompetitions = competitions.filter(comp => comp.date && new Date(comp.date) < currentDate);
  const futureCompetitions = competitions.filter(comp => !comp.date || new Date(comp.date) >= currentDate);
  const handleSimulationStart = (competition: Competition) => {
    setSimulatingCompetition(competition);
    // Load existing predictions if available
    const existingData = simulationData?.[competition.id];
    if (existingData) {
      setPredictions(existingData.predictions);
    } else {
      setPredictions({
        first: '',
        second: '',
        third: ''
      });
    }
    setShowSuccessMessage(false);
  };
  const handlePredictionChange = (position: 'first' | 'second' | 'third', team: string) => {
    setPredictions(prev => ({
      ...prev,
      [position]: team
    }));
  };
  const simulatingLineupSize = simulatingCompetition ? (Array.isArray(simulatingCompetition.lineup) ? simulatingCompetition.lineup.length : 0) : 0;
  const simulatingHasThirdPlace = simulatingLineupSize > 6;

  const handleSaveSimulation = () => {
    if (simulatingCompetition && predictions.first && predictions.second && (simulatingHasThirdPlace ? predictions.third : true) && onSimulationSet) {
      onSimulationSet(simulatingCompetition.name, simulatingCompetition.id, predictions);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setSimulatingCompetition(null);
        setShowSuccessMessage(false);
      }, 1500);
    }
  };
  const handleCancelSimulation = () => {
    setSimulatingCompetition(null);
    setPredictions({
      first: '',
      second: '',
      third: ''
    });
    setShowSuccessMessage(false);
  };
  const canSaveSimulation = predictions.first && predictions.second && (simulatingHasThirdPlace ? predictions.third : true) && predictions.first !== predictions.second && (!simulatingHasThirdPlace || (predictions.first !== predictions.third && predictions.second !== predictions.third));
  const getAvailableTeams = (position: 'first' | 'second' | 'third') => {
    if (!simulatingCompetition) return [];

    // Ensure lineup has the expected structure
    const availableTeams = simulatingCompetition.lineup.filter(team => {
      // Skip teams that are already selected in previous positions
      if (position === 'second' && String(team.id) === predictions.first) return false;
      if (position === 'third' && (String(team.id) === predictions.first || String(team.id) === predictions.second)) return false;
      return true;
    }).map(team => ({
      id: String(team.id),
      name: team.name
    }));
    return availableTeams;
  };
  return <div className="pb-4 w-full overflow-hidden" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 1.5rem)' }}>


      {/* Simulation Modal */}
      {simulatingCompetition && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-4 text-center">Simulate {simulatingCompetition.name}</h3>
              <p className="text-muted-foreground text-sm mb-6 text-center">Predict the top {simulatingHasThirdPlace ? '3' : '2'} teams for this competition</p>
              
              <div className="space-y-4 mb-6">
                <SimulationDropdown teams={getAvailableTeams('first')} selectedTeam={predictions.first} onSelect={team => handlePredictionChange('first', team)} placeholder="Select 1st place team" position="first" />
                <SimulationDropdown teams={getAvailableTeams('second')} selectedTeam={predictions.second} onSelect={team => handlePredictionChange('second', team)} placeholder="Select 2nd place team" position="second" />
                {simulatingHasThirdPlace && <SimulationDropdown teams={getAvailableTeams('third')} selectedTeam={predictions.third} onSelect={team => handlePredictionChange('third', team)} placeholder="Select 3rd place team" position="third" />}
              </div>
              
              <div className="flex gap-3">
                <button onClick={handleCancelSimulation} className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground px-4 py-4 rounded-lg transition-colors min-h-[48px]">
                  Cancel
                </button>
                <button onClick={handleSaveSimulation} disabled={!canSaveSimulation} className={`flex-1 px-4 py-4 rounded-lg transition-colors min-h-[48px] ${showSuccessMessage ? 'bg-green-600 text-white' : canSaveSimulation ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}>
                  {showSuccessMessage ? 'Prediction Saved!' : 'Save Prediction'}
                </button>
              </div>
            </div>
          </div>
        </div>}

      <div className="flex flex-col items-center w-full">
          <CompetitionTimeline
            competitions={[...competitions].sort((a, b) => {
              if (!a.date && !b.date) return 0;
              if (!a.date) return 1;
              if (!b.date) return -1;
              return new Date(a.date).getTime() - new Date(b.date).getTime();
            })}
            onCompetitionClick={competition => {
              const mapped = mapCompetitionTeamsFull(competition, teams);
              setSelectedCompetition({
                ...mapped,
                media: { photos: [], videos: [] }
              });
            }}
            onSimulationStart={handleSimulationStart}
          />
        </div>

      {/* Competition Detail Modal */}
      {selectedCompetition && <>
        <CompetitionDetail competition={selectedCompetition} onClose={() => setSelectedCompetition(null)} onSimulationSet={onSimulationSet} simulationData={simulationData} teams={teams} onTeamClick={onTeamClick} />
        </>}
    </div>;
}