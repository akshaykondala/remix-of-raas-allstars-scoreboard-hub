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
  // Log every team with bid points: name, normalized, match status, position
  const appNames = teams.filter(t => t.bidPoints > 0).map(t => {
    const normalized = normalizeName(t.name);
    const rank = fuzzyLookup(normalized, rankingMap);
    return {
      original: t.name,
      normalized,
      matched: rank !== undefined,
      sheetRank: rank,
    };
  });

  console.log(`[Tiebreaker] Diagnostic: ${appNames.length} teams with bid points:`);
  appNames.forEach(n => {
    const status = n.matched ? `✅ position ${n.sheetRank}` : '❌ UNMATCHED';
    console.log(`  "${n.original}" → "${n.normalized}" → ${status}`);
  });

  const unmatched = appNames.filter(n => !n.matched);
  if (unmatched.length > 0) {
    console.warn(`[Tiebreaker] ⚠️ ${unmatched.length} team(s) still unmatched after fuzzy matching`);
  }

  // Log tie groups
  const sorted = [...teams].filter(t => t.bidPoints > 0).sort(createTeamComparator(rankingMap));
  const groups = new Map<number, typeof appNames>();
  sorted.forEach(t => {
    const pts = t.bidPoints;
    if (!groups.has(pts)) groups.set(pts, []);
    const normalized = normalizeName(t.name);
    const rank = fuzzyLookup(normalized, rankingMap);
    groups.get(pts)!.push({
      original: t.name,
      normalized,
      matched: rank !== undefined,
      sheetRank: rank,
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
