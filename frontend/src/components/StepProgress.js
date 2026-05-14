import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

function StepProgress({ currentStep, totalSteps, steps = [] }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="flex items-center justify-between">
        {steps.length > 0 ? (
          steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-smooth
                    ${index + 1 < currentStep
                      ? 'bg-green-600 text-white'
                      : index + 1 === currentStep
                      ? 'bg-green-700 text-white ring-2 ring-green-300'
                      : 'bg-gray-200 text-gray-600'
                    }
                  `}
                >
                  {index + 1 < currentStep ? (
                    <CheckCircle size={20} />
                  ) : (
                    <span className="font-bold">{index + 1}</span>
                  )}
                </div>
                <p className={`text-xs md:text-sm font-medium text-center
                  ${index + 1 <= currentStep ? 'text-green-700' : 'text-gray-600'}
                `}>
                  {step}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 mb-6 transition-smooth
                    ${index + 1 < currentStep ? 'bg-green-600' : 'bg-gray-300'}
                  `}
                />
              )}
            </React.Fragment>
          ))
        ) : (
          <>
            {Array.from({ length: totalSteps }).map((_, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-smooth
                      ${index + 1 < currentStep
                        ? 'bg-green-600 text-white'
                        : index + 1 === currentStep
                        ? 'bg-green-700 text-white ring-2 ring-green-300'
                        : 'bg-gray-200 text-gray-600'
                      }
                    `}
                  >
                    <span className="font-bold">{index + 1}</span>
                  </div>
                </div>

                {index < totalSteps - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 mb-6 transition-smooth
                      ${index + 1 < currentStep ? 'bg-green-600' : 'bg-gray-300'}
                    `}
                  />
                )}
              </React.Fragment>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default StepProgress;
