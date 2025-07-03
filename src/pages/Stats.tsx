import { useLocation, useNavigate } from 'react-router-dom';
import { PieGraph, BarGraph, AreaGraph } from '../components/Graphs'
import { Data } from '../utils/Server'
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
    const h = 150

    const tvHrs: number = location.state?.data?.tvHrs;

    const movieCount: number = location.state?.data?.movieCount;
    const movieMonths: Data[] | undefined = location.state?.data?.movieMonths;
    const movieGenres: Data[] | undefined = location.state?.data?.movieGenres;
    const movieDecades: Data[] | undefined = location.state?.data?.movieDecades;  
    const movieGenreRatings: Data[] | undefined = location.state?.data?.movieGenreRatings;
    const movieDecadeRatings: Data[] | undefined = location.state?.data?.movieDecadeRatings;
    const movieAvg: number = location.state?.data?.movieAvg;

    const tvCount: number = location.state?.data?.tvCount;
    const tvMonths: Data[] | undefined = location.state?.data?.tvMonths;
    const tvGenres: Data[] | undefined = location.state?.data?.tvGenres;
    const tvDecades: Data[] | undefined = location.state?.data?.tvDecades;  
    const tvGenreRatings: Data[] | undefined = location.state?.data?.tvGenreRatings;
    const tvDecadeRatings: Data[] | undefined = location.state?.data?.tvDecadeRatings;
    const tvAvg: number = location.state?.data?.tvAvg;

    const headerData: HeaderItem[] = [
        { top: movieCount, bottom: "MOVIES"},
        { top: tvCount, bottom: "SHOWS"},
        { top: movieAvg, bottom: "AVG. MOVIE RATING"},
        { top: tvAvg, bottom: "AVG. SHOW RATING"},
        { top: tvHrs + movieCount * 2, bottom: "HOURS"}
    ]


  return (
    <div className="page" id="stats-page">
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
        <PieGraph w={w*0.5} h={h}
            title="media (by hours)" 
            palette={palette}
            data={[
                { "name": "movies", "value": movieCount * 2 },
                { "name": "tv", "value": tvHrs }
            ]}/>

            <AreaGraph w={w*1.05} h={h}
            color={0}
            title="months (movies)"
            data={movieMonths}
            domain={32}
            palette={palette}/>


            <AreaGraph w={w*1.05} h={h}
            color={1}
            domain={32}
            title="months (shows)"
            data={tvMonths}
            palette={palette}/>
            
            <PieGraph w={w} h={h}
            title="genre (movies)" 
            palette={palette}
            data={movieGenres}/>

            <PieGraph w={w*0.6} h={h}
            title="genre (shows)" 
            palette={palette}
            data={tvGenres}/>

            <BarGraph w={w*.8} h={h}
            title="decades (movies)"
            domain={6}
            data={movieDecades}
            color={0}
            palette={palette}/>            
            
            <BarGraph w={w*0.5} h={h}
            title="decades (shows)"
            color={1}
            domain={6}
            data={tvDecades}
            palette={palette}/>


        </div>

        <h3> HIGHEST RATED </h3>
        <div className="stats-section">
            <BarGraph w={w} h={h}
            title="movies by genre"
            domain={5}
            data={movieGenreRatings}
            palette={palette}/>

            <BarGraph w={w * 0.5} h={h}
            title="shows by genre"
            domain={5}
            data={tvGenreRatings}
            palette={palette}/>
        
            <BarGraph w={w * 1} h={h}
            title="movies by decade"
            color={0}
            domain={5}
            data={movieDecadeRatings}
            palette={palette}/>

            <BarGraph w={w * .5} h={h}
            title="shows by decade"
            color={1}
            domain={5}
            data={tvDecadeRatings}
            palette={palette}/>
        </div>
        
    </div>
  );
};

export default Stats;