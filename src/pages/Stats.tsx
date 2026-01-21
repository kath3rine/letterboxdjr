import { useLocation, useNavigate } from 'react-router-dom';
import { PieGraph, BarGraph, AreaGraph, StackedBar } from '../components/Graphs'
import { useState, useEffect } from 'react'
import { Data } from '../utils/Types'
import { getStats, getTheaterStats } from '../utils/Stats'
import movieObjects from '../data/movies25.json';
import tvObjects from '../data/shows25.json';
import theaterObjects from '../data/theater25.json'
import '../styles/Stats.css'

type HeaderItem = {
    top: string | number
    bottom: string
}

type StatsType = {
  year: string
  movieObjects: any[]
  tvObjects: any[]
  theaterObjects: any[]
}
function Stats(props: StatsType) {
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
      "#81F0AA",
      "#22E46B",
      "#A0F3C0",
      "#42E880",
      "#C0F7D5",
      "#61EC95",
      "#DFFBEA"
    ]
    const blues = [
      "#40BCF4",
      "#A0DEFA",
      "#71CDF7",
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
              getStats(props.movieObjects, 'movie'),
              getStats(props.tvObjects, 'tv'),
              getTheaterStats(props.theaterObjects)
            ]);
    
            setData({
              movieCount: props.movieObjects.length,
              movieAvg: movieStats.avgRating,
              movieMonths: movieStats.monthData,
              movieGenres: movieStats.genreData,
              movieGenreRatings: movieStats.genreRatings,
              movieDecades: movieStats.decadeData,
              movieDecadeRatings: movieStats.decadeRatings,
              movieRatingCounts: movieStats.ratingCounts,
              movieRewatches: movieStats.rewatches,

              tvCount: props.tvObjects.length,
              tvAvg: showStats.avgRating,
              tvMonths: showStats.monthData,
              tvGenres: showStats.genreData,
              tvGenreRatings: showStats.genreRatings,
              tvDecades: showStats.decadeData,
              tvDecadeRatings: showStats.decadeRatings,
              tvHrs: showStats.totalHours,
              tvRewatches: showStats.rewatches,
              tvRatingCounts: showStats.ratingCounts,

              theaterCount: props.theaterObjects.length,
              theaterAvg: theaterStats.avgRating,
              theaterGenres: theaterStats.genreData,
              theaterGenreRatings: theaterStats.genreRatings,
              theaterMonths: theaterStats.monthData,
              theaterRewatches: theaterStats.rewatches,
              theaterRatingCounts: theaterStats.ratingCounts
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
    const totalHours = data.movieCount * 2 + data.tvHrs + data.theaterCount * 2

    const totalMonths = Array.from({ length: 12 }, (_, i) => {
      return {
        name: i + 1, 
        movies: data.movieMonths[i]?.value * 2 ?? 0,
        tv: data.tvMonths[i]?.value ?? 0,
        theater: data.theaterMonths[i]?.value * 2?? 0
      }
    })

    const totalRatingCounts = Array.from({ length: 5 }, (_, i) => {
      return {
        name: i + 1, 
        tv: data.tvRatingCounts[i]?.value ?? 0,
        movies: data.movieRatingCounts[i]?.value ?? 0,
        
        theater: data.theaterRatingCounts[i]?.value ?? 0,
      }
    }) 

    const headerData: HeaderItem[] = [        
        { top: totalHours, bottom: "HOURS"},
        { top: data.movieCount, bottom: "MOVIES"},
        { top: data.tvCount, bottom: "SHOWS"},
        { top: data.theaterCount, bottom: "PLAYS"}
    ]

    return (
    <div className="page" id="stats-page">
        <button onClick={() => navigate('/')}>
            Home
        </button>
        <h1>{props.year} in Film </h1>

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
                <div className='stats-card-content'>
                <StackedBar w={w*1.5} h={h}
                    data={totalMonths}
                    palette={palette}
                    categories = {["movies", "tv", "theater"]} 
                  />
                </div>
              </div>

              <div className='stats-card-wide'>
              <div className='stats-card-content'>
                <PieGraph w={w*1.5} h={h}
                  title="most watched media (in hours)" 
                  palette={palette2}
                  data={[
                      { "name": "movies: new", "value": (data.movieCount - data.movieRewatches) * 2},
                      { "name": "movies: rewatch", "value": data.movieRewatches * 2 },
                      { "name": "tv: new", "value": data.tvHrs - data.tvRewatches},
                      { "name": "tv: rewatch", "value": data.tvRewatches },
                      { "name": "theater: new", "value": (data.theaterCount - data.theaterRewatches) * 2},
                      { "name": "theater: rewatch", "value": data.theaterRewatches * 2}
                  ]}/>
                <div className='stats-card-details'>
                  <li>{ ((data.movieRewatches * 2 + data.tvRewatches + data.theaterRewatches * 2) * 100 / totalHours).toFixed(1)}% rewatches</li>
                  <li>{  (data.movieCount * 2 * 100 / totalHours).toFixed(1)}% movies</li>
                  <li>{  (data.tvHrs * 100 / totalHours).toFixed(1)}% tv</li>
                  <li>{  (data.theaterCount * 2 * 100 / totalHours).toFixed(1)}% theater</li>
                </div>
                </div>
        </div>

              <div className='stats-card-wide'><h3>ratings, by media</h3>
                <div className='stats-card-content'>
                
                <StackedBar w={w} h={h*0.8}
                    title="distribution"
                    data={totalRatingCounts}
                    palette={palette}
                    categories = {["movies", "tv", "theater"]} 
                  />
                <BarGraph w={w} h={h*0.8}
                  title="highest rated" 
                  palette={palette}
                  myDomain={5}
                  data={[
                      { "name": "movies", "value": data.movieAvg },
                      { "name": "tv", "value": data.tvAvg },
                      { "name": "theater", "value": data.theaterAvg }
                ]}/></div>
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
          <h3> venues - theater</h3>
          <div className='stats-card-content'>
          <PieGraph w={w} h={h*0.8}
            title="most watched" 
            palette={oranges}
            hideLabel={true}
            data={data.theaterGenres}/>
          <BarGraph w={w} h={h*0.8}
            title="highest rated"
            myDomain={5}
            layout="vertical"
            data={data.theaterGenreRatings}
            palette={oranges}/>
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
        


        </div>
        
    </div>
  );
};

export default Stats;