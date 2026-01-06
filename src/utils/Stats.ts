import { searchTMDB, BASE_URL, API_KEY } from "./TMDB";
import { Input } from './Types'

export async function getStats(
    items: Input[],
    type: 'movie' | 'tv'
) {
    const genreMapRes = await fetch(`${BASE_URL}/genre/${type}/list?api_key=${API_KEY}`);
    const genreMapJson = await genreMapRes.json();
    const genreMap = Object.fromEntries(genreMapJson.genres.map((g: any) => [g.id, g.name]));
    const genreCounts: {[genre: string]: number} = {}
    const genreRating: {[genre: string]: number} = {}
    const decadeCounts: {[decade: string]: number} = {}
    const decadeRating: {[decade: string]: number} = {}
    const monthCounts: {[month: number]: number} = {}
    let totalRating = 0

    for (let i = 0; i < 12; i++) {
        monthCounts[i + 1] = 0
    }

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const result = await searchTMDB(item.title, type, item.year);
        if (!result) continue;
    
        const gid = result.genre_ids?.[0];
        if (gid !== undefined) {
            const genre = genreMap[gid] || 'Unknown';
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            genreRating[genre] = (genreRating[genre] || 0) + item.points;
        }

        const date = type === 'movie' ? result.release_date : result.first_air_date;
        if (date) {
            const year = parseInt(date.split('-')[0]);
            const decade = `${Math.floor(year / 10) * 10}s`;
            decadeCounts[decade] = (decadeCounts[decade] || 0) + 1;
            decadeRating[decade] = (decadeRating[decade] || 0) + item.points;
        }

        if (type === 'movie') {
            monthCounts[item.month] += 1
        } else if (item.episodes) {
            monthCounts[item.month] += item.episodes
        }
        totalRating += item.points
    }
    const avgRating = Math.round((totalRating / items.length) * 100) / 100;

    return {
        genreData: Object.entries(genreCounts).map(([name, value]) => ({ name, value })),
        genreRatings: Object.entries(genreRating).map(([name, total]) => ({
            name,
            value: Math.round((total / genreCounts[name]) * 100) / 100,
        })),
        decadeData: Object.entries(decadeCounts).map(([name, value]) => ({ name, value }))
            .sort((a, b) => String(a.name).localeCompare(String(b.name))),
        decadeRatings: Object.entries(decadeRating).map(([name, total]) => ({
            name,
            value: Math.round((total / decadeCounts[name]) * 100) / 100,
        })).sort((a, b) => String(a.name).localeCompare(String(b.name))),
        monthData: Object.entries(monthCounts).map(([name, value]) => ({ name, value })),
        avgRating,
        totalHours: items.reduce((sum, item) => sum + (type === 'movie' ? 2 : item.episodes ?? 0), 0),
    };
}

export async function getTheaterStats(items: Input[]) {
    const genreCounts: {[genre: string]: number} = {}
    const genreRating: {[genre: string]: number} = {}
    const monthCounts: {[month: number]: number} = {}
    let totalRating = 0

    for (let i = 0; i < 12; i++) {
        monthCounts[i + 1] = 0
    }

    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.genre) {
            genreCounts[item.genre] = (genreCounts[item.genre] || 0) + 1;
            genreRating[item.genre] = (genreRating[item.genre] || 0) + item.points;
        }
        monthCounts[item.month] += 1
        totalRating += item.points
    }
    const avgRating = Math.round((totalRating / items.length) * 100) / 100;

    return {
        genreData: Object.entries(genreCounts).map(([name, value]) => ({ name, value })),
        genreRatings: Object.entries(genreRating).map(([name, total]) => ({
            name,
            value: Math.round((total / genreCounts[name]) * 100) / 100,
        })),
        monthData: Object.entries(monthCounts).map(([name, value]) => ({ name, value })),
        avgRating
    }
}