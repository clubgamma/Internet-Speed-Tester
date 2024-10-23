import React, { useState } from 'react';
import { Wifi, Upload, Download, Clock, MapPin, Network, Moon, Sun } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SpeedTest() {
  const [loading, setLoading] = useState(false);
  const [speedData, setSpeedData] = useState(null);
  const [error, setError] = useState('');
  const [historicalData, setHistoricalData] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

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
        const newDataPoint = {
          timestamp: new Date().toLocaleTimeString(),
          download: data.download,
          upload: data.upload,
        };
        setHistoricalData(prev => [...prev, newDataPoint].slice(-7));
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
    { country: 'South Korea', avgSpeed: 143.11 },
    { country: 'Netherlands', avgSpeed: 142.22 },
    { country: 'Denmark', avgSpeed: 133.57 },
    { country: 'Norway', avgSpeed: 129.16 },
    { country: 'Bulgaria', avgSpeed: 129.07 },
    { country: 'Saudi Arabia', avgSpeed: 120.74 },
    { country: 'Luxembourg', avgSpeed: 119.81 },
  ];

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="mx-auto space-y-8 max-w-7xl">
        {/* Header with Theme Toggle */}
        <div className="flex items-center justify-between w-full">
          <div className="flex-1 text-center">
            <h1 className="text-3xl font-bold sm:text-4xl">Internet Speed Test</h1>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Check your connection speed in seconds
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className={`p-2 transition-all duration-300 transform rounded-full hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              darkMode ? 'bg-gray-700' : 'bg-white'
            }`}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <Sun className="w-6 h-6 text-yellow-500" />
            ) : (
              <Moon className="w-6 h-6 text-gray-900" />
            )}
          </button>
        </div>

        {/* Speed Test Button */}
        <div className="flex justify-center">
          <button
            onClick={checkSpeed}
            disabled={loading}
            className="flex items-center gap-3 px-6 py-3 text-base font-semibold text-white transition-all duration-300 transform bg-blue-600 rounded-lg sm:px-8 sm:py-4 sm:text-lg hover:bg-blue-700 hover:scale-105 disabled:opacity-50"
          >
            <Wifi className="w-5 h-5 sm:w-6 sm:h-6" />
            {loading ? 'Testing...' : 'Start Speed Test'}
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-blue-600 rounded-full sm:w-16 sm:h-16 border-t-transparent animate-spin"></div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="relative px-4 py-3 text-center text-red-700 bg-red-100 border border-red-400 rounded animate-fade-in">
            {error}
          </div>
        )}

        {/* Speed Data Display */}
        {speedData && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Download,
                  title: 'Download Speed',
                  value: `${speedData.download} Mbps`,
                  color: 'text-blue-600',
                },
                {
                  icon: Upload,
                  title: 'Upload Speed',
                  value: `${speedData.upload} Mbps`,
                  color: 'text-green-600',
                },
                {
                  icon: Clock,
                  title: 'Ping',
                  value: `${speedData.ping} ms`,
                  color: 'text-yellow-600',
                },
                {
                  icon: MapPin,
                  title: 'Location',
                  value: speedData.location,
                  color: 'text-purple-600',
                },
                {
                  icon: Network,
                  title: 'IP Address',
                  value: speedData.ip,
                  color: 'text-indigo-600',
                  text: 'text-sm',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`p-4 transition-all duration-300 transform ${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                  } shadow-lg sm:p-6 rounded-xl hover:shadow-xl hover:scale-105`}
                >
                  <div className="flex items-center gap-3 mb-2 sm:gap-4 sm:mb-4">
                    <item.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${item.color}`} />
                    <h2 className="text-lg font-semibold sm:text-xl">{item.title}</h2>
                  </div>
                  <p className= {`text-2xl font-bold ${item.text ? item.text : ''}`}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Historical Data Chart */}
            {historicalData.length > 0 && (
              <div className={`p-6 shadow-lg rounded-xl md:p-8 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h2 className="mb-6 text-2xl font-bold text-center">Speed History</h2>
                <div className="h-64 md:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                      <XAxis
                        dataKey="timestamp"
                        stroke={darkMode ? '#9CA3AF' : '#4B5563'}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        stroke={darkMode ? '#9CA3AF' : '#4B5563'}
                        tick={{ fontSize: 12 }}
                        label={{
                          value: 'Speed (Mbps)',
                          angle: -90,
                          position: 'left',
                          offset: -5,
                          style: { fill: darkMode ? '#9CA3AF' : '#4B5563' }
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: darkMode ? '#1F2937' : '#fff',
                          borderColor: darkMode ? '#374151' : '#2563eb'
                        }}
                        labelStyle={{ color: darkMode ? '#E5E7EB' : '#2563eb' }}
                      />
                      <Legend
                        verticalAlign="top"
                        align="right"
                        wrapperStyle={{ paddingBottom: 10 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="download"
                        stroke="#2563eb"
                        name="Download"
                        strokeWidth={2}
                        dot={{ stroke: '#2563eb', strokeWidth: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="upload"
                        stroke="#16a34a"
                        name="Upload"
                        strokeWidth={2}
                        dot={{ stroke: '#16a34a', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Leaderboard */}
            <div className="px-2 mt-8 sm:px-4 sm:mt-12">
              <h2 className="mb-4 text-xl font-bold text-center sm:mb-6 sm:text-2xl">
                Global Speed Rankings
              </h2>

              <div className={`max-w-2xl mx-auto overflow-hidden shadow-lg rounded-xl ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className={darkMode
                      ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-gray-100'
                      : 'bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700'
                    }>
                      <tr>
                        <th className="p-3 text-xs font-semibold text-left">Rank</th>
                        <th className="p-3 text-xs font-semibold text-left">Country</th>
                        <th className="p-3 text-xs font-semibold text-right">Mbps</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                      {mockLeaderboard.map((item, index) => (
                        <tr
                          key={index}
                          className={`
                            ${index === 0
                              ? darkMode
                                ? 'bg-cyan-900 text-white'
                                : 'bg-yellow-50 text-gray-900'
                              : darkMode
                                ? 'text-gray-100 hover:bg-gray-700'
                                : 'text-gray-700 hover:bg-gray-50'
                            }
                            transition-colors duration-150
                          `}
                        >
                          <td className="p-3 text-xs font-medium">{index + 1}</td>
                          <td className="p-3">
                            <span className="text-xs font-medium truncate">
                              {item.country}
                            </span>
                          </td>
                          <td className={`p-3 text-xs font-bold text-right ${
                            darkMode
                              ? index === 0 ? 'text-cyan-200' : 'text-blue-400'
                              : index === 0 ? 'text-blue-700' : 'text-blue-600'
                          }`}>
                            {item.avgSpeed}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}