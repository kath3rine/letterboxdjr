import Stats from '../components/Stats'
import movieObjects from '../data/movies25.json';
import tvObjects from '../data/shows25.json';
import theaterObjects from '../data/theater25.json'

function Diary25() {
    return(
        <div>
            <Stats year="2025"
            movieObjects={movieObjects}
            tvObjects={tvObjects}
            theaterObjects={theaterObjects}/>
        </div>
    )
}
export default Diary25;