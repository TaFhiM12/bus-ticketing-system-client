import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  User, 
  AlertCircle, 
  Loader2, 
  Clock,
  Users,
  Shield,
  CheckCircle,
  Crown,
  Sofa,
  Baby,
  Zap,
  Eye,
  EyeOff,
  Info,
  Timer,
  Minus,
  Plus,
  MapPin,
  Star,
  CreditCard,
  Home,
  DoorOpen
} from 'lucide-react';
import axios from 'axios';
import io from 'socket.io-client';
import useAuth from '../hooks/useAuth';


const SeatSelection = ({ bus, onClose, onProceedToBooking }) => {
  const { user } = useAuth();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerCount, setPassengerCount] = useState(1);
  const [seatLayout, setSeatLayout] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [realTimeSeats, setRealTimeSeats] = useState({
    booked: [],
    selectedByOthers: []
  });
  const [timerCountdowns, setTimerCountdowns] = useState({});
  const [showSeatInfo, setShowSeatInfo] = useState(false);
  const timerRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    if (!bus?._id) return;

    const socketUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:5001'
      : 'https://bus-ticketing-system-server-2.onrender.com';
    
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: true
    });

    setSocket(newSocket);

    // Join bus room
    newSocket.emit('join-bus', { 
      busId: bus._id,
      userId: user?.uid || 'anonymous'
    });

    // Socket event listeners
    newSocket.on('seat-status', (data) => {
      setRealTimeSeats(prev => ({
        ...prev,
        booked: data.bookedSeats || [],
        selectedByOthers: data.selectedByOthers || []
      }));
    });

    newSocket.on('seat-selected', (data) => {
      setRealTimeSeats(prev => ({
        ...prev,
        selectedByOthers: [...prev.selectedByOthers, {
          seatNumber: data.seatNumber,
          selectedBy: data.selectedBy,
          selectedAt: data.selectedAt,
          expiresIn: data.expiresIn
        }]
      }));
    });

    newSocket.on('seat-deselected', (data) => {
      setRealTimeSeats(prev => ({
        ...prev,
        selectedByOthers: prev.selectedByOthers.filter(
          seat => seat.seatNumber !== data.seatNumber
        )
      }));
    });

    newSocket.on('seats-booked', (data) => {
      setRealTimeSeats(prev => ({
        booked: [...prev.booked, ...data.bookedSeats],
        selectedByOthers: prev.selectedByOthers.filter(
          seat => !data.bookedSeats.includes(seat.seatNumber)
        )
      }));
    });

    newSocket.on('seats-released', (data) => {
      setRealTimeSeats(prev => ({
        ...prev,
        selectedByOthers: prev.selectedByOthers.filter(
          seat => !data.seats.includes(seat.seatNumber)
        )
      }));
    });

    newSocket.on('seat-locked', (data) => {
      alert(`Seat ${data.seatNumber} is being selected by another user. Please try again in ${data.timeLeft} seconds.`);
    });

    newSocket.on('seat-unavailable', (data) => {
      alert(`Seat ${data.seatNumber} is no longer available.`);
    });

    newSocket.on('error', (data) => {
      console.error('Socket error:', data);
      setError(data.message);
    });

    return () => {
      if (newSocket) {
        newSocket.emit('leave-bus', { busId: bus._id });
        newSocket.disconnect();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [bus?._id, user?.uid]);

  // Update timer countdowns
  useEffect(() => {
    timerRef.current = setInterval(() => {
      const now = new Date();
      const newCountdowns = {};
      
      realTimeSeats.selectedByOthers.forEach(seat => {
        if (seat.selectedAt) {
          const selectedTime = new Date(seat.selectedAt);
          const elapsedSeconds = Math.floor((now - selectedTime) / 1000);
          const remaining = Math.max(0, 120 - elapsedSeconds); // 2 minutes timeout
          newCountdowns[seat.seatNumber] = remaining;
        }
      });
      
      setTimerCountdowns(newCountdowns);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [realTimeSeats.selectedByOthers]);

  useEffect(() => {
    if (bus?._id) {
      fetchSeatLayout();
    } else {
      generateDefaultLayout();
    }
  }, [bus]);

  const fetchSeatLayout = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`https://bus-ticketing-system-server-2.onrender.com/api/buses/${bus._id}/seats`);
      
      if (response.data.success && response.data.seatLayout) {
        const layout = Array.isArray(response.data.seatLayout) 
          ? response.data.seatLayout 
          : [];
        
        const formattedLayout = layout.map(row => {
          if (Array.isArray(row)) {
            return row;
          } else if (row.seats && Array.isArray(row.seats)) {
            return row.seats;
          }
          return [];
        }).filter(row => row.length > 0);
        
        setSeatLayout(formattedLayout);
      } else {
        generateDefaultLayout();
      }
    } catch (error) {
      console.error("Error fetching seat layout:", error);
      generateDefaultLayout();
    } finally {
      setLoading(false);
    }
  };

  const generateDefaultLayout = () => {
    if (!bus) return;
    
    const totalSeats = bus.totalSeats || 40;
    const availableSeats = bus.availableSeats || totalSeats;
    const rows = Math.ceil(totalSeats / 4);
    const layout = [];
    
    for (let row = 0; row < rows; row++) {
      const rowSeats = [];
      for (let col = 0; col < 4; col++) {
        const seatNumber = row * 4 + col + 1;
        if (seatNumber > totalSeats) break;
        
        const seatType = col === 0 || col === 3 ? 'window' : 'aisle';
        
        rowSeats.push({
          seatNumber,
          type: seatType,
          status: 'available',
          priceMultiplier: seatType === 'window' ? 1.1 : 1.0
        });
      }
      if (rowSeats.length > 0) {
        layout.push(rowSeats);
      }
    }
    
    setSeatLayout(layout);
    setLoading(false);
  };

  const getSeatStatus = (seatNumber) => {
    // Check if booked
    if (realTimeSeats.booked.includes(seatNumber)) {
      return 'booked';
    }
    
    // Check if selected by current user
    if (selectedSeats.find(s => s.seatNumber === seatNumber)) {
      return 'selected';
    }
    
    // Check if selected by others
    const otherSelection = realTimeSeats.selectedByOthers.find(
      s => s.seatNumber === seatNumber
    );
    if (otherSelection) {
      return 'locked';
    }
    
    return 'available';
  };

  const handleSeatSelect = (seat) => {
    const status = getSeatStatus(seat.seatNumber);
    
    if (status === 'booked') {
      alert("This seat is already booked!");
      return;
    }
    
    if (status === 'locked') {
      const timer = timerCountdowns[seat.seatNumber] || 0;
      alert(`This seat is being selected by another user. Available in ${timer} seconds.`);
      return;
    }

    if (selectedSeats.length >= passengerCount && !selectedSeats.find(s => s.seatNumber === seat.seatNumber)) {
      alert(`You can only select ${passengerCount} seat(s)`);
      return;
    }

    if (selectedSeats.find(s => s.seatNumber === seat.seatNumber)) {
      // Deselect seat
      setSelectedSeats(prev => prev.filter(s => s.seatNumber !== seat.seatNumber));
      if (socket) {
        socket.emit('select-seat', {
          busId: bus._id,
          seatNumber: seat.seatNumber,
          action: 'deselect',
          userId: user?.uid
        });
      }
    } else {
      // Select seat
      setSelectedSeats(prev => [...prev, seat]);
      if (socket) {
        socket.emit('select-seat', {
          busId: bus._id,
          seatNumber: seat.seatNumber,
          action: 'select',
          userId: user?.uid
        });
      }
    }
  };

  const calculateTotalPrice = () => {
    if (!bus) return 0;
    
    return selectedSeats.reduce((total, seat) => {
      const basePrice = bus.discountPrice && bus.discountPrice < bus.price 
        ? bus.discountPrice 
        : (bus.price || 0);
      return total + Math.round(basePrice * seat.priceMultiplier);
    }, 0);
  };

  const getSeatIcon = (seatType) => {
    switch(seatType) {
      case 'window': return <Eye size={14} />;
      case 'aisle': return <DoorOpen size={14} />;
      default: return <Sofa size={14} />;
    }
  };

  const getSeatClassName = (seatNumber, seatType) => {
    const status = getSeatStatus(seatNumber);
    const baseClass = "relative flex flex-col items-center justify-center rounded-lg transition-all duration-300 transform hover:scale-105 cursor-pointer ";
    const sizeClass = "w-16 h-16";
    
    switch(status) {
      case 'booked':
        return baseClass + sizeClass + " bg-gray-100 border-2 border-gray-300 cursor-not-allowed opacity-60";
      case 'selected':
        return baseClass + sizeClass + " bg-gradient-to-br from-green-500 to-emerald-600 border-2 border-emerald-700 text-white shadow-lg";
      case 'locked':
        const timer = timerCountdowns[seatNumber] || 0;
        return baseClass + sizeClass + " bg-gradient-to-br from-orange-400 to-red-500 border-2 border-red-600 text-white animate-pulse cursor-not-allowed";
      default:
        const premiumClass = seatType === 'window' 
          ? "bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-300 hover:border-blue-500"
          : "bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 hover:border-gray-400";
        return baseClass + sizeClass + premiumClass;
    }
  };

  const handleProceed = () => {
    if (!bus) {
      alert("Bus information is missing!");
      return;
    }
    
    if (selectedSeats.length !== passengerCount) {
      alert(`Please select exactly ${passengerCount} seat(s)`);
      return;
    }

    // Notify others that seats are booked
    if (socket) {
      socket.emit('booking-completed', {
        busId: bus._id,
        bookedSeats: selectedSeats.map(s => s.seatNumber)
      });
    }

    onProceedToBooking({
      bus,
      selectedSeats,
      passengerCount,
      totalPrice: calculateTotalPrice()
    });
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-[#295A55] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sofa className="text-[#295A55]" size={32} />
                </div>
              </div>
              <p className="mt-4 text-gray-600 font-medium">Loading interactive seat selection...</p>
              <p className="text-sm text-gray-500">Connecting to real-time server</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!bus) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          <div className="text-center py-12">
            <AlertCircle size={64} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Bus Not Found</h3>
            <p className="text-gray-600 mb-6">Unable to load bus information for seat selection.</p>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-[#295A55] to-[#3A7A72] text-white rounded-xl hover:from-[#244D49] hover:to-[#346B64] font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Select Your Seats</h2>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#295A55]"></div>
                  <span className="text-sm text-gray-600">{bus.operator}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600">{bus.busNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {new Date(bus.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSeatInfo(!showSeatInfo)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                title="Seat Information"
              >
                <Info size={20} className="text-gray-600" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 h-full">
            {/* Left Column - Bus Layout */}
            <div className="lg:col-span-3 p-6">
              <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
                {/* Bus Top View */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800">Bus Layout - Top View</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span className="text-sm">Selected</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-400 rounded"></div>
                        <span className="text-sm">Booked</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-orange-500 rounded animate-pulse"></div>
                        <span className="text-sm">Processing</span>
                      </div>
                    </div>
                  </div>

                  {/* Driver Section */}
                  <div className="relative mb-6">
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-0">
                      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-2 rounded-t-lg">
                        <div className="flex items-center justify-center gap-2">
                          <Crown size={16} />
                          <span className="text-sm font-medium">Driver Cabin</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Seats Grid */}
                  <div className="relative">
                    {/* Left Aisle */}
                    <div className="absolute left-0 top-0 bottom-0 w-16 flex items-center justify-center">
                      <div className="h-full w-1 bg-gradient-to-b from-gray-300 to-gray-400"></div>
                      <div className="absolute text-xs text-gray-500 rotate-90 whitespace-nowrap">
                        Aisle
                      </div>
                    </div>

                    {/* Right Aisle */}
                    <div className="absolute right-0 top-0 bottom-0 w-16 flex items-center justify-center">
                      <div className="h-full w-1 bg-gradient-to-b from-gray-300 to-gray-400"></div>
                      <div className="absolute text-xs text-gray-500 rotate-90 whitespace-nowrap">
                        Aisle
                      </div>
                    </div>

                    {/* Seats */}
                    <div className="px-20">
                      <div className="grid grid-cols-4 gap-4">
                        {seatLayout.map((row, rowIndex) => (
                          <React.Fragment key={rowIndex}>
                            {row.map((seat) => {
                              const status = getSeatStatus(seat.seatNumber);
                              const isSelected = selectedSeats.find(s => s.seatNumber === seat.seatNumber);
                              const isLocked = status === 'locked';
                              const timer = timerCountdowns[seat.seatNumber];
                              
                              return (
                                <button
                                  key={seat.seatNumber}
                                  onClick={() => handleSeatSelect(seat)}
                                  disabled={status === 'booked' || isLocked}
                                  className={getSeatClassName(seat.seatNumber, seat.type)}
                                >
                                  {/* Seat Number */}
                                  <div className="font-bold text-lg">
                                    {seat.seatNumber}
                                  </div>
                                  
                                  {/* Seat Type Icon */}
                                  <div className="mt-1 opacity-80">
                                    {getSeatIcon(seat.type)}
                                  </div>
                                  
                                  {/* Price Badge */}
                                  {!isSelected && !isLocked && status !== 'booked' && (
                                    <div className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full px-2 py-1 shadow-sm">
                                      <span className="text-xs font-bold text-[#295A55]">
                                        ৳{Math.round((bus.discountPrice < bus.price ? bus.discountPrice : bus.price) * seat.priceMultiplier)}
                                      </span>
                                    </div>
                                  )}
                                  
                                  {/* Selection Check */}
                                  {isSelected && (
                                    <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 shadow-lg">
                                      <CheckCircle size={16} className="text-white" />
                                    </div>
                                  )}
                                  
                                  {/* Timer for locked seats */}
                                  {isLocked && timer > 0 && (
                                    <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 shadow-lg">
                                      <div className="text-xs font-bold text-white">
                                        {formatTimer(timer)}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Seat Type Label */}
                                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/80 text-gray-700">
                                      {seat.type.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Exit Section */}
                  <div className="relative mt-8">
                    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0">
                      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-b-lg">
                        <div className="flex items-center justify-center gap-2">
                          <Zap size={16} />
                          <span className="text-sm font-medium">Emergency Exit</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Special Seats Section */}
                <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
                  <h4 className="font-bold text-gray-800 mb-3">Special Seats</h4>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { type: 'premium', icon: <Crown size={20} />, label: 'Premium', desc: 'Extra legroom' },
                      { type: 'ladies', icon: <User size={20} />, label: 'Ladies', desc: 'Female only' },
                      { type: 'family', icon: <Baby size={20} />, label: 'Family', desc: 'Near exit' },
                      { type: 'accessible', icon: <Zap size={20} />, label: 'Accessible', desc: 'Zap' }
                    ].map((special, idx) => (
                      <div key={idx} className="text-center p-3 bg-white rounded-lg border border-gray-200">
                        <div className="text-indigo-600 mb-2 flex justify-center">
                          {special.icon}
                        </div>
                        <div className="font-medium text-gray-800">{special.label}</div>
                        <div className="text-xs text-gray-500">{special.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Selection Summary */}
            <div className="lg:col-span-1 bg-gradient-to-b from-gray-50 to-white border-l p-6 overflow-y-auto">
              <div className="sticky top-0">
                {/* Passenger Counter */}
                <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-800">Passengers</h3>
                    <Users size={20} className="text-gray-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setPassengerCount(c => Math.max(1, c - 1))}
                      disabled={passengerCount <= 1}
                      className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-50 hover:bg-gray-200"
                    >
                      <Minus size={20} className="text-gray-600" />
                    </button>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#295A55]">{passengerCount}</div>
                      <div className="text-xs text-gray-500">Passenger{passengerCount > 1 ? 's' : ''}</div>
                    </div>
                    <button
                      onClick={() => setPassengerCount(c => Math.min(bus.availableSeats || 40, c + 1))}
                      disabled={passengerCount >= (bus.availableSeats || 40)}
                      className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-50 hover:bg-gray-200"
                    >
                      <Plus size={20} className="text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Selected Seats */}
                <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-800">Selected Seats</h3>
                    <div className="text-sm font-medium">
                      <span className="text-[#295A55]">{selectedSeats.length}</span>
                      <span className="text-gray-500">/{passengerCount}</span>
                    </div>
                  </div>
                  
                  {selectedSeats.length > 0 ? (
                    <div className="space-y-3">
                      {selectedSeats.map((seat) => (
                        <div key={seat.seatNumber} className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                              <span className="text-white font-bold">{seat.seatNumber}</span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">Seat {seat.seatNumber}</div>
                              <div className="text-xs text-gray-500 capitalize">{seat.type} seat</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-[#295A55]">
                              ৳{Math.round((bus.discountPrice < bus.price ? bus.discountPrice : bus.price) * seat.priceMultiplier)}
                            </div>
                            <button
                              onClick={() => handleSeatSelect(seat)}
                              className="text-xs text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Sofa size={32} className="text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No seats selected</p>
                      <p className="text-gray-400 text-xs">Click on available seats to select</p>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
                  <h3 className="font-bold text-gray-800 mb-3">Price Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Fare:</span>
                      <span className="font-medium">
                        ৳{bus.discountPrice < bus.price ? bus.discountPrice : bus.price} × {selectedSeats.length}
                      </span>
                    </div>
                    {selectedSeats.some(s => s.type === 'window') && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Window Premium:</span>
                        <span className="text-green-600">+10%</span>
                      </div>
                    )}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-800">Total:</span>
                        <span className="text-2xl font-bold text-[#295A55]">
                          ৳{calculateTotalPrice()}
                        </span>
                      </div>
                      {bus.discountPrice < bus.price && (
                        <div className="text-xs text-green-600 mt-1">
                          You save ৳{(bus.price - bus.discountPrice) * selectedSeats.length}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Security & Info */}
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center gap-3">
                      <Shield size={20} className="text-blue-600" />
                      <div>
                        <div className="font-medium text-blue-800">Secure Booking</div>
                        <div className="text-xs text-blue-600">Your selection is protected</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-200">
                    <div className="flex items-center gap-3">
                      <AlertCircle size={20} className="text-yellow-600" />
                      <div>
                        <div className="font-medium text-yellow-800">Important</div>
                        <ul className="text-xs text-yellow-700 mt-1 space-y-1">
                          <li>• Seats auto-release after 2 minutes</li>
                          <li>• Arrive 30 mins before departure</li>
                          <li>• Carry valid photo ID</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleProceed}
                    disabled={selectedSeats.length !== passengerCount}
                    className="w-full bg-gradient-to-r from-[#295A55] via-[#3A7A72] to-[#295A55] text-white py-3 rounded-xl font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {selectedSeats.length === passengerCount ? (
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle size={20} />
                        <span>Proceed to Booking</span>
                      </div>
                    ) : (
                      `Select ${passengerCount - selectedSeats.length} More Seat${passengerCount - selectedSeats.length > 1 ? 's' : ''}`
                    )}
                  </button>

                  <button
                    onClick={onClose}
                    className="w-full border-2 border-gray-300 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>

                {/* Real-time Indicator */}
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Real-time Seat Updates Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seat Information Modal */}
        {showSeatInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Seat Information</h3>
                  <button
                    onClick={() => setShowSeatInfo(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-green-500 to-emerald-600"></div>
                    <div>
                      <div className="font-medium">Selected Seat</div>
                      <div className="text-sm text-gray-500">Your chosen seat</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-300"></div>
                    <div>
                      <div className="font-medium">Window Seat</div>
                      <div className="text-sm text-gray-500">10% premium, better view</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200"></div>
                    <div>
                      <div className="font-medium">Aisle Seat</div>
                      <div className="text-sm text-gray-500">Easy access, standard price</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gray-100 border-2 border-gray-300 opacity-60"></div>
                    <div>
                      <div className="font-medium">Booked Seat</div>
                      <div className="text-sm text-gray-500">Already taken</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-400 to-red-500 animate-pulse"></div>
                    <div>
                      <div className="font-medium">Processing</div>
                      <div className="text-sm text-gray-500">Selected by another user</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatSelection;