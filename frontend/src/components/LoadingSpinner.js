import React from 'react';
import { Loader } from 'lucide-react';

function LoadingSpinner({ message = 'Loading...', size = 40 }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader 
        size={size} 
        className="animate-spin text-green-700 mb-4" 
      />
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  );
}

export default LoadingSpinner;
