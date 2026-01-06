import { searchTMDB } from "./TMDB";
import { Input, DiaryEntry } from './Types'

export async function getDiary(
    items: Input[], 
    type: 'movie' | 'tv' | 'theater'
) {
    const diaryEntries: DiaryEntry[] = []
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        var posterPath = "";
        if (type == 'movie' || type == 'tv') {
            const result = await searchTMDB(item.title, type, item.year);
            if (result) {
                posterPath = `https://image.tmdb.org/t/p/w200${result.poster_path}`
            }
        }
    
        diaryEntries.push({
          title: item.title,
          poster: posterPath,
          points: item.points,
          review: item.review || '',
        });
    }
    
    return diaryEntries;
}

