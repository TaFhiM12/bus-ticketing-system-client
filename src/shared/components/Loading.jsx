import React from 'react';
import { Bus } from 'lucide-react';

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center">
        {/* Bus Icon with Spin */}
        <div className="animate-spin-slow mb-4">
          <Bus size={48} className="text-[#295A55]" />
        </div>
        
        {/* Loading Text */}
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
      
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Loading;