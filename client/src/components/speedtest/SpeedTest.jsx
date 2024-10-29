import React, { useState } from 'react';
import { calculateDownloadSpeed, calculateUploadSpeed, calculateLatency } from '../../utils/speedTestUtils.js';
import TestButton from './TestButton.jsx';
import SpeedDisplay from './SpeedDisplay.jsx';

const SpeedTest = () => {
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [latency, setLatency] = useState(0);
  const [isTesting, setIsTesting] = useState(false);
  
  // Add mock data for demo
  const [location] = useState('Gadva, IN');
  const [ipAddress] = useState('240f:4900:53e8:8b28:399f:bcc8:6c1e:2a4b');

  const handleDownloadTest = async () => {
    setIsTesting(true);
    const speed = await calculateDownloadSpeed();
    setDownloadSpeed(Number(speed).toFixed(2));
    setIsTesting(false);
  };

  const handleUploadTest = async () => {
    setIsTesting(true);
    const speed = await calculateUploadSpeed();
    setUploadSpeed(Number(speed).toFixed(2));
    setIsTesting(false);
  };

  const handleLatencyTest = async () => {
    setIsTesting(true);
    const ping = await calculateLatency();
    setLatency(Number(ping).toFixed(0));
    setIsTesting(false);
  };

  const handleReset = () => {
    setDownloadSpeed(0);
    setUploadSpeed(0);
    setLatency(0);
    setIsTesting(false);
  };

  const handleStartTest = () => {
    handleDownloadTest();
    handleUploadTest();
    handleLatencyTest();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Internet Speed Test</h1>
        <p className="text-gray-600">Check your connection speed in seconds</p>
      </div>

      {/* Centered Start Test Button */}
      <div className="flex justify-center mb-8">
        <TestButton
          onClick={handleStartTest}
          label="Start Speed Test"
          disabled={isTesting}
          primary
        />
      </div>

      {/* Speed Display Cards with Buttons Below */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="flex flex-col gap-4">
          <SpeedDisplay
            label="Download Speed"
            value={downloadSpeed}
            unit="Mbps"
            type="download"
          />
          <TestButton
            onClick={handleDownloadTest}
            label="Test Download"
            disabled={isTesting}
          />
        </div>
        
        <div className="flex flex-col gap-4">
          <SpeedDisplay
            label="Upload Speed"
            value={uploadSpeed}
            unit="Mbps"
            type="upload"
          />
          <TestButton
            onClick={handleUploadTest}
            label="Test Upload"
            disabled={isTesting}
          />
        </div>
        
        <div className="flex flex-col gap-4">
          <SpeedDisplay
            label="Ping"
            value={latency}
            unit="ms"
            type="ping"
          />
          <TestButton
            onClick={handleLatencyTest}
            label="Test Latency"
            disabled={isTesting}
          />
        </div>
      </div>

      {/* Location and IP Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <SpeedDisplay
          label="Location"
          value={location}
          type="location"
        />
        <SpeedDisplay
          label="IP Address"
          value={ipAddress}
          type="ip"
        />
      </div>

      {/* Centered Reset Button */}
      <div className="flex justify-center mb-8">
        <TestButton
          onClick={handleReset}
          label="RESET"
          disabled={isTesting}
        />
      </div>

      {/* Global Speed Rankings */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Global Speed Rankings</h3>
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="pb-3">Rank</th>
              <th className="pb-3">Country</th>
              <th className="pb-3 text-right">Mbps</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-100">
              <td className="py-3">1</td>
              <td>United Arab Emirates</td>
              <td className="text-right text-blue-500">413.14</td>
            </tr>
            <tr className="border-t border-gray-100">
              <td className="py-3">2</td>
              <td>Qatar</td>
              <td className="text-right text-blue-500">350.5</td>
            </tr>
            <tr className="border-t border-gray-100">
              <td className="py-3">3</td>
              <td>Kuwait</td>
              <td className="text-right text-blue-500">252.15</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpeedTest;