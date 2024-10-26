// src/components/SpeedTest/SpeedTest.jsx

import React, { useState } from 'react';
import { calculateDownloadSpeed, calculateUploadSpeed, calculateLatency } from '../../utils/speedTestUtils.js';
import SpeedDisplay from './SpeedDisplay.jsx';
import TestButton from './TestButton.jsx';

const SpeedTest = () => {
  const [downloadSpeed, setDownloadSpeed] = useState(null);
  const [uploadSpeed, setUploadSpeed] = useState(null);
  const [latency, setLatency] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleDownloadTest = async () => {
    setIsTesting(true);
    const speed = await calculateDownloadSpeed();
    setDownloadSpeed(speed.toFixed(2));
    setIsTesting(false);
  };

  const handleUploadTest = async () => {
    setIsTesting(true);
    const speed = await calculateUploadSpeed();
    setUploadSpeed(speed.toFixed(2));
    setIsTesting(false);
  };

  const handleLatencyTest = async () => {
    setIsTesting(true);
    const latency = await calculateLatency();
    setLatency(latency);
    setIsTesting(false);
  };

  return (
    <div className="speed-test">
      <h2>Browser-Based Speed Test</h2>
      
      <div className="test-buttons">
        <TestButton onClick={handleDownloadTest} label="Test Download Speed" disabled={isTesting} />
        <TestButton onClick={handleUploadTest} label="Test Upload Speed" disabled={isTesting} />
        <TestButton onClick={handleLatencyTest} label="Test Latency" disabled={isTesting} />
      </div>

      <div className="test-results">
        <SpeedDisplay label="Download Speed" value={downloadSpeed} unit="Mbps" />
        <SpeedDisplay label="Upload Speed" value={uploadSpeed} unit="Mbps" />
        <SpeedDisplay label="Latency" value={latency} unit="ms" />
      </div>
    </div>
  );
};

export default SpeedTest;
