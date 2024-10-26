import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const SpeedChart = ({ downloadSpeed, uploadSpeed }) => {
  const data = {
    labels: ['Download Speed', 'Upload Speed'],
    datasets: [
      {
        label: 'Speed (Mbps)',
        data: [downloadSpeed, uploadSpeed],
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)', 
          'rgba(153, 102, 255, 0.8)',
        ],
        borderWidth: 2,
        barThickness: 50,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Speed (Mbps)',
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <h3 style={{ textAlign: 'center', color: '#333' }}>Internet Speed Test Results</h3> {/* Title */}
      <Bar data={data} options={options} />
    </div>
  );
};

export default SpeedChart;
