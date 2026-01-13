import { useLocation, useNavigate } from 'react-router-dom';
import { PieGraph, BarGraph, AreaGraph, StackedBar } from '../components/Graphs'
import { useState, useEffect } from 'react'
import { Data } from '../utils/Types'
import { getStats, getTheaterStats } from '../utils/Stats'
import movieObjects from '../data/movies.json';
import tvObjects from '../data/shows.json';
import theaterObjects from '../data/theater.json'
import '../styles/Stats.css'

type HeaderItem = {
    top: string | number
    bottom: string
}

function Stats() {
    const location = useLocation();
    const navigate = useNavigate();
    const palette = [
      "#00E054",
      "#40BCF4",
      "#FF8000",
    ]
    const palette2 = [
      "#00E054",
      "#81F0AA",
      "#40BCF4",
      "#A0DEFA",
      "#FF8000",
      "#FFAB57",
    ]
    const greens = [
      "#00E054",
      "#22E46B",
      "#42E880",
      "#61EC95",
      "#81F0AA",
      "#A0F3C0",
      "#C0F7D5",
      "#DFFBEA"
    ]
    const blues = [
      "#40BCF4",
      "#71CDF7",
      "#A0DEFA",
      "#D0EEFC"
    ]
    const oranges = [
      "#FF8000",
      "#FFAB57",
      "#FFD5AB"
    ]
    const w = 300
    const h = 200

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
          try {
            const [movieStats, showStats, theaterStats] = await Promise.all([
              getStats(movieObjects, 'movie'),
              getStats(tvObjects, 'tv'),
              getTheaterStats(theaterObjects)
            ]);
    
            setData({
              movieCount: movieObjects.length,
              movieAvg: movieStats.avgRating,
              movieMonths: movieStats.monthData,
              movieGenres: movieStats.genreData,
              movieGenreRatings: movieStats.genreRatings,
              movieDecades: movieStats.decadeData,
              movieDecadeRatings: movieStats.decadeRatings,
              movieRewatches: movieStats.rewatches,
              tvCount: tvObjects.length,
              tvAvg: showStats.avgRating,
              tvMonths: showStats.monthData,
              tvGenres: showStats.genreData,
              tvGenreRatings: showStats.genreRatings,
              tvDecades: showStats.decadeData,
              tvDecadeRatings: showStats.decadeRatings,
              tvHrs: showStats.totalHours,
              tvRewatches: showStats.rewatches,
              theaterCount: theaterObjects.length,
              theaterAvg: theaterStats.avgRating,
              theaterGenres: theaterStats.genreData,
              theaterGenreRatings: theaterStats.genreRatings,
              theaterMonths: theaterStats.monthData,
              theaterRewatches: theaterStats.rewatches
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

    const totalMonths = Array.from({ length: 12 }, (_, i) => {
      return {
        name: i + 1, 
        movies: data.movieMonths[i]?.value * 2 ?? 0,
        tv: data.tvMonths[i]?.value ?? 0,
        theater: data.theaterMonths[i]?.value * 2?? 0
      }
    })


    const headerData: HeaderItem[] = [        
        { top: data.movieCount * 2 + data.tvHrs + data.theaterCount * 2, bottom: "HOURS"},
        { top: data.movieCount, bottom: "MOVIES"},
        { top: data.tvCount, bottom: "SHOWS"},
        { top: data.theaterCount, bottom: "PLAYS"}
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

        <div className='stats-section'>
              <div className='stats-card-wide'>
                <h3>hrs watched per month, by media</h3>
                <StackedBar w={w*2} h={h*1.1}
                    data={totalMonths}
                    palette={palette}
                    categories = {["movies", "tv", "theater"]} 
                  />
              </div>
                        
        {/* <BarGraph w={w} h={h}
            color={0}
            title="months - movies"
            data={data.movieMonths}
            palette={greens}/>


            <BarGraph w={w} h={h}
            color={1}
            title="months - tv"
            data={data.tvMonths}
            palette={blues}/>

            <BarGraph w={w} h={h}
            color={2}
            title="months - theater"
            data={data.theaterMonths}
            palette={palette}/> */}
        <div className='stats-card-wide'>
          <h3>media</h3>
          <div className='stats-card-content'>
            <PieGraph w={w*1.5} h={h}
              title="most watched (in hours)" 
              palette={palette2}
              data={[
                  { "name": "movies: new", "value": (data.movieCount - data.movieRewatches) * 2 },
                  { "name": "movies: rewatch", "value": data.movieRewatches * 2 },
                  { "name": "tv: new", "value": data.tvHrs - data.tvRewatches},
                  { "name": "tv: rewatch", "value": data.tvRewatches },
                  { "name": "theater: new", "value": (data.theaterCount - data.theaterRewatches) * 2},
                  { "name": "theater: rewatch", "value": data.theaterRewatches * 2}
              ]}/>
            <BarGraph w={w*0.7} h={h}
              title="highest rated" 
              palette={palette}
              myDomain={5}
              data={[
                  { "name": "movies", "value": data.movieAvg },
                  { "name": "tv", "value": data.tvAvg },
                  { "name": "theater", "value": data.theaterAvg }
            ]}/>
            </div>
        </div>

        <div className='stats-card'>
          <h3>genres - movies</h3>
          <div className='stats-card-content'>
            <PieGraph w={w*1.2} h={h}
            title="most watched" 
            palette={greens}
            data={data.movieGenres}/>
            <BarGraph w={w} h={h*1.2}
            title="highest rated"
            myDomain={5}
            layout="vertical"
            data={data.movieGenreRatings}
            palette={greens}/>
          </div>
        </div>
        
        <div className='stats-card'>
          <h3>genres - tv</h3>
          <div className="stats-card-content">
            <PieGraph w={w} h={h}
            title="most-watched" 
            palette={blues}
            data={data.tvGenres}/>
            <BarGraph w={w} h={h*1.2}
            title="highest rated"
            myDomain={5}
            layout="vertical"
            data={data.tvGenreRatings}
            palette={blues}/>
          </div>
        </div>


        <div className='stats-card'>
            <h3>decades (movies)</h3>
            <div className='stats-card-content'>
              <BarGraph w={w} h={h}
                  title="most watched"
                  myDomain={9}
                  data={data.movieDecades}
                  palette={greens}/>  
              <BarGraph w={w} h={h*1.2}
                  title="highest rated"
                  myDomain={5}
                  data={data.movieDecadeRatings}
                  isRating={true}
                  palette={greens}/>
            </div>                    
        </div>

        <div className='stats-card'>
          <h3>decades - tv</h3>
          <div className='stats-card-content'>
            <BarGraph w={w} h={h}
            title="most watched"
            myDomain={9}
            data={data.tvDecades}
            palette={blues}/>
            <BarGraph w={w} h={h*1.2}
            title="highest rated"
            myDomain={5}
            data={data.tvDecadeRatings}
            palette={blues}/>
          </div>
        </div>
        

        <div className='stats-card'>
          <h3> venues - theater</h3>
          <div className='stats-card-content'>
          <PieGraph w={w*1.1} h={h}
            title="most watched" 
            palette={oranges}
            data={data.theaterGenres}/>
          <BarGraph w={w} h={h}
            title="highest rated"
            myDomain={5}
            layout="vertical"
            data={data.theaterGenreRatings}
            palette={oranges}/>
          </div>
        </div>
        </div>
        
    </div>
  );
};

export default Stats;