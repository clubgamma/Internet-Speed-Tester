import React, { useState, useEffect } from 'react';
import { Gauge, Upload, Download, Signal } from 'lucide-react'; // You need to install lucide-react for icons

const SpeedTest = () => {
  const [metrics, setMetrics] = useState({ upload: 0, download: 0, ping: 0 });
  const [testing, setTesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState(null);
  const [ws, setWs] = useState(null);

  // WebSocket connection handler
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080'); // Adjust the WebSocket URL as needed
    setWs(socket);

    // Handle messages from the WebSocket server
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.type === 'ping') {
        setMetrics(prev => ({ ...prev, ping: message.value }));
        setProgress(33);
        setCurrentTest('upload');
      } else if (message.type === 'upload') {
        setMetrics(prev => ({ ...prev, upload: message.value }));
        setProgress(66);
        setCurrentTest('download');
      } else if (message.type === 'download') {
        setMetrics(prev => ({ ...prev, download: message.value }));
        setProgress(100);
        setTesting(false);
        setCurrentTest(null);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => socket.close(); // Cleanup WebSocket on component unmount
  }, []);

  // Start the speed test by sending the command to the WebSocket server
  const startSpeedTest = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      setTesting(true);
      setProgress(0);
      setCurrentTest('ping');
      ws.send(JSON.stringify({ action: 'startTest' }));
    }
  };

  // Get appropriate status text for the button
  const getStatusText = () => {
    if (!testing) return 'Start Speed Test';
    switch (currentTest) {
      case 'ping': return 'Testing Ping...';
      case 'upload': return 'Testing Upload...';
      case 'download': return 'Testing Download...';
      default: return 'Testing...';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Speed Test</h1>
          <p className="text-gray-400">Test your internet connection speed</p>
        </div>

        <div className="space-y-8">
          {/* Progress Circle */}
          <div className="relative w-48 h-48 mx-auto">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                className="text-gray-700"
                strokeWidth="12"
                stroke="currentColor"
                fill="transparent"
                r="70"
                cx="96"
                cy="96"
              />
              <circle
                className="text-blue-500 transition-all duration-300"
                strokeWidth="12"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * progress) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="70"
                cx="96"
                cy="96"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="text-2xl font-bold">{progress}%</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <Signal className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm text-gray-400">Ping</div>
              <div className="text-xl font-bold">{metrics.ping} ms</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <Upload className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm text-gray-400">Upload</div>
              <div className="text-xl font-bold">{metrics.upload} Mbps</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <Download className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm text-gray-400">Download</div>
              <div className="text-xl font-bold">{metrics.download} Mbps</div>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={startSpeedTest}
            disabled={testing}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
              testing ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {getStatusText()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpeedTest;
