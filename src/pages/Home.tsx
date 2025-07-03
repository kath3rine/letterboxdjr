import { useNavigate } from 'react-router-dom';
import '../styles/Home.css'

function Home() {
    const navigate = useNavigate();

    return (
        <div className="page" id="home-page">
            <h1>Letterboxd Jr.</h1>
            <div id="buttons">
                <button onClick={() => navigate('/diary')}>
                    Diary
                </button>
                <button onClick={() => navigate('/stats')}>
                    Yearly Stats
                </button>
            </div>
            
        </div>
    );
};

export default Home;
