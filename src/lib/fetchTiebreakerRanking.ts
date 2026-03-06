const SHEET_ID = '1ZwhzO49wsBv_a8T_gyF_dihhH9FmjDQdGXknS6_-Uqw';
const GID = '1418394758';

/** Strip to lowercase alphanumeric only for robust matching */
export function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Fetches the tiebreaker ranking from a public Google Sheet (specific tab).
 * Returns a Map of normalized team name → numeric Position from Column A.
 * On failure, returns an empty map (ties fall back to alphabetical).
 */
export async function fetchTiebreakerRanking(): Promise<Map<string, number>> {
  const rankingMap = new Map<string, number>();

  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;
    const response = await fetch(url);
    if (!response.ok) return rankingMap;

    const csv = await response.text();
    const lines = csv.split('\n').filter(line => line.trim().length > 0);

    // Skip header row (line 0)
    for (let i = 1; i < lines.length; i++) {
      const fields = parseCSVLine(lines[i]);
      const positionStr = fields[0]?.replace(/^"|"$/g, '').trim();
      const rawName = fields[1]?.replace(/^"|"$/g, '').trim();
      const position = parseInt(positionStr, 10);

      if (rawName && !isNaN(position)) {
        const normalized = normalizeName(rawName);
        rankingMap.set(normalized, position);
      }
    }
    // Log all entries for debugging
    console.log(`[Tiebreaker] Loaded ${rankingMap.size} teams from sheet:`);
    rankingMap.forEach((pos, name) => {
      console.log(`  [Sheet] "${name}" → position ${pos}`);
    });
  } catch (error) {
    console.warn('Failed to fetch tiebreaker ranking:', error);
  }

  return rankingMap;
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
