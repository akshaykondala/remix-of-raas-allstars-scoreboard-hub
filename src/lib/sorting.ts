import { Team } from './types';
import { normalizeName, fuzzyLookup } from './fetchTiebreakerRanking';

/**
 * Creates a comparator that sorts teams by:
 * 1. bidPoints descending
 * 2. Google Sheet position ascending (lower position number = higher rank = listed first)
 *    Uses fuzzy matching to handle minor name differences
 * 3. Alphabetical fallback (no more "unmatched auto-loses")
 */
export function createTeamComparator(rankingMap: Map<string, number>, sheetOriginalNames?: Map<string, string>) {
  return (a: Team, b: Team): number => {
    // Primary: higher bid points first
    if (b.bidPoints !== a.bidPoints) return b.bidPoints - a.bidPoints;

    // Tiebreaker: use sheet position with fuzzy matching
    const aKey = normalizeName(a.name);
    const bKey = normalizeName(b.name);
    const aRank = fuzzyLookup(aKey, rankingMap, a.name, sheetOriginalNames);
    const bRank = fuzzyLookup(bKey, rankingMap, b.name, sheetOriginalNames);

    // If both found in sheet, compare positions
    if (aRank !== undefined && bRank !== undefined) {
      return aRank - bRank; // lower position wins
    }

    // If only one or neither found, fall back to alphabetical
    return a.name.localeCompare(b.name);
  };
}

/**
 * Builds a rank map (teamId → 1-based rank) from sorted teams with bid points.
 */
export function buildRankMap(teams: Team[], rankingMap: Map<string, number>, sheetOriginalNames?: Map<string, string>): Map<string, number> {
  const sorted = teams
    .filter(t => t.bidPoints > 0)
    .sort(createTeamComparator(rankingMap, sheetOriginalNames));
  return new Map(sorted.map((t, i) => [t.id, i + 1]));
}

