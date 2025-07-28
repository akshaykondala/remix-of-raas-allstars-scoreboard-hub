// Utility to map competition lineup and placings to full team objects
export function mapCompetitionTeamsFull(competition, teams) {
  const getTeam = (entry) => {
    // Handle junction table structure where entry has teams_id
    if (entry && typeof entry === 'object' && entry.teams_id) {
      return teams.find(t => t.id === entry.teams_id || t.id === String(entry.teams_id)) || { id: entry.teams_id, name: `Team ${entry.teams_id}` };
    }
    // Handle direct team ID or name
    return teams.find(t => t.id === entry || t.id === String(entry) || t.name === entry) || { id: entry, name: entry };
  };

  return {
    ...competition,
    lineup: Array.isArray(competition.lineup)
      ? competition.lineup.map(entry => getTeam(entry))
      : [],
    placings: {
      first: getTeam(competition.placings?.first),
      second: getTeam(competition.placings?.second),
      third: getTeam(competition.placings?.third),
    },
  };
} 