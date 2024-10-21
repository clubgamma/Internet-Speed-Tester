import React, { useState } from 'react';
import './App.css';
import performanceImg from './assets/performance.png';
import '@fortawesome/fontawesome-free/css/all.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ripples } from 'ldrs'

ripples.register()

const App = () => {
    const [loading, setLoading] = useState(false);
    const [speedData, setSpeedData] = useState(null);
    const [error, setError] = useState('');

    const checkSpeed = async () => {
        setLoading(true);
        setSpeedData(null);
        setError('');

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await fetch(`${apiUrl}/api/speed`);
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
        <div className="container mx-auto p-4 font-sans">
            <div className="text-center mb-6">
                <h1 className="text-2xl md:text-4xl font-bold text-gray-800">Internet Speed Tester</h1>
            </div>

            <div className="flex justify-center">
                <button
                    onClick={checkSpeed}
                    type="button"
                    className="flex items-center justify-center bg-black text-white  rounded-lg px-4 py-2 text-lg md:text-xl hover:bg-gray-800 transition-all"
                >
                    <img
                        src={performanceImg}
                        alt="Speed Test Icon"
                        className="w-8 h-8 md:w-10 md:h-10 mr-3"
                    />
                    Speed Test
                </button>
            </div>

            {loading && (
                <div className='flex justify-center mt-4'>
                    <l-ripples
                        size="55"
                        speed="2"
                        color="black"
                    ></l-ripples>
                </div>
            )}

            {error && <div className="text-center text-red-500 mt-6">{error}</div>}

            {speedData && (
                <div className="result mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 text-center">
                    <div className="flex flex-col items-center">
                        <i className="fa-solid fa-download text-3xl text-blue-500 mb-2"></i>
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Download Speed: {speedData.download} Mbps</h2>
                    </div>
                    <div className="flex flex-col items-center">
                        <i className="fa-solid fa-upload text-3xl text-blue-500 mb-2"></i>
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Upload Speed: {speedData.upload} Mbps</h2>
                    </div>
                    <div className="flex flex-col items-center">
                        <i className="fa-solid fa-clock text-3xl text-blue-500 mb-2"></i>
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Ping: {speedData.ping} ms</h2>
                    </div>
                    <div className="flex flex-col items-center">
                        <i className="fa-solid fa-map-marker-alt text-3xl text-blue-500 mb-2"></i>
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Location: {speedData.location}</h2>
                    </div>
                    <div className="flex flex-col items-center">
                        <i className="fa-solid fa-network-wired text-3xl text-blue-500 mb-2"></i>
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">IP Address: {speedData.ip}</h2>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
