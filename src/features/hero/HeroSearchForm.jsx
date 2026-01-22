import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { 
  Search, 
  Calendar, 
  Users, 
  MapPin, 
  ArrowLeftRight,
  Filter,
  ChevronDown,
  SortAsc,
  Loader2
} from "lucide-react";
import axios from "axios";
import PopularRoutes from "./PopularRoutes";

const HeroSearchForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    date: "",
    passengers: 1
  });
  
  const [suggestions, setSuggestions] = useState({
    from: [],
    to: []
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    operators: [],
    busTypes: [],
    departureTime: "",
    priceRange: { min: 0, max: 5000 },
    amenities: []
  });
  
  const [sortBy, setSortBy] = useState("departureTime");
  const [availableFilters, setAvailableFilters] = useState(null);
  
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setSearchData(prev => ({
      ...prev,
      date: tomorrow.toISOString().split('T')[0]
    }));
    
    fetchFilters();
  }, []);
  
  const fetchFilters = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/buses/filters`);
      setAvailableFilters(response.data);
    } catch (error) {
      console.log("Using default filters", error);
      setAvailableFilters({
        operators: ["Hanif Enterprise", "Shyamoli Paribahan", "ENA Paribahan", "Liton Enterprise", "Green Line Paribahan", "Saintmartin Travels", "Soudia Paribahan"],
        busTypes: ["AC Business", "AC Seater", "Non-AC Seater", "AC Sleeper", "Executive"],
        amenities: ["ac", "charging", "water", "wifi", "snacks", "blanket", "newspaper", "entertainment", "hot-meal"],
        sortOptions: [
          { value: "departureTime", label: "Departure Time (Earliest)" },
          { value: "arrivalTime", label: "Arrival Time (Earliest)" },
          { value: "priceLow", label: "Price (Low to High)" },
          { value: "priceHigh", label: "Price (High to Low)" },
          { value: "rating", label: "Rating (Highest)" }
        ]
      });
    }
  };
  
  const fetchSuggestions = async (type, value) => {
    if (value.length < 2) {
      setSuggestions(prev => ({ ...prev, [type]: [] }));
      return;
    }
    
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/search/suggestions`, {
        params: { q: value }
      });
      
      setSuggestions(prev => ({ 
        ...prev, 
        [type]: response.data.suggestions || [] 
      }));
    } catch (error) {
      const localCities = ["Dhaka", "Chittagong", "Cox's Bazar", "Sylhet", "Khulna", "Rajshahi", "Barisal"];
      const localOperators = ["Hanif Enterprise", "Shyamoli Paribahan", "ENA Paribahan"];
      
      const filteredCities = localCities.filter(item => 
        item.toLowerCase().includes(value.toLowerCase())
      ).map(city => ({ type: "city", value: city }));
      
      const filteredOperators = localOperators.filter(op => 
        op.toLowerCase().includes(value.toLowerCase())
      ).map(op => ({ type: "operator", value: op }));
      
      setSuggestions(prev => ({ 
        ...prev, 
        [type]: [...filteredCities, ...filteredOperators].slice(0, 5) 
      }));
    }
  };
  
  const handleInputChange = (field, value) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
    
    if (field === "from" || field === "to") {
      fetchSuggestions(field, value);
    }
  };
  
  const handleSwap = () => {
    setSearchData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };
  
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchData.from.trim() || !searchData.to.trim() || !searchData.date) {
      alert("Please fill in all required fields");
      return;
    }
    
    if (searchData.passengers < 1 || searchData.passengers > 10) {
      alert("Number of passengers must be between 1 and 10");
      return;
    }
    
    if (searchData.from.trim().toLowerCase() === searchData.to.trim().toLowerCase()) {
      alert("Departure and destination cannot be the same");
      return;
    }
    
    try {
      setLoading(true);
      
      // Store search data in sessionStorage for persistence
      const searchSessionData = {
        searchParams: searchData,
        filters: showFilters ? filters : {},
        sortBy: sortBy,
        timestamp: new Date().getTime()
      };
      
      sessionStorage.setItem('busSearchData', JSON.stringify(searchSessionData));
      
      // Navigate to results page
      navigate("/results", {
        state: searchSessionData
      });
      
    } catch (error) {
      console.error("Navigation error:", error);
      alert("Search failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (filterType === "operators" || filterType === "busTypes" || filterType === "amenities") {
        const current = prev[filterType];
        return {
          ...prev,
          [filterType]: current.includes(value) 
            ? current.filter(v => v !== value)
            : [...current, value]
        };
      } else if (filterType === "priceRange") {
        return {
          ...prev,
          priceRange: value
        };
      } else {
        return {
          ...prev,
          [filterType]: value
        };
      }
    });
  };
  
  const handleQuickRoute = (route) => {
    const [from, to] = route.split(" to ");
    setSearchData(prev => ({ 
      ...prev, 
      from: from.trim(), 
      to: to.trim() 
    }));
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 lg:px-6">
      <div className="backdrop-blur-md bg-white/5 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-white/10">
        <div className="space-y-6">
          <form onSubmit={handleSearch}>
            <div className="space-y-4">
              <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-white font-medium flex items-center gap-2">
                      <MapPin size={16} className="text-white/80" />
                      From
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchData.from}
                        onChange={(e) => handleInputChange("from", e.target.value)}
                        placeholder="Enter departure city"
                        className="w-full p-4 pl-12 rounded-xl bg-white border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#295A55]/50 focus:border-[#295A55] transition-all duration-300"
                        required
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <MapPin size={20} />
                      </div>
                      
                      {suggestions.from.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                          {suggestions.from.map((suggestion, index) => (
                            <button
                              key={index}
                              type="button"
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0"
                              onClick={() => {
                                setSearchData(prev => ({ ...prev, from: suggestion.value }));
                                setSuggestions(prev => ({ ...prev, from: [] }));
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <MapPin size={16} className={
                                  suggestion.type === "city" ? "text-blue-500" : "text-purple-500"
                                } />
                                <div className="flex-1">
                                  <div className="font-medium text-gray-800">{suggestion.value}</div>
                                  <div className="text-xs text-gray-500 capitalize">
                                    {suggestion.type}
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-white font-medium flex items-center gap-2">
                      <MapPin size={16} className="text-white/80" />
                      To
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchData.to}
                        onChange={(e) => handleInputChange("to", e.target.value)}
                        placeholder="Enter destination city"
                        className="w-full p-4 pl-12 rounded-xl bg-white border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#295A55]/50 focus:border-[#295A55] transition-all duration-300"
                        required
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <MapPin size={20} />
                      </div>
                      
                      {suggestions.to.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                          {suggestions.to.map((suggestion, index) => (
                            <button
                              key={index}
                              type="button"
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0"
                              onClick={() => {
                                setSearchData(prev => ({ ...prev, to: suggestion.value }));
                                setSuggestions(prev => ({ ...prev, to: [] }));
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <MapPin size={16} className={
                                  suggestion.type === "city" ? "text-blue-500" : "text-purple-500"
                                } />
                                <div className="flex-1">
                                  <div className="font-medium text-gray-800">{suggestion.value}</div>
                                  <div className="text-xs text-gray-500 capitalize">
                                    {suggestion.type}
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-white font-medium flex items-center gap-2">
                      <Calendar size={16} className="text-white/80" />
                      Journey Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={searchData.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                        className="w-full p-4 pl-12 rounded-xl bg-white border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#295A55]/50 focus:border-[#295A55] transition-all duration-300"
                        required
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <Calendar size={20} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-white font-medium flex items-center gap-2">
                      <Users size={16} className="text-white/80" />
                      Passengers
                    </label>
                    <div className="relative">
                      <div className="flex items-center bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setSearchData(prev => ({ 
                            ...prev, 
                            passengers: Math.max(1, prev.passengers - 1) 
                          }))}
                          className="px-4 py-4 text-gray-600 hover:text-[#295A55] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={searchData.passengers <= 1}
                        >
                          <span className="text-xl">−</span>
                        </button>
                        <div className="w-full p-4 text-center bg-transparent text-gray-700">
                          <span className="text-lg font-semibold">{searchData.passengers}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            {searchData.passengers === 1 ? 'Passenger' : 'Passengers'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSearchData(prev => ({ 
                            ...prev, 
                            passengers: Math.min(10, prev.passengers + 1) 
                          }))}
                          className="px-4 py-4 text-gray-600 hover:text-[#295A55] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={searchData.passengers >= 10}
                        >
                          <span className="text-xl">+</span>
                        </button>
                      </div>
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <Users size={20} />
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={handleSwap}
                  className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#295A55] p-3 rounded-full shadow-lg hover:bg-[#244D49] transition-colors z-10 border-4 border-white"
                  aria-label="Swap departure and destination"
                >
                  <ArrowLeftRight size={20} className="text-white" />
                </button>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 text-white hover:text-white/80 transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
                >
                  <Filter size={18} />
                  <span>Advanced Filters</span>
                  <ChevronDown size={18} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                
                <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                  <SortAsc size={18} className="text-white" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-white border-none focus:outline-none cursor-pointer"
                  >
                    <option value="departureTime">Departure Time</option>
                    <option value="arrivalTime">Arrival Time</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>
              
              {showFilters && availableFilters && (
                <div className="bg-white/10 rounded-xl p-6 space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h3 className="text-white font-medium">Bus Operators</h3>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {availableFilters.operators.map((operator) => (
                          <label key={operator} className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-2 rounded">
                            <input
                              type="checkbox"
                              checked={filters.operators.includes(operator)}
                              onChange={() => handleFilterChange("operators", operator)}
                              className="rounded border-gray-300 text-[#295A55] focus:ring-[#295A55]"
                            />
                            <span className="text-white/90 text-sm">{operator}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-white font-medium">Bus Type</h3>
                      <div className="space-y-2">
                        {availableFilters.busTypes.map((type) => (
                          <label key={type} className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-2 rounded">
                            <input
                              type="checkbox"
                              checked={filters.busTypes.includes(type)}
                              onChange={() => handleFilterChange("busTypes", type)}
                              className="rounded border-gray-300 text-[#295A55] focus:ring-[#295A55]"
                            />
                            <span className="text-white/90 text-sm">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-white font-medium">Departure Time</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: "morning", label: "Morning", time: "6AM-12PM" },
                          { value: "afternoon", label: "Afternoon", time: "12PM-6PM" },
                          { value: "evening", label: "Evening", time: "6PM-12AM" },
                          { value: "night", label: "Night", time: "12AM-6AM" }
                        ].map((time) => (
                          <button
                            key={time.value}
                            type="button"
                            onClick={() => handleFilterChange("departureTime", 
                              filters.departureTime === time.value ? "" : time.value
                            )}
                            className={`p-3 rounded-lg border text-center transition-all ${
                              filters.departureTime === time.value
                                ? "border-[#295A55] bg-[#295A55] text-white"
                                : "border-white/30 text-white/80 hover:border-[#295A55] hover:bg-[#295A55]/20"
                            }`}
                          >
                            <div className="font-medium text-sm">{time.label}</div>
                            <div className="text-xs opacity-80">{time.time}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-white font-medium">Price Range</h3>
                      <span className="text-white/80 text-sm">
                        ৳{filters.priceRange.min} - ৳{filters.priceRange.max}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={filters.priceRange.max}
                      onChange={(e) => handleFilterChange("priceRange", { 
                        min: 0, 
                        max: parseInt(e.target.value) 
                      })}
                      className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#295A55]"
                    />
                    <div className="flex justify-between text-white/70 text-sm">
                      <span>৳0</span>
                      <span>৳2500</span>
                      <span>৳5000</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setFilters({
                          operators: [],
                          busTypes: [],
                          departureTime: "",
                          priceRange: { min: 0, max: 5000 },
                          amenities: []
                        });
                      }}
                      className="px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors text-sm rounded-lg"
                    >
                      Clear all filters
                    </button>
                  </div>
                </div>
              )}
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#295A55] to-[#3A7A72] text-white py-4 rounded-xl font-semibold text-lg hover:from-[#244D49] hover:to-[#346B64] active:from-[#1F443F] active:to-[#2D5D57] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#295A55]/25 flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#295A55] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={24} className="animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search size={24} />
                      Search Buses
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["Dhaka to Chittagong", "Dhaka to Sylhet", "Chittagong to Cox's Bazar", "Dhaka to Khulna"].map((route) => (
              <button
                key={route}
                type="button"
                onClick={() => handleQuickRoute(route)}
                className="text-white/80 hover:text-white hover:bg-white/10 py-2 px-3 rounded-lg transition-colors text-sm text-center truncate"
                title={route}
              >
                {route}
              </button>
            ))}
          </div>
          
          <div className="border-b border-white/20 my-2 sm:my-4"></div>
          
          <PopularRoutes />
        </div>
      </div>
      
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 flex flex-col items-center gap-4">
            <Loader2 size={48} className="animate-spin text-[#295A55]" />
            <div className="text-lg font-semibold text-gray-700">Searching for buses...</div>
            <div className="text-sm text-gray-500">Please wait</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSearchForm;