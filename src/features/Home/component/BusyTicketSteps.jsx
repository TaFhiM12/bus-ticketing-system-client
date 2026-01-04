import { Search, Bus, CreditCard, CheckCircle } from 'lucide-react';
import React from 'react';

const BusyTicketSteps = () => {
  const steps = [
    {
      step: 1,
      icon: Search,
      title: "Search",
      description: "Enter your travel details to find available buses.",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
      borderColor: "border-blue-200"
    },
    {
      step: 2,
      icon: Bus,
      title: "Select Your Bus",
      description: "Choose from a variety of buses that fit your schedule and budget.",
      color: "text-[#295A55]",
      bgColor: "bg-[#295A55]/5",
      iconColor: "text-[#295A55]",
      borderColor: "border-[#295A55]/20"
    },
    {
      step: 3,
      icon: CreditCard,
      title: "Book and Pay",
      description: "Complete your booking with our secure payment options.",
      color: "text-green-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-500",
      borderColor: "border-green-200"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 my-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Buy Tickets in <span className="text-[#295A55]">3 Easy Steps</span>
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Get your bus tickets quickly and securely with our simple booking process
        </p>
      </div>

      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute top-12 left-0 right-0 h-0.5 bg-gray-200 hidden md:block">
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-r from-blue-400 via-[#295A55] to-green-400 transform scale-x-100"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div 
              key={step.step}
              className="relative flex flex-col items-center text-center group"
            >
              {/* Step Number with Animation */}
              <div className={`relative z-10 mb-6 ${step.bgColor} ${step.borderColor} border-2 rounded-full p-3 w-20 h-20 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border-2 border-white flex items-center justify-center">
                  <span className={`text-sm font-bold ${step.color}`}>{step.step}</span>
                </div>
                <step.icon className={`w-10 h-10 ${step.iconColor}`} />
              </div>

              {/* Step Content */}
              <div className="flex-1">
                <h3 className={`text-xl font-bold ${step.color} mb-3`}>
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Step Indicator for Mobile */}
              <div className="md:hidden mt-6">
                {index < steps.length - 1 && (
                  <div className="w-0.5 h-12 mx-auto bg-linear-to-b from-gray-300 to-transparent"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusyTicketSteps;