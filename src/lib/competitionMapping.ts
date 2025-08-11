// Utility to map competition lineup and placings to full team objects
export function mapCompetitionTeamsFull(competition, teams) {
  console.log('🔍 mapCompetitionTeamsFull input:', { 
    competitionId: competition.id, 
    competitionName: competition.name,
    originalLineup: competition.lineup 
  });
  
  const getTeam = (entry) => {
    console.log('🔍 Processing lineup entry:', entry);
    
    // Handle case where entry.id is already a full team object
    if (entry && typeof entry === 'object' && entry.id && typeof entry.id === 'object' && entry.id.name) {
      console.log('✅ Found full team object in entry.id:', entry.id);
      // entry.id is a full team object, extract the actual ID and name
      return { id: entry.id.id, name: entry.id.name };
    }
    // Handle junction table structure where entry has teams_id
    if (entry && typeof entry === 'object' && entry.teams_id) {
      console.log('✅ Found teams_id in entry:', entry.teams_id);
      // Check if teams_id is already a full team object
      if (typeof entry.teams_id === 'object' && entry.teams_id.name) {
        console.log('✅ teams_id is a full team object, extracting ID and name');
        return { id: entry.teams_id.id, name: entry.teams_id.name };
      }
      // teams_id is just an ID, find the team
      return teams.find(t => t.id === entry.teams_id || t.id === String(entry.teams_id)) || { id: entry.teams_id, name: `Team ${entry.teams_id}` };
    }
    // Handle direct team ID or name
    console.log('✅ Processing as direct entry:', entry);
    return teams.find(t => t.id === entry || t.id === String(entry) || t.name === entry) || { id: entry, name: entry };
  };

  // Construct logo URL if it's an ID
  const API_URL = import.meta.env.VITE_DIRECTUS_URL;
  const logoUrl = competition.logo
    ? (typeof competition.logo === 'string'
        ? (competition.logo.startsWith('http') ? competition.logo : `${API_URL}/assets/${competition.logo}`)
        : (competition.logo && typeof competition.logo === 'object' && competition.logo.url ? competition.logo.url : `${API_URL}/assets/${competition.logo.id}`))
    : '';

  const mappedLineup = Array.isArray(competition.lineup)
    ? competition.lineup.map(entry => getTeam(entry))
    : [];
    
  console.log('🔍 Final mapped lineup:', mappedLineup);
  
  return {
    ...competition,
    logo: logoUrl,
    lineup: mappedLineup,
  };
} 