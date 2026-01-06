import { useLocation, useNavigate } from 'react-router-dom';
import { PieGraph, BarGraph, AreaGraph } from '../components/Graphs'
import { useState, useEffect } from 'react'
import { Data } from '../utils/Types'
import { getStats } from '../utils/Stats'
import movieObjects from '../data/movies.json';
import tvObjects from '../data/shows.json';
import '../styles/Stats.css'

type HeaderItem = {
    top: string | number
    bottom: string
}

function Stats() {
    const location = useLocation();
    const navigate = useNavigate();
    const palette = [ "#00e054", "#ff8000", "#40bcf4", "#eee",  "#555", "#aaa" ]
    const w = 430
    const h = 180

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
          try {
            const [movieStats, showStats] = await Promise.all([
              getStats(movieObjects, 'movie'),
              getStats(tvObjects, 'tv'),
            ]);
    
            setData({
              movieCount: movieObjects.length,
              movieAvg: movieStats.avgRating,
              movieMonths: movieStats.monthData,
              movieGenres: movieStats.genreData,
              movieGenreRatings: movieStats.genreRatings,
              movieDecades: movieStats.decadeData,
              movieDecadeRatings: movieStats.decadeRatings,
              tvCount: tvObjects.length,
              tvAvg: showStats.avgRating,
              tvMonths: showStats.monthData,
              tvGenres: showStats.genreData,
              tvGenreRatings: showStats.genreRatings,
              tvDecades: showStats.decadeData,
              tvDecadeRatings: showStats.decadeRatings,
              tvHrs: showStats.totalHours,
            });
          } catch (err) {
            console.error("Failed to load stats data:", err);
          } finally {
            setLoading(false);
          }
        }
    
        loadData();
      }, []);
    
    
    if (loading) return <div>Loading stats...</div>;


    const headerData: HeaderItem[] = [
        { top: data.movieCount, bottom: "MOVIES"},
        { top: data.tvCount, bottom: "SHOWS"},
        { top: data.movieCount * 2 + data.tvHrs, bottom: "HOURS"},
        { top: data.movieAvg, bottom: "AVG. MOVIE RATING"},
        { top: data.tvAvg, bottom: "AVG. SHOW RATING"}
    ]

    return (
    <div className="page" id="stats-page">
        <button onClick={() => navigate('/')}>
            Home
        </button>
        <h1>2025 in Film </h1>

        <div id="stats-header">
            { headerData.map((item: HeaderItem) => (
                <div id="header-item">
                    <div id='header-top'>{item.top}</div>
                    <div id='header-bottom'>{item.bottom}</div>
                </div>
            ))}
        </div>

        <h3> MOST WATCHED </h3>
        <div className="stats-section">
            
            <PieGraph w={w} h={h}
            title="genres - movies" 
            palette={palette}
            data={data.movieGenres}/>

            <PieGraph w={w} h={h}
            title="genres - tv" 
            palette={palette}
            data={data.tvGenres}/>

            <PieGraph w={w*0.5} h={h}
            title="media (by hours)" 
            palette={palette}
            data={[
                { "name": "movies", "value": data.movieCount * 2 },
                { "name": "tv", "value": data.tvHrs }
            ]}/>
                        
                        
            <AreaGraph w={w*.8} h={h}
            color={0}
            title="months - movies"
            data={data.movieMonths}
            domain={75}
            palette={palette}/>


            <AreaGraph w={w*.8} h={h}
            color={1}
            domain={75}
            title="months - tv"
            data={data.tvMonths}
            palette={palette}/>

            <BarGraph w={w*.6} h={h}
            title="decades - movies"
            domain={6}
            data={data.movieDecades}
            color={0}
            palette={palette}/>            
            
            <BarGraph w={w*0.6} h={h}
            title="decades - tv"
            color={1}
            domain={6}
            data={data.tvDecades}
            palette={palette}/>


        </div>

        <h3> HIGHEST RATED </h3>
        <div className="stats-section">
            <BarGraph w={w*1.3} h={h}
            title="genres - movies"
            domain={5}
            data={data.movieGenreRatings}
            palette={palette}/>

            <BarGraph w={w} h={h}
            title="genres - tv"
            domain={5}
            data={data.tvGenreRatings}
            palette={palette}/>
        
            <BarGraph w={w * 1.3} h={h}
            title="decades - movies"
            color={0}
            domain={5}
            data={data.movieDecadeRatings}
            palette={palette}/>

            <BarGraph w={w} h={h}
            title="decades - tv"
            color={1}
            domain={5}
            data={data.tvDecadeRatings}
            palette={palette}/>
        </div>
        
    </div>
  );
};

export default Stats;