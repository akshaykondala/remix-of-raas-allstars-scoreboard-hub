import { Team } from './types';
import { normalizeName } from './fetchTiebreakerRanking';

/**
 * Creates a comparator that sorts teams by:
 * 1. bidPoints descending
 * 2. Google Sheet position ascending (lower position number = higher rank = listed first)
 * 3. Teams found in sheet always beat unmatched teams in a tie
 * 4. Alphabetical fallback
 */
export function createTeamComparator(rankingMap: Map<string, number>) {
  return (a: Team, b: Team): number => {
    // Primary: higher bid points first
    if (b.bidPoints !== a.bidPoints) return b.bidPoints - a.bidPoints;

    // Tiebreaker: use sheet position (lower number = better)
    const aKey = normalizeName(a.name);
    const bKey = normalizeName(b.name);
    const aRank = rankingMap.get(aKey);
    const bRank = rankingMap.get(bKey);

    // If both found in sheet, compare positions
    if (aRank !== undefined && bRank !== undefined) {
      return aRank - bRank; // lower position wins
    }
    // If only one found, that one wins
    if (aRank !== undefined && bRank === undefined) return -1;
    if (aRank === undefined && bRank !== undefined) return 1;

    // Neither found: alphabetical
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

/**
 * Logs diagnostic info about tie groups and name matching.
 */
export function logTiebreakerDiagnostics(teams: Team[], rankingMap: Map<string, number>) {
  // Check for unmatched names
  const appNames = teams.filter(t => t.bidPoints > 0).map(t => ({
    original: t.name,
    normalized: normalizeName(t.name),
    matched: rankingMap.has(normalizeName(t.name)),
    sheetRank: rankingMap.get(normalizeName(t.name)),
  }));

  const unmatched = appNames.filter(n => !n.matched);
  if (unmatched.length > 0) {
    console.warn(`[Tiebreaker] ⚠️ ${unmatched.length} app team(s) NOT found in sheet:`);
    unmatched.forEach(n => console.warn(`  App name: "${n.original}" → normalized: "${n.normalized}"`));
  }

  // Log tie groups
  const sorted = [...teams].filter(t => t.bidPoints > 0).sort(createTeamComparator(rankingMap));
  const groups = new Map<number, typeof appNames>();
  sorted.forEach(t => {
    const pts = t.bidPoints;
    if (!groups.has(pts)) groups.set(pts, []);
    groups.get(pts)!.push({
      original: t.name,
      normalized: normalizeName(t.name),
      matched: rankingMap.has(normalizeName(t.name)),
      sheetRank: rankingMap.get(normalizeName(t.name)),
    });
  });

  groups.forEach((members, pts) => {
    if (members.length > 1) {
      console.log(`[Tiebreaker] ${pts}pt tie group (${members.length} teams):`);
      members.forEach((m, i) => {
        console.log(`  ${i + 1}. "${m.original}" sheetPos=${m.sheetRank ?? 'UNMATCHED'}`);
      });
    }
  });
}
