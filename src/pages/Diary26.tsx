import Diary from '../components/Diary'
import movieObjects from '../data/movies26.json';
import tvObjects from '../data/shows26.json';
import theaterObjects from '../data/theater26.json'

function Diary26() {
    return(
        <div>
            <Diary year="2026"
            movieObjects={movieObjects}
            tvObjects={tvObjects}
            theaterObjects={theaterObjects}/>
        </div>
    )
}
export default Diary26;