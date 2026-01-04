import { Search, Calendar, Users, MapPin, ArrowLeftRight } from "lucide-react";
import PopularRoutes from "./PopularRoutes";

const HeroSearchForm = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 lg:px-6">
      <div className="backdrop-blur-md bg-white/5 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-white/10">
        <div className="space-y-4 sm:space-y-6">
          {/* Search Form Container */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-16">
              {/* From Input */}
              <div className="space-y-1 sm:space-y-2">
                <label className="text-white font-medium flex items-center gap-2 text-sm sm:text-base">
                  <MapPin size={14} sm:size={16} className="text-white/80" />
                  From
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter departure city"
                    className="w-full p-3 sm:p-4 pl-10 sm:pl-12 rounded-lg sm:rounded-xl bg-white border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#295A55]/50 focus:border-[#295A55] transition-all duration-300 text-sm sm:text-base"
                  />
                  <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <MapPin size={16} sm:size={20} />
                  </div>
                </div>
              </div>

              {/* To Input */}
              <div className="space-y-1 sm:space-y-2">
                <label className="text-white font-medium flex items-center gap-2 text-sm sm:text-base">
                  <MapPin size={14} sm:size={16} className="text-white/80" />
                  To
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter destination city"
                    className="w-full p-3 sm:p-4 pl-10 sm:pl-12 rounded-lg sm:rounded-xl bg-white border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#295A55]/50 focus:border-[#295A55] transition-all duration-300 text-sm sm:text-base"
                  />
                  <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <MapPin size={16} sm:size={20} />
                  </div>
                </div>
              </div>

              {/* Journey Date */}
              <div className="space-y-1 sm:space-y-2">
                <label className="text-white font-medium flex items-center gap-2 text-sm sm:text-base">
                  <Calendar size={14} sm:size={16} className="text-white/80" />
                  Journey Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full p-3 sm:p-4 pl-10 sm:pl-12 rounded-lg sm:rounded-xl bg-white border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#295A55]/50 focus:border-[#295A55] transition-all duration-300 text-sm sm:text-base"
                  />
                  <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <Calendar size={16} sm:size={20} />
                  </div>
                </div>
              </div>

              {/* Passengers */}
              <div className="space-y-1 sm:space-y-2">
                <label className="text-white font-medium flex items-center gap-2 text-sm sm:text-base">
                  <Users size={14} sm:size={16} className="text-white/80" />
                  Passengers
                </label>
                <div className="relative">
                  <div className="flex items-center bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden">
                    <button
                      type="button"
                      className="px-3 sm:px-4 py-3 text-gray-600 hover:text-[#295A55] hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-lg sm:text-xl">−</span>
                    </button>
                    <input
                      type="number"
                      min="1"
                      defaultValue="1"
                      className="w-full p-3 sm:p-4 text-center bg-transparent text-gray-700 focus:outline-none text-sm sm:text-base"
                      placeholder="Enter number of passengers"
                    />
                    <button
                      type="button"
                      className="px-3 sm:px-4 py-3 text-gray-600 hover:text-[#295A55] hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-lg sm:text-xl">+</span>
                    </button>
                  </div>
                  <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <Users size={16} sm:size={20} />
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow Left Right Icon - Desktop */}
            <div className="hidden md:block absolute left-1/2 top-15 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-[#295A55] p-2 rounded-full  shadow-lg">
                <ArrowLeftRight size={20} className="text-white" />
              </div>
            </div>

            {/* Arrow Left Right Icon - Mobile */}
          </div>

          {/* Search Button */}
          <div className="pt-1 sm:pt-2">
            <button className="w-full bg-linear-to-r from-[#295A55] to-[#3A7A72] text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg hover:from-[#244D49] hover:to-[#346B64] active:from-[#1F443F] active:to-[#2D5D57] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#295A55]/25 flex items-center justify-center gap-2 sm:gap-3 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#295A55]">
              <Search size={20} sm:size={24} />
              Search Buses
            </button>
          </div>

          <div className="border-b border-white/20 my-2 sm:my-4"></div>

          <PopularRoutes />
        </div>
      </div>
    </div>
  );
};

export default HeroSearchForm;
