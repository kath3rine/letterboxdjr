import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'
import { getDiary } from '../utils/Diary'
import { DiaryEntry } from '../utils/Types'
import movieObjects from '../data/movies.json';
import tvObjects from '../data/shows.json';
import '../styles/Diary.css'
import '../App.css'

function Film({film, index}: {film: DiaryEntry, index: number}) {
    const [isFlipped, setIsFlipped] = useState(false);
  
    const handleClick = () => {
      setIsFlipped(!isFlipped);
    };

    return(
        <div id="wrapper1">
            <div id="wrapper2">
            <div className={`film ${isFlipped ? 'flipped' : ''}`} onClick={handleClick}>
                    <div id="film-front">
                        <img src={film.poster ? film.poster : ''}/>
                        <p id="film-title">{film.title}</p>
                    </div>

                    <div id="film-back">
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
}

function FilmReel(props: ReelType) {
    return(
        <div>
            <h2>{props.title ? props.title : ""}</h2>
            <p>click on an item to see my thoughts</p>

            <div className="reel">
                { props.films.map((film: DiaryEntry, index: number) => (
                    <Film film={film} index={index}/>
                ))}
            </div>
        </div>
    )
}

function Diary() {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [movieData, setMovieData] = useState<DiaryEntry[]>([]);
  const [tvData, setTvData] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [movies, shows] = await Promise.all([
          getDiary(movieObjects, 'movie'),
          getDiary(tvObjects, 'tv')
        ]);
        setMovieData(movies);
        setTvData(shows);
      } catch (err) {
        console.log("Failed to load diary data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const reels: {title?: string; films: DiaryEntry[]}[] = [
    { title: "my 2025 movie reel", films: movieData },
    { title: "my 2025 tv show reel", films: tvData }
  ]

  if (loading) return <div>Loading diary...</div>;

  return (
    <div className="page" id="diary-page">
        <button onClick={() => navigate('/')}>
            Home
        </button>
        { reels.map((reel: ReelType) => (
            <FilmReel title={reel.title}
            films={reel.films} />
        ))}
    </div>
  );
};

export default Diary;