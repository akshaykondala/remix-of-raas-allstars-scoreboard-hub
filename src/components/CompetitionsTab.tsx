
import { useEffect, useState } from 'react';
import { CompetitionCard } from './CompetitionCard';
import { CompetitionDetail } from './CompetitionDetail';
import { ChevronDown } from 'lucide-react';
import { fetchFromDirectus } from '../lib/api';
import { Competition, SimulationData, Team } from '../lib/types';
import { mapCompetitionTeamsFull } from '../lib/competitionMapping';

export interface CompetitionsTabProps {
  onSimulationSet?: (competitionName: string, competitionId: string, predictions: { first: string; second: string; third: string }) => void;
  simulationData?: SimulationData;
  teams: any[];
  onTeamClick?: (team: any) => void;
}

// Fallback competition data for visualization
const fallbackCompetitions: Competition[] = [
  {
    id: '1',
    name: 'Raas Chaos',
    city: 'Atlanta, GA',
    date: '2024-01-15',
    logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop&crop=center',
    lineup: [
      { id: { id: '1' } as Team, name: 'Texas Raas' },
      { id: { id: '2' } as Team, name: 'CMU Raasta' },
      { id: { id: '3' } as Team, name: 'UF Gatoraas' },
      { id: { id: '4' } as Team, name: 'UCLA Nashaa' },
      { id: { id: '5' } as Team, name: 'Michigan Maize Mirchi' },
      { id: { id: '6' } as Team, name: 'NYU Bhangra' },
      { id: { id: '7' } as Team, name: 'Georgia Tech Raas' },
      { id: { id: '8' } as Team, name: 'Penn Aatish' }
    ],
    firstplace: '1',
    secondplace: '2', 
    thirdplace: '3',
    bid_status: true,
    judges: [
      { name: 'Rajesh Patel', category: 'Technique' },
      { name: 'Priya Sharma', category: 'Storytelling' },
      { name: 'Arjun Kumar', category: 'Overall Performance' }
    ],
    media: {
      photos: [],
      videos: []
    }
  },
  {
    id: '2',
    name: 'Bollywood Berkeley',
    city: 'Berkeley, CA',
    date: '2024-02-03',
    logo: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop&crop=center',
    lineup: [
      { id: { id: '4' } as Team, name: 'UCLA Nashaa' },
      { id: { id: '9' } as Team, name: 'USC Zeher' },
      { id: { id: '1' } as Team, name: 'Texas Raas' },
      { id: { id: '5' } as Team, name: 'Michigan Maize Mirchi' },
      { id: { id: '2' } as Team, name: 'CMU Raasta' },
      { id: { id: '6' } as Team, name: 'NYU Bhangra' },
      { id: { id: '8' } as Team, name: 'Penn Aatish' },
      { id: { id: '10' } as Team, name: 'UIUC Roshni' }
    ],
    firstplace: '4',
    secondplace: '1',
    thirdplace: '2',
    bid_status: true,
    judges: [
      { name: 'Neha Gupta', category: 'Technique' },
      { name: 'Vikram Singh', category: 'Expression' },
      { name: 'Anjali Mehta', category: 'Choreography' }
    ],
    media: {
      photos: [],
      videos: []
    }
  },
  {
    id: '3',
    name: 'East Coast Showdown',
    city: 'New York, NY',
    date: '2024-02-17',
    logo: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop&crop=center',
    lineup: [
      { id: { id: '6' } as Team, name: 'NYU Bhangra' },
      { id: { id: '8' } as Team, name: 'Penn Aatish' },
      { id: { id: '11' } as Team, name: 'Rutgers Raas' },
      { id: { id: '2' } as Team, name: 'CMU Raasta' },
      { id: { id: '12' } as Team, name: 'Case Western Raas' },
      { id: { id: '1' } as Team, name: 'Texas Raas' },
      { id: { id: '3' } as Team, name: 'UF Gatoraas' },
      { id: { id: '5' } as Team, name: 'Michigan Maize Mirchi' }
    ],
    firstplace: '6',
    secondplace: '8',
    thirdplace: '2',
    bid_status: true,
    judges: [
      { name: 'Rahul Khanna', category: 'Technique' },
      { name: 'Kavya Reddy', category: 'Innovation' },
      { name: 'Deepak Joshi', category: 'Stage Presence' }
    ],
    media: {
      photos: [],
      videos: []
    }
  },
  {
    id: '4',
    name: 'Midwest Magic',
    city: 'Chicago, IL',
    date: '2024-03-02',
    logo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&crop=center',
    lineup: [
      { id: { id: '5' } as Team, name: 'Michigan Maize Mirchi' },
      { id: { id: '10' } as Team, name: 'UIUC Roshni' },
      { id: { id: '12' } as Team, name: 'Case Western Raas' },
      { id: { id: '1' } as Team, name: 'Texas Raas' },
      { id: { id: '2' } as Team, name: 'CMU Raasta' },
      { id: { id: '6' } as Team, name: 'NYU Bhangra' },
      { id: { id: '3' } as Team, name: 'UF Gatoraas' },
      { id: { id: '4' } as Team, name: 'UCLA Nashaa' }
    ],
    firstplace: '5',
    secondplace: '1',
    thirdplace: '10',
    bid_status: true,
    judges: [
      { name: 'Sanjay Patel', category: 'Musicality' },
      { name: 'Meera Nair', category: 'Technique' },
      { name: 'Karan Thakur', category: 'Overall' }
    ],
    media: {
      photos: [],
      videos: []
    }
  },
  {
    id: '5',
    name: 'Spring Nationals',
    city: 'Austin, TX',
    date: '2025-03-15',
    logo: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop&crop=center',
    lineup: [
      { id: { id: '1' } as Team, name: 'Texas Raas' },
      { id: { id: '2' } as Team, name: 'CMU Raasta' },
      { id: { id: '3' } as Team, name: 'UF Gatoraas' },
      { id: { id: '4' } as Team, name: 'UCLA Nashaa' },
      { id: { id: '5' } as Team, name: 'Michigan Maize Mirchi' },
      { id: { id: '6' } as Team, name: 'NYU Bhangra' },
      { id: { id: '7' } as Team, name: 'Georgia Tech Raas' },
      { id: { id: '8' } as Team, name: 'Penn Aatish' }
    ],
    bid_status: true,
    judges: [{ name: 'TBD', category: 'All Categories' }],
    media: {
      photos: [],
      videos: []
    }
  },
  {
    id: '6',
    name: 'Raas All Stars',
    city: 'Los Angeles, CA',
    date: '2025-04-15',
    logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop&crop=center',
    lineup: [
      { id: { id: '1' } as Team, name: 'Texas Raas' },
      { id: { id: '2' } as Team, name: 'CMU Raasta' },
      { id: { id: '3' } as Team, name: 'UF Gatoraas' },
      { id: { id: '4' } as Team, name: 'UCLA Nashaa' },
      { id: { id: '5' } as Team, name: 'Michigan Maize Mirchi' },
      { id: { id: '6' } as Team, name: 'NYU Bhangra' },
      { id: { id: '7' } as Team, name: 'Georgia Tech Raas' },
      { id: { id: '8' } as Team, name: 'Penn Aatish' },
      { id: { id: '10' } as Team, name: 'UIUC Roshni' }
    ],
    bid_status: true,
    judges: [{ name: 'TBD', category: 'All Categories' }],
    media: {
      photos: [],
      videos: []
    }
  },
  {
    id: '7',
    name: 'Regional Showcase',
    city: 'Phoenix, AZ',
    date: '2024-11-20',
    logo: '',
    lineup: [
      { id: { id: '13' } as Team, name: 'ASU Moksha' },
      { id: { id: '14' } as Team, name: 'Arizona Raas' },
      { id: { id: '15' } as Team, name: 'UNLV Saptak' },
      { id: { id: '16' } as Team, name: 'Colorado Raas' }
    ],
    firstplace: '13',
    secondplace: '14',
    thirdplace: '15',
    bid_status: false,
    judges: [
      { name: 'Maya Singh', category: 'Technique' },
      { name: 'Raj Mehta', category: 'Expression' }
    ],
    media: {
      photos: [],
      videos: []
    }
  },
  {
    id: '8',
    name: 'Winter Workshop Comp',
    city: 'Seattle, WA',
    date: '2024-12-15',
    logo: '',
    lineup: [
      { id: { id: '17' } as Team, name: 'UW Jhankar' },
      { id: { id: '18' } as Team, name: 'Seattle Raas' },
      { id: { id: '19' } as Team, name: 'Portland Raas' },
      { id: { id: '20' } as Team, name: 'WSU Taal' },
      { id: { id: '21' } as Team, name: 'Oregon State Raas' }
    ],
    bid_status: false,
    judges: [
      { name: 'Arun Patel', category: 'Creativity' },
      { name: 'Lila Sharma', category: 'Synchronization' }
    ],
    media: {
      photos: [],
      videos: []
    }
  }
];

interface SimulationDropdownProps {
  teams: Array<{ id: string; name: string }>;
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

  if (!teams.length) {
    return (
      <div className="text-center text-slate-400 py-8">
        No teams available
      </div>
    );
  }

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
            return team.name;
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

export function CompetitionsTab({ onSimulationSet, simulationData, teams, onTeamClick }: CompetitionsTabProps) {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [simulatingCompetition, setSimulatingCompetition] = useState<Competition | null>(null);
  const [predictions, setPredictions] = useState<{ first: string; second: string; third: string }>({
    first: '',
    second: '',
    third: ''
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchCompetitions = async () => {
      const data = await fetchFromDirectus('competitions');
      
      // If no data from API, use fallback competition data
      if (!data || data.length === 0) {
        console.warn('No competition data from API, using fallback data');
        setCompetitions(fallbackCompetitions);
        setLoading(false);
        return;
      }

      const API_URL = import.meta.env.VITE_DIRECTUS_URL;
  
      const mapped = data.map(item => {
        const mappedComp = mapCompetitionTeamsFull(item, teams);
        console.log('[DEBUG] Raw item.lineup:', item.lineup);
        console.log('[DEBUG] Mapped lineup:', mappedComp.lineup);

        return mappedComp;
      });
  
      setCompetitions(mapped);
      setLoading(false);
    };
  
    fetchCompetitions();
  }, [teams]);

  const currentDate = new Date();
  const pastCompetitions = competitions.filter(comp => new Date(comp.date) < currentDate);
  const futureCompetitions = competitions.filter(comp => new Date(comp.date) >= currentDate);

  const handleSimulationStart = (competition: Competition) => {
    setSimulatingCompetition(competition);
    // Load existing predictions if available
    const existingData = simulationData?.[competition.id];
    if (existingData) {
      setPredictions(existingData.predictions);
    } else {
      setPredictions({ first: '', second: '', third: '' });
    }
    setShowSuccessMessage(false);
  };

  const handlePredictionChange = (position: 'first' | 'second' | 'third', team: string) => {
    setPredictions(prev => ({ ...prev, [position]: team }));
  };

  const handleSaveSimulation = () => {
    if (simulatingCompetition && predictions.first && predictions.second && predictions.third && onSimulationSet) {
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
    setPredictions({ first: '', second: '', third: '' });
    setShowSuccessMessage(false);
  };

  const canSaveSimulation = predictions.first && predictions.second && predictions.third && 
    predictions.first !== predictions.second && 
    predictions.first !== predictions.third && 
    predictions.second !== predictions.third;

  const getAvailableTeams = (position: 'first' | 'second' | 'third') => {
    if (!simulatingCompetition) return [];
    
    // Ensure lineup has the expected structure
    const availableTeams = simulatingCompetition.lineup
      .filter(team => {
        // Skip teams that are already selected in previous positions
        if (position === 'second' && String(team.id) === predictions.first) return false;
        if (position === 'third' && (String(team.id) === predictions.first || String(team.id) === predictions.second)) return false;
        return true;
      })
      .map(team => ({
        id: String(team.id),
        name: team.name
      }));
    
    return availableTeams;
  };

  useEffect(() => {
    if (selectedCompetition) {
      console.log('[DEBUG] Passing to CompetitionDetail:', selectedCompetition);
    }
  }, [selectedCompetition]);

  return (
    <div className="py-4 w-full overflow-hidden">
      <div className="mb-6 text-center px-4">
        <h2 className="text-xl font-bold text-white mb-2">Season Competitions</h2>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-slate-400 mt-2">Loading competitions...</p>
        </div>
      )}

      {/* Simulation Modal */}
      {simulatingCompetition && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Simulate {simulatingCompetition.name}</h3>
              <p className="text-slate-400 text-sm mb-6 text-center">Predict the top 3 teams for this competition</p>
              
              <div className="space-y-4 mb-6">
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
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleCancelSimulation}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-4 rounded-lg transition-colors min-h-[48px]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSimulation}
                  disabled={!canSaveSimulation}
                  className={`flex-1 px-4 py-4 rounded-lg transition-colors min-h-[48px] ${
                    showSuccessMessage 
                      ? 'bg-green-600 text-white' 
                      : canSaveSimulation 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {showSuccessMessage ? 'Prediction Saved!' : 'Save Prediction'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && (
        <div className="flex flex-col items-start w-full px-4">
          {/* Past Competitions */}
          {pastCompetitions.length > 0 && (
          <div className="mb-8 w-full">
            <h3 className="text-lg font-bold text-white mb-3">Past Competitions</h3>
            <div className="space-y-3 w-full flex flex-col items-start">
              {pastCompetitions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((competition) => {
                const [year, month, day] = competition.date.split('-');
                const displayDate = `${month}/${day}/${year}`;
                return (
                  <CompetitionCard
                    key={competition.id}
                    competition={{ ...competition, date: displayDate }}
                    onClick={() => {
                      const { media, ...rest } = competition;
                      console.log('[DEBUG] Competition clicked:', { ...rest, media: { photos: [], videos: [] } });
                      setSelectedCompetition({ ...rest, media: { photos: [], videos: [] } });
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Divider Line */}
        {pastCompetitions.length > 0 && futureCompetitions.length > 0 && (
          <div className="my-8 w-full max-w-lg">
            <div className="border-t-2 border-dashed border-blue-500/70 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg whitespace-nowrap">
                UPCOMING COMPETITIONS
              </div>
            </div>
          </div>
        )}

        {/* Future Competitions */}
        {futureCompetitions.length > 0 && (
          <div className="w-full">
            <h3 className="text-lg font-bold text-white mb-2">Upcoming Competitions</h3>
            <p className="text-slate-400 text-sm mb-4">
              Click "Simulate" to predict results for future competitions
            </p>
            <div className="space-y-3 w-full flex flex-col items-start">
              {futureCompetitions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((competition) => {
                const [year, month, day] = competition.date.split('-');
                const displayDate = `${month}/${day}/${year}`;
                return (
                  <div key={competition.id} className="relative w-full max-w-sm">
                    <CompetitionCard
                      competition={{ ...competition, date: displayDate }}
                      onClick={() => {
                        const { media, ...rest } = competition;
                        setSelectedCompetition({ ...rest, media: { photos: [], videos: [] } });
                      }}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSimulationStart(competition);
                      }}
                      className="absolute top-3 right-6 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs transition-colors font-semibold z-10"
                    >
                      Simulate
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        </div>
      )}

      {/* Competition Detail Modal */}
      {selectedCompetition && (
        <>
        <CompetitionDetail 
          competition={selectedCompetition} 
          onClose={() => setSelectedCompetition(null)}
          onSimulationSet={onSimulationSet}
          simulationData={simulationData}
          teams={teams}
          onTeamClick={onTeamClick}
        />
        </>
      )}
    </div>
  );
}
