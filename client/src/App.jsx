import React, { useState } from 'react';
import { Wifi, Upload, Download, Clock, MapPin, Network } from 'lucide-react';

const SpeedTest = () => {
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

    const mockLeaderboard = [
        { country: 'United Arab Emirates', avgSpeed: 413.14 },
        { country: 'Qatar', avgSpeed: 350.50 },
        { country: 'Kuwait', avgSpeed: 257.15 },
        { country: 'South korea', avgSpeed: 143.11 },
        { country: 'Netherlands', avgSpeed: 142.22 },
        { country: 'Denmark', avgSpeed: 133.57 },
        { country: 'Norway', avgSpeed: 129.16 },
        { country: 'Bulgaria', avgSpeed: 129.07 },
        { country: 'Saudi Arabia', avgSpeed: 120.74 },
        { country: 'Luxembourg', avgSpeed: 119.81 },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="text-center font-montserrat space-y-4">
                    <h1 className="text-4xl font-bold text-gray-900">Internet Speed Test</h1>
                    <p className="text-gray-600">Check your connection speed in seconds</p>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={checkSpeed}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 font-dm-sans text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-3 transition-all transform hover:scale-105 disabled:opacity-50"
                    >
                        <Wifi className="w-6 h-6" />
                        {loading ? 'Testing...' : 'Start Speed Test'}
                    </button>
                </div>

                {loading && (
                    <div className="flex justify-center">
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
                        {error}
                    </div>
                )}

                {speedData && (
                    <>
                        <div className="grid grid-cols-1 font-dm-sans md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-center gap-4 mb-4">
                                    <Download className="w-8 h-8 text-blue-600" />
                                    <h2 className="text-xl font-semibold">Download Speed</h2>
                                </div>
                                <p className="text-3xl font-bold text-gray-900">{speedData.download} Mbps</p>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-center gap-4 mb-4">
                                    <Upload className="w-8 h-8 text-green-600" />
                                    <h2 className="text-xl font-semibold">Upload Speed</h2>
                                </div>
                                <p className="text-3xl font-bold text-gray-900">{speedData.upload} Mbps</p>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-center gap-4 mb-4">
                                    <Clock className="w-8 h-8 text-yellow-600" />
                                    <h2 className="text-xl font-semibold">Ping</h2>
                                </div>
                                <p className="text-3xl font-bold text-gray-900">{speedData.ping} ms</p>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-center gap-4 mb-4">
                                    <MapPin className="w-8 h-8 text-purple-600" />
                                    <h2 className="text-xl font-semibold">Location</h2>
                                </div>
                                <p className="text-xl text-gray-900">{speedData.location}</p>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-center gap-4 mb-4">
                                    <Network className="w-8 h-8 text-indigo-600" />
                                    <h2 className="text-xl font-semibold">IP Address</h2>
                                </div>
                                <p className="text-xl text-gray-900">{speedData.ip}</p>
                            </div>
                        </div>
                        <div className="mt-12 px-4 font-poppins">
                            <h2 className="text-2xl font-bold font-dm-sans text-center mb-6">Global Speed Rankings</h2>

                            <div className="max-w-2xl mx-auto rounded-xl shadow-lg bg-white">
                                <table className="w-full divide-y divide-gray-200">
                                    <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
                                        <tr>
                                            <th className="p-3 text-left text-xs font-semibold text-gray-900">
                                                Rank
                                            </th>
                                            <th className="p-3 text-left text-xs font-semibold text-gray-900">
                                                Country
                                            </th>
                                            <th className="p-3 text-right text-xs font-semibold text-gray-900">
                                                Mbps
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {mockLeaderboard.map((item, index) => (
                                            <tr
                                                key={index}
                                                className={`${index === 0 ? 'bg-yellow-50' : 'hover:bg-gray-50'}`}
                                            >
                                                <td className="p-3 text-xs font-medium text-gray-900">
                                                    {index + 1}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-xs font-medium text-gray-900 truncate">
                                                            {item.country}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-right text-xs font-bold text-blue-600">
                                                    {item.avgSpeed}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
};

export default SpeedTest;