import React from 'react';

const TestButton = ({ onClick, label, disabled, primary }) => {
  const baseClasses = "px-6 py-3 rounded-lg transition-all duration-200 ease-in-out font-semibold text-sm flex items-center justify-center";
  
  const primaryClasses = primary
    ? "bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-300"
    : "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${primaryClasses} ${
        disabled ? 'cursor-not-allowed opacity-50' : ''
      }`}
    >
      {label}
    </button>
  );
};

export default TestButton;