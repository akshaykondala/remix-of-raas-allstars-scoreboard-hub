import { useState, useEffect } from 'react';
import { Trophy, Target, Check, Clock } from 'lucide-react';
import { Competition, Team } from '../lib/types';
import { Button } from './ui/button';

interface Prediction {
  competitionId: string;
  first: string;
  second: string;
  third: string;
}

interface FantasyPredictionsProps {
  competitions: Competition[];
  onClose: () => void;
}

export function FantasyPredictions({ competitions, onClose }: FantasyPredictionsProps) {
  const [predictions, setPredictions] = useState<Record<string, Prediction>>({});
  const [savedPredictions, setSavedPredictions] = useState<Record<string, Prediction>>({});

  // Get current week's competitions (competitions within next 7 days)
  const getCurrentWeekCompetitions = () => {
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return competitions.filter(comp => {
      const compDate = new Date(comp.date);
      return compDate >= now && compDate <= oneWeekFromNow;
    });
  };

  const currentWeekComps = getCurrentWeekCompetitions();

  // Load saved predictions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('fantasyPredictions');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSavedPredictions(parsed);
      setPredictions(parsed);
    }
  }, []);

  const handleTeamSelect = (competitionId: string, position: 'first' | 'second' | 'third', teamId: string) => {
    setPredictions(prev => ({
      ...prev,
      [competitionId]: {
        ...prev[competitionId],
        competitionId,
        first: position === 'first' ? teamId : prev[competitionId]?.first || '',
        second: position === 'second' ? teamId : prev[competitionId]?.second || '',
        third: position === 'third' ? teamId : prev[competitionId]?.third || '',
      }
    }));
  };

  const savePredictions = () => {
    localStorage.setItem('fantasyPredictions', JSON.stringify(predictions));
    setSavedPredictions(predictions);
  };

  const calculatePoints = (competition: Competition, prediction: Prediction) => {
    if (!competition.firstplace || !competition.secondplace || !competition.thirdplace) {
      return null; // Results not available yet
    }

    let points = 0;
    if (prediction.first === competition.firstplace) points += 5;
    if (prediction.second === competition.secondplace) points += 3;
    if (prediction.third === competition.thirdplace) points += 2;
    
    return points;
  };

  const totalPoints = currentWeekComps.reduce((total, comp) => {
    const prediction = savedPredictions[comp.id];
    if (!prediction) return total;
    const points = calculatePoints(comp, prediction);
    return total + (points || 0);
  }, 0);

  if (currentWeekComps.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-6">
          <div className="text-center">
            <Clock className="h-12 w-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">No Upcoming Competitions</h3>
            <p className="text-slate-400 mb-4">Check back soon for the next week's competitions to make your predictions!</p>
            <Button onClick={onClose} className="w-full">Close</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full my-8">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-white">Make Your Predictions</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 -m-2"
            >
              ✕
            </button>
          </div>
          <p className="text-slate-400 text-sm">Select your top 3 for each competition this week</p>
          
          {totalPoints > 0 && (
            <div className="mt-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                <span className="text-white font-bold">Total Points: {totalPoints}</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {currentWeekComps.map(comp => {
            const prediction = predictions[comp.id];
            const savedPrediction = savedPredictions[comp.id];
            const points = savedPrediction ? calculatePoints(comp, savedPrediction) : null;
            const hasResults = !!(comp.firstplace && comp.secondplace && comp.thirdplace);

            return (
              <div key={comp.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold">{comp.name}</h3>
                    <p className="text-slate-400 text-sm">{new Date(comp.date).toLocaleDateString()}</p>
                  </div>
                  {points !== null && hasResults && (
                    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-lg px-3 py-1">
                      <span className="text-yellow-400 font-bold">{points} pts</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {['first', 'second', 'third'].map((position) => {
                    const label = position === 'first' ? '1st' : position === 'second' ? '2nd' : '3rd';
                    const pointValue = position === 'first' ? 5 : position === 'second' ? 3 : 2;
                    const selectedTeamId = prediction?.[position as keyof Prediction];
                    const correctTeamId = comp[`${position}place` as keyof Competition] as string;
                    const isCorrect = hasResults && selectedTeamId === correctTeamId;

                    return (
                      <div key={position} className="space-y-2">
                        <label className="text-slate-300 text-sm font-medium flex items-center gap-2">
                          <Trophy className={`h-4 w-4 ${position === 'first' ? 'text-yellow-400' : position === 'second' ? 'text-slate-400' : 'text-orange-400'}`} />
                          {label} Place ({pointValue} pts)
                          {isCorrect && <Check className="h-4 w-4 text-green-400 ml-auto" />}
                        </label>
                        <select
                          value={selectedTeamId || ''}
                          onChange={(e) => handleTeamSelect(comp.id, position as 'first' | 'second' | 'third', e.target.value)}
                          disabled={hasResults}
                          className={`w-full bg-slate-800 border ${isCorrect ? 'border-green-400' : 'border-slate-600'} text-white rounded-lg px-3 py-2 text-sm ${hasResults ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                          <option value="">Select team...</option>
                          {comp.lineup.map((teamObj) => (
                            <option key={teamObj.id.id} value={teamObj.id.id}>
                              {teamObj.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-6 border-t border-slate-700 bg-slate-800/50">
          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={savePredictions} 
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <Target className="h-4 w-4 mr-2" />
              Save Predictions
            </Button>
          </div>
          <p className="text-slate-400 text-xs text-center mt-3">
            Predictions are saved locally. Points: 1st=5pts, 2nd=3pts, 3rd=2pts
          </p>
        </div>
      </div>
    </div>
  );
}
