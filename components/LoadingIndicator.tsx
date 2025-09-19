
import React from 'react';

interface LoadingIndicatorProps {
  message: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <div className="relative w-48 h-48 flex items-center justify-center">
        <div className="absolute font-bangers text-6xl text-white animate-spin-slow" style={{ WebkitTextStroke: '3px black' }}>POW!</div>
        <svg className="animate-spin h-48 w-48 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <p className="text-2xl font-bold mt-6 bg-white py-2 px-4 rounded-md border-2 border-black">{message}</p>
    </div>
  );
};

export default LoadingIndicator;
