
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TeamCard } from '@/components/TeamCard';
import { TeamDetail } from '@/components/TeamDetail';
import { CompetitionDetail } from '@/components/CompetitionDetail';
import { CompetitionsTab } from '@/components/CompetitionsTab';
import { FantasyTab } from '@/components/FantasyTab';
import { Trophy, Target, Calendar, Users, Zap, RotateCcw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchTeams, fetchFromDirectus } from '@/lib/api';
import { Team, SimulationData, Competition } from '@/lib/types';
import { mapCompetitionTeamsFull } from '../lib/competitionMapping';

// Fallback teams data in case database connection fails
const fallbackTeams: Team[] = [
  {
    id: '1',
    name: 'Texas Raas',
    university: 'University of Texas at Austin',
    bidPoints: 8,
    qualified: true,
    locked: true,
    color: 'bg-orange-600',
    city: 'Austin, TX',
    instagramlink: 'https://www.instagram.com/texasraas/',
    competitions_attending: [],
    history: [
      'Founded in 2005, Texas Raas has been a powerhouse in collegiate Raas',
      'Multiple-time Raas All Stars qualifier',
      'Known for innovative choreography and strong storytelling'
    ],
    achievements: [
      { name: 'Raas All Stars 2023 - 2nd Place', link: 'https://www.youtube.com/watch?v=example1' },
      { name: 'Raas All Stars 2022 - 4th Place', link: 'https://www.youtube.com/watch?v=example2' }
    ],
    founded: 2005,
    genderComposition: 'Co-ed',
    logo: '/src/logos/texas-raas.jpg',
    contactInfo: {
      email: 'texasraas@utexas.edu',
      captains: ['Priya Sharma', 'Arjun Patel'],
      website: 'https://www.texasraas.org'
    },
    competitionResults: [
      {
        competitionId: 'comp1',
        competitionName: 'Bollywood Berkeley 2024',
        placement: '2nd',
        bidPointsEarned: 2,
        cumulativeBidPoints: 2,
        date: '2024-02-15'
      },
      {
        competitionId: 'comp2',
        competitionName: 'Spring Nationals 2024',
        placement: '1st',
        bidPointsEarned: 4,
        cumulativeBidPoints: 6,
        date: '2024-03-20'
      },
      {
        competitionId: 'comp3',
        competitionName: 'Raas Chaos 2024',
        placement: '3rd',
        bidPointsEarned: 1,
        cumulativeBidPoints: 7,
        date: '2024-04-10'
      },
      {
        competitionId: 'comp4',
        competitionName: 'East Coast Elite 2024',
        placement: '6th',
        bidPointsEarned: 0,
        cumulativeBidPoints: 7,
        date: '2024-04-25'
      },
      {
        competitionId: 'comp5',
        competitionName: 'Midwest Magic 2024',
        placement: '2nd',
        bidPointsEarned: 2,
        cumulativeBidPoints: 9,
        date: '2024-05-05'
      }
    ]
  },
  {
    id: '2',
    name: 'CMU Raasta',
    university: 'Carnegie Mellon University',
    bidPoints: 92,
    qualified: true,
    locked: true,
    color: 'bg-red-700',
    city: 'Pittsburgh, PA',
    instagramlink: 'https://www.instagram.com/cmuraasta/',
    competitions_attending: [],
    history: [
      'CMU Raasta brings technical precision to every performance',
      'Consistently ranked in top 10 nationally',
      'Known for clean formations and synchronized movements'
    ],
    achievements: [
      { name: 'Raas All Stars 2023 - 6th Place', link: 'https://www.youtube.com/watch?v=example3' },
      { name: 'Raas All Stars 2021 - 3rd Place', link: 'https://www.youtube.com/watch?v=example4' }
    ],
    founded: 2003,
    genderComposition: 'All Girls',
    logo: '/src/logos/cmu-raasta.jpg',
    contactInfo: {
      email: 'raasta@cmu.edu',
      captains: ['Ananya Patel', 'Kavya Singh', 'Riya Sharma'],
      phone: '(412) 555-0123'
    },
    competitionResults: [
      {
        competitionId: 'comp1',
        competitionName: 'Fall Classic 2024',
        placement: '1st',
        bidPointsEarned: 4,
        cumulativeBidPoints: 4,
        date: '2024-01-20'
      },
      {
        competitionId: 'comp2',
        competitionName: 'Winter Showcase 2024',
        placement: '1st',
        bidPointsEarned: 4,
        cumulativeBidPoints: 8,
        date: '2024-02-28'
      }
    ]
  },
  {
    id: '3',
    name: 'UF Gatoraas',
    university: 'University of Florida',
    bidPoints: 6,
    qualified: true,
    locked: false,
    color: 'bg-blue-600',
    city: 'Gainesville, FL',
    instagramlink: 'https://www.instagram.com/ufgatoraas/',
    competitions_attending: [],
    history: [
      'UF Gatoraas represents the University of Florida with pride',
      'Known for high-energy performances and crowd engagement',
      'Consistent top performer in regional competitions'
    ],
    achievements: [
      { name: 'Raas All Stars 2023 - 8th Place', link: 'https://www.youtube.com/watch?v=example5' },
      { name: 'Raas Chaos 2024 - 3rd Place', link: 'https://www.youtube.com/watch?v=example6' }
    ],
    founded: 2008,
    genderComposition: 'Co-ed',
    logo: '/src/logos/uf-gatoraas.jpeg',
    contactInfo: {
      email: 'gatoraas@ufl.edu',
      captains: ['Ravi Kumar', 'Deepika Nair']
    },
    competitionResults: [
      {
        competitionId: 'comp1',
        competitionName: 'Southeast Showdown 2024',
        placement: '3rd',
        bidPointsEarned: 1,
        cumulativeBidPoints: 1,
        date: '2024-02-05'
      },
      {
        competitionId: 'comp2',
        competitionName: 'Florida State Championship',
        placement: '1st',
        bidPointsEarned: 4,
        cumulativeBidPoints: 5,
        date: '2024-03-15'
      },
      {
        competitionId: 'comp3',
        competitionName: 'Southern Classic 2024',
        placement: '2nd',
        bidPointsEarned: 2,
        cumulativeBidPoints: 7,
        date: '2024-04-20'
      }
    ]
  },
  {
    id: '4',
    name: 'UCLA Nashaa',
    university: 'University of California, Los Angeles',
    bidPoints: 4,
    qualified: false,
    locked: false,
    color: 'bg-blue-800',
    city: 'Los Angeles, CA',
    instagramlink: 'https://www.instagram.com/uclanashaa/',
    competitions_attending: [],
    history: [
      'UCLA Nashaa brings West Coast energy to the Raas circuit',
      'Known for innovative choreography and modern interpretations',
      'Strong presence in California competitions'
    ],
    achievements: [
      { name: 'Bollywood Berkeley 2024 - 1st Place', link: 'https://www.youtube.com/watch?v=example7' },
      { name: 'Spring Nationals 2023 - 5th Place', link: 'https://www.youtube.com/watch?v=example8' }
    ],
    founded: 2010,
    genderComposition: 'All Boys',
    logo: '',
    contactInfo: {
      email: 'nashaa@ucla.edu',
      captains: ['Arjun Singh']
    },
    competitionResults: [
      {
        competitionId: 'comp1',
        competitionName: 'West Coast Classic 2024',
        placement: '5th',
        bidPointsEarned: 0,
        cumulativeBidPoints: 0,
        date: '2024-01-15'
      },
      {
        competitionId: 'comp2',
        competitionName: 'California Championships',
        placement: '1st',
        bidPointsEarned: 4,
        cumulativeBidPoints: 4,
        date: '2024-03-10'
      }
    ]
  },
  {
    id: '5',
    name: 'Michigan Maize Mirchi',
    university: 'University of Michigan',
    bidPoints: 3,
    qualified: false,
    locked: false,
    color: 'bg-yellow-600',
    city: 'Ann Arbor, MI',
    instagramlink: 'https://www.instagram.com/michiganmaizemirchi/',
    competitions_attending: [],
    history: [
      'Michigan Maize Mirchi represents the Midwest with pride',
      'Known for synchronized formations and technical precision',
      'Consistent performer in regional competitions'
    ],
    achievements: [
      { name: 'Midwest Magic 2024 - 1st Place', link: 'https://www.youtube.com/watch?v=example9' },
      { name: 'Raas All Stars 2022 - 7th Place', link: 'https://www.youtube.com/watch?v=example10' }
    ],
    founded: 2007,
    genderComposition: 'Co-ed',
    logo: '',
    contactInfo: {
      email: 'maizemirchi@umich.edu',
      captains: ['Simran Kaur', 'Vikram Agarwal']
    },
    competitionResults: [
      {
        competitionId: 'comp1',
        competitionName: 'Great Lakes Championship',
        placement: '3rd',
        bidPointsEarned: 1,
        cumulativeBidPoints: 1,
        date: '2024-02-25'
      },
      {
        competitionId: 'comp2',
        competitionName: 'Midwest Regional 2024',
        placement: '3rd',
        bidPointsEarned: 1,
        cumulativeBidPoints: 2,
        date: '2024-04-05'
      },
      {
        competitionId: 'comp3',
        competitionName: 'Spring Finale 2024',
        placement: '2nd',
        bidPointsEarned: 2,
        cumulativeBidPoints: 4,
        date: '2024-05-12'
      }
    ]
  },
  {
    id: '6',
    name: 'NYU Bhangra',
    university: 'New York University',
    bidPoints: 2,
    qualified: false,
    locked: false,
    color: 'bg-purple-700',
    city: 'New York, NY',
    instagramlink: 'https://www.instagram.com/nyubhangra/',
    competitions_attending: [],
    history: [
      'NYU Bhangra brings the energy of New York City',
      'Known for creative storytelling and emotional performances',
      'Strong presence in East Coast competitions'
    ],
    achievements: [
      { name: 'East Coast Showdown 2024 - 2nd Place', link: 'https://www.youtube.com/watch?v=example11' },
      { name: 'Raas All Stars 2021 - 9th Place', link: 'https://www.youtube.com/watch?v=example12' }
    ],
    founded: 2006,
    genderComposition: 'Open',
    logo: '',
    contactInfo: {
      email: 'bhangra@nyu.edu',
      captains: ['Kiran Mehta', 'Aiden Chen']
    },
    competitionResults: [
      {
        competitionId: 'comp1',
        competitionName: 'NYC Metro Championship',
        placement: '2nd',
        bidPointsEarned: 2,
        cumulativeBidPoints: 2,
        date: '2024-03-02'
      }
    ]
  },
  {
    id: '7',
    name: 'Georgia Tech Raas',
    university: 'Georgia Institute of Technology',
    bidPoints: 1,
    qualified: false,
    locked: false,
    color: 'bg-yellow-500',
    city: 'Atlanta, GA',
    instagramlink: 'https://www.instagram.com/gatechraas/',
    competitions_attending: [],
    history: [
      'Georgia Tech Raas represents the Southeast with pride',
      'Known for technical excellence and innovative choreography',
      'Rising star in the collegiate Raas circuit'
    ],
    achievements: [
      { name: 'Raas Chaos 2024 - 5th Place', link: 'https://www.youtube.com/watch?v=example13' },
      { name: 'Spring Nationals 2023 - 8th Place', link: 'https://www.youtube.com/watch?v=example14' }
    ],
    founded: 2012,
    genderComposition: 'Co-ed',
    logo: '',
    contactInfo: {
      email: 'raas@gatech.edu',
      captains: ['Neha Agarwal']
    },
    competitionResults: [
      {
        competitionId: 'comp1',
        competitionName: 'Atlanta Spring Classic',
        placement: '3rd',
        bidPointsEarned: 1,
        cumulativeBidPoints: 1,
        date: '2024-04-14'
      }
    ]
  },
  {
    id: '8',
    name: 'Penn Aatish',
    university: 'University of Pennsylvania',
    bidPoints: 1,
    qualified: false,
    locked: false,
    color: 'bg-red-600',
    city: 'Philadelphia, PA',
    instagramlink: 'https://www.instagram.com/pennaatish/',
    competitions_attending: [],
    history: [
      'Penn Aatish brings Ivy League excellence to Raas',
      'Known for sophisticated choreography and storytelling',
      'Consistent performer in regional competitions'
    ],
    achievements: [
      { name: 'East Coast Showdown 2024 - 3rd Place', link: 'https://www.youtube.com/watch?v=example15' },
      { name: 'Raas All Stars 2022 - 10th Place', link: 'https://www.youtube.com/watch?v=example16' }
    ],
    founded: 2009,
    genderComposition: 'All Girls',
    logo: '',
    contactInfo: {
      email: 'aatish@upenn.edu',
      captains: ['Meera Shah', 'Priya Desai']
    },
    competitionResults: [
      {
        competitionId: 'comp1',
        competitionName: 'Ivy League Championship',
        placement: '7th',
        bidPointsEarned: 0,
        cumulativeBidPoints: 0,
        date: '2024-02-18'
      },
      {
        competitionId: 'comp2',
        competitionName: 'Philadelphia Regional',
        placement: '3rd',
        bidPointsEarned: 1,
        cumulativeBidPoints: 1,
        date: '2024-03-30'
      }
    ]
  },
  {
    id: '9',
    name: 'UIUC Roshni',
    university: 'University of Illinois at Urbana-Champaign',
    bidPoints: 0,
    qualified: false,
    locked: false,
    color: 'bg-orange-500',
    city: 'Champaign, IL',
    instagramlink: 'https://www.instagram.com/uiucroshni/',
    competitions_attending: [],
    history: [
      'UIUC Roshni represents the heart of Illinois',
      'Known for energetic performances and crowd engagement',
      'Emerging talent in the collegiate Raas circuit'
    ],
    achievements: [
      { name: 'Midwest Magic 2024 - 3rd Place', link: 'https://www.youtube.com/watch?v=example17' },
      { name: 'Spring Nationals 2023 - 9th Place', link: 'https://www.youtube.com/watch?v=example18' }
    ],
    founded: 2015,
    genderComposition: 'Co-ed',
    logo: '',
    contactInfo: {
      email: 'roshni@illinois.edu',
      captains: ['Aditi Gupta', 'Rohan Patel']
    },
    competitionResults: [
      {
        competitionId: 'comp1',
        competitionName: 'Chicago Winter Classic',
        placement: '8th',
        bidPointsEarned: 0,
        cumulativeBidPoints: 0,
        date: '2024-01-28'
      },
      {
        competitionId: 'comp2',
        competitionName: 'Illinois State Championship',
        placement: '6th',
        bidPointsEarned: 0,
        cumulativeBidPoints: 0,
        date: '2024-03-25'
      }
    ]
  }
];

const CUTOFF_POINTS = 5;

const Index = () => {
  const navigate = useNavigate();
  
  // Modal stack management
  interface ModalEntry {
    id: string;
    type: 'team' | 'competition';
    data: any;
    zIndex: number;
  }
  
  const [modalStack, setModalStack] = useState<ModalEntry[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [simulationData, setSimulationData] = useState<SimulationData>({});
  const [activeTab, setActiveTab] = useState<string>('standings');
  const [teamsData, setTeamsData] = useState<Team[]>(fallbackTeams); // Start with fallback data
  const [originalTeamsData, setOriginalTeamsData] = useState<Team[]>([]); // Store original data
  const [loading, setLoading] = useState(false); // Don't show loading initially

  // Modal stack utility functions
  const pushModal = (type: 'team' | 'competition', data: any) => {
    const newModal: ModalEntry = {
      id: `${type}-${Date.now()}-${Math.random()}`,
      type,
      data,
      zIndex: 50 + (modalStack.length * 10)
    };
    setModalStack(prev => [...prev, newModal]);
    console.log('📱 Pushed modal to stack:', { type, zIndex: newModal.zIndex, stackDepth: modalStack.length + 1 });
  };

  const popModal = () => {
    setModalStack(prev => {
      const newStack = prev.slice(0, -1);
      console.log('📱 Popped modal from stack. New depth:', newStack.length);
      return newStack;
    });
  };

  const clearModalStack = () => {
    setModalStack([]);
    console.log('📱 Cleared entire modal stack');
  };

  // Helper functions to get current modals
  const getCurrentTeam = () => modalStack.find(modal => modal.type === 'team')?.data || null;
  const getCurrentCompetition = () => modalStack.find(modal => modal.type === 'competition')?.data || null;

  // Fetch teams and competitions from database
  useEffect(() => {
    const loadData = async () => {
      console.log('🔄 Loading fresh data from database...');
      try {
        const [teams, competitionsData] = await Promise.all([
          fetchTeams(),
          fetchFromDirectus('competitions')
        ]);
        
        // Debug: Log raw API data
        console.log('📊 Raw teams data:', teams);
        // Debug: Check for empty data
        if (!teams.length) {
          console.error('❌ No teams loaded from API!');
        }
        
        // Debug: Log raw competitions data
        console.log('📊 Raw competitions data:', competitionsData);
        console.log('📊 Raw competitions data length:', competitionsData?.length);
        console.log('📊 Raw competitions data sample:', competitionsData?.slice(0, 2));
        if (!competitionsData.length) {
          console.error('❌ No competitions loaded from API!');
        }
        
        // Map competitions data FIRST
        let mappedCompetitions: any[] = [];
        if (competitionsData) {
          const API_URL = import.meta.env.VITE_DIRECTUS_URL;
          mappedCompetitions = competitionsData.map((comp: any) => ({
            id: comp.id,
            name: comp.name,
            city: comp.city,
            date: comp.date,
            logo: comp.logo
              ? (typeof comp.logo === 'string'
                  ? (comp.logo.startsWith('http') ? comp.logo : `${API_URL}/assets/${comp.logo}`)
                  : (comp.logo && typeof comp.logo === 'object' && comp.logo.url ? comp.logo.url : `${API_URL}/assets/${comp.logo.id}`))
              : '',
            lineup: comp.lineup || [],
            firstplace: comp.firstplace,
            secondplace: comp.secondplace,
            thirdplace: comp.thirdplace,
            judges: Array.isArray(comp.judges)
              ? comp.judges.map((judge: any) => typeof judge === 'string' ? { name: judge, category: 'Judge' } : judge)
              : [],
            instagramlink: comp.instagramlink || '',
            media: { photos: [], videos: [] }
          }));
          // Debug: Log mapped competitions
          console.log('🏆 Mapped competitions:', mappedCompetitions);
          console.log('🏆 Mapped competitions length:', mappedCompetitions.length);
          console.log('🏆 First few mapped competitions:', mappedCompetitions.slice(0, 2));
          // Debug: Log logo URLs
          console.log('🖼️ Competition logo URLs:', mappedCompetitions.map(c => ({ name: c.name, logo: c.logo })));
          console.log('🎯 Setting competitions state with mapped competitions');
          setCompetitions(mappedCompetitions);
          console.log('✅ Competitions state set');
        }
        
        // Map teams data AFTER competitions are available
        if (teams) {
          const API_URL = import.meta.env.VITE_DIRECTUS_URL;
          const mappedTeams = teams.map((team: any) => ({
            id: team.id,
            name: team.name,
            founded: team.founded || team.est || 0,
            university: team.university,
            city: team.city,
            logo: team.logo
              ? (typeof team.logo === 'string'
                  ? (team.logo.startsWith('http') ? team.logo : `${API_URL}/assets/${team.logo}`)
                  : (team.logo.url ? team.logo.url : `${API_URL}/assets/${team.logo.id}`))
              : '',
            color: team.color || team.theme || 'bg-slate-600',
            bidPoints: Number(team.bidPoints || team.bid_points || team.bidpoints || 0),
            qualified: (team.bidPoints || team.bid_points || team.bidpoints || 0) >= 5,
            competitions_attending: Array.isArray(team.competitions_attending) 
              ? team.competitions_attending.map((comp: any) => 
                  typeof comp === 'string' ? comp : comp.name || comp.id || comp
                )
              : [],
            achievements: Array.isArray(team.achievements) ? team.achievements : (team.achievements ? [team.achievements] : []),
            history: team.history || [],
            instagramlink: team.instagramlink || '',
            genderComposition: team.genderComposition || team.gender_comp,
            contactInfo: {
              email: team.contactInfo?.email || team.contact_info || team.email || '',
              phone: team.contactInfo?.phone || team.phone || '',
              website: team.contactInfo?.website || team.website || '',
              captains: Array.isArray(team.contactInfo?.captains) ? team.contactInfo.captains : 
                       Array.isArray(team.captains) ? team.captains : 
                       (typeof (team.contactInfo?.captains || team.captains) === 'string' && 
                        (team.contactInfo?.captains || team.captains).includes('[') && 
                        (team.contactInfo?.captains || team.captains).includes(']')) 
                          ? (team.contactInfo?.captains || team.captains).replace(/[\[\]]/g, '').split(',').map(c => c.trim())
                          : (team.contactInfo?.captains || team.captains ? [team.contactInfo?.captains || team.captains] : [])
            },
            competitionResults: (() => {
              if (team.competitionResults && Array.isArray(team.competitionResults)) {
                return team.competitionResults;
              }
              
              // Generate competition results from competitions_attending using actual placings
              if (Array.isArray(team.competitions_attending) && team.competitions_attending.length > 0) {
                let cumulativePoints = 0;
                return team.competitions_attending.map((compId: any, index: number) => {
                  // Find competition by ID from the mapped competitions array
                  const competition = mappedCompetitions.find((c: any) => String(c.id) === String(compId));
                  if (!competition) {
                    console.warn(`⚠️ Competition not found for team ${team.name}, compId: ${compId}`);
                    return null;
                  }
                  
                  // Find team's placement in this competition
                  let placement = 'N/A';
                  let pointsEarned = 0;
                  
                  if (String(competition.firstplace) === String(team.id)) {
                    placement = '1st';
                    pointsEarned = 4;
                  } else if (String(competition.secondplace) === String(team.id)) {
                    placement = '2nd';
                    pointsEarned = 2;
                  } else if (String(competition.thirdplace) === String(team.id)) {
                    placement = '3rd';
                    pointsEarned = 1;
                  }
                  
                  return {
                    competitionId: compId,
                    competitionName: competition.name,
                    placement: placement,
                    bidPointsEarned: pointsEarned,
                    cumulativeBidPoints: 0, // Will be recalculated after sorting
                    date: competition.date || new Date(2024, index, 15 + index * 10).toISOString().split('T')[0]
                  };
                }).filter(Boolean).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                
                // Recalculate cumulative points in chronological order
                let runningTotal = 0;
                return team.competitions_attending.map((compId: any, index: number) => {
                  // Find competition by ID from the mapped competitions array
                  const competition = mappedCompetitions.find((c: any) => String(c.id) === String(compId));
                  if (!competition) return null;
                  
                                     // Find team's placement in this competition
                   let placement = 'N/A';
                   let pointsEarned = 0;
                   
                   if (String(competition.firstplace) === String(team.id)) {
                     placement = '1st';
                     pointsEarned = 4;
                   } else if (String(competition.secondplace) === String(team.id)) {
                     placement = '2nd';
                     pointsEarned = 2;
                   } else if (String(competition.thirdplace) === String(team.id)) {
                     placement = '3rd';
                     pointsEarned = 1;
                   }
                  
                  runningTotal += pointsEarned;
                  
                  return {
                    competitionId: compId,
                    competitionName: competition.name,
                    placement: placement,
                    bidPointsEarned: pointsEarned,
                    cumulativeBidPoints: runningTotal,
                    date: competition.date || new Date(2024, index, 15 + index * 10).toISOString().split('T')[0]
                  };
                }).filter(Boolean).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
              }
              
              return [];
            })()
          }));
          // Debug: Log mapped data
          console.log('🎯 Mapped teams data:', mappedTeams);
          // Debug: Log logo URLs
          console.log('🖼️ Team logo URLs:', mappedTeams.map(t => ({ name: t.name, logo: t.logo })));
          // Debug: Check bidPoints type
          mappedTeams.forEach(team => {
            if (typeof team.bidPoints !== 'number') {
              console.warn(`⚠️ bidPoints for ${team.name} is not a number:`, team.bidPoints);
            }
          });
          setTeamsData(mappedTeams);
          setOriginalTeamsData(mappedTeams); // Store original data
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to fallback teams if database fails
        setTeamsData(fallbackTeams);
        setCompetitions([]); // Add empty competitions array as fallback
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Calculate bid points based on competition results
  const calculateBidPoints = (teams: Team[], competitions: any[]) => {
    const pointsMap: { [teamId: string]: number } = {};
    
    // Initialize all teams with their original bid points
    teams.forEach(team => {
      // Find the original team data to get the base bid points
      const originalTeam = originalTeamsData.find(ot => ot.id === team.id);
      pointsMap[team.id] = originalTeam ? originalTeam.bidPoints : (team.bidPoints || 0);
    });

    // Add points from completed competitions (currently no placings data)
    // competitions.forEach(comp => {
    //   // Points will be added from simulation data instead
    // });

    // Add simulation points if active
    Object.values(simulationData).forEach(simulation => {
      // simulation.predictions contains team IDs, not names
      if (simulation.predictions.first) {
        pointsMap[simulation.predictions.first] = (pointsMap[simulation.predictions.first] || 0) + 4;
      }
      if (simulation.predictions.second) {
        pointsMap[simulation.predictions.second] = (pointsMap[simulation.predictions.second] || 0) + 2;
      }
      if (simulation.predictions.third) {
        pointsMap[simulation.predictions.third] = (pointsMap[simulation.predictions.third] || 0) + 1;
      }
    });

    return teams.map(team => ({
      ...team,
      bidPoints: pointsMap[team.id] || 0,
      qualified: (pointsMap[team.id] || 0) >= CUTOFF_POINTS
    }));
  };

  // Re-enable the useEffect that recalculates bid points
  const isInitialLoad = useRef(true);
  
  useEffect(() => {
    if (teamsData.length > 0 && originalTeamsData.length > 0) {
      if (isInitialLoad.current) {
        // Initial load - just set the teams without recalculating
        isInitialLoad.current = false;
      } else {
        // Simulation data changed - recalculate bid points
        const updatedTeams = calculateBidPoints(teamsData, []);
        setTeamsData(updatedTeams);
      }
    }
  }, [simulationData, originalTeamsData]);

  const qualifiedTeams = teamsData.filter(team => team.qualified).length;
  const sortedTeams = [...teamsData].sort((a, b) => b.bidPoints - a.bidPoints);
  const topThreeTeams = sortedTeams.slice(0, 3);
  const topNineTeams = sortedTeams.slice(0, 9);
  const qualifiedOtherTeams = sortedTeams.slice(3, 9);
  const notQualifiedTeams = sortedTeams.slice(9);

  // Debug: Log teamsData before rendering
  console.log('Rendering teamsData:', teamsData);
  console.log('Rendering sortedTeams:', sortedTeams);
  console.log('Rendering topThreeTeams:', topThreeTeams);
  console.log('Rendering qualifiedOtherTeams:', qualifiedOtherTeams);
  console.log('Rendering notQualifiedTeams:', notQualifiedTeams);


  const handleSimulationSet = (competitionName: string, competitionId: string, predictions: { first: string; second: string; third: string }) => {
    setSimulationData(prev => ({
      ...prev,
      [competitionId]: { competitionName, competitionId, predictions }
    }));
    setActiveTab('standings');
  };

  const handleCompetitionClick = (competitionData: any) => {
    console.log('🚀 handleCompetitionClick called with:', competitionData, 'type:', typeof competitionData);
    console.log('🔍 Current competitions state length:', competitions.length);
    console.log('🔍 Current teamsData state length:', teamsData.length);
    
    // Handle different data types - competitions_attending contains IDs
    let competitionId = '';
    if (typeof competitionData === 'string') {
      competitionId = competitionData;
      console.log('📝 competitionData is string, using as competitionId:', competitionId);
    } else if (competitionData && typeof competitionData === 'object') {
      competitionId = competitionData.id || competitionData;
      console.log('📦 competitionData is object, extracted competitionId:', competitionId);
    } else if (typeof competitionData === 'number') {
      competitionId = String(competitionData);
      console.log('🔢 competitionData is number, converted to string:', competitionId);
    } else {
      console.error('❌ Unknown competitionData type:', typeof competitionData, competitionData);
      return;
    }
    
    console.log('🔍 Final processed competitionId:', competitionId);
    console.log('📋 Available competitions:', competitions.map(c => ({ id: c.id, name: c.name, type: typeof c.id })));
    
    const competition = competitions.find(comp => String(comp.id) === String(competitionId));
    if (competition) {
      console.log('✅ Found competition:', competition);
      console.log('🔍 Competition ID type:', typeof competition.id);
      console.log('🔍 Competition ID value:', competition.id);
      
      const mappedCompetition = mapCompetitionTeamsFull(competition, teamsData);
      console.log('[DEBUG] TeamDetail click - original lineup:', competition.lineup);
      console.log('[DEBUG] TeamDetail click - mapped lineup:', mappedCompetition.lineup);

      console.log('🎯 Pushing competition to modal stack:', mappedCompetition);
      pushModal('competition', mappedCompetition);
      console.log('✅ Competition detail modal should now be open');
    } else {
      console.error('❌ Competition not found for ID:', competitionId);
      console.error('❌ Available competition IDs:', competitions.map(c => c.id));
      console.error('❌ Available competition names:', competitions.map(c => c.name));
    }
  };

  const handleTeamClick = (team: Team) => {
    console.log('🎯 TEAM CLICKED!', { teamId: team.id, teamName: team.name });
    pushModal('team', team);
    console.log('✅ Team detail modal should now be open');
  };

  const clearSimulation = () => {
    setSimulationData({});
    setTeamsData(originalTeamsData); // Restore original teams data
  };


  const goToSimulation = () => {
    const simulationCount = Object.keys(simulationData).length;
    if (simulationCount === 1) {
      const singleSimulation = Object.values(simulationData)[0];
      setActiveTab('comps');
    } else {
      setActiveTab('comps');
    }
  };

  const simulationCount = Object.keys(simulationData).length;
  const simulationNames = Object.values(simulationData).map(sim => sim.competitionName);

  // Determine if a team is locked in (has enough points to guarantee top 9)
  const isLockedIn = (team: any, rank: number) => {
    // A team is locked in if they're in top 6 with significant point lead
    // or if the gap between them and 10th place is too large to overcome
    const tenthPlacePoints = sortedTeams[9]?.bidPoints || 0;
    return rank <= 6 && team.bidPoints >= tenthPlacePoints + 8; // 8+ point lead is generally safe
  };

  return (
    <div className="min-h-screen max-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-black overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-900/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-slate-800/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-800/20 rounded-full blur-3xl"></div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full relative z-10 h-screen flex flex-col">

        <TabsContent value="standings" className="mt-0 flex-1 overflow-y-auto scrollbar-hide pb-20">
          {/* Header with Centered Logo and Discord Button */}
          <div className="relative pt-6 pb-8">
            {/* Centered Logo */}
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/fac2918d-a107-444b-8ce2-b83e59b5b3c7.png" 
                alt="Raas All Stars Logo" 
                className="h-12 w-auto"
              />
            </div>
            
            {/* Discord Button - Positioned absolutely in top right */}
            <a
              href="https://discord.gg/your-discord-invite"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-6 right-4 text-white hover:text-slate-300 transition-colors duration-200 p-2"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </a>
          </div>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-slate-400 mt-2">Loading teams...</p>
            </div>
          ) : (
            <>
              {/* Simulation Alert */}
              {simulationCount > 0 && (
            <div className="mx-4 mb-6">
              <div className="bg-gradient-to-r from-blue-600/80 to-purple-600/80 backdrop-blur-sm border border-blue-500/50 rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    <div>
                      <h3 className="text-white font-bold text-sm">Simulation Mode</h3>
                      <p className="text-blue-100 text-xs">
                        {simulationCount === 1 
                          ? `Viewing predicted results for ${simulationNames[0]}`
                          : `Viewing predictions for ${simulationCount} competitions: ${simulationNames.join(', ')}`
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={goToSimulation}
                      className="bg-blue-600/70 hover:bg-blue-600/90 text-white px-6 py-4 rounded-lg text-xs transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
                    >
                      Edit
                    </button>
                    <button
                      onClick={clearSimulation}
                      className="bg-white/20 hover:bg-white/30 text-white px-6 py-4 rounded-lg text-xs flex items-center gap-2 transition-colors min-h-[48px]"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Exit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top 3 Flowing Podium - Reduced Brightness */}
          <section className="px-4 pb-8">
            <div className="relative">
              {/* Subtle flowing background that doesn't reach the logo */}
              <div className="absolute inset-0 top-4 bg-gradient-to-r from-slate-800/5 via-slate-700/10 to-slate-800/5 rounded-3xl blur-2xl"></div>
              <div className="absolute inset-0 top-8 bg-gradient-to-b from-transparent via-slate-700/8 to-slate-800/15 rounded-3xl blur-xl"></div>
              
              <div className="relative flex gap-4 justify-center items-end py-8">
                {/* 2nd Place */}
                <div className="flex-1 max-w-[95px]">
                  <div 
                    onClick={() => pushModal('team', topThreeTeams[1])}
                    className="relative group cursor-pointer"
                  >
                    {/* Enhanced floating effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-500/30 to-slate-700/50 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    
                    <div className="relative bg-gradient-to-br from-slate-600/70 to-slate-800/90 backdrop-blur-md rounded-3xl p-4 h-32 flex flex-col items-center justify-between border border-slate-500/20 group-hover:border-slate-400/40 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                      
                      {/* Featured Profile Picture */}
                      <div className="relative -mt-6 mb-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-400/50 to-slate-600/50 rounded-full blur-lg group-hover:blur-xl transition-all duration-500"></div>
                        <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-2xl bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center border-2 border-slate-400/50 group-hover:border-slate-300/70 transition-all duration-500">
                          {topThreeTeams[1]?.logo ? (
                            <img src={topThreeTeams[1].logo} alt={topThreeTeams[1].name} className="w-full h-full object-cover" />
                          ) : (
                            <Trophy className="h-8 w-8 text-slate-200" />
                          )}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-slate-300 font-bold text-xs mb-1">2nd</div>
                        <div className="text-white font-semibold text-xs leading-tight mb-1">{topThreeTeams[1]?.name}</div>
                        <div className="relative -mt-1">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-sm"></div>
                          <div className="relative bg-gradient-to-r from-blue-500/30 to-purple-500/30 px-3 py-1 rounded-full border border-blue-400/30">
                            <span className="text-white font-bold text-xs tracking-wider">{topThreeTeams[1]?.bidPoints}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1st Place - Hero Profile */}
                <div className="flex-1 max-w-[110px] -mt-8">
                  <div 
                    onClick={() => pushModal('team', topThreeTeams[0])}
                    className="relative group cursor-pointer"
                  >
                    {/* Epic glowing effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/40 to-orange-500/60 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                    
                    <div className="relative bg-gradient-to-br from-yellow-400/85 to-orange-500/95 backdrop-blur-md rounded-3xl p-5 h-40 flex flex-col items-center justify-between shadow-2xl border border-yellow-300/40 group-hover:border-yellow-200/60 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-3">
                      
                      {/* Hero Profile Picture */}
                      <div className="relative -mt-8 mb-3">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/60 to-orange-400/60 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                        <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-2xl bg-gradient-to-br from-yellow-200 to-yellow-400 flex items-center justify-center border-3 border-yellow-300/60 group-hover:border-yellow-200/80 transition-all duration-500">
                          {topThreeTeams[0]?.logo ? (
                            <img src={topThreeTeams[0].logo} alt={topThreeTeams[0].name} className="w-full h-full object-cover" />
                          ) : (
                            <Trophy className="h-10 w-10 text-yellow-700" />
                          )}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-yellow-800 font-bold text-sm mb-1">1st</div>
                        <div className="text-yellow-900 font-bold text-sm leading-tight mb-1">{topThreeTeams[0]?.name}</div>
                        <div className="relative -mt-1">
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/40 to-orange-300/40 rounded-full blur-sm"></div>
                          <div className="relative bg-gradient-to-r from-yellow-200/80 to-orange-200/80 px-4 py-1.5 rounded-full border border-yellow-300/60">
                            <span className="text-yellow-900 font-bold text-sm tracking-wider">{topThreeTeams[0]?.bidPoints}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="flex-1 max-w-[95px]">
                  <div 
                    onClick={() => pushModal('team', topThreeTeams[2])}
                    className="relative group cursor-pointer"
                  >
                    {/* Enhanced floating effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-red-600/50 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    
                    <div className="relative bg-gradient-to-br from-orange-500/70 to-red-600/90 backdrop-blur-md rounded-3xl p-4 h-32 flex flex-col items-center justify-between border border-orange-400/20 group-hover:border-orange-300/40 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                      
                      {/* Featured Profile Picture */}
                      <div className="relative -mt-6 mb-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/50 to-red-500/50 rounded-full blur-lg group-hover:blur-xl transition-all duration-500"></div>
                        <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-2xl bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center border-2 border-orange-400/50 group-hover:border-orange-300/70 transition-all duration-500">
                          {topThreeTeams[2]?.logo ? (
                            <img src={topThreeTeams[2].logo} alt={topThreeTeams[2].name} className="w-full h-full object-cover" />
                          ) : (
                            <Trophy className="h-8 w-8 text-orange-800" />
                          )}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-orange-200 font-bold text-xs mb-1">3rd</div>
                        <div className="text-orange-100 font-semibold text-xs leading-tight mb-1">{topThreeTeams[2]?.name}</div>
                        <div className="relative -mt-1">
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-full blur-sm"></div>
                          <div className="relative bg-gradient-to-r from-orange-400/30 to-red-400/30 px-3 py-1 rounded-full border border-orange-300/30">
                            <span className="text-orange-100 font-bold text-xs tracking-wider">{topThreeTeams[2]?.bidPoints}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Seamless Team List */}
          <main className="px-4">
            {/* Qualified Teams (4-9) */}
            <div className="space-y-2 mb-6">
              {qualifiedOtherTeams.map((team, index) => {
                const rank = index + 4;
                return (
                  <div 
                    key={team.id}
                    onClick={() => pushModal('team', team)}
                    className="group relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:bg-slate-800/70 hover:border-slate-600/50 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/5 to-blue-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative flex items-center gap-4">
                      {/* Team Logo with glow */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-white/10 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          {team.logo ? (
                            <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                          ) : (
                            <Trophy className="h-6 w-6 text-slate-400" />
                          )}
                        </div>
                      </div>
                      
                      {/* Team Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-base truncate group-hover:text-blue-100 transition-colors duration-300">{team.name}</h3>
                        <p className="text-slate-400 text-sm truncate group-hover:text-slate-300 transition-colors duration-300">{team.university}</p>
                      </div>
                      
                      {/* Modern Points Display */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                        <div className="relative bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-blue-400/20 group-hover:border-blue-300/40 transition-all duration-300">
                          <div className="flex flex-col items-center">
                            <div className="text-blue-300 font-black text-lg leading-none group-hover:text-blue-200 transition-colors duration-300">{team.bidPoints}</div>
                            <div className="text-blue-400/70 font-medium text-[10px] uppercase tracking-widest">points</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cutoff Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-500/50 to-transparent"></div>
              </div>
              <div className="relative flex justify-center">
                <div className="bg-slate-900 px-6 py-2 border border-slate-600/30 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                    <span className="text-slate-400 font-medium text-xs uppercase tracking-wider">RAS Cutoff</span>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Non-Qualified Teams */}
            <div className="space-y-2">
              {notQualifiedTeams.map((team, index) => {
                const rank = index + 10;
                return (
                  <div 
                    key={team.id}
                    onClick={() => pushModal('team', team)}
                    className="group relative bg-slate-800/20 backdrop-blur-sm border border-slate-700/20 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:bg-slate-800/40 hover:border-slate-600/30 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-4">
                      {/* Muted rank */}
                      <div className="w-10 h-10 bg-slate-600/20 border border-slate-500/20 rounded-xl flex items-center justify-center">
                        <span className="text-slate-500 font-bold text-sm">{rank}</span>
                      </div>
                      
                      {/* Team Logo */}
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-700/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                        {team.logo ? (
                          <img src={team.logo} alt={team.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                        ) : (
                          <Trophy className="h-6 w-6 text-slate-500" />
                        )}
                      </div>
                      
                      {/* Team Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-slate-300 font-semibold text-base truncate group-hover:text-slate-200 transition-colors duration-300">{team.name}</h3>
                        <p className="text-slate-500 text-sm truncate group-hover:text-slate-400 transition-colors duration-300">{team.university}</p>
                      </div>
                      
                      {/* Muted Points Display */}
                      <div className="bg-slate-600/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-slate-500/20">
                        <div className="flex flex-col items-center">
                          <div className="text-slate-400 font-black text-lg leading-none">{team.bidPoints}</div>
                          <div className="text-slate-500/70 font-medium text-[10px] uppercase tracking-widest">points</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </main>
            </>
          )}
        </TabsContent>

        <TabsContent value="comps" className="mt-0 flex-1 overflow-y-auto scrollbar-hide pb-20">
          <div className="px-4">
            <CompetitionsTab 
              onSimulationSet={handleSimulationSet}
              simulationData={simulationData}
              teams={teamsData}
              onTeamClick={handleTeamClick}
            />
          </div>
        </TabsContent>

        <TabsContent value="fantasy" className="mt-0 flex-1 overflow-y-auto scrollbar-hide pb-20">
          <FantasyTab />
        </TabsContent>

        <TabsContent value="teams" className="mt-0 flex-1 overflow-y-auto scrollbar-hide pb-20">
          <div className="px-4 py-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-slate-400 mt-2">Loading teams...</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-2">All Teams</h2>
                  <p className="text-slate-400 text-sm">
                    Complete listing of teams in the circuit
                  </p>
                </div>

                <div className="space-y-3">
                  {[...teamsData].sort((a, b) => a.name.localeCompare(b.name)).map((team) => (
                    <div 
                      key={team.id}
                      onClick={() => pushModal('team', team)}
                      className="group relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:bg-slate-800/60 hover:border-slate-600/40 hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <div className="flex items-start gap-4">
                        {/* Team Logo */}
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-700/40 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                          {team.logo ? (
                            <img src={team.logo} alt={team.name} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300" />
                          ) : (
                            <Trophy className="h-6 w-6 text-slate-400" />
                          )}
                        </div>
                        
                        {/* Team Info & Competition Logos */}
                        <div className="flex-1 min-w-0">
                          {/* Team Header */}
                          <div className="mb-3">
                            <h3 className="text-white font-semibold text-lg truncate group-hover:text-blue-200 transition-colors duration-300">{team.name}</h3>
                            <p className="text-slate-400 text-sm truncate">{team.university}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </TabsContent>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700/50 shadow-lg z-50 flex-shrink-0">
          <TabsList className="grid grid-cols-4 bg-transparent border-none rounded-none w-full h-16 p-0">
            <TabsTrigger 
              value="standings" 
              className="text-slate-400 data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400 rounded-none text-xs flex-col gap-1 h-full border-none min-h-[44px]"
            >
              <Trophy className="h-4 w-4" />
              Standings
            </TabsTrigger>
            <TabsTrigger 
              value="comps" 
              className="text-slate-400 data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400 rounded-none text-xs flex-col gap-1 h-full border-none min-h-[44px]"
            >
              <Calendar className="h-4 w-4" />
              Comps
            </TabsTrigger>
            <TabsTrigger 
              value="fantasy" 
              className="text-slate-400 data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400 rounded-none text-xs flex-col gap-1 h-full border-none min-h-[44px]"
            >
              <Zap className="h-4 w-4" />
              Fantasy
            </TabsTrigger>
            <TabsTrigger 
              value="teams" 
              className="text-slate-400 data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400 rounded-none text-xs flex-col gap-1 h-full border-none min-h-[44px]"
            >
              <Users className="h-4 w-4" />
              Teams
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      {/* Modal Stack Rendering */}
      {modalStack.map((modal, index) => {
        const isTopModal = index === modalStack.length - 1;
        
        if (modal.type === 'competition') {
          return (
            <CompetitionDetail 
              key={modal.id}
              competition={modal.data} 
              onClose={() => {
                popModal();
                console.log('📱 Competition modal closed, remaining modals:', modalStack.length - 1);
              }}
              onSimulationSet={handleSimulationSet}
              simulationData={simulationData}
              teams={teamsData}
              onTeamClick={handleTeamClick}
              zIndex={modal.zIndex}
            />
          );
        }
        
        if (modal.type === 'team') {
          return (
            <TeamDetail 
              key={modal.id}
              team={modal.data} 
              onClose={() => {
                popModal();
                console.log('📱 Team modal closed, remaining modals:', modalStack.length - 1);
              }}
              onCompetitionClick={handleCompetitionClick}
              competitions={competitions}
              zIndex={modal.zIndex}
            />
          );
        }
        
        return null;
      })}

      {/* Debug: Log modal stack state */}
      {modalStack.length > 0 && (() => {
        console.log('📱 Modal stack state:', {
          depth: modalStack.length,
          modals: modalStack.map(m => ({ type: m.type, zIndex: m.zIndex }))
        });
        return null;
      })()}
    </div>
  );
};

export default Index;
