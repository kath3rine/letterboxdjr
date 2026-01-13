import Stats from '../components/Stats'
import movieObjects from '../data/movies26.json';
import tvObjects from '../data/shows26.json';
import theaterObjects from '../data/theater26.json'

function Stats26() {
    return(
        <div>
            <Stats year="2026"
            movieObjects={movieObjects}
            tvObjects={tvObjects}
            theaterObjects={theaterObjects}/>
        </div>
    )
}
export default Stats26;