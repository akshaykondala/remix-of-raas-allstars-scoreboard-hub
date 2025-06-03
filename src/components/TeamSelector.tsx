
import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  university: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const teams: Team[] = [
  {
    id: '1',
    name: 'Texas Raas',
    university: 'University of Texas at Austin',
    colors: { primary: 'bg-orange-600', secondary: 'bg-orange-700', accent: 'text-orange-400' }
  },
  {
    id: '2',
    name: 'CMU Raasta',
    university: 'Carnegie Mellon University',
    colors: { primary: 'bg-red-700', secondary: 'bg-red-800', accent: 'text-red-400' }
  },
  {
    id: '3',
    name: 'UF Gatoraas',
    university: 'University of Florida',
    colors: { primary: 'bg-blue-600', secondary: 'bg-blue-700', accent: 'text-blue-400' }
  },
  {
    id: '4',
    name: 'UCLA Nashaa',
    university: 'University of California, Los Angeles',
    colors: { primary: 'bg-blue-800', secondary: 'bg-blue-900', accent: 'text-blue-400' }
  },
  {
    id: '5',
    name: 'Michigan Maize Mirchi',
    university: 'University of Michigan',
    colors: { primary: 'bg-yellow-600', secondary: 'bg-yellow-700', accent: 'text-yellow-400' }
  },
  {
    id: '6',
    name: 'NYU Bhangra',
    university: 'New York University',
    colors: { primary: 'bg-purple-700', secondary: 'bg-purple-800', accent: 'text-purple-400' }
  }
];

interface TeamSelectorProps {
  selectedTeam: Team | null;
  onTeamSelect: (team: Team) => void;
}

export function TeamSelector({ selectedTeam, onTeamSelect }: TeamSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
          selectedTeam 
            ? `${selectedTeam.colors.primary} border-transparent text-white` 
            : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
        }`}
      >
        <span className="font-medium">
          {selectedTeam ? selectedTeam.name : 'Select Your Team'}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => {
                onTeamSelect(team);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-700 transition-colors text-left"
            >
              <div>
                <div className="text-white font-medium">{team.name}</div>
                <div className="text-slate-400 text-sm">{team.university}</div>
              </div>
              {selectedTeam?.id === team.id && (
                <Check className="h-4 w-4 text-green-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export type { Team };
