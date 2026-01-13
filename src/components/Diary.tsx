import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'
import { getDiary } from '../utils/Diary'
import { DiaryEntry } from '../utils/Types'
import '../styles/Diary.css'
import '../App.css'

function Film({film, index}: {film: DiaryEntry, index: number}) {
    const [isFlipped, setIsFlipped] = useState(false);
  
    const handleClick = () => {
      setIsFlipped(!isFlipped);
    };

    return(
        <div id="film-outer">
            <div id="film-inner">
            <div className={`film ${isFlipped ? 'flipped' : ''}`} onClick={handleClick}>
                    <div className="film-front">
                        <img src={film.poster ? film.poster : ''}/>
                        <p id="film-title">{film.title}</p>
                    </div>

                    <div className="film-back">
                        <p id="details">#{index + 1} | rating: {film.points}/5</p>
                        <p id="review">{film.review}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function VHS({film, index}: {film: DiaryEntry, index: number}) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return(
      <div id="vhs-outer">
          <div id="vhs-inner">
          <div className={`film ${isFlipped ? 'flipped' : ''}`} onClick={handleClick}>
                  <div className="film-front">
                    <div id="vhs-tape">
                      <div id="roll">
                      <div id="vhs-label">
                      <p id="film-title">{film.title}</p>
                      </div>
                      </div>
                    </div>
                  </div>

                  <div className="film-back">
                      <p id="details">#{index + 1} | rating: {film.points}/5</p>
                      <p id="review">{film.review}</p>
                  </div>
              </div>
          </div>
      </div>
  )
}

type ReelType = {
    films: DiaryEntry[]
    title?: string
    style: 'film' | 'vhs'
}

function FilmReel(props: ReelType) {
    return(
        <div>
            <h2>{props.title ? props.title : ""}</h2>
            <p>click on an item to see my thoughts</p>

            <div className="reel">
                { props.films.map((film: DiaryEntry, index: number) => (
                    props.style == 'film' 
                      ? <Film film={film} index={index}/>
                      : <VHS film={film} index={index} />
                ))}
            </div>
        </div>
    )
}


type DiaryType = {
  year: string
  movieObjects: any[]
  tvObjects: any[]
  theaterObjects: any[]
}

function Diary(props: DiaryType) {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [movieData, setMovieData] = useState<DiaryEntry[]>([]);
  const [tvData, setTvData] = useState<DiaryEntry[]>([]);
  const [theaterData, setTheaterData] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [movies, shows, plays] = await Promise.all([
          getDiary(props.movieObjects, 'movie'),
          getDiary(props.tvObjects, 'tv'),
          getDiary(props.theaterObjects, 'theater')
        ]);
        setMovieData(movies);
        setTvData(shows);
        setTheaterData(plays);
      } catch (err) {
        console.log("Failed to load diary data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const reels: {title?: string; films: DiaryEntry[]; style: 'film' | 'vhs'}[] = [
    { title: `my ${props.year} movie reel`, films: movieData, style: "film" },
    { title: `my ${props.year} tv reel`, films: tvData, style: "film" },
    { title: `my ${props.year} theater reel`, films: theaterData, style: "vhs" }
  ]

  if (loading) return <div>Loading diary...</div>;

  return (
    <div className="page" id="diary-page">
        <button onClick={() => navigate('/')}>
            Home
        </button>
        { reels.map((reel: ReelType) => (
            <FilmReel title={reel.title}
            films={reel.films}
            style={reel.style} />
        ))}
    </div>
  );
};

export default Diary;