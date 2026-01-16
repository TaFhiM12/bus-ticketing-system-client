// Error.jsx
import React from 'react';
import { Bus, AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router';

const Error = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#1a3c38] via-[#295A55] to-[#3A7A72] p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 sm:p-10 overflow-hidden">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Outer Circle */}
            <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-75"></div>
            
            {/* Middle Circle */}
            <div className="relative p-5 bg-linear-to-br from-red-100 to-red-50 rounded-full border-4 border-white shadow-lg">
              <div className="p-4 bg-linear-to-r from-red-500 to-red-600 rounded-full">
                <AlertCircle size={48} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-3">
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
            Page Not Found
          </h2>
          <p className="text-gray-600 text-lg">
            Oops! The page you're looking for seems to have taken a detour.
          </p>
        </div>

        {/* Bus Illustration */}
        <div className="relative mb-8">
          <div className="h-1 bg-linear-to-r from-gray-300 via-gray-400 to-gray-300 rounded-full"></div>
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="p-3 bg-linear-to-r from-[#295A55] to-[#3A7A72] rounded-xl shadow-lg rotate-12">
              <Bus size={32} className="text-white" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Go Home Button */}
          <Link
            to="/"
            className="w-full bg-linear-to-r from-[#295A55] to-[#3A7A72] text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg hover:from-[#244D49] hover:to-[#346B64] active:from-[#1F443F] active:to-[#2D5D57] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#295A55]/25 flex items-center justify-center gap-2 sm:gap-3 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#295A55]"
          >
            <Home size={20} />
            Go to Homepage
          </Link>

          {/* Refresh Page Button */}
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-white text-[#295A55] py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg hover:bg-gray-50 active:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg border-2 border-[#295A55] flex items-center justify-center gap-2 sm:gap-3 focus:outline-none focus:ring-2 focus:ring-[#295A55]/50"
          >
            <RefreshCw size={20} />
            Refresh Page
          </button>
        </div>

        {/* Contact Support */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            Need help?{' '}
            <button className="text-[#295A55] hover:text-[#244D49] font-semibold">
              Contact Support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Error;