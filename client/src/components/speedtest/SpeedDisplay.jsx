// src/components/SpeedTest/SpeedDisplay.jsx

import React from 'react';

const SpeedDisplay = ({ label, value, unit }) => (
  <div className="speed-display">
    <h3>{label}</h3>
    <p>{value !== null ? `${value} ${unit}` : '-'}</p>
  </div>
);

export default SpeedDisplay;
