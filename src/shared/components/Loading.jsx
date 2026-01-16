// Loading.jsx
import React from 'react';
import { Bus } from 'lucide-react';

const Loading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1a3c38] via-[#295A55] to-[#3A7A72] p-4">
      <div className="relative mb-12">
        {/* Road */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-full shadow-lg"></div>
        
        {/* Moving Bus */}
        <div className="relative animate-bounce">
          <div className="flex items-center justify-center">
            <div className="p-4 bg-gradient-to-r from-[#295A55] to-[#3A7A72] rounded-2xl shadow-xl transform rotate-12">
              <Bus size={48} className="text-white animate-pulse" />
            </div>
          </div>
          
          {/* Wheels */}
          <div className="absolute -bottom-2 left-3 w-6 h-6 rounded-full bg-gray-800 border-2 border-gray-600 animate-spin"></div>
          <div className="absolute -bottom-2 right-3 w-6 h-6 rounded-full bg-gray-800 border-2 border-gray-600 animate-spin"></div>
        </div>
        
        {/* Road lines */}
        <div className="absolute bottom-1 left-1/4 w-12 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1 left-2/4 w-12 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1 left-3/4 w-12 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
      </div>

      {/* Loading Text */}
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 animate-pulse">
          Bus Vara
        </h2>
        
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        
        <p className="text-white/80 text-lg font-medium">
          Loading your journey...
        </p>
      </div>

      {/* Loading Progress Bar */}
      <div className="mt-12 w-full max-w-sm">
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-white/30 via-white to-white/30 rounded-full animate-shimmer"></div>
        </div>
        <p className="text-white/60 text-sm text-center mt-2">
          Please wait while we prepare your experience
        </p>
      </div>

      {/* CSS for custom animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default Loading;