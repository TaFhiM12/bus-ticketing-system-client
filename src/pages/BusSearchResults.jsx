import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { 
  Filter, 
  SortAsc, 
  Clock, 
  Users, 
  MapPin, 
  CheckCircle, 
  Shield, 
  Wifi, 
  Droplets,
  Zap,
  Coffee,
  Tv,
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Navigation,
  AlertCircle
} from "lucide-react";
import axios from "axios";
import SeatSelection from "./SeatSelection";
import useAuth from "../hooks/useAuth";
import Loading from "../shared/components/Loading";

// Default filter values
const DEFAULT_FILTERS = {
  operators: [],
  busTypes: [],
  departureTime: "",
  priceRange: { min: 0, max: 5000 },
  amenities: []
};

const DEFAULT_SORT = "departureTime";

const BusSearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [buses, setBuses] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState(DEFAULT_SORT);
  const [availableFilters, setAvailableFilters] = useState({
    operators: [],
    busTypes: [],
    amenities: [],
    priceRange: { min: 0, max: 5000 }
  });

  useEffect(() => {
      document.title = "BUS VARA | Bus Search Results";
    }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBus, setSelectedBus] = useState(null);
  const [showSeatSelection, setShowSeatSelection] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    // Load search data from sessionStorage or location state
    const loadSearchData = async () => {
      try {
        setLoading(true);
        
        // Check sessionStorage first (for login redirects)
        const sessionData = sessionStorage.getItem('busSearchData');
        let searchData = null;
        
        if (sessionData) {
          try {
            searchData = JSON.parse(sessionData);
            // Check if data is fresh (less than 10 minutes old)
            const isFresh = new Date().getTime() - (searchData.timestamp || 0) < 10 * 60 * 1000;
            if (isFresh) {
              // console.log("Using session search data");
            } else {
              searchData = null;
              sessionStorage.removeItem('busSearchData');
            }
          } catch (e) {
            console.error("Error parsing session data:", e);
            sessionStorage.removeItem('busSearchData');
          }
        }
        
        // Fallback to location state
        if (!searchData && location.state) {
          searchData = location.state;
        }
        
        // If still no data, redirect to home
        if (!searchData || !searchData.searchParams) {
          navigate("/");
          return;
        }
        
        // Set states with safe defaults
        const {
          searchParams: params = {},
          filters: savedFilters = DEFAULT_FILTERS,
          sortBy: savedSortBy = DEFAULT_SORT
        } = searchData;
        
        setSearchParams(params);
        setFilters({
          ...DEFAULT_FILTERS,
          ...savedFilters,
          priceRange: savedFilters.priceRange || DEFAULT_FILTERS.priceRange
        });
        setSortBy(savedSortBy);
        
        // Fetch buses
        await fetchBuses(params, savedFilters, savedSortBy);
        
      } catch (error) {
        console.error("Error loading search data:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    
    loadSearchData();
  }, [location, navigate]);

  const fetchBuses = async (params, customFilters = null, customSortBy = null) => {
    try {
      setLoading(true);
      
      // Ensure we have valid parameters
      if (!params.from || !params.to || !params.date) {
        console.error("Missing search parameters");
        setBuses([]);
        return;
      }
      
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/buses/search`, {
        ...params,
        sortBy: customSortBy || sortBy,
        filters: customFilters || filters
      });
      
      if (response.data.success === false) {
        console.error("Search API error:", response.data.error);
        setBuses([]);
        return;
      }
      
      setBuses(response.data.buses || []);
      
      // Set available filters from response
      if (response.data.filters) {
        setAvailableFilters(prev => ({
          ...prev,
          ...response.data.filters,
          priceRange: response.data.filters.priceRange || prev.priceRange
        }));
      }
      
    } catch (error) {
      console.error("Failed to fetch buses:", error);
      setBuses([]);
      
      // Set fallback available filters
      setAvailableFilters(prev => ({
        ...prev,
        operators: ["Hanif Enterprise", "Shyamoli Paribahan", "ENA Paribahan"],
        busTypes: ["AC Business", "AC Seater", "Non-AC Seater"]
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters };
    
    if (filterType === "operators" || filterType === "busTypes" || filterType === "amenities") {
      const current = newFilters[filterType] || [];
      newFilters[filterType] = current.includes(value) 
        ? current.filter(v => v !== value)
        : [...current, value];
    } else if (filterType === "priceRange") {
      newFilters.priceRange = {
        min: value.min || 0,
        max: value.max || 5000
      };
    } else {
      newFilters[filterType] = value;
    }
    
    setFilters(newFilters);
    fetchBuses(searchParams, newFilters, sortBy);
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    fetchBuses(searchParams, DEFAULT_FILTERS, sortBy);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    fetchBuses(searchParams, filters, value);
  };

  const handleBookNow = (bus) => {
    if (!user) {
      // Store current search data and redirect to login
      const redirectData = {
        searchParams,
        filters,
        sortBy,
        timestamp: new Date().getTime()
      };
      sessionStorage.setItem('busSearchData', JSON.stringify(redirectData));
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    
    setSelectedBus(bus);
    setShowSeatSelection(true);
  };

  const handleProceedToBooking = (data) => {
    setBookingData(data);
    setShowSeatSelection(false);
    navigate("/booking", {
      state: {
        bus: data.bus,
        selectedSeats: data.selectedSeats,
        passengerCount: data.passengerCount,
        totalPrice: data.totalPrice,
        searchParams
      }
    });
  };

  const getAmenityIcon = (amenity) => {
    switch(amenity) {
      case "ac": return <Droplets size={16} className="text-blue-500" />;
      case "charging": return <Zap size={16} className="text-yellow-500" />;
      case "wifi": return <Wifi size={16} className="text-purple-500" />;
      case "water": return <Droplets size={16} className="text-blue-300" />;
      case "snacks": return <Coffee size={16} className="text-orange-500" />;
      case "entertainment": return <Tv size={16} className="text-red-500" />;
      default: return <CheckCircle size={16} className="text-green-500" />;
    }
  };

  const getBusTypeColor = (type) => {
    if (type.includes("Business") || type.includes("Executive")) return "bg-purple-100 text-purple-800";
    if (type.includes("Sleeper")) return "bg-blue-100 text-blue-800";
    if (type.includes("AC")) return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return "Invalid time";
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return "Invalid date";
    }
  };

  const getDuration = (departure, arrival) => {
    try {
      const dep = new Date(departure);
      const arr = new Date(arrival);
      const diff = arr - dep;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    } catch {
      return "N/A";
    }
  };

  const paginatedBuses = buses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (authLoading) {
    return <Loading/>
  }

  if (loading) {
    return <Loading/>
  }

  // Safe price range access
  const priceRangeMax = filters.priceRange?.max || 5000;
  const availablePriceRangeMax = availableFilters.priceRange?.max || 5000;

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-[#295A55] mb-4"
          >
            <ChevronLeft size={20} />
            Back to Search
          </button>
          
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {searchParams.from || "N/A"} → {searchParams.to || "N/A"}
                </h1>
                <div className="flex items-center gap-4 mt-2 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{searchParams.date ? formatDate(searchParams.date) : "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>{searchParams.passengers || 1} Passenger{searchParams.passengers > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold text-[#295A55]">
                  {buses.length}
                </div>
                <div className="text-gray-600">Buses Found</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#295A55] hover:text-[#244D49]"
                >
                  Clear All
                </button>
              </div>

              {/* Price Range Filter - FIXED */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Price Range</h3>
                <input
                  type="range"
                  min="0"
                  max={availablePriceRangeMax}
                  step="100"
                  value={priceRangeMax}
                  onChange={(e) => handleFilterChange("priceRange", { 
                    min: 0, 
                    max: parseInt(e.target.value) 
                  })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#295A55]"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-600">৳0</span>
                  <span className="text-sm font-medium text-[#295A55]">
                    Up to ৳{priceRangeMax}
                  </span>
                  <span className="text-sm text-gray-600">৳{availablePriceRangeMax}</span>
                </div>
              </div>

              {/* Bus Operators Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Bus Operators</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableFilters.operators.map((operator) => (
                    <label key={operator} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={(filters.operators || []).includes(operator)}
                        onChange={() => handleFilterChange("operators", operator)}
                        className="w-4 h-4 text-[#295A55] border-gray-300 rounded focus:ring-[#295A55]"
                      />
                      <span className="text-gray-600 group-hover:text-gray-800 text-sm">
                        {operator}
                      </span>
                    </label>
                  ))}
                  {availableFilters.operators.length === 0 && (
                    <p className="text-gray-500 text-sm">No operators available</p>
                  )}
                </div>
              </div>

              {/* Bus Types Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Bus Type</h3>
                <div className="space-y-2">
                  {availableFilters.busTypes.map((type) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={(filters.busTypes || []).includes(type)}
                        onChange={() => handleFilterChange("busTypes", type)}
                        className="w-4 h-4 text-[#295A55] border-gray-300 rounded focus:ring-[#295A55]"
                      />
                      <span className="text-gray-600 group-hover:text-gray-800 text-sm">
                        {type}
                      </span>
                    </label>
                  ))}
                  {availableFilters.busTypes.length === 0 && (
                    <p className="text-gray-500 text-sm">No bus types available</p>
                  )}
                </div>
              </div>

              {/* Departure Time Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Departure Time</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "morning", label: "Morning", time: "6AM - 12PM" },
                    { value: "afternoon", label: "Afternoon", time: "12PM - 6PM" },
                    { value: "evening", label: "Evening", time: "6PM - 12AM" },
                    { value: "night", label: "Night", time: "12AM - 6AM" }
                  ].map((time) => (
                    <button
                      key={time.value}
                      onClick={() => handleFilterChange("departureTime", 
                        filters.departureTime === time.value ? "" : time.value
                      )}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        filters.departureTime === time.value
                          ? "border-[#295A55] bg-[#295A55] text-white"
                          : "border-gray-200 hover:border-[#295A55] hover:bg-[#295A55]/5"
                      }`}
                    >
                      <div className="font-medium text-sm">{time.label}</div>
                      <div className="text-xs opacity-80">{time.time}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Amenities</h3>
                <div className="space-y-2">
                  {availableFilters.amenities.map((amenity) => (
                    <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={(filters.amenities || []).includes(amenity)}
                        onChange={() => handleFilterChange("amenities", amenity)}
                        className="w-4 h-4 text-[#295A55] border-gray-300 rounded focus:ring-[#295A55]"
                      />
                      <span className="text-gray-600 group-hover:text-gray-800 text-sm capitalize">
                        {amenity}
                      </span>
                    </label>
                  ))}
                  {availableFilters.amenities.length === 0 && (
                    <p className="text-gray-500 text-sm">No amenities available</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bus Results */}
          <div className="lg:w-3/4">
            {/* Sort Options */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <SortAsc size={20} className="text-gray-600" />
                  <span className="text-gray-700">Sort by:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "departureTime", label: "Departure Time" },
                    { value: "arrivalTime", label: "Arrival Time" },
                    { value: "priceLow", label: "Price: Low to High" },
                    { value: "priceHigh", label: "Price: High to Low" },
                    { value: "rating", label: "Rating" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        sortBy === option.value
                          ? "bg-[#295A55] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bus Cards */}
            <div className="space-y-6">
              {paginatedBuses.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <Navigation size={64} className="mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No buses found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Try adjusting your filters or search criteria
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-[#295A55] text-white rounded-lg hover:bg-[#244D49] transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                paginatedBuses.map((bus) => (
                  <div key={bus._id} className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Left Column - Timing & Route */}
                        <div className="lg:w-1/3">
                          <div className="bg-linear-to-r from-[#295A55] to-[#3A7A72] text-white rounded-lg p-4">
                            <div className="flex justify-between items-center mb-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold">
                                  {formatTime(bus.departureTime)}
                                </div>
                                <div className="text-sm opacity-90">
                                  {formatDate(bus.departureTime)}
                                </div>
                              </div>
                              
                              <div className="text-center">
                                <div className="flex items-center justify-center">
                                  <ArrowRight size={20} />
                                </div>
                                <div className="text-sm mt-1">
                                  {getDuration(bus.departureTime, bus.arrivalTime)}
                                </div>
                              </div>
                              
                              <div className="text-center">
                                <div className="text-2xl font-bold">
                                  {formatTime(bus.arrivalTime)}
                                </div>
                                <div className="text-sm opacity-90">
                                  {formatDate(bus.arrivalTime)}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-between text-sm">
                              <div className="text-center">
                                <div className="font-medium">{bus.route?.from?.city || "N/A"}</div>
                                <div className="opacity-80">{bus.route?.from?.terminal || "N/A"}</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium">{bus.route?.to?.city || "N/A"}</div>
                                <div className="opacity-80">{bus.route?.to?.terminal || "N/A"}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 space-y-2">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock size={16} />
                              <span>Duration: {bus.route?.duration || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin size={16} />
                              <span>Distance: {bus.route?.distance || "N/A"}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Middle Column - Bus Details */}
                        <div className="lg:w-2/5">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-800">
                                {bus.operator || "Unknown Operator"}
                              </h3>
                              <div className="flex items-center gap-4 mt-1">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBusTypeColor(bus.type || "")}`}>
                                  {bus.type || "Unknown Type"}
                                </span>
                                <div className="flex items-center gap-1">
                                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                  <span className="font-medium">{bus.rating || "N/A"}</span>
                                  <span className="text-gray-500">/5</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500">Bus Number</div>
                              <div className="font-mono font-bold text-lg text-[#295A55]">
                                {bus.busNumber || "N/A"}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Shield size={16} className="text-green-600" />
                              <span className="font-medium text-gray-700">Features:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {(bus.features || []).slice(0, 3).map((feature, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                >
                                  {feature}
                                </span>
                              ))}
                              {(!bus.features || bus.features.length === 0) && (
                                <span className="text-gray-500 text-sm">No features listed</span>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle size={16} className="text-blue-600" />
                              <span className="font-medium text-gray-700">Amenities:</span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                              {(bus.amenities || []).slice(0, 5).map((amenity, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-1 text-gray-600"
                                >
                                  {getAmenityIcon(amenity)}
                                  <span className="text-sm capitalize">{amenity}</span>
                                </div>
                              ))}
                              {(!bus.amenities || bus.amenities.length === 0) && (
                                <span className="text-gray-500 text-sm">No amenities listed</span>
                              )}
                              {bus.amenities && bus.amenities.length > 5 && (
                                <span className="text-sm text-gray-500">
                                  +{bus.amenities.length - 5} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Right Column - Price & Booking */}
                        <div className="lg:w-1/4 border-l lg:border-l-0 lg:border-t lg:pt-4 lg:mt-4 lg:pl-6 lg:border-gray-100">
                          <div className="text-right mb-4">
                            <div className="flex items-center justify-end gap-2 mb-1">
                              {bus.discountPrice && bus.discountPrice < bus.price ? (
                                <>
                                  <span className="text-2xl font-bold text-[#295A55]">
                                    ৳{bus.discountPrice}
                                  </span>
                                  <span className="text-lg text-gray-500 line-through">
                                    ৳{bus.price}
                                  </span>
                                </>
                              ) : (
                                <span className="text-2xl font-bold text-[#295A55]">
                                    ৳{bus.price || "N/A"}
                                  </span>
                              )}
                            </div>
                            
                            {bus.discountText && (
                              <div className="text-sm text-green-600 font-medium">
                                {bus.discountText}
                              </div>
                            )}
                            
                            <div className="text-sm text-gray-500 mt-1">
                              per seat
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-600">Available Seats:</span>
                              <span className={`font-medium ${
                                (bus.availableSeats || 0) < 10 ? 'text-red-600' : 
                                (bus.availableSeats || 0) < 20 ? 'text-orange-600' : 
                                'text-green-600'
                              }`}>
                                {bus.availableSeats || 0} / {bus.totalSeats || 0}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  ((bus.availableSeats || 0) / (bus.totalSeats || 1)) > 0.5 ? 'bg-green-500' :
                                  ((bus.availableSeats || 0) / (bus.totalSeats || 1)) > 0.2 ? 'bg-orange-500' :
                                  'bg-red-500'
                                }`}
                                style={{ 
                                  width: `${((bus.availableSeats || 0) / (bus.totalSeats || 1)) * 100}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <button
                              onClick={() => handleBookNow(bus)}
                              className="w-full bg-linear-to-r from-[#295A55] to-[#3A7A72] text-white py-3 rounded-lg font-semibold hover:from-[#244D49] hover:to-[#346B64] transition-all shadow-md hover:shadow-lg"
                            >
                              Book Now
                            </button>
                            
                            <button
                              onClick={() => setSelectedBus(bus)}
                              className="w-full border border-[#295A55] text-[#295A55] py-2 rounded-lg font-medium hover:bg-[#295A55] hover:text-white transition-colors"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Boarding & Dropping Points */}
                    <div className="bg-gray-50 border-t px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                            <MapPin size={16} />
                            <span>Boarding Points:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {(bus.boardingPoints || []).map((point, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600"
                              >
                                {point}
                              </span>
                            ))}
                            {(!bus.boardingPoints || bus.boardingPoints.length === 0) && (
                              <span className="text-gray-500 text-sm">No boarding points listed</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                            <MapPin size={16} />
                            <span>Dropping Points:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {(bus.droppingPoints || []).map((point, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600"
                              >
                                {point}
                              </span>
                            ))}
                            {(!bus.droppingPoints || bus.droppingPoints.length === 0) && (
                              <span className="text-gray-500 text-sm">No dropping points listed</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {buses.length > itemsPerPage && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft size={20} />
                </button>
                
                {Array.from({ length: Math.ceil(buses.length / itemsPerPage) }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === currentPage || 
                    page === currentPage - 1 || 
                    page === currentPage + 1 || 
                    page === Math.ceil(buses.length / itemsPerPage)
                  )
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg ${
                          currentPage === page
                            ? 'bg-[#295A55] text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))}
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil(buses.length / itemsPerPage), p + 1))}
                  disabled={currentPage === Math.ceil(buses.length / itemsPerPage)}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Seat Selection Overlay */}
      {showSeatSelection && selectedBus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <SeatSelection
            bus={selectedBus}
            onClose={() => {
              setShowSeatSelection(false);
              setSelectedBus(null);
            }}
            onProceedToBooking={handleProceedToBooking}
          />
        </div>
      )}

      {/* Bus Details Modal */}
      {selectedBus && !showSeatSelection && (
        <BusDetailsModal
          bus={selectedBus}
          onClose={() => setSelectedBus(null)}
          onBookNow={() => {
            setSelectedBus(null);
            handleBookNow(selectedBus);
          }}
          formatTime={formatTime}
          formatDate={formatDate}
          getAmenityIcon={getAmenityIcon}
          getBusTypeColor={getBusTypeColor}
        />
      )}
    </div>
  );
};

// Separate Bus Details Modal Component
const BusDetailsModal = ({ bus, onClose, onBookNow, formatTime, formatDate, getAmenityIcon, getBusTypeColor }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{bus.operator}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBusTypeColor(bus.type)}`}>
                {bus.type}
              </span>
              <span className="font-mono text-gray-600">{bus.busNumber}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="bg-linear-to-r from-[#295A55] to-[#3A7A72] text-white rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="text-lg font-bold">{formatTime(bus.departureTime)}</div>
                <div className="text-sm opacity-90">{bus.route?.from?.city}</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <ArrowRight size={20} />
                </div>
                <div className="text-sm">{bus.route?.duration}</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold">{formatTime(bus.arrivalTime)}</div>
                <div className="text-sm opacity-90">{bus.route?.to?.city}</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="font-medium text-gray-700">Distance</div>
              <div className="text-gray-600">{bus.route?.distance}</div>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-gray-700">Rating</div>
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <span>{bus.rating}/5</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-gray-700">Total Seats</div>
              <div className="text-gray-600">{bus.totalSeats}</div>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-gray-700">Available Seats</div>
              <div className="text-gray-600">{bus.availableSeats}</div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Amenities</h3>
            <div className="flex flex-wrap gap-3">
              {bus.amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg"
                >
                  {getAmenityIcon(amenity)}
                  <span className="text-sm capitalize">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Features</h3>
            <div className="flex flex-wrap gap-2">
              {bus.features.map((feature, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Boarding Points</h3>
            <div className="space-y-2">
              {bus.boardingPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-gray-600">{point}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Dropping Points</h3>
            <div className="space-y-2">
              {bus.droppingPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-gray-600">{point}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Cancellation Policy</h3>
            <p className="text-gray-600 text-sm">{bus.cancellationPolicy}</p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-lg font-bold text-[#295A55]">
                ৳{bus.discountPrice < bus.price ? bus.discountPrice : bus.price}
              </div>
              {bus.discountPrice < bus.price && (
                <div className="text-sm text-green-600">{bus.discountText}</div>
              )}
            </div>
            <button
              onClick={onBookNow}
              className="px-6 py-3 bg-[#295A55] text-white rounded-lg hover:bg-[#244D49]"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default BusSearchResults;