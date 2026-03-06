import { Team } from './types';
import { normalizeName } from './fetchTiebreakerRanking';

/**
 * Creates a comparator that sorts teams by:
 * 1. bidPoints descending
 * 2. Google Sheet position ascending (lower = better)
 * 3. Alphabetical fallback
 */
export function createTeamComparator(rankingMap: Map<string, number>) {
  return (a: Team, b: Team): number => {
    if (b.bidPoints !== a.bidPoints) return b.bidPoints - a.bidPoints;
    const aRank = rankingMap.get(normalizeName(a.name)) ?? 9999;
    const bRank = rankingMap.get(normalizeName(b.name)) ?? 9999;
    if (aRank !== bRank) return aRank - bRank;
    return a.name.localeCompare(b.name);
  };
}

/**
 * Builds a rank map (teamId → 1-based rank) from sorted teams with bid points.
 */
export function buildRankMap(teams: Team[], rankingMap: Map<string, number>): Map<string, number> {
  const sorted = teams
    .filter(t => t.bidPoints > 0)
    .sort(createTeamComparator(rankingMap));
  return new Map(sorted.map((t, i) => [t.id, i + 1]));
}
