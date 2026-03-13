const API_URL = import.meta.env.VITE_DIRECTUS_URL || 'https://your-directus-instance.com';
const TOKEN = import.meta.env.VITE_DIRECTUS_TOKEN || '';

/** Save data to localStorage cache */
function setCache(key: string, data: any): void {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {}
}

/** Get data from localStorage cache */
function getCache(key: string): any | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.data ?? null;
  } catch {
    return null;
  }
}

/** Fetch with retry and exponential backoff */
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutMs = 15000;
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      return res;
    } catch (err) {
      if (attempt === maxRetries - 1) throw err;
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
    }
  }
  throw new Error('Max retries exceeded');
}

export async function fetchFromDirectus(collection: string) {
  const cacheKey = `cache_${collection}`;
  try {
    if (!API_URL || API_URL === 'https://your-directus-instance.com') {
      return getCache(cacheKey);
    }
    
    let url = `${API_URL}/items/${collection}`;
    if (collection === 'competitions') {
      url += '?fields=*,lineup.teams_id.*';
    }
    if (collection === 'teams') {
      url += '?fields=*,competitions_attending.competitions_id.*';
    }

    const res = await fetchWithRetry(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });

    const data = await res.json();
    const result = data.data;
    
    // Cache successful response
    if (result) {
      setCache(cacheKey, result);
    }
    
    return result;
  } catch (err) {
    console.warn(`[API] Failed to fetch ${collection}, falling back to cache:`, err);
    const cached = getCache(cacheKey);
    if (cached) {
      console.info(`[API] Using cached data for ${collection}`);
    }
    return cached;
  }
}

export async function fetchTeams() {
  try {
    const [teamsData, competitionsData] = await Promise.all([
      fetchFromDirectus('teams'),
      fetchFromDirectus('competitions')
    ]);
    
    if (!teamsData) return [];
    
    const API_URL = import.meta.env.VITE_DIRECTUS_URL || 'https://your-directus-instance.com';
    
    const competitionMap = new Map();
    if (competitionsData) {
      competitionsData.forEach((comp: any) => {
        competitionMap.set(comp.id, comp);
      });
    }
    
    return teamsData.map((team: any) => {
      const teamResult = (() => {
        if (!competitionsData || !Array.isArray(competitionsData)) return { results: [] as any[], bidPointsFromResults: 0 };
        
        const results = competitionsData.map((competition: any) => {
          let placement = 'N/A';
          let pointsEarned = 0;
          
          const teamIdStr = String(team.id);
          const teamName = team.name;
          
          if (String(competition.firstplace) === teamIdStr || competition.firstplace === teamName) {
            placement = '1st';
            pointsEarned = 4;
          } else if (String(competition.secondplace) === teamIdStr || competition.secondplace === teamName) {
            placement = '2nd';
            pointsEarned = 2;
          } else if (String(competition.thirdplace) === teamIdStr || competition.thirdplace === teamName) {
            const lineupSize = Array.isArray(competition.lineup) ? competition.lineup.length : 0;
            if (lineupSize > 6) {
              placement = '3rd';
              pointsEarned = 1;
            }
          }
          
          if (placement === 'N/A') {
            const inLineup = Array.isArray(competition.lineup) && competition.lineup.some((entry: any) => {
              const entryTeamId = entry?.teams_id?.id ?? entry?.teams_id ?? entry?.id ?? entry;
              return String(entryTeamId) === teamIdStr || 
                     (entry?.teams_id?.name && entry.teams_id.name === teamName);
            });
            
            if (!inLineup) return null;
            const [y, m, d] = (competition.date || '').split('-').map(Number);
            const compDate = new Date(y, m - 1, d);
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            placement = compDate >= now ? 'Upcoming' : 'Competed';
          }
          
          return {
            competitionId: competition.id,
            competitionName: competition.name,
            placement,
            bidPointsEarned: competition.bid_status === true ? pointsEarned : 0,
            cumulativeBidPoints: 0,
            date: competition.date || '',
            isBidCompetition: competition.bid_status === true
          };
        }).filter(Boolean).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        let runningTotal = 0;
        results.forEach((result: any) => {
          runningTotal += result.bidPointsEarned;
          result.cumulativeBidPoints = runningTotal;
        });
        const bidPointsFromResults = results.reduce((sum: number, r: any) => sum + r.bidPointsEarned, 0);
        return { results, bidPointsFromResults };
      })();
      return {
        id: String(team.id),
        name: team.name,
        genderComposition: team.gender_comp,
        university: team.university,
        bidPoints: teamResult.bidPointsFromResults,
        qualified: team.rasqual === true || team.rasqual === 'true',
        locked: false,
        color: team.theme || 'bg-slate-600',
        theme: team.theme || '',
        city: team.city || '',
        instagramlink: team.instagramlink || '',
        competitions_attending: Array.isArray(team.competitions_attending)
          ? team.competitions_attending.map((compObj: any) =>
              compObj.competitions_id?.name || compObj.competitions_id?.id || compObj
            )
          : [],
        history: team.history || [],
        achievements: Array.isArray(team.achievements) ? team.achievements : (team.achievements ? [team.achievements] : []),
        founded: team.est || 0,
        logo: team.logo
          ? (typeof team.logo === 'string'
              ? (team.logo.startsWith('http') ? team.logo : `${API_URL}/assets/${team.logo}`)
              : (team.logo.url ? team.logo.url : `${API_URL}/assets/${team.logo.id}`))
          : '',
        contactInfo: {
          email: team.contact_info || team.email || '',
          phone: team.phone || '',
          website: team.website || '',
          captains: Array.isArray(team.captains) ? team.captains :
                   (typeof team.captains === 'string' && team.captains.includes('[') && team.captains.includes(']'))
                     ? team.captains.replace(/[\[\]]/g, '').split(',').map((c: string) => c.trim())
                     : (team.captains ? [team.captains] : [])
        },
        competitionResults: teamResult.results
      };
    });
  } catch (err) {
    console.warn('[API] fetchTeams failed:', err);
    return [];
  }
}
