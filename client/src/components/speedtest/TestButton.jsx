import React from 'react';

const TestButton = ({ onClick, label, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-lg transition duration-200 ease-in-out 
                ${disabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} 
                text-white font-semibold shadow-md`}
  >
    {label}
  </button>
);

export default TestButton;