import React, { useState } from 'react';
import { calculateDownloadSpeed, calculateUploadSpeed, calculateLatency } from '../../utils/speedTestUtils.js';
import TestButton from './TestButton.jsx';
import ReactSpeedometer from "react-d3-speedometer/slim";

const SpeedTest = () => {
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [latency, setLatency] = useState(0);
  const [isTesting, setIsTesting] = useState(false);

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

  return (
    <div className="flex flex-col items-center gap-8 p-8 bg-white rounded-lg shadow-lg w-[600px] mx-auto md:w-[90%]">
      <h2 className="text-3xl font-bold text-gray-800">Internet Speed Test</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-20 ">
        
        <ReactSpeedometer
          minValue={0}
          maxValue={4000}
          value={downloadSpeed}
          needleColor="#a7ff83"
          startColor="#c46e74"
          segments={4}
          endColor="#a3be8b"
          dimensionUnit="px"
          height={220}
          width={220}
          currentValueText="${value} Mbps"
          needleHeightRatio={0.4}
          needleTransition="easeElastic"
          className="rounded-lg shadow-md"
          />
        <ReactSpeedometer
          minValue={0}
          maxValue={4000}
          value={uploadSpeed}
          needleColor="#a7ff83"
          startColor="#c46e74"
          segments={4}
          endColor="#a3be8b"
          dimensionUnit="px"
          height={220}
          width={220}
          currentValueText="${value} Mbps"
          needleHeightRatio={0.4}
          needleTransition="easeElastic"
          className="rounded-lg shadow-md"
          />
        <ReactSpeedometer
          minValue={0}
          maxValue={120}
          value={latency}
          needleColor="#a7ff83"
          startColor="#c46e74"
          segments={4}
          endColor="#a3be8b"
          dimensionUnit="px"
          height={220}
          width={220}
          currentValueText="${value} ms"
          needleHeightRatio={0.4}
          needleTransition="easeElastic"
          className="rounded-lg shadow-md"
        />
      </div>

      <div className="flex gap-4">
        <TestButton
          onClick={handleDownloadTest}
          label="Test Download"
          disabled={isTesting }
        />
        <TestButton
          onClick={handleUploadTest}
          label="Test Upload"
          disabled={isTesting}
        />
        <TestButton
          onClick={handleLatencyTest}
          label="Test Latency"
          disabled={isTesting}
        />
        <TestButton
          onClick={()=>{
              setDownloadSpeed(0);
              setUploadSpeed(0);
              setLatency(0);
              setIsTesting(false);
          }}
          label="RESET"
          disabled={isTesting}
        />
      </div>
    </div>
  );
};

export default SpeedTest;