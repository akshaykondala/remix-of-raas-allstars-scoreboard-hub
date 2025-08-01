const API_URL = import.meta.env.VITE_DIRECTUS_URL || 'https://your-directus-instance.com';
const TOKEN = import.meta.env.VITE_DIRECTUS_TOKEN || '';

export async function fetchFromDirectus(collection: string) {
  try {
    // If API_URL is not configured, return fallback data
    if (!API_URL || API_URL === 'https://your-directus-instance.com') {
      console.warn('Directus URL not configured, using fallback data');
      return null;
    }
    
    let url = `${API_URL}/items/${collection}`;
    // Deep populate lineup for competitions - get the nested team data from junction table
    if (collection === 'competitions') {
      url += '?fields=*,lineup.teams_id.*';
    }
    // Deep populate competitions_attending for teams - get the nested competition data
    if (collection === 'teams') {
      url += '?fields=*,competitions_attending.competitions_id.*';
    }
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error('Directus API fetch error:', err);
    return null;
  }
}

export async function fetchTeams() {
  try {
    console.log('🔄 fetchTeams: Starting to fetch teams and competitions...');
    const [teamsData, competitionsData] = await Promise.all([
      fetchFromDirectus('teams'),
      fetchFromDirectus('competitions')
    ]);
    
    console.log('📊 fetchTeams: teamsData received:', teamsData ? teamsData.length : 'null');
    console.log('📊 fetchTeams: competitionsData received:', competitionsData ? competitionsData.length : 'null');
    
    if (!teamsData) return [];
    
    const API_URL = import.meta.env.VITE_DIRECTUS_URL || 'https://your-directus-instance.com';
    
    // Create a map of competition IDs to full competition data for quick lookup
    const competitionMap = new Map();
    if (competitionsData) {
      console.log('Available competitions:', competitionsData.map(c => ({ id: c.id, name: c.name })));
      competitionsData.forEach((comp: any) => {
        competitionMap.set(comp.id, comp);
      });
    } else {
      console.log('No competitions data available');
    }
    
    console.log('Teams data before mapping:', teamsData.map(t => ({ 
      name: t.name, 
      competitions_attending: t.competitions_attending,
      bidpoints: t.bidpoints 
    })));
    
    return teamsData.map((team: any) => ({
      id: String(team.id), // Ensure ID is always a string for consistency
      name: team.name,
      genderComposition: team.gender_comp,
      university: team.university,
      bidPoints: team.bidpoints || 0,
      qualified: (team.bidpoints || 0) >= 5, // Auto-calculate qualification based on bid points
      locked: false, // You can add this field to your database if needed
      color: team.theme || 'bg-slate-600', // Using 'theme' field for team color
      city: team.city || '',
      instagramlink: team.instagramlink || '',
      competitions_attending: Array.isArray(team.competitions_attending) 
        ? team.competitions_attending.map((compObj: any) => 
            compObj.competitions_id?.name || compObj.competitions_id?.id || compObj
          )
        : [],
      history: team.history || [], // Add this field to your database if needed
      achievements: Array.isArray(team.achievements) ? team.achievements : (team.achievements ? [team.achievements] : []),
      founded: team.est || 0, // Using 'est' field for founded year
      logo: team.logo
        ? (typeof team.logo === 'string'
            ? (team.logo.startsWith('http') ? team.logo : `${API_URL}/assets/${team.logo}`)
            : (team.logo.url ? team.logo.url : `${API_URL}/assets/${team.logo.id}`))
        : '',
      contactInfo: {
        email: team.contact_info || team.email || '',
        phone: team.phone || '',
        website: team.website || '',
        captains: Array.isArray(team.captains) ? team.captains : 
                 (typeof team.captains === 'string' && team.captains.includes('[') && team.captains.includes(']')) 
                   ? team.captains.replace(/[\[\]]/g, '').split(',').map(c => c.trim())
                   : (team.captains ? [team.captains] : [])
      },
      competitionResults: (() => {
        if (team.competitionResults && Array.isArray(team.competitionResults)) {
          console.log('Using existing competitionResults for', team.name, team.competitionResults);
          return team.competitionResults;
        }
        
        // Generate competition results from competitions_attending using actual placings
        if (Array.isArray(team.competitions_attending) && team.competitions_attending.length > 0) {
          console.log('Generating competitionResults for', team.name, 'from competitions_attending:', team.competitions_attending);
          let cumulativePoints = 0;
          const results = team.competitions_attending.map((compObj: any, index: number) => {
            const competition = compObj.competitions_id;
            console.log('Processing competition object:', competition);
            if (!competition) {
              console.log('Competition object is null/undefined');
              return null;
            }
            
            // Find team's placement in this competition
            let placement = 'N/A';
            let pointsEarned = 0;
            
            if (competition.firstplace === team.id) {
              placement = '1st';
              pointsEarned = 4;
            } else if (competition.secondplace === team.id) {
              placement = '2nd';
              pointsEarned = 2;
            } else if (competition.thirdplace === team.id) {
              placement = '3rd';
              pointsEarned = 1;
            }
            
            const result = {
              competitionId: competition.id,
              competitionName: competition.name,
              placement: placement,
              bidPointsEarned: pointsEarned,
              cumulativeBidPoints: 0, // Will be recalculated after sorting
              date: competition.date || new Date(2024, index, 15 + index * 10).toISOString().split('T')[0]
            };
            console.log('Generated result:', result);
            return result;
          }).filter(Boolean).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          
          // Recalculate cumulative points in chronological order
          let runningTotal = 0;
          results.forEach((result, index) => {
            runningTotal += result.bidPointsEarned;
            result.cumulativeBidPoints = runningTotal;
          });
          console.log('Final competitionResults for', team.name, ':', results);
          return results;
        }
        
        console.log('No competitionResults generated for', team.name);
        return [];
      })()
    }));
  } catch (err) {
    console.error('Error fetching teams:', err);
    return [];
  }
}
