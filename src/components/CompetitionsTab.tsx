
import { useState } from 'react';
import { CompetitionCard } from './CompetitionCard';
import { CompetitionDetail } from './CompetitionDetail';

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
  }
];

export interface CompetitionsTabProps {
  onSimulationSet?: (competitionName: string, predictions: { first: string; second: string; third: string }) => void;
}


export function CompetitionsTab({ onSimulationSet }: CompetitionsTabProps) {
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);

  // Sort competitions chronologically (newest first)
  const sortedCompetitions = competitions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
          <CompetitionCard
            key={competition.id}
            competition={competition}
            onClick={() => setSelectedCompetition(competition)}
          />
        ))}
      </div>

      {/* Competition Detail Modal */}
      {selectedCompetition && (
        <CompetitionDetail 
          competition={selectedCompetition} 
          onClose={() => setSelectedCompetition(null)} 
        />
      )}
    </div>
  );
}
