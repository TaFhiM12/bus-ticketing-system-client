import React from "react";

const PopularRoutes = () => {
  const popularRoutes = [
    { from: "Dhaka", to: "Chittagong" },
    { from: "Dhaka", to: "Sylhet" },
    { from: "Dhaka", to: "Cox's Bazar" },
    { from: "Chittagong", to: "Dhaka" },
  ]
  
  return (
    <div>
      <div className="mt-4 flex flex-col gap-2">
        <div className="text-white/80 text-sm">Popular Routes</div>
        <div className="flex flex-wrap gap-2 justify-between">
          {popularRoutes.map(
          (route) => (
            <div
              key={`${route.from}-${route.to}`}
              className="px-3 py-3 rounded-xl w-40 bg-white text-gray-800 text-sm hover:bg-white/20 transition-colors "
            >
              <span className="text-black font-bold">{route.from}</span> <br /> <span className="text-gray-500">{route.to}</span>
            </div>
          )
        )}
        </div>
      </div>
    </div>
  );
};

export default PopularRoutes;
