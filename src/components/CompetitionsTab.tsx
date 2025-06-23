import { useState } from 'react';
import { CompetitionCard } from './CompetitionCard';
import { CompetitionDetail } from './CompetitionDetail';
import { MapPin, Calendar, Trophy, Users, CheckCircle } from 'lucide-react';

interface Competition {
  id: string;
  name: string;
  location: string;
  date: string;
  teams: string[];
  description: string;
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

interface CompetitionsTabProps {
  onSimulationSet: (competitionName: string, competitionId: string, predictions: { first: string; second: string; third: string }) => void;
  simulationData: { [competitionId: string]: SimulationData | undefined };
}

const competitions: Competition[] = [
  {
    id: '1',
    name: 'Lone Star Raas',
    location: 'Austin, TX',
    date: '2024-03-02',
    teams: ['Texas Raas', 'CMU Raasta', 'UF Gatoraas', 'UCLA Nashaa', 'Michigan Maize Mirchi'],
    description: 'Annual Raas competition hosted in Austin, Texas.'
  },
  {
    id: '2',
    name: 'Raas Chaos',
    location: 'Atlanta, GA',
    date: '2024-03-09',
    teams: ['Georgia Tech Raas', 'Penn Aatish', 'UIUC Roshni', 'Rutgers Raas', 'USC Zeher'],
    description: 'A high-energy Raas competition held in Atlanta, Georgia.'
  },
  {
    id: '3',
    name: 'Windy City Raas',
    location: 'Chicago, IL',
    date: '2024-03-16',
    teams: ['UIUC Roshni', 'Michigan Maize Mirchi', 'Case Western Raas', 'Texas Raas', 'NYU Bhangra'],
    description: 'Raas competition in the heart of Chicago, Illinois.'
  },
  {
    id: '4',
    name: 'Liberty Raas',
    location: 'Philadelphia, PA',
    date: '2024-03-23',
    teams: ['Penn Aatish', 'Rutgers Raas', 'CMU Raasta', 'UCLA Nashaa', 'Georgia Tech Raas'],
    description: 'Raas competition celebrating freedom and dance in Philadelphia.'
  }
];

export const CompetitionsTab = ({ onSimulationSet, simulationData }: CompetitionsTabProps) => {
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [savedPredictions, setSavedPredictions] = useState<{ [key: string]: boolean }>({});

  const handleSimulationSet = (competitionName: string, competitionId: string, predictions: { first: string; second: string; third: string }) => {
    onSimulationSet(competitionName, competitionId, predictions);
    setSavedPredictions(prev => ({ ...prev, [competitionId]: true }));
    
    // Clear the saved state after 2 seconds
    setTimeout(() => {
      setSavedPredictions(prev => ({ ...prev, [competitionId]: false }));
    }, 2000);
  };

  const handleDropdownOpen = (competitionId: string, placement: string) => {
    const dropdownId = `${competitionId}-${placement}`;
    setOpenDropdownId(openDropdownId === dropdownId ? null : dropdownId);
  };

  return (
    <div className="py-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Competitions</h2>
        <p className="text-slate-400 text-sm">
          View upcoming competitions and simulate results
        </p>
      </div>

      <div className="grid gap-4">
        {competitions.map((competition) => (
          <CompetitionCard 
            key={competition.id}
            competition={competition}
            onSimulationSet={handleSimulationSet}
            simulationData={simulationData[competition.id]}
            onClick={() => setSelectedCompetition(competition)}
            openDropdownId={openDropdownId}
            onDropdownOpen={handleDropdownOpen}
            showSavedFeedback={savedPredictions[competition.id]}
          />
        ))}
      </div>

      {selectedCompetition && (
        <CompetitionDetail 
          competition={selectedCompetition}
          onClose={() => setSelectedCompetition(null)}
        />
      )}
    </div>
  );
};
