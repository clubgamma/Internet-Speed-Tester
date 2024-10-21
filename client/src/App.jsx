import React, { useState } from 'react';
import './App.css'; 
import performanceImg from './assets/performance.png';
import '@fortawesome/fontawesome-free/css/all.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    const [loading, setLoading] = useState(false);
    const [speedData, setSpeedData] = useState(null);
    const [error, setError] = useState('');

    const checkSpeed = async () => {
        setLoading(true);
        setSpeedData(null);
        setError('');

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'; // Use .env variable or fallback
            const response = await fetch(`${apiUrl}/api/speed`); // Fetch from API
const data = await response.json();
            
            setLoading(false);
            if (data.error) {
                setError(`Error: ${data.error}`);
            } else {
                setSpeedData(data);
            }
        } catch (err) {
            setLoading(false);
            setError('Error performing speed test.');
        }
    };

    return (
        <div className="container">
            <div className="header">
                <h1>Internet Speed Tester</h1>
            </div>
            <button
                onClick={checkSpeed}
                type="button"
                className="btn active"
                style={{ fontSize: '2rem', color: 'white', backgroundColor: '#211212' }}
            >
                <img
                    src={performanceImg}
                    alt="Speed Test Icon"
                    style={{ maxWidth: '30px', maxHeight: '50px' }}
                />
                Speed Test
            </button>

            {loading && (
                <div className="speedometer" style={{ display: 'block' }}>
                    <div className="arc"></div>
                    <div className="mask"></div>
                    <div className="pointer"></div>
                    <div className="center-cap"></div>
                </div>
            )}

            {error && <div className="result">{error}</div>}

            {speedData && (
                <div className="result">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0' }}>
                        <i className="fa-solid fa-download" style={{ fontSize: '24px', color: '#2980b9', marginRight: '10px' }} />
                        <h2 style={{ fontSize: '2rem', color: '#333' }}>Download Speed: {speedData.download} Mbps</h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0' }}>
                        <i className="fa-solid fa-upload" style={{ fontSize: '24px', color: '#2980b9', marginRight: '10px' }} />
                        <h2 style={{ fontSize: '2rem', color: '#333' }}>Upload Speed: {speedData.upload} Mbps</h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0' }}>
                        <i className="fa-solid fa-clock" style={{ fontSize: '24px', color: '#2980b9', marginRight: '10px' }} />
                        <h2 style={{ fontSize: '2rem', color: '#333' }}>Ping: {speedData.ping} ms</h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0' }}>
                        <i className="fa-solid fa-map-marker-alt" style={{ fontSize: '24px', color: '#2980b9', marginRight: '10px' }} />
                        <h2 style={{ fontSize: '2rem', color: '#333' }}>Location: {speedData.location}</h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0' }}>
                        <i className="fa-solid fa-network-wired" style={{ fontSize: '24px', color: '#2980b9', marginRight: '10px' }} />
                        <h2 style={{ fontSize: '2rem', color: '#333' }}>IP Address: {speedData.ip}</h2>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;