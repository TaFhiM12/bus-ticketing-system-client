import React, { useState, useEffect } from "react";
import HeroSearchForm from "../../hero/HeroSearchForm";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 4;
  
  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle slide change
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };
  
  // Carousel images - using placeholder service
  const carouselImages = [
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920&h=1080&fit=crop'
  ];
  
  return (
    <div className="relative min-h-screen">
      {/* Carousel Container */}
      <div className="relative h-[90vh] md:h-[85vh] lg:h-[90vh] overflow-hidden">
        <div className="relative w-full h-full">
          {carouselImages.map((image, index) => (
            <div 
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ${
                currentSlide === index ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={image}
                alt={`Bus travel slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
            </div>
          ))}
        </div>

        {/* Search Form - Responsive Positioning */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pt-16 md:pt-20 lg:pt-24 px-2 sm:px-4">
          <HeroSearchForm />
        </div>
      </div>

      {/* Indicators Section - Outside and Below Carousel */}
      <div className="relative py-2 bg-gray-50">
        <div className="flex justify-center items-center space-x-1 sm:space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="group flex flex-col items-center px-1 sm:px-2 py-1 rounded-lg hover:bg-white/5 transition-all duration-300"
              aria-label={`Go to slide ${index + 1}`}
            >
              {/* Indicator Bar */}
              <div className="relative">
                <div className={`
                  h-1 sm:h-1.5 rounded-full transition-all duration-500 ease-out
                  ${currentSlide === index 
                    ? 'w-8 sm:w-10 md:w-12 bg-gradient-to-r from-[#295A55] to-[#3A7D72] shadow-lg shadow-[#295A55]/50' 
                    : 'w-3 sm:w-4 bg-gray-400 group-hover:w-6 sm:group-hover:w-8 md:group-hover:w-10 group-hover:bg-gray-500'
                  }
                `}>
                  {/* Animated Progress Bar */}
                  {currentSlide === index && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-transparent rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;