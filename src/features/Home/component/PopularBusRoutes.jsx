import { ArrowRight } from "lucide-react";
import { popularroutes } from "../../../assets/data/popularRoutesData";

const PopularBusRoutes = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 mt-20">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Popular <span className="text-[#295A55]">Bus Routes</span>
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Most traveled routes with best prices
        </p>
        <div className="w-20 h-1 bg-[#295A55] mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Route Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {popularroutes.map((route, index) => (
          <div
            key={index}
            className="group relative h-64 rounded-xl overflow-hidden shadow-lg cursor-pointer"
          >
            {/* Background Image with Lighter Overlay */}
            <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
              <img
                src={route.image}
                alt={route.destination}
                className="w-full h-full object-cover"
              />
              {/* Lighter Gradient Overlays */}
              <div className="absolute inset-0 bg-linear-to-tr from-black/30 via-black/15 to-black/40"></div>
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/25 to-black/50"></div>
            </div>

            {/* Content Overlay - Bottom Left */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="flex items-end justify-between">
                {/* Left Content */}
                <div className="transform transition-transform duration-300 group-hover:translate-x-2">
                  <h3 className="text-xl font-bold text-white mb-2 transition-all duration-300">
                    {route.destination}
                  </h3>
                  <div className="text-white/90 mb-1 flex items-center gap-2 transition-all duration-300 text-sm">
                    <span>Bus Ticket</span>
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </div>

                {/* Right Content */}
                <div className="transform transition-all duration-300 group-hover:-translate-x-2">
                  {/* Price as Button */}
                  <button className="bg-[#295A55] text-white px-2 py-1 rounded-lg text-md  hover:bg-[#244D49] transition-colors duration-300 shadow-lg">
                    {route.price}
                  </button>
                  {/* <div className="text-white/80 text-xs mt-2">
                    {route.duration}
                  </div> */}
                </div>
              </div>

              {/* Hover Indicator Line */}
              <div className="absolute bottom-0 left-0 h-1 bg-linear-to-r from-[#295A55] to-cyan-400 rounded-full w-0 transition-all duration-400 group-hover:w-full"></div>
            </div>

            {/* Hover Overlay - Subtle */}
            <div className="absolute inset-0 bg-linear-to-t from-[#295A55]/0 to-transparent transition-all duration-300 group-hover:from-[#295A55]/10"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularBusRoutes;
