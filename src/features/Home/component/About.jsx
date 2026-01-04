import React from "react";
import { CheckCircle } from "lucide-react";

const About = () => {
  const benefits = [
    "Easy online booking in 3 simple steps",
    "Secure payment with multiple options",
    "Real-time seat availability",
    "Instant e-ticket confirmation",
    "24/7 customer support",
    "Best price guarantee"
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 my-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          About <span className="text-[#295A55]">Bus Vara</span>
        </h2>
        <div className="w-20 h-1 bg-[#295A55] mx-auto mb-6 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="mb-8">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Bus Vara is a modern bus ticket booking platform designed to make your
              travel simple, fast, and hassle-free. We help passengers find the best
              bus routes, compare prices, and book tickets online in just a few
              clicks.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              With reliable operators, secure payments, and real-time seat
              availability, Bus Vara ensures a smooth and comfortable journey every
              time. Our mission is to revolutionize bus travel by making it more
              accessible, reliable, and convenient for everyone.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-10">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#295A55] mt-1 flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#295A55] rounded-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6">Our Mission</h3>
          <p className="text-white/90 leading-relaxed mb-6">
            To provide a seamless, reliable, and affordable bus ticket booking 
            experience that connects people across Bangladesh with comfort and safety.
          </p>
          
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center p-4 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">99%</div>
              <div className="text-sm text-white/80 mt-1">Satisfaction</div>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">5 Min</div>
              <div className="text-sm text-white/80 mt-1">Avg. Booking Time</div>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">50+</div>
              <div className="text-sm text-white/80 mt-1">Bus Partners</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;