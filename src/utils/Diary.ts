import { searchTMDB } from "./TMDB";
import { Input, DiaryEntry } from './Types'

export async function getDiary(
    items: Input[], 
    type: 'movie' | 'tv'
) {
    const diaryEntries: DiaryEntry[] = []
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const result = await searchTMDB(item.title, type, item.year);
        if (!result) continue;
    
        diaryEntries.push({
          title: item.title,
          poster: result.poster_path ? `https://image.tmdb.org/t/p/w200${result.poster_path}` : null,
          points: item.points,
          review: item.review || '',
        });
    }
    
    return diaryEntries;
}