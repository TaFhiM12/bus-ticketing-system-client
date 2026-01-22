import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  CreditCard, 
  User, 
  Phone, 
  Mail, 
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { useEffect } from 'react';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bus, selectedSeats, passengerCount, totalPrice, searchParams } = location.state || {};
  
  const [passengerInfo, setPassengerInfo] = useState(
    Array(passengerCount).fill().map(() => ({
      name: '',
      age: '',
      gender: '',
      idNumber: ''
    }))
  );
  
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    emergencyContact: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
      document.title = "BUS VARA | Booking";
    }, []);
  if (!bus || !selectedSeats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={64} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">No Booking Data Found</h2>
          <p className="text-gray-600 mt-2">Please go back and select seats again.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-[#295A55] text-white rounded-lg hover:bg-[#244D49]"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengerInfo];
    updatedPassengers[index][field] = value;
    setPassengerInfo(updatedPassengers);
  };

  const handleContactChange = (field, value) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    // Validate passenger info
    for (let i = 0; i < passengerInfo.length; i++) {
      const passenger = passengerInfo[i];
      if (!passenger.name.trim() || !passenger.age || !passenger.gender) {
        alert(`Please fill all details for Passenger ${i + 1}`);
        return false;
      }
      if (parseInt(passenger.age) < 1 || parseInt(passenger.age) > 100) {
        alert(`Please enter valid age for Passenger ${i + 1}`);
        return false;
      }
    }

    // Validate contact info
    if (!contactInfo.name.trim() || !contactInfo.email.trim() || !contactInfo.phone.trim()) {
      alert("Please fill all contact details");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
      alert("Please enter a valid email address");
      return false;
    }

    if (!/^01[3-9]\d{8}$/.test(contactInfo.phone)) {
      alert("Please enter a valid Bangladeshi phone number");
      return false;
    }

    return true;
  };

  const handleConfirmBooking = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const bookingData = {
        busId: bus._id,
        passengers: passengerInfo.map((passenger, index) => ({
          ...passenger,
          seatNumber: selectedSeats[index].seatNumber,
          seatType: selectedSeats[index].type
        })),
        selectedSeats: selectedSeats,
        contactInfo: contactInfo,
        paymentMethod: paymentMethod,
        totalPrice: totalPrice,
        searchParams: searchParams
      };

      const response = await axios.post("https://bus-ticketing-system-server-2.onrender.com/api/bookings", bookingData);
      
      if (response.data.success) {
        setBookingConfirmed(true);
        setBookingDetails(response.data);
        
        // Clear session storage
        sessionStorage.removeItem('busSearchData');
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Booking failed: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (bookingConfirmed && bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={48} className="text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed!</h1>
              <p className="text-gray-600">Your tickets have been booked successfully</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="text-center mb-4">
                <div className="text-sm text-gray-600">Booking Reference</div>
                <div className="text-2xl font-bold text-[#295A55] font-mono">
                  {bookingDetails.pnr}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <div className="text-sm text-gray-600">Bus Operator</div>
                  <div className="font-medium">{bus.operator}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Bus Number</div>
                  <div className="font-medium">{bus.busNumber}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Departure</div>
                  <div className="font-medium">{new Date(bus.departureTime).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Arrival</div>
                  <div className="font-medium">{new Date(bus.arrivalTime).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Seats</div>
                  <div className="font-medium">
                    {selectedSeats.map(s => s.seatNumber).join(', ')}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Total Amount</div>
                  <div className="font-bold text-lg text-[#295A55]">৳{totalPrice}</div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-yellow-800 mb-2">Next Steps:</h3>
              <ul className="text-sm text-yellow-700 space-y-1 text-left">
                <li>• Save or screenshot this booking reference (PNR)</li>
                <li>• Arrive at boarding point 30 minutes before departure</li>
                <li>• Bring valid photo ID for all passengers</li>
                <li>• Show PNR at the counter to collect tickets</li>
                <li>• Check email for booking confirmation</li>
              </ul>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/my-tickets')}
                className="px-6 py-3 bg-[#295A55] text-white rounded-lg hover:bg-[#244D49]"
              >
                View My Tickets
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Book Another Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-[#295A55] mb-4"
          >
            <ArrowLeft size={20} />
            Back to Seat Selection
          </button>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Complete Your Booking</h1>
            <div className="text-gray-600">
              {bus.operator} • {bus.busNumber} • {selectedSeats.length} seat(s) selected
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Booking Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Passenger Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <User size={20} />
                Passenger Information
              </h2>
              
              <div className="space-y-6">
                {passengerInfo.map((passenger, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-700 mb-4">Passenger {index + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={passenger.name}
                          onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#295A55]/50"
                          placeholder="Enter full name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Age *
                        </label>
                        <input
                          type="number"
                          value={passenger.age}
                          onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#295A55]/50"
                          placeholder="Enter age"
                          min="1"
                          max="100"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Gender *
                        </label>
                        <select
                          value={passenger.gender}
                          onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#295A55]/50"
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ID Number (Optional)
                        </label>
                        <input
                          type="text"
                          value={passenger.idNumber}
                          onChange={(e) => handlePassengerChange(index, 'idNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#295A55]/50"
                          placeholder="NID/Passport Number"
                        />
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                      Seat: {selectedSeats[index]?.seatNumber} ({selectedSeats[index]?.type})
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Phone size={20} />
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    value={contactInfo.name}
                    onChange={(e) => handleContactChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#295A55]/50"
                    placeholder="Enter contact name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#295A55]/50"
                    placeholder="example@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => handleContactChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#295A55]/50"
                    placeholder="01XXXXXXXXX"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Contact
                  </label>
                  <input
                    type="tel"
                    value={contactInfo.emergencyContact}
                    onChange={(e) => handleContactChange('emergencyContact', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#295A55]/50"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard size={20} />
                Payment Method
              </h2>
              
              <div className="space-y-3">
                {[
                  { value: 'cash', label: 'Cash Payment', description: 'Pay at counter when boarding' },
                  { value: 'bkash', label: 'bKash', description: 'Mobile banking payment' },
                  { value: 'card', label: 'Credit/Debit Card', description: 'Online payment' },
                  { value: 'nagad', label: 'Nagad', description: 'Mobile banking payment' }
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                      paymentMethod === method.value
                        ? 'border-[#295A55] bg-[#295A55]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-[#295A55] focus:ring-[#295A55]"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{method.label}</div>
                      <div className="text-sm text-gray-500">{method.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Booking Summary</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700">Journey Details</h3>
                  <div className="mt-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Route:</span>
                      <span className="font-medium">{bus.route.from.city} → {bus.route.to.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span>{new Date(bus.departureTime).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span>{new Date(bus.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700">Bus Details</h3>
                  <div className="mt-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Operator:</span>
                      <span>{bus.operator}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bus Number:</span>
                      <span>{bus.busNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span>{bus.type}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700">Seat Selection</h3>
                  <div className="mt-2 space-y-1">
                    {selectedSeats.map((seat, index) => (
                      <div key={seat.seatNumber} className="flex justify-between text-sm">
                        <span>
                          Seat {seat.seatNumber} ({seat.type})
                          {passengerInfo[index]?.name && ` - ${passengerInfo[index].name}`}
                        </span>
                        <span>
                          ৳{Math.round((bus.discountPrice < bus.price ? bus.discountPrice : bus.price) * seat.priceMultiplier)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-[#295A55]">৳{totalPrice}</span>
                  </div>
                  {bus.discountPrice < bus.price && (
                    <div className="text-sm text-green-600 mt-1">
                      You save ৳{(bus.price - bus.discountPrice) * selectedSeats.length}
                    </div>
                  )}
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Shield size={18} className="text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-700">
                      <div className="font-medium">Secure Booking</div>
                      <div>Your payment and personal information are protected</div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleConfirmBooking}
                  disabled={loading}
                  className="w-full bg-linear-to-r from-[#295A55] to-[#3A7A72] text-white py-3 rounded-lg font-semibold hover:from-[#244D49] hover:to-[#346B64] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? 'Processing...' : 'Confirm Booking & Pay'}
                </button>
                
                <p className="text-xs text-gray-500 text-center">
                  By confirming, you agree to our Terms & Conditions and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;