import { useNavigate } from 'react-router-dom';
import '../styles/Home.css'

function Home() {
    const navigate = useNavigate();

    return (
        <div className="page" id="home-page">
            <h1>Letterboxd Jr.</h1>
            <div id="buttons">
                <div className="button-row">
                    <button onClick={() => navigate('/diary26')}>
                        2026 Diary
                    </button>
                    <button onClick={() => navigate('/stats26')}>
                        2026 Stats
                    </button>
                </div>

                <div className="button-row">
                    <button onClick={() => navigate('/diary25')}>
                        2025 Diary
                    </button>
                    <button onClick={() => navigate('/stats25')}>
                        2025 Stats
                    </button>
                </div>
            </div>
            
        </div>
    );
};

export default Home;
