const API_KEY = "0fbec63a0ce96767c0a97b7c1e0b0902"

export type FilmType = {
    title: string
    poster: string | null
    points: number
    review: string
}

export type Data = {
    name: string
    value: number
}

export interface getInfoResults {
    posters: FilmType[];
    genreData: Data[];
    genreRatings: Data[];
    decadeData: Data[];
    decadeRatings: Data[];
    monthData: Data[];
    avgRating: number;
    totalHours: number;
  }

export async function getInfo (
    items: {
        title: string
        month: number
        points: number
        episodes?: number
        review?: string
    }[],
    type: 'movie' | 'tv',
    altIndices: number[] = []
): Promise<getInfoResults> {
    const baseUrl = 'https://api.themoviedb.org/3';
    const genreMapRes = await fetch(`${baseUrl}/genre/${type}/list?api_key=${API_KEY}`);
    const genreMapJson = await genreMapRes.json();
    const genreMap = Object.fromEntries(genreMapJson.genres.map((g: any) => [g.id, g.name]));

    const posters: FilmType[] = []
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
        const item = items[i]
        const alt = altIndices.includes(i)
        const searchUrl = `${baseUrl}/search/${type}?api_key=${API_KEY}&query=${encodeURIComponent(item.title)}`
        const searchRes = await fetch(searchUrl)
        const searchData = await searchRes.json()
        const result = searchData.results?.[alt ? 1 : 0]
        if (!result) continue

        // reels
        posters.push({
            title: item.title,
            poster: result.poster_path ? `https://image.tmdb.org/t/p/w200${result.poster_path}` : null,
            points: item.points,
            review: item.review || '',
        });

        // charts
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
            monthCounts[item.month] += 2
        } else if (item.episodes) {
            monthCounts[item.month] += item.episodes
        }
        totalRating += item.points
    }

    const avgRating = Math.round((totalRating / items.length) * 100) / 100;

    return {
        posters,
        genreData: Object.entries(genreCounts).map(([name, value]) => ({ name, value })),
        genreRatings: Object.entries(genreRating).map(([name, total]) => ({
            name,
            value: Math.round((total / genreCounts[name]) * 100) / 100,
        })),
        decadeData: Object.entries(decadeCounts).map(([name, value]) => ({ name, value })).sort((a, b) => String(a.value).localeCompare(String(b.value))),
        decadeRatings: Object.entries(decadeRating).map(([name, total]) => ({
            name,
            value: Math.round((total / decadeCounts[name]) * 100) / 100,
        })),
        monthData: Object.entries(monthCounts).map(([name, value]) => ({ name, value })),
        avgRating,
        totalHours: items.reduce((sum, item) => sum + (type === 'movie' ? 2 : item.episodes ?? 0), 0),
    };
}