const SHEET_ID = '1ZwhzO49wsBv_a8T_gyF_dihhH9FmjDQdGXknS6_-Uqw';
const GID = '1418394758';

/** Strip to lowercase alphanumeric only for robust matching */
export function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Simple Levenshtein distance for fuzzy matching.
 */
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

/** Split original name into lowercase tokens (preserves word boundaries) */
function tokenizeOriginal(name: string): string[] {
  return name.toLowerCase().split(/[^a-z0-9]+/).filter(t => t.length > 0);
}

/**
 * Look up a normalized name in the ranking map.
 * Strategies in order: exact → substring containment → token overlap → Levenshtein ≤ 3.
 */
export function fuzzyLookup(
  normalizedName: string,
  rankingMap: Map<string, number>,
  originalName?: string,
  sheetOriginalNames?: Map<string, string>
): number | undefined {
  // 1. Exact match
  const exact = rankingMap.get(normalizedName);
  if (exact !== undefined) return exact;

  // 2. Substring containment (best = shortest containing match)
  let substringBest: { pos: number; len: number } | undefined;
  for (const [sheetName, pos] of rankingMap.entries()) {
    if (normalizedName.includes(sheetName) || sheetName.includes(normalizedName)) {
      if (!substringBest || sheetName.length < substringBest.len) {
        substringBest = { pos, len: sheetName.length };
      }
    }
  }
  if (substringBest) {
    return substringBest.pos;
  }

  // 3. Token overlap using original names (preserves word boundaries)
  const appTokens = tokenizeOriginal(originalName || normalizedName);
  let tokenBest: { pos: number; overlap: number } | undefined;
  for (const [sheetNorm, pos] of rankingMap.entries()) {
    const sheetOrig = sheetOriginalNames?.get(sheetNorm) || sheetNorm;
    const sheetTokens = tokenizeOriginal(sheetOrig);
    const shared = appTokens.filter(t => sheetTokens.includes(t)).length;
    if (shared >= 2) {
      const ratio = shared / Math.max(appTokens.length, sheetTokens.length);
      if (!tokenBest || ratio > tokenBest.overlap) {
        tokenBest = { pos, overlap: ratio };
      }
    }
  }
  if (tokenBest) {
    return tokenBest.pos;
  }

  // 4. Levenshtein ≤ 3
  let bestDist = Infinity;
  let bestPos: number | undefined;
  for (const [sheetName, pos] of rankingMap.entries()) {
    const dist = levenshtein(normalizedName, sheetName);
    if (dist < bestDist && dist <= 3) {
      bestDist = dist;
      bestPos = pos;
    }
  }
  return bestPos;
}

/**
 * Fetches the tiebreaker ranking from a public Google Sheet (specific tab).
 * Returns a Map of normalized team name → numeric Position from Column A.
 * On failure, returns an empty map (ties fall back to alphabetical).
 */
export async function fetchTiebreakerRanking(): Promise<{ rankingMap: Map<string, number>; originalNames: Map<string, string> }> {
  const rankingMap = new Map<string, number>();
  const originalNames = new Map<string, string>(); // normalized → original sheet name

  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;
    const response = await fetch(url);
    if (!response.ok) return { rankingMap, originalNames };

    const csv = await response.text();
    const lines = csv.split('\n').filter(line => line.trim().length > 0);

    for (let i = 1; i < lines.length; i++) {
      const fields = parseCSVLine(lines[i]);
      const positionStr = fields[0]?.replace(/^"|"$/g, '').trim();
      const rawName = fields[1]?.replace(/^"|"$/g, '').trim();
      const position = parseInt(positionStr, 10);

      if (rawName && !isNaN(position)) {
        const normalized = normalizeName(rawName);
        rankingMap.set(normalized, position);
        originalNames.set(normalized, rawName);
      }
    }
    // Sheet loaded successfully
  } catch (error) {
    // Tiebreaker fetch failed; ties fall back to alphabetical
  }

  return { rankingMap, originalNames };
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current);
  return fields;
}
