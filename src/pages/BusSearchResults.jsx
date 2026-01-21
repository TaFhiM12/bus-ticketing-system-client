// BusSearchResults.jsx
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
  Navigation
} from "lucide-react";
import axios from "axios";

const BusSearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [buses, setBuses] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const [filters, setFilters] = useState({
    operators: [],
    busTypes: [],
    departureTime: "",
    priceRange: { min: 0, max: 5000 },
    amenities: []
  });
  const [sortBy, setSortBy] = useState("departureTime");
  const [availableFilters, setAvailableFilters] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBus, setSelectedBus] = useState(null);
  const [showSeatLayout, setShowSeatLayout] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerCount, setPassengerCount] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const params = location.state?.searchParams || {};
    setSearchParams(params);
    fetchBuses(params);
  }, [location]);

  const fetchBuses = async (params) => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5001/api/buses/search", {
        ...params,
        sortBy,
        filters: Object.keys(filters).length > 0 ? filters : {}
      });
      
      setBuses(response.data.buses);
      setAvailableFilters(response.data.filters);
    } catch (error) {
      console.error("Failed to fetch buses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters };
    
    if (filterType === "operators" || filterType === "busTypes" || filterType === "amenities") {
      const current = newFilters[filterType];
      newFilters[filterType] = current.includes(value) 
        ? current.filter(v => v !== value)
        : [...current, value];
    } else if (filterType === "priceRange") {
      newFilters.priceRange = value;
    } else {
      newFilters[filterType] = value;
    }
    
    setFilters(newFilters);
    fetchBuses({ ...searchParams, filters: newFilters, sortBy });
  };

  const clearFilters = () => {
    setFilters({
      operators: [],
      busTypes: [],
      departureTime: "",
      priceRange: { min: 0, max: 5000 },
      amenities: []
    });
    fetchBuses(searchParams);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    fetchBuses({ ...searchParams, sortBy: value, filters });
  };

  const handleBookNow = (bus) => {
    setSelectedBus(bus);
    setShowSeatLayout(true);
  };

  const handleSeatSelect = (seat) => {
    if (selectedSeats.length >= passengerCount && !selectedSeats.find(s => s.seatNumber === seat.seatNumber)) {
      alert(`You can only select ${passengerCount} seat(s)`);
      return;
    }

    if (seat.status === "booked") {
      alert("This seat is already booked!");
      return;
    }

    setSelectedSeats(prev => {
      if (prev.find(s => s.seatNumber === seat.seatNumber)) {
        return prev.filter(s => s.seatNumber !== seat.seatNumber);
      } else {
        return [...prev, seat];
      }
    });
  };

  const proceedToBooking = () => {
    if (selectedSeats.length !== passengerCount) {
      alert(`Please select exactly ${passengerCount} seat(s)`);
      return;
    }

    navigate("/booking", {
      state: {
        bus: selectedBus,
        selectedSeats,
        passengerCount,
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
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDuration = (departure, arrival) => {
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const diff = arr - dep;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const paginatedBuses = buses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#295A55]"></div>
            <p className="mt-4 text-gray-600">Searching for buses...</p>
          </div>
        </div>
      </div>
    );
  }

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
                  {searchParams.from} → {searchParams.to}
                </h1>
                <div className="flex items-center gap-4 mt-2 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{formatDate(searchParams.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>{searchParams.passengers} Passenger{searchParams.passengers > 1 ? 's' : ''}</span>
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

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Price Range</h3>
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
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-600">৳0</span>
                  <span className="text-sm font-medium text-[#295A55]">
                    Up to ৳{filters.priceRange.max}
                  </span>
                  <span className="text-sm text-gray-600">৳5000</span>
                </div>
              </div>

              {/* Bus Operators */}
              {availableFilters?.operators && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-3">Bus Operators</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {availableFilters.operators.map((operator) => (
                      <label key={operator} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters.operators.includes(operator)}
                          onChange={() => handleFilterChange("operators", operator)}
                          className="w-4 h-4 text-[#295A55] border-gray-300 rounded focus:ring-[#295A55]"
                        />
                        <span className="text-gray-600 group-hover:text-gray-800">
                          {operator}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Bus Types */}
              {availableFilters?.busTypes && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-3">Bus Type</h3>
                  <div className="space-y-2">
                    {availableFilters.busTypes.map((type) => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters.busTypes.includes(type)}
                          onChange={() => handleFilterChange("busTypes", type)}
                          className="w-4 h-4 text-[#295A55] border-gray-300 rounded focus:ring-[#295A55]"
                        />
                        <span className="text-gray-600 group-hover:text-gray-800">
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Departure Time */}
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
                      <div className="font-medium">{time.label}</div>
                      <div className="text-xs opacity-80">{time.time}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Amenities</h3>
                <div className="space-y-2">
                  {[
                    { value: "ac", label: "AC", icon: <Droplets size={16} /> },
                    { value: "charging", label: "Charging", icon: <Zap size={16} /> },
                    { value: "wifi", label: "WiFi", icon: <Wifi size={16} /> },
                    { value: "water", label: "Water", icon: <Droplets size={16} /> },
                    { value: "snacks", label: "Snacks", icon: <Coffee size={16} /> },
                    { value: "blanket", label: "Blanket" },
                    { value: "entertainment", label: "Entertainment", icon: <Tv size={16} /> }
                  ].map((amenity) => (
                    <label key={amenity.value} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.amenities.includes(amenity.value)}
                        onChange={() => handleFilterChange("amenities", amenity.value)}
                        className="w-4 h-4 text-[#295A55] border-gray-300 rounded focus:ring-[#295A55]"
                      />
                      <div className="flex items-center gap-2">
                        {amenity.icon}
                        <span className="text-gray-600 group-hover:text-gray-800">
                          {amenity.label}
                        </span>
                      </div>
                    </label>
                  ))}
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
                                <div className="font-medium">{bus.route.from.city}</div>
                                <div className="opacity-80">{bus.route.from.terminal}</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium">{bus.route.to.city}</div>
                                <div className="opacity-80">{bus.route.to.terminal}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 space-y-2">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock size={16} />
                              <span>Duration: {bus.route.duration}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin size={16} />
                              <span>Distance: {bus.route.distance}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Middle Column - Bus Details */}
                        <div className="lg:w-2/5">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-800">
                                {bus.operator}
                              </h3>
                              <div className="flex items-center gap-4 mt-1">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBusTypeColor(bus.type)}`}>
                                  {bus.type}
                                </span>
                                <div className="flex items-center gap-1">
                                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                  <span className="font-medium">{bus.rating}</span>
                                  <span className="text-gray-500">/5</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500">Bus Number</div>
                              <div className="font-mono font-bold text-lg text-[#295A55]">
                                {bus.busNumber}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Shield size={16} className="text-green-600" />
                              <span className="font-medium text-gray-700">Features:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {bus.features.slice(0, 3).map((feature, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle size={16} className="text-blue-600" />
                              <span className="font-medium text-gray-700">Amenities:</span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                              {bus.amenities.slice(0, 5).map((amenity, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-1 text-gray-600"
                                >
                                  {getAmenityIcon(amenity)}
                                  <span className="text-sm capitalize">{amenity}</span>
                                </div>
                              ))}
                              {bus.amenities.length > 5 && (
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
                              {bus.discountPrice < bus.price ? (
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
                                  ৳{bus.price}
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
                                bus.availableSeats < 10 ? 'text-red-600' : 
                                bus.availableSeats < 20 ? 'text-orange-600' : 
                                'text-green-600'
                              }`}>
                                {bus.availableSeats} / {bus.totalSeats}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  (bus.availableSeats / bus.totalSeats) > 0.5 ? 'bg-green-500' :
                                  (bus.availableSeats / bus.totalSeats) > 0.2 ? 'bg-orange-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${(bus.availableSeats / bus.totalSeats) * 100}%` }}
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
                            {bus.boardingPoints.map((point, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600"
                              >
                                {point}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                            <MapPin size={16} />
                            <span>Dropping Points:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {bus.droppingPoints.map((point, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600"
                              >
                                {point}
                              </span>
                            ))}
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

      {/* Seat Layout Modal */}
      {showSeatLayout && selectedBus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Select Seats</h2>
                <button
                  onClick={() => {
                    setShowSeatLayout(false);
                    setSelectedSeats([]);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-700">{selectedBus.operator}</h3>
                    <div className="text-sm text-gray-600">
                      {selectedBus.type} • {selectedBus.busNumber}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Passengers</div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPassengerCount(c => Math.max(1, c - 1))}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="font-bold text-lg">{passengerCount}</span>
                        <button
                          onClick={() => setPassengerCount(c => Math.min(selectedBus.availableSeats, c + 1))}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Selected</div>
                      <div className="font-bold text-lg text-[#295A55]">
                        {selectedSeats.length} / {passengerCount}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Seat Layout */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-700">Seat Layout</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-100 border border-green-500 rounded"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 border border-blue-500 rounded"></div>
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-100 border border-gray-400 rounded"></div>
                      <span>Booked</span>
                    </div>
                  </div>
                </div>
                
                {/* Bus Layout */}
                <div className="bg-gray-100 rounded-lg p-6">
                  {/* Driver's Seat */}
                  <div className="flex justify-center mb-8">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-300 rounded mb-2 mx-auto"></div>
                      <div className="text-sm text-gray-600">Driver</div>
                    </div>
                  </div>
                  
                  {/* Seats Grid */}
                  <div className="space-y-4">
                    {Array.from({ length: Math.ceil(selectedBus.totalSeats / 4) }, (_, rowIndex) => (
                      <div key={rowIndex} className="flex gap-8 justify-center">
                        {[0, 1, 2, 3].map((colIndex) => {
                          const seatNumber = rowIndex * 4 + colIndex + 1;
                          if (seatNumber > selectedBus.totalSeats) return null;
                          
                          const isBooked = seatNumber > (selectedBus.totalSeats - selectedBus.availableSeats);
                          const isSelected = selectedSeats.find(s => s.seatNumber === seatNumber);
                          const seatType = colIndex === 0 || colIndex === 3 ? 'window' : 'aisle';
                          
                          return (
                            <button
                              key={seatNumber}
                              onClick={() => handleSeatSelect({
                                seatNumber,
                                type: seatType,
                                status: isBooked ? 'booked' : 'available',
                                priceMultiplier: seatType === 'window' ? 1.0 : 0.95
                              })}
                              disabled={isBooked}
                              className={`w-12 h-12 rounded flex flex-col items-center justify-center border transition-all ${
                                isBooked
                                  ? 'bg-gray-100 border-gray-400 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-blue-100 border-blue-500'
                                  : 'bg-green-100 border-green-500 hover:bg-green-200'
                              }`}
                            >
                              <span className="font-bold">{seatNumber}</span>
                              <span className="text-xs">{seatType.charAt(0).toUpperCase()}</span>
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  
                  {/* Aisle */}
                  <div className="h-8"></div>
                </div>
              </div>
              
              {/* Selected Seats Summary */}
              {selectedSeats.length > 0 && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-3">Selected Seats</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedSeats.map((seat, index) => (
                      <div key={index} className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-blue-200">
                        <span className="font-bold">Seat {seat.seatNumber}</span>
                        <span className="text-sm text-gray-600">({seat.type})</span>
                        <span className="text-sm font-medium text-[#295A55]">
                          ৳{Math.round(selectedBus.price * seat.priceMultiplier)}
                        </span>
                        <button
                          onClick={() => setSelectedSeats(s => s.filter((_, i) => i !== index))}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Total Price */}
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg mb-6">
                <div>
                  <div className="text-lg font-bold text-gray-800">Total Fare</div>
                  <div className="text-sm text-gray-600">Inclusive of all charges</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-[#295A55]">
                    ৳{selectedSeats.reduce((total, seat) => 
                      total + Math.round(selectedBus.price * seat.priceMultiplier), 0
                    )}
                  </div>
                  {selectedBus.discountPrice < selectedBus.price && (
                    <div className="text-sm text-green-600">
                      You save ৳{Math.round(selectedBus.price - selectedBus.discountPrice) * selectedSeats.length}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowSeatLayout(false);
                    setSelectedSeats([]);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={proceedToBooking}
                  disabled={selectedSeats.length !== passengerCount}
                  className="px-6 py-3 bg-[#295A55] text-white rounded-lg hover:bg-[#244D49] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bus Details Modal */}
      {selectedBus && !showSeatLayout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedBus.operator}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBusTypeColor(selectedBus.type)}`}>
                      {selectedBus.type}
                    </span>
                    <span className="font-mono text-gray-600">{selectedBus.busNumber}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBus(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Route & Timing */}
                <div className="bg-linear-to-r from-[#295A55] to-[#3A7A72] text-white rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <div className="text-lg font-bold">{formatTime(selectedBus.departureTime)}</div>
                      <div className="text-sm opacity-90">{selectedBus.route.from.city}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center">
                        <ArrowRight size={20} />
                      </div>
                      <div className="text-sm">{selectedBus.route.duration}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold">{formatTime(selectedBus.arrivalTime)}</div>
                      <div className="text-sm opacity-90">{selectedBus.route.to.city}</div>
                    </div>
                  </div>
                </div>
                
                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="font-medium text-gray-700">Distance</div>
                    <div className="text-gray-600">{selectedBus.route.distance}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-gray-700">Rating</div>
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                      <span>{selectedBus.rating}/5</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-gray-700">Total Seats</div>
                    <div className="text-gray-600">{selectedBus.totalSeats}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-gray-700">Available Seats</div>
                    <div className="text-gray-600">{selectedBus.availableSeats}</div>
                  </div>
                </div>
                
                {/* Amenities */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedBus.amenities.map((amenity, index) => (
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
                
                {/* Features */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedBus.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Boarding Points */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Boarding Points</h3>
                  <div className="space-y-2">
                    {selectedBus.boardingPoints.map((point, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        <span className="text-gray-600">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Dropping Points */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Dropping Points</h3>
                  <div className="space-y-2">
                    {selectedBus.droppingPoints.map((point, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        <span className="text-gray-600">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Cancellation Policy */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Cancellation Policy</h3>
                  <p className="text-gray-600 text-sm">{selectedBus.cancellationPolicy}</p>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-lg font-bold text-[#295A55]">
                      ৳{selectedBus.discountPrice < selectedBus.price ? selectedBus.discountPrice : selectedBus.price}
                    </div>
                    {selectedBus.discountPrice < selectedBus.price && (
                      <div className="text-sm text-green-600">{selectedBus.discountText}</div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedBus(null);
                      handleBookNow(selectedBus);
                    }}
                    className="px-6 py-3 bg-[#295A55] text-white rounded-lg hover:bg-[#244D49]"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusSearchResults;