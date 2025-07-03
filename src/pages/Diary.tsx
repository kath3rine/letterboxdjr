import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react'
import { FilmType } from '../utils/Server'
import '../styles/Diary.css'
import '../App.css'

function Film({film, index}: {film: FilmType, index: number}) {
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
    films: FilmType[]
    title?: string
}

function FilmReel(props: ReelType) {
    return(
        <div>
            <h2>{props.title ? props.title : ""}</h2>
            <p>click on an item to see my thoughts</p>

            <div className="reel">
                { props.films.map((film: FilmType, index: number) => (
                    <Film film={film} index={index}/>
                ))}
            </div>
        </div>
    )
}

const Reel = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const movies25: FilmType[] = location.state?.data?.movieData;
  const shows25: FilmType[] = location.state?.data?.showData;
  const reels: {title?: string; films: FilmType[]}[] = [
    { title: "my 2025 movie reel", films: movies25 },
    { title: "my 2025 tv show reel", films: shows25 }
  ]

  if (!movies25) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>No movie data found. Please return to the home page.</p>
        <button onClick={() => navigate('/')}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="page" id="diary-page">
        { reels.map((reel: ReelType) => (
            <FilmReel title={reel.title}
            films={reel.films} />
        ))}
    </div>
  );
};

export default Reel;