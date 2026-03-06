const SHEET_ID = '1ZwhzO49wsBv_a8T_gyF_dihhH9FmjDQdGXknS6_-Uqw';

/** Normalize a team name for matching: lowercase, trim, collapse whitespace, strip punctuation */
export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/['''\-]/g, '');
}

/**
 * Fetches the tiebreaker ranking from a public Google Sheet.
 * Returns a Map of normalized team name → rank position (1-based).
 * On failure, returns an empty map (ties fall back to alphabetical).
 */
export async function fetchTiebreakerRanking(): Promise<Map<string, number>> {
  const rankingMap = new Map<string, number>();

  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;
    const response = await fetch(url);
    if (!response.ok) return rankingMap;

    const csv = await response.text();
    const lines = csv.split('\n').filter(line => line.trim().length > 0);

    // Skip header row (line 0), parse remaining rows
    for (let i = 1; i < lines.length; i++) {
      const fields = parseCSVLine(lines[i]);
      // Column B (index 1) is the Team name
      const rawName = fields[1]?.replace(/^"|"$/g, '').trim();
      if (rawName) {
        const normalized = normalizeName(rawName);
        rankingMap.set(normalized, i);
        console.log(`[Tiebreaker] Sheet row ${i}: "${rawName}" → normalized: "${normalized}"`);
      }
    }
    console.log('[Tiebreaker] Final ranking map:', Object.fromEntries(rankingMap));
  } catch (error) {
    console.warn('Failed to fetch tiebreaker ranking from Google Sheet:', error);
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
