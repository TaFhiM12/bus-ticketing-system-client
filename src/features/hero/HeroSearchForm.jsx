import { Search, Calendar, Users, MapPin } from "lucide-react";
import PopularRoutes from "./PopularRoutes";

const HeroSearchForm = () => {
  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="backdrop-blur-md bg-white/5 rounded-3xl p-6 md:p-8 shadow-2xl border border-white/10">
        <div className="space-y-6">
          {/* Search Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* From Input */}
            <div className="space-y-2">
              <label className="text-gray-800 font-medium flex items-center gap-2">
                <MapPin size={16} className="text-gray-600" />
                From
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Departure city"
                  className="w-full p-4 pl-12 rounded-xl bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#295A55] focus:border-transparent transition-all duration-300"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <MapPin size={20} />
                </div>
              </div>
            </div>

            {/* To Input */}
            <div className="space-y-2">
              <label className="text-gray-800 font-medium flex items-center gap-2">
                <MapPin size={16} className="text-gray-600" />
                To
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Destination city"
                  className="w-full p-4 pl-12 rounded-xl bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#295A55] focus:border-transparent transition-all duration-300"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <MapPin size={20} />
                </div>
              </div>
            </div>

            {/* Journey Date */}
            <div className="space-y-2">
              <label className="text-gray-800 font-medium flex items-center gap-2">
                <Calendar size={16} className="text-gray-600" />
                Journey Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full p-4 pl-12 rounded-xl bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#295A55] focus:border-transparent transition-all duration-300"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Calendar size={20} />
                </div>
              </div>
            </div>

            {/* Passengers */}
            <div className="space-y-2">
              <label className="text-gray-800 font-medium flex items-center gap-2">
                <Users size={16} className="text-gray-600" />
                Passengers
              </label>
              <div className="relative">
                <div className="flex items-center bg-white rounded-xl border border-gray-300 overflow-hidden">
                  <button 
                    type="button"
                    className="px-4 py-4 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xl">−</span>
                  </button>
                  <input
                    type="number"
                    min="1"
                    defaultValue="1"
                    className="w-full p-4 text-center bg-transparent text-gray-800 focus:outline-none"
                    placeholder="1"
                  />
                  <button 
                    type="button"
                    className="px-4 py-4 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xl">+</span>
                  </button>
                </div>
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Users size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Add Return Button */}
          

          {/* Search Button */}
          <div className="pt-2">
            <button className="w-full bg-linear-to-r from-[#295A55] to-[#3A7A72] text-white py-4 rounded-xl font-semibold text-lg hover:from-[#244D49] hover:to-[#346B64] active:from-[#1F443F] active:to-[#2D5D57] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#295A55]/25 flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-[#295A55] focus:ring-offset-2 focus:ring-offset-white">
              <Search size={24} />
              Search Buses
            </button>
          </div>
          <div className="border-b border-white my-4">
          </div>
          <PopularRoutes />
        </div>
      </div>
    </div>
  );
};

export default HeroSearchForm;