import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  User, 
  AlertCircle, 
  Clock,
  Users,
  Shield,
  CheckCircle,
  Crown,
  Sofa,
  Baby,
  Zap,
  Eye,
  Info,
  Minus,
  Plus,
  DoorOpen,
  RotateCw
} from 'lucide-react';
import axios from 'axios';
import io from 'socket.io-client';
import useAuth from '../hooks/useAuth';
import Loading from '../shared/components/Loading';

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
  const [refreshing, setRefreshing] = useState(false);
  const timerRef = useRef(null);
  const socketRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    if (!bus?._id) return;

    const socketUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:5001'
      : `${import.meta.env.VITE_BACKEND_URL}`;
    
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Register user with socket
    newSocket.emit('register-user', { 
      userId: user?.uid || 'anonymous'
    });

    // Join bus room
    newSocket.emit('join-bus', { 
      busId: bus._id,
      userId: user?.uid || 'anonymous'
    });

    // Socket event listeners
    newSocket.on('seat-status', (data) => {
      console.log('Received seat-status:', data);
      setRealTimeSeats({
        booked: data.bookedSeats || [],
        selectedByOthers: data.selectedByOthers || []
      });
    });

    newSocket.on('seat-selected', (data) => {
      console.log('Seat selected by others:', data);
      setRealTimeSeats(prev => {
        // Check if seat is already in selectedByOthers
        const exists = prev.selectedByOthers.find(s => s.seatNumber === data.seatNumber);
        if (exists) return prev;
        
        return {
          ...prev,
          selectedByOthers: [...prev.selectedByOthers, {
            seatNumber: data.seatNumber,
            selectedBy: data.selectedBy,
            selectedAt: data.selectedAt,
            expiresIn: data.expiresIn
          }]
        };
      });
    });

    newSocket.on('seat-deselected', (data) => {
      console.log('Seat deselected by others:', data);
      setRealTimeSeats(prev => ({
        ...prev,
        selectedByOthers: prev.selectedByOthers.filter(
          seat => seat.seatNumber !== data.seatNumber
        )
      }));
    });

    newSocket.on('seats-booked', (data) => {
      console.log('Seats booked:', data);
      setRealTimeSeats(prev => ({
        booked: [...prev.booked, ...data.bookedSeats],
        selectedByOthers: prev.selectedByOthers.filter(
          seat => !data.bookedSeats.includes(seat.seatNumber)
        )
      }));
    });

    newSocket.on('seats-released', (data) => {
      console.log('Seats released:', data);
      setRealTimeSeats(prev => ({
        ...prev,
        selectedByOthers: prev.selectedByOthers.filter(
          seat => !data.seats.includes(seat.seatNumber)
        )
      }));
    });

    // Listen for seats expired from server
    newSocket.on('seats-expired', (data) => {
      console.log('Seats expired:', data);
      setRealTimeSeats(prev => ({
        ...prev,
        selectedByOthers: prev.selectedByOthers.filter(
          seat => !data.seats.includes(seat.seatNumber)
        )
      }));
      
      // Also check if any of our selected seats are expired
      const expiredFromOurSelection = selectedSeats.filter(seat => 
        data.seats.includes(seat.seatNumber)
      );
      
      if (expiredFromOurSelection.length > 0) {
        setSelectedSeats(prev => prev.filter(seat => 
          !data.seats.includes(seat.seatNumber)
        ));
        
        // Notify user
        expiredFromOurSelection.forEach(seat => {
          alert(`Seat ${seat.seatNumber} selection has expired. Please select again.`);
        });
      }
    });

    // Listen for our own seat expiry
    newSocket.on('your-seat-expired', (data) => {
      console.log('Your seat expired:', data);
      setSelectedSeats(prev => prev.filter(seat => seat.seatNumber !== data.seatNumber));
      alert(`Your selection for seat ${data.seatNumber} has expired. Please select again.`);
    });

    newSocket.on('seat-locked', (data) => {
      alert(`Seat ${data.seatNumber} is being selected by another user. Please try again in ${data.timeLeft} seconds.`);
    });

    newSocket.on('seat-unavailable', (data) => {
      alert(`Seat ${data.seatNumber} is no longer available.`);
    });

    newSocket.on('seat-status-update', (data) => {
      console.log('Seat status update:', data);
      setRealTimeSeats(prev => ({
        ...prev,
        selectedByOthers: data.selectedByOthers || []
      }));
    });

    newSocket.on('error', (data) => {
      console.error('Socket error:', data);
      setError(data.message);
    });

    // Handle connection issues
    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setError('Connection error. Please try again.');
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected, attempt:', attemptNumber);
      if (bus?._id) {
        newSocket.emit('join-bus', { 
          busId: bus._id,
          userId: user?.uid || 'anonymous'
        });
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave-bus', { busId: bus._id });
        socketRef.current.disconnect();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [bus?._id, user?.uid]);

  // Update timer countdowns and check for expired seats
  useEffect(() => {
    timerRef.current = setInterval(() => {
      const now = new Date();
      const newCountdowns = {};
      let shouldUpdateOthers = false;
      let shouldUpdateSelected = false;
      
      // Check seats selected by others
      const updatedSelectedByOthers = realTimeSeats.selectedByOthers.filter(seat => {
        if (seat.selectedAt) {
          const selectedTime = new Date(seat.selectedAt);
          const elapsedSeconds = Math.floor((now - selectedTime) / 1000);
          const remaining = Math.max(0, 120 - elapsedSeconds);
          
          if (remaining > 0) {
            newCountdowns[seat.seatNumber] = remaining;
            return true;
          } else {
            shouldUpdateOthers = true;
            return false;
          }
        }
        return false;
      });
      
      // Check our own selected seats
      const updatedSelectedSeats = selectedSeats.filter(seat => {
        if (seat.selectedAt) {
          const selectedTime = new Date(seat.selectedAt);
          const elapsedSeconds = Math.floor((now - selectedTime) / 1000);
          const remaining = Math.max(0, 120 - elapsedSeconds);
          
          if (remaining > 0) {
            newCountdowns[seat.seatNumber] = remaining;
            return true;
          } else {
            shouldUpdateSelected = true;
            
            // Notify server that our seat has expired
            if (socketRef.current) {
              socketRef.current.emit('user-seat-expired', {
                busId: bus._id,
                seatNumber: seat.seatNumber
              });
            }
            
            return false;
          }
        }
        return true;
      });
      
      // Update states if needed
      if (shouldUpdateOthers) {
        setRealTimeSeats(prev => ({
          ...prev,
          selectedByOthers: updatedSelectedByOthers
        }));
      }
      
      if (shouldUpdateSelected) {
        setSelectedSeats(updatedSelectedSeats);
      }
      
      setTimerCountdowns(newCountdowns);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [realTimeSeats.selectedByOthers, selectedSeats, bus?._id]);

  // Refresh seat status manually
  const refreshSeatStatus = () => {
    if (socketRef.current && bus?._id) {
      setRefreshing(true);
      socketRef.current.emit('refresh-seat-selection', { busId: bus._id });
      
      // Also fetch fresh data from API
      fetchSeatLayout();
      
      setTimeout(() => setRefreshing(false), 1000);
    }
  };

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
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/buses/${bus._id}/seats`);
      
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
    
    // Check if selected by others (with expiration check)
    const otherSelection = realTimeSeats.selectedByOthers.find(
      s => s.seatNumber === seatNumber
    );
    
    if (otherSelection && otherSelection.selectedAt) {
      const now = new Date();
      const selectedTime = new Date(otherSelection.selectedAt);
      const elapsedSeconds = (now - selectedTime) / 1000;
      
      // If expired, don't show as locked
      if (elapsedSeconds >= 120) {
        return 'available';
      }
      
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
      if (socketRef.current) {
        socketRef.current.emit('select-seat', {
          busId: bus._id,
          seatNumber: seat.seatNumber,
          action: 'deselect',
          userId: user?.uid
        });
      }
    } else {
      // Select seat with current timestamp
      const seatWithTimestamp = {
        ...seat,
        selectedAt: new Date().toISOString()
      };
      
      setSelectedSeats(prev => [...prev, seatWithTimestamp]);
      if (socketRef.current) {
        socketRef.current.emit('select-seat', {
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
    
    const timer = timerCountdowns[seatNumber] || 0;
    const isAboutToExpire = timer > 0 && timer < 30;
    
    switch(status) {
      case 'booked':
        return baseClass + sizeClass + " bg-gray-100 border-2 border-gray-300 cursor-not-allowed opacity-60";
      case 'selected': {
        if (isAboutToExpire) {
          return baseClass + sizeClass + " bg-linear-to-br from-yellow-500 to-orange-500 border-2 border-orange-600 text-white shadow-lg animate-pulse";
        }
        return baseClass + sizeClass + " bg-linear-to-br from-green-500 to-emerald-600 border-2 border-emerald-700 text-white shadow-lg";
      }
      case 'locked': {
        if (isAboutToExpire) {
          return baseClass + sizeClass + " bg-linear-to-br from-orange-300 to-red-400 border-2 border-red-500 text-white animate-pulse cursor-not-allowed";
        }
        return baseClass + sizeClass + " bg-linear-to-br from-orange-400 to-red-500 border-2 border-red-600 text-white animate-pulse cursor-not-allowed";
      }
      default: {
        const premiumClass = seatType === 'window' 
          ? "bg-linear-to-br from-blue-50 to-indigo-100 border-2 border-blue-300 hover:border-blue-500"
          : "bg-linear-to-br from-gray-50 to-gray-100 border-2 border-gray-200 hover:border-gray-400";
        return baseClass + sizeClass + premiumClass;
      }
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
    if (socketRef.current) {
      socketRef.current.emit('booking-completed', {
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
    return <Loading/>
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
              className="px-8 py-3 bg-linear-to-r from-[#295A55] to-[#3A7A72] text-white rounded-xl hover:from-[#244D49] hover:to-[#346B64] font-medium"
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
                onClick={refreshSeatStatus}
                disabled={refreshing}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center gap-2"
                title="Refresh Seat Status"
              >
                <RotateCw size={20} className={`text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="text-sm">Refresh</span>
              </button>
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
              <div className="bg-linear-to-b from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
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
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-500 rounded animate-pulse"></div>
                        <span className="text-sm">Expiring Soon</span>
                      </div>
                    </div>
                  </div>

                  {/* Driver Section */}
                  <div className="relative mb-20">
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-0">
                      <div className="bg-linear-to-r from-gray-800 to-gray-900 text-white px-6 py-2 rounded-t-lg">
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
                      <div className="h-full w-1 bg-linear-to-b from-gray-300 to-gray-400"></div>
                      <div className="absolute text-xs text-gray-500 rotate-90 whitespace-nowrap">
                        Aisle
                      </div>
                    </div>

                    {/* Right Aisle */}
                    <div className="absolute right-0 top-0 bottom-0 w-16 flex items-center justify-center">
                      <div className="h-full w-1 bg-linear-to-b from-gray-300 to-gray-400"></div>
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
                                  
                                  {/* Timer for selected seats */}
                                  {isSelected && timerCountdowns[seat.seatNumber] > 0 && (
                                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                                      <div className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded">
                                        {formatTimer(timerCountdowns[seat.seatNumber])}
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
                </div>

                {/* Special Seats Section */}
                <div className="mt-8 bg-linear-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
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
            <div className="lg:col-span-1 bg-linear-to-b from-gray-50 to-white border-l p-6 overflow-y-auto">
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
                      {selectedSeats.map((seat) => {
                        const timer = timerCountdowns[seat.seatNumber] || 0;
                        return (
                          <div key={seat.seatNumber} className="flex items-center justify-between p-3 bg-linear-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                timer > 0 && timer < 30 
                                  ? "bg-linear-to-br from-yellow-500 to-orange-500" 
                                  : "bg-linear-to-br from-green-500 to-emerald-600"
                              }`}>
                                <span className="text-white font-bold">{seat.seatNumber}</span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-800">Seat {seat.seatNumber}</div>
                                <div className="text-xs text-gray-500 capitalize">{seat.type} seat</div>
                                {timer > 0 && (
                                  <div className="text-xs text-orange-600 font-medium">
                                    Expires in: {formatTimer(timer)}
                                  </div>
                                )}
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
                        );
                      })}
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
                  <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center gap-3">
                      <Shield size={20} className="text-blue-600" />
                      <div>
                        <div className="font-medium text-blue-800">Secure Booking</div>
                        <div className="text-xs text-blue-600">Your selection is protected</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-linear-to-r from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-200">
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
                    className="w-full bg-linear-to-r from-[#295A55] via-[#3A7A72] to-[#295A55] text-white py-3 rounded-xl font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
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
                    <div className="w-8 h-8 rounded bg-linear-to-br from-green-500 to-emerald-600"></div>
                    <div>
                      <div className="font-medium">Selected Seat</div>
                      <div className="text-sm text-gray-500">Your chosen seat</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-linear-to-br from-yellow-500 to-orange-500"></div>
                    <div>
                      <div className="font-medium">Expiring Soon</div>
                      <div className="text-sm text-gray-500">Less than 30 seconds left</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-linear-to-br from-orange-400 to-red-500 animate-pulse"></div>
                    <div>
                      <div className="font-medium">Processing</div>
                      <div className="text-sm text-gray-500">Selected by another user</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-linear-to-br from-blue-50 to-indigo-100 border-2 border-blue-300"></div>
                    <div>
                      <div className="font-medium">Window Seat</div>
                      <div className="text-sm text-gray-500">10% premium, better view</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-linear-to-br from-gray-50 to-gray-100 border-2 border-gray-200"></div>
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