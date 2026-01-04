import React from "react";
import { ArrowRight } from "lucide-react";

const PopularRoutes = () => {
  const popularRoutes = [
    { from: "Dhaka", to: "Chittagong" },
    { from: "Dhaka", to: "Sylhet" },
    { from: "Dhaka", to: "Cox's Bazar" },
    { from: "Chittagong", to: "Dhaka" },
  ]
  
  return (
    <div className="mt-2 sm:mt-4">
      <div className="flex flex-col gap-1 sm:gap-2">
        <div className="text-white/80 text-xs sm:text-sm">Popular Routes</div>
        <div className="w-full">
          <div className="flex divide-x divide-gray-300 bg-white/90 rounded-lg sm:rounded-xl overflow-hidden">
            {popularRoutes.map((route) => (
              <div
                key={`${route.from}-${route.to}`}
                className="flex-1 px-2 py-3 sm:px-3 sm:py-3 hover:bg-white transition-colors cursor-pointer text-center"
              >
                <div className="inline-flex items-center gap-1 sm:gap-2">
                  <span className="text-xs sm:text-sm font-bold text-black truncate">{route.from}</span>
                  <ArrowRight size={10} sm:size={12} className="text-gray-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-500 truncate">{route.to}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularRoutes;