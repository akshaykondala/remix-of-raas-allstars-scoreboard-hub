// Utility to map competition lineup and placings to full team objects
export function mapCompetitionTeamsFull(competition, teams) {
  const getTeam = (entry) => {
    // Handle case where entry.id is already a full team object
    if (entry && typeof entry === 'object' && entry.id && typeof entry.id === 'object' && entry.id.name) {
      return { id: entry.id.id, name: entry.id.name };
    }
    // Handle junction table structure where entry has teams_id
    if (entry && typeof entry === 'object' && entry.teams_id) {
      // Check if teams_id is already a full team object
      if (typeof entry.teams_id === 'object' && entry.teams_id.name) {
        return { id: entry.teams_id.id, name: entry.teams_id.name };
      }
      // teams_id is just an ID, find the team
      return teams.find(t => t.id === entry.teams_id || t.id === String(entry.teams_id)) || { id: entry.teams_id, name: `Team ${entry.teams_id}` };
    }
    // Handle direct team ID or name
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
  
  const sanitizeTime = (raw?: string): string => {
    if (!raw) return '';
    // Strip "2026-02-19T" prefix if Directus returned a full ISO datetime
    const t = raw.includes('T') ? raw.split('T')[1] : raw;
    // Strip fractional seconds and UTC marker e.g. ".000Z" or "Z"
    return t.replace(/\.\d+Z?$/, '').replace(/Z$/, '');
  };

  return {
    ...competition,
    time: sanitizeTime(competition.time),
    logo: logoUrl,
    lineup: mappedLineup,
    judges: Array.isArray(competition.judges) ? competition.judges : [],
    showTicketsLink: competition.showtickets || competition.showTicketsLink || '',
    afterpartyTicketsLink: competition.aptickets || competition.afterpartyTicketsLink || '',
    livestreamLink: competition.livelink || competition.livestreamLink || '',
    videoLink: competition.videolink || competition.videoLink || '',
  };
} 