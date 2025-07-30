export interface Team {
  id: string;
  name: string;
  university: string;
  bidPoints: number;
  qualified: boolean;
  locked?: boolean;
  logo?: string;
  est?: number;
  color: string;
  city?: string;
  instagramlink?: string;
  competitions_attending?: string[];
  history: string[];
  achievements: string[];
  founded: number;
  genderComposition: 'All Girls' | 'All Boys' | 'Co-ed' | 'Open';
  contactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
    captains?: string[];
  };
  competitionResults?: Array<{
    competitionId: string;
    competitionName: string;
    placement?: string;
    bidPointsEarned: number;
    cumulativeBidPoints: number;
    date?: string;
  }>;
}

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
  judges: Array<{ name: string; category: string }>;
  instagramlink?: string;
  media: {
    photos: string[];
    videos: string[];
  };
}

export interface SimulationData {
  [competitionId: string]: {
    competitionName: string;
    competitionId: string;
    predictions: {
      first: string;
      second: string;
      third: string;
    };
  };
}

export interface FantasyTeam {
  id: string;
  name: string;
  owner: string;
  points: number;
  dancers: string[];
  weeklyChange: number;
} 