const API_URL = import.meta.env.VITE_DIRECTUS_URL;
const TOKEN = import.meta.env.VITE_DIRECTUS_TOKEN;

export async function fetchFromDirectus(collection: string) {
  try {
    let url = `${API_URL}/items/${collection}`;
    // Deep populate lineup for competitions
    if (collection === 'competitions') {
      url += '?fields=*,lineup.*';
    }
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error('Directus API fetch error:', err);
    return null;
  }
}

export async function fetchTeams() {
  try {
    const data = await fetchFromDirectus('teams');
    if (!data) return [];
    
    const API_URL = import.meta.env.VITE_DIRECTUS_URL;
    
    return data.map((team: any) => ({
      id: team.id,
      name: team.name,
      university: team.university,
      bidPoints: team.bidpoints || 0,
      qualified: (team.bidpoints || 0) >= 5, // Auto-calculate qualification based on bid points
      locked: false, // You can add this field to your database if needed
      color: team.theme || 'bg-slate-600', // Using 'theme' field for team color
      city: team.city || '',
      instagramlink: team.instagramlink || '',
      competitions_attending: team.competitions_attending || [],
      history: [], // You can add this field to your database if needed
      achievements: [], // You can add this field to your database if needed
      founded: '', // You can add this field to your database if needed
      logo: team.logo
        ? (typeof team.logo === 'string'
            ? `${API_URL}/assets/${team.logo}`
            : `${API_URL}/assets/${team.logo.id}`)
        : undefined
    }));
  } catch (err) {
    console.error('Error fetching teams:', err);
    return [];
  }
}
