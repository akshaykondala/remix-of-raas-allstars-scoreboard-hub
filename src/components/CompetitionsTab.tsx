import { useState } from 'react';
import { CompetitionCard } from './CompetitionCard';
import { CompetitionDetail } from './CompetitionDetail';
import { Zap, Target, Trophy } from 'lucide-react';

export interface Competition {
  id: string;
  name: string;
  city: string;
  date: string;
  logo: string;
  lineup: string[];
  placings: {
    first: string;
    second: string;
    third: string;
  };
  judges: string[];
  media: {
    photos: string[];
    videos: string[];
  };
}

interface CompetitionsTabProps {
  onSimulationSet: (competitionName: string, predictions: { first: string; second: string; third: string }) => void;
}

const competitions: Competition[] = [
  {
    id: '1',
    name: 'Raas Chaos',
    city: 'Atlanta, GA',
    date: '2024-01-15',
    logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop&crop=center',
    lineup: ['Texas Raas', 'CMU Raasta', 'UF Gatoraas', 'UCLA Nashaa', 'Michigan Maize Mirchi', 'NYU Bhangra', 'Georgia Tech Raas', 'Penn Aatish'],
    placings: {
      first: 'Texas Raas',
      second: 'CMU Raasta',
      third: 'UF Gatoraas'
    },
    judges: ['Rajesh Patel', 'Priya Sharma', 'Arjun Kumar'],
    media: {
      photos: ['photo-1488590528505-98d2b5aba04b', 'photo-1518770660439-4636190af475'],
      videos: []
    }
  },
  {
    id: '2',
    name: 'Bollywood Berkeley',
    city: 'Berkeley, CA',
    date: '2024-02-03',
    logo: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop&crop=center',
    lineup: ['UCLA Nashaa', 'USC Zeher', 'Texas Raas', 'Michigan Maize Mirchi', 'CMU Raasta', 'NYU Bhangra', 'Penn Aatish', 'UIUC Roshni'],
    placings: {
      first: 'UCLA Nashaa',
      second: 'Texas Raas',
      third: 'CMU Raasta'
    },
    judges: ['Neha Gupta', 'Vikram Singh', 'Anjali Mehta'],
    media: {
      photos: ['photo-1486312338219-ce68d2c6f44d', 'photo-1581091226825-a6a2a5aee158'],
      videos: []
    }
  },
  {
    id: '3',
    name: 'East Coast Showdown',
    city: 'New York, NY',
    date: '2024-02-17',
    logo: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop&crop=center',
    lineup: ['NYU Bhangra', 'Penn Aatish', 'Rutgers Raas', 'CMU Raasta', 'Case Western Raas', 'Texas Raas', 'UF Gatoraas', 'Michigan Maize Mirchi'],
    placings: {
      first: 'CMU Raasta',
      second: 'NYU Bhangra',
      third: 'Penn Aatish'
    },
    judges: ['Rahul Khanna', 'Kavya Reddy', 'Deepak Joshi'],
    media: {
      photos: ['photo-1518770660439-4636190af475', 'photo-1461749280684-dccba630e2f6'],
      videos: []
    }
  },
  {
    id: '4',
    name: 'Midwest Magic',
    city: 'Chicago, IL',
    date: '2024-03-02',
    logo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&crop=center',
    lineup: ['Michigan Maize Mirchi', 'UIUC Roshni', 'Case Western Raas', 'Texas Raas', 'CMU Raasta', 'NYU Bhangra', 'UF Gatoraas', 'UCLA Nashaa'],
    placings: {
      first: 'Michigan Maize Mirchi',
      second: 'Texas Raas',
      third: 'UIUC Roshni'
    },
    judges: ['Sanjay Patel', 'Meera Nair', 'Karan Thakur'],
    media: {
      photos: ['photo-1486312338219-ce68d2c6f44d', 'photo-1488590528505-98d2b5aba04b'],
      videos: []
    }
  },
  {
    id: '5',
    name: 'Raas All Stars',
    city: 'Los Angeles, CA',
    date: '2024-04-15',
    logo: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop&crop=center',
    lineup: ['Texas Raas', 'CMU Raasta', 'UF Gatoraas', 'UCLA Nashaa', 'Michigan Maize Mirchi', 'NYU Bhangra', 'Georgia Tech Raas', 'Penn Aatish', 'UIUC Roshni'],
    placings: {
      first: 'Texas Raas',
      second: 'CMU Raasta',
      third: 'UF Gatoraas'
    },
    judges: ['Ravi Desai', 'Shreya Ghoshal', 'Arjun Rampal', 'Priyanka Chopra'],
    media: {
      photos: ['photo-1518770660439-4636190af475', 'photo-1581091226825-a6a2a5aee158'],
      videos: []
    }
  },
  {
    id: '6',
    name: 'Spring Showcase',
    city: 'Boston, MA',
    date: '2024-12-15',
    logo: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop&crop=center',
    lineup: ['Texas Raas', 'CMU Raasta', 'UF Gatoraas', 'UCLA Nashaa', 'Michigan Maize Mirchi', 'NYU Bhangra', 'Georgia Tech Raas', 'Penn Aatish'],
    placings: {
      first: '',
      second: '',
      third: ''
    },
    judges: ['TBD'],
    media: {
      photos: [],
      videos: []
    }
  },
  {
    id: '7',
    name: 'National Championships 2025',
    city: 'Dallas, TX',
    date: '2025-03-20',
    logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop&crop=center',
    lineup: ['Texas Raas', 'CMU Raasta', 'UF Gatoraas', 'UCLA Nashaa', 'Michigan Maize Mirchi', 'NYU Bhangra', 'Georgia Tech Raas', 'Penn Aatish', 'UIUC Roshni'],
    placings: {
      first: '',
      second: '',
      third: ''
    },
    judges: ['TBD'],
    media: {
      photos: [],
      videos: []
    }
  }
];

export function CompetitionsTab({ onSimulationSet }: CompetitionsTabProps) {
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [simulatingCompetition, setSimulatingCompetition] = useState<Competition | null>(null);
  const [predictions, setPredictions] = useState({
    first: '',
    second: '',
    third: ''
  });

  // Sort competitions chronologically (newest first)
  const sortedCompetitions = competitions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const isFutureCompetition = (date: string) => {
    return new Date(date) > new Date();
  };

  const handleSimulateClick = (competition: Competition) => {
    setSimulatingCompetition(competition);
    setPredictions({ first: '', second: '', third: '' });
  };

  const handlePredictionSubmit = () => {
    if (simulatingCompetition && predictions.first && predictions.second && predictions.third) {
      onSimulationSet(simulatingCompetition.name, predictions);
      setSimulatingCompetition(null);
      setPredictions({ first: '', second: '', third: '' });
    }
  };

  const teamOptions = [
    'Texas Raas', 'CMU Raasta', 'UF Gatoraas', 'UCLA Nashaa', 'Michigan Maize Mirchi', 
    'NYU Bhangra', 'Georgia Tech Raas', 'Penn Aatish', 'UIUC Roshni', 'Rutgers Raas', 
    'USC Zeher', 'Case Western Raas'
  ];

  return (
    <div className="py-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Season Competitions</h2>
        <p className="text-slate-400 text-sm">
          Track competitions throughout the 2024 season
        </p>
      </div>

      <div className="grid gap-3">
        {sortedCompetitions.map((competition) => (
          <div key={competition.id} className="relative">
            <CompetitionCard
              competition={competition}
              onClick={() => setSelectedCompetition(competition)}
            />
            {isFutureCompetition(competition.date) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSimulateClick(competition);
                }}
                className="absolute top-3 right-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1 transition-colors z-10"
              >
                <Zap className="h-3 w-3" />
                Simulate
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Competition Detail Modal */}
      {selectedCompetition && (
        <CompetitionDetail 
          competition={selectedCompetition} 
          onClose={() => setSelectedCompetition(null)} 
        />
      )}

      {/* Simulation Modal */}
      {simulatingCompetition && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Simulate Results
                </h3>
                <button
                  onClick={() => setSimulatingCompetition(null)}
                  className="text-slate-400 hover:text-white p-2 -m-2"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-4">
                <h4 className="text-white font-semibold mb-2">{simulatingCompetition.name}</h4>
                <p className="text-slate-400 text-sm">{simulatingCompetition.city} • {new Date(simulatingCompetition.date).toLocaleDateString()}</p>
              </div>

              <div className="space-y-4 mb-6">
                {/* First Place */}
                <div>
                  <label className="block text-slate-300 text-sm mb-2 flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-400" />
                    1st Place
                  </label>
                  <select
                    value={predictions.first}
                    onChange={(e) => setPredictions(prev => ({ ...prev, first: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    <option value="">Select team...</option>
                    {teamOptions.map(team => (
                      <option key={team} value={team} disabled={team === predictions.second || team === predictions.third}>
                        {team}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Second Place */}
                <div>
                  <label className="block text-slate-300 text-sm mb-2 flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-slate-400" />
                    2nd Place
                  </label>
                  <select
                    value={predictions.second}
                    onChange={(e) => setPredictions(prev => ({ ...prev, second: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    <option value="">Select team...</option>
                    {teamOptions.map(team => (
                      <option key={team} value={team} disabled={team === predictions.first || team === predictions.third}>
                        {team}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Third Place */}
                <div>
                  <label className="block text-slate-300 text-sm mb-2 flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-orange-400" />
                    3rd Place
                  </label>
                  <select
                    value={predictions.third}
                    onChange={(e) => setPredictions(prev => ({ ...prev, third: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    <option value="">Select team...</option>
                    {teamOptions.map(team => (
                      <option key={team} value={team} disabled={team === predictions.first || team === predictions.second}>
                        {team}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handlePredictionSubmit}
                disabled={!predictions.first || !predictions.second || !predictions.third}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Target className="h-4 w-4" />
                Apply Simulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
