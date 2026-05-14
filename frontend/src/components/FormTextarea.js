import React from 'react';
import { AlertCircle } from 'lucide-react';

function FormTextarea({
  label,
  placeholder,
  error,
  required = false,
  rows = 4,
  disabled = false,
  ...props
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-600">*</span>}
        </label>
      )}

      <textarea
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`w-full px-4 py-2 border-2 rounded-lg transition-smooth resize-none
          ${error 
            ? 'border-red-500 focus:border-red-600 focus:outline-none' 
            : 'border-gray-300 focus:border-green-700 focus:outline-none'
          }
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        `}
        {...props}
      />

      {error && (
        <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default FormTextarea;
