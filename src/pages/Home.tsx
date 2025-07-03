import { useNavigate } from 'react-router-dom';
import movieObjects from '../data/movies.json';
import showObjects from '../data/shows.json';
import { getInfo } from '../utils/Server';
import { useState } from 'react';

function Home() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleClick = async (mode: 'diary' | 'stats') => {
        setLoading(true);
        try {
        const [movieData, tvData] = await Promise.all([
            getInfo(movieObjects, 'movie', [8, 10]),
            getInfo(showObjects, 'tv'),
        ]);

        if (mode === 'diary') {
            navigate('/diary', {
                state: { 
                    data: { 
                        movieData: movieData.posters, 
                        showData: tvData.posters } 
                },
            });
        } else {
            navigate('/stats', {
                state: {
                    data: {
                        movieCount: movieObjects.length,
                        movieAvg: movieData.avgRating,
                        movieMonths: movieData.monthData,
                        movieGenres: movieData.genreData,
                        movieGenreRatings: movieData.genreRatings,
                        movieDecades: movieData.decadeData,
                        movieDecadeRatings: movieData.decadeRatings,

                        tvCount: showObjects.length,
                        tvAvg: tvData.avgRating,
                        tvMonths: tvData.monthData,
                        tvGenres: tvData.genreData,
                        tvGenreRatings: tvData.genreRatings,
                        tvDecades: tvData.decadeData,
                        tvDecadeRatings: tvData.decadeRatings,
                        tvHrs: tvData.totalHours,
                    },
                },
            });
        }
        } catch (err) {
            alert('Error loading data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <button onClick={() => handleClick('diary')} disabled={loading}>
                Diary
            </button>
            <button onClick={() => handleClick('stats')} disabled={loading} style={{ marginLeft: '10px' }}>
                Yearly Stats
            </button>
        </div>
    );
};

export default Home;
