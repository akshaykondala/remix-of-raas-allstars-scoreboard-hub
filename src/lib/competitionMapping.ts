// Utility to map competition lineup and placings to full team objects
export function mapCompetitionTeamsFull(competition, teams) {
  const getTeam = (entry) =>
    teams.find(
      t => t.id === entry || t.id === String(entry) || t.name === entry
    ) || { id: entry, name: entry };

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