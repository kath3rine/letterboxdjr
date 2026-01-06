import { useNavigate } from 'react-router-dom';
import '../styles/Home.css'

function Home() {
    const navigate = useNavigate();

    return (
        <div className="page" id="home-page">
            <h1>Letterboxd Jr.</h1>
            <div id="buttons">
                <button onClick={() => navigate('/diary')}>
                    2025 Diary
                </button>
                <button onClick={() => navigate('/stats')}>
                    2025 Stats
                </button>
            </div>
            
        </div>
    );
};

export default Home;
