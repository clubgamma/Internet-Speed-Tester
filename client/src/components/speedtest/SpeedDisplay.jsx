import React from 'react';
import { ArrowDown, ArrowUp, Clock, MapPin, Wifi } from 'lucide-react';

const SpeedDisplay = ({ label, value, unit, type }) => {
  const getIcon = () => {
    switch (type) {
      case 'download':
        return <ArrowDown className="w-5 h-5 text-blue-500" />;
      case 'upload':
        return <ArrowUp className="w-5 h-5 text-green-500" />;
      case 'ping':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'location':
        return <MapPin className="w-5 h-5 text-purple-500" />;
      default:
        return <Wifi className="w-5 h-5 text-gray-500" />;
    }
  };

  // For location and IP display
  if (type === 'location' || type === 'ip') {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center space-x-3">
        {getIcon()}
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="font-medium text-gray-900">{value}</p>
        </div>
      </div>
    );
  }

  // For speed metrics
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-center space-x-2 mb-2">
        {getIcon()}
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <div className="font-bold text-2xl text-gray-900">
        {value !== null ? value : '0'} <span className="text-gray-600">{unit}</span>
      </div>
    </div>
  );
};

export default SpeedDisplay;