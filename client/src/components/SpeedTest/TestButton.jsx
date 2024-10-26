// src/components/SpeedTest/TestButton.jsx

import React from 'react';

const TestButton = ({ onClick, label, disabled }) => (
  <button onClick={onClick} disabled={disabled}>
    {label}
  </button>
);

export default TestButton;
