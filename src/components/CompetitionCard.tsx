import { useState } from 'react';
import { MapPin, Calendar, Trophy, Users, ChevronDown, CheckCircle } from 'lucide-react';
import { TeamSelector } from './TeamSelector';

interface Competition {
  id: string;
  name: string;
  location: string;
  date: string;
  teams: string[];
}

interface SimulationData {
  competitionName: string;
  competitionId: string;
  predictions: {
    first: string;
    second: string;
    third: string;
  };
}

interface CompetitionCardProps {
  competition: Competition;
  onClick: () => void;
  onSimulationSet: (competitionName: string, competitionId: string, predictions: { first: string; second: string; third: string }) => void;
  simulationData?: SimulationData;
  openDropdownId: string | null;
  onDropdownOpen: (competitionId: string, placement: string) => void;
  showSavedFeedback?: boolean;
}

export const CompetitionCard = ({ 
  competition, 
  onClick, 
  onSimulationSet, 
  simulationData,
  openDropdownId,
  onDropdownOpen,
  showSavedFeedback = false
}: CompetitionCardProps) => {
  const [predictions, setPredictions] = useState({
    first: simulationData?.predictions.first || '',
    second: simulationData?.predictions.second || '',
    third: simulationData?.predictions.third || ''
  });

  const handleTeamSelect = (placement: string, team: string) => {
    setPredictions(prev => ({ ...prev, [placement]: team }));
    onDropdownOpen('', ''); // Close dropdown
  };

  const handleSavePrediction = () => {
    if (predictions.first && predictions.second && predictions.third) {
      onSimulationSet(competition.name, competition.id, predictions);
    }
  };

  const canSave = predictions.first && predictions.second && predictions.third;
  const isDropdownOpen = (placement: string) => openDropdownId === `${competition.id}-${placement}`;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6">
      {/* Competition Header */}
      <div className="cursor-pointer" onClick={onClick}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1 break-words">{competition.name}</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="break-words">{competition.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>{competition.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 flex-shrink-0" />
                <span>{competition.teams.length} teams</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulation Section */}
      <div className="border-t border-slate-700 pt-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-white font-semibold flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-400" />
            Simulate Results
          </h4>
          {showSavedFeedback && (
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle className="h-4 w-4" />
              Predictions Saved
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {['first', 'second', 'third'].map((placement) => (
            <div key={placement} className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDropdownOpen(competition.id, placement);
                }}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-left text-white hover:border-slate-500 transition-colors flex items-center justify-between"
              >
                <span className="text-sm">
                  {predictions[placement as keyof typeof predictions] || `${placement === 'first' ? '1st' : placement === 'second' ? '2nd' : '3rd'} Place`}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>
              
              {isDropdownOpen(placement) && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1">
                  <TeamSelector
                    teams={competition.teams}
                    onSelect={(team) => handleTeamSelect(placement, team)}
                    selectedTeams={Object.values(predictions)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleSavePrediction}
          disabled={!canSave}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            canSave
              ? showSavedFeedback
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-slate-700 text-slate-400 cursor-not-allowed'
          }`}
        >
          {showSavedFeedback ? 'Predictions Saved' : 'Save Prediction'}
        </button>
      </div>
    </div>
  );
};
