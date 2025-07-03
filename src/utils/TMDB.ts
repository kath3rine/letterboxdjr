export const API_KEY = "0fbec63a0ce96767c0a97b7c1e0b0902"
export const BASE_URL = 'https://api.themoviedb.org/3'

export async function searchTMDB(
    title: string,
    type: 'movie' | 'tv',
    altIndex: boolean
): Promise<any | null> {
    const url = `${BASE_URL}/search/${type}?api_key=${API_KEY}&query=${encodeURIComponent(title)}`;
    const res = await fetch(url);
    if (!res.ok) {
        console.error(`TMDB search failed for "${title}"`);
        return null;
    }

    const data = await res.json();
    const results = data.results || [];
    
    if (results.length > 0) {
        if (altIndex) {
            return results[1]
        } else {
            return results[0]
        }
    }
    return null
}