import React, { useState, useEffect } from 'react';
import { X, User, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const SeatSelection = ({ bus, onClose, onProceedToBooking }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerCount, setPassengerCount] = useState(1);
  const [seatLayout, setSeatLayout] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        // Ensure seatLayout is in correct format
        const layout = Array.isArray(response.data.seatLayout) 
          ? response.data.seatLayout 
          : [];
        
        // Transform to our expected format if needed
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
    
    // Create 2D array for seat layout (4 seats per row)
    const rows = Math.ceil(totalSeats / 4);
    const layout = [];
    
    for (let row = 0; row < rows; row++) {
      const rowSeats = [];
      for (let col = 0; col < 4; col++) {
        const seatNumber = row * 4 + col + 1;
        if (seatNumber > totalSeats) break;
        
        const isBooked = seatNumber > (totalSeats - availableSeats);
        const seatType = col === 0 || col === 3 ? 'window' : 'aisle';
        
        rowSeats.push({
          seatNumber,
          type: seatType,
          status: isBooked ? 'booked' : 'available',
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

  const handleSeatSelect = (seat) => {
    if (seat.status === 'booked') {
      alert("This seat is already booked!");
      return;
    }

    if (selectedSeats.length >= passengerCount && !selectedSeats.find(s => s.seatNumber === seat.seatNumber)) {
      alert(`You can only select ${passengerCount} seat(s)`);
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

  const calculateTotalPrice = () => {
    if (!bus) return 0;
    
    return selectedSeats.reduce((total, seat) => {
      const basePrice = bus.discountPrice && bus.discountPrice < bus.price ? bus.discountPrice : (bus.price || 0);
      return total + Math.round(basePrice * seat.priceMultiplier);
    }, 0);
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

    onProceedToBooking({
      bus,
      selectedSeats,
      passengerCount,
      totalPrice: calculateTotalPrice()
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl max-w-4xl w-full">
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <Loader2 size={48} className="animate-spin text-[#295A55] mx-auto mb-4" />
              <p className="text-gray-600">Loading seat layout...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!bus) {
    return (
      <div className="bg-white rounded-xl max-w-4xl w-full">
        <div className="p-6">
          <div className="text-center py-8">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Bus Not Found</h3>
            <p className="text-gray-600 mb-4">Unable to load bus information for seat selection.</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#295A55] text-white rounded-lg hover:bg-[#244D49]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Select Seats</h2>
            <p className="text-gray-600">
              {bus.operator} • {bus.busNumber || 'N/A'} • {bus.type || 'Standard'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Bus Layout */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-700">Bus Layout</h3>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 border border-green-500 rounded"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-100 border border-blue-500 rounded"></div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-100 border border-gray-400 rounded"></div>
                    <span>Booked</span>
                  </div>
                </div>
              </div>

              {/* Bus Driver */}
              <div className="flex justify-center mb-6">
                <div className="text-center">
                  <div className="w-12 h-8 bg-gray-300 rounded mb-2 mx-auto"></div>
                  <div className="text-xs text-gray-600">Driver</div>
                </div>
              </div>

              {/* Seats Grid */}
              <div className="space-y-2">
                {Array.isArray(seatLayout) && seatLayout.length > 0 ? (
                  seatLayout.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-2 justify-center">
                      {/* Left Aisle */}
                      <div className="w-8 flex items-center justify-center">
                        {rowIndex % 2 === 0 && (
                          <div className="text-xs text-gray-400">Aisle</div>
                        )}
                      </div>
                      
                      {/* Seats */}
                      {Array.isArray(row) ? row.map((seat) => (
                        <button
                          key={seat.seatNumber}
                          onClick={() => handleSeatSelect(seat)}
                          disabled={seat.status === 'booked'}
                          className={`w-10 h-10 rounded flex flex-col items-center justify-center border text-sm transition-all ${
                            seat.status === 'booked'
                              ? 'bg-gray-100 border-gray-400 cursor-not-allowed'
                              : selectedSeats.find(s => s.seatNumber === seat.seatNumber)
                              ? 'bg-blue-100 border-blue-500 text-blue-700'
                              : 'bg-green-100 border-green-500 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {seat.seatNumber}
                          <span className="text-xs opacity-75">{seat.type?.charAt(0) || 'S'}</span>
                        </button>
                      )) : null}
                      
                      {/* Right Aisle */}
                      <div className="w-8 flex items-center justify-center">
                        {rowIndex % 2 === 1 && (
                          <div className="text-xs text-gray-400">Aisle</div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No seat layout available</p>
                    <button
                      onClick={generateDefaultLayout}
                      className="mt-2 px-4 py-2 text-sm bg-[#295A55] text-white rounded hover:bg-[#244D49]"
                    >
                      Generate Default Layout
                    </button>
                  </div>
                )}
              </div>

              {/* Bus Exit */}
              <div className="flex justify-center mt-6">
                <div className="text-center">
                  <div className="w-16 h-2 bg-red-300 rounded mb-2 mx-auto"></div>
                  <div className="text-xs text-gray-600">Exit</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Selection Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-gray-700 mb-4">Passenger Details</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Passengers
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPassengerCount(c => Math.max(1, c - 1))}
                    disabled={passengerCount <= 1}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50"
                  >
                    -
                  </button>
                  <div className="flex-1 text-center">
                    <div className="text-xl font-bold">{passengerCount}</div>
                    <div className="text-xs text-gray-500">Passenger(s)</div>
                  </div>
                  <button
                    onClick={() => setPassengerCount(c => Math.min(bus.availableSeats || 40, c + 1))}
                    disabled={passengerCount >= (bus.availableSeats || 40)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Selected Seats:</span>
                  <span className="font-medium text-[#295A55]">
                    {selectedSeats.length} / {passengerCount}
                  </span>
                </div>
                
                {selectedSeats.length > 0 && (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedSeats.map((seat) => (
                      <div key={seat.seatNumber} className="flex justify-between items-center bg-white p-2 rounded border">
                        <div>
                          <span className="font-medium">Seat {seat.seatNumber}</span>
                          <span className="text-xs text-gray-500 ml-2">({seat.type || 'standard'})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            ৳{Math.round((bus.discountPrice && bus.discountPrice < bus.price ? bus.discountPrice : (bus.price || 0)) * (seat.priceMultiplier || 1))}
                          </span>
                          <button
                            onClick={() => setSelectedSeats(s => s.filter(s => s.seatNumber !== seat.seatNumber))}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Base Fare:</span>
                  <span className="font-medium">
                    ৳{bus.discountPrice && bus.discountPrice < bus.price ? bus.discountPrice : (bus.price || 0)} × {selectedSeats.length}
                  </span>
                </div>
                {selectedSeats.some(s => s.type === 'window') && (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 text-sm">Window seat premium:</span>
                    <span className="text-sm">+10%</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold mt-4">
                  <span>Total:</span>
                  <span className="text-[#295A55]">৳{calculateTotalPrice()}</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Important Notes</h4>
                  <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                    <li>• Arrive 30 minutes before departure</li>
                    <li>• Carry valid ID proof</li>
                    <li>• Seats cannot be changed after booking</li>
                    <li>• Window seats have 10% premium</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={handleProceed}
              disabled={selectedSeats.length !== passengerCount}
              className="w-full bg-gradient-to-r from-[#295A55] to-[#3A7A72] text-white py-3 rounded-lg font-semibold hover:from-[#244D49] hover:to-[#346B64] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Proceed to Booking
            </button>

            <button
              onClick={onClose}
              className="w-full mt-2 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;