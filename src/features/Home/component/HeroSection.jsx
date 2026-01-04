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
    <div className="relative min-h-screen ">
      <div className="relative h-[90vh] overflow-hidden">
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
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-transparent"></div>
            </div>
          ))}
        </div>

        <div className="absolute inset-0 flex items-center justify-center z-10 pt-24">
          <HeroSearchForm />
        </div>
      </div>

      {/* Indicators Section - Outside and Below Carousel */}
      <div className="relative py-2">
        <div className="flex justify-center items-center">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="group flex flex-col items-center  px-1 rounded-lg hover:bg-white/5 transition-all duration-300"
              aria-label={`Go to slide ${index + 1}`}
            >
              {/* Indicator Bar */}
              <div className="relative">
                <div className={`
                  h-1 rounded-full transition-all duration-500 ease-out
                  ${currentSlide === index 
                    ? 'w-10 bg-linear-to-r from-[#295A55] to-[#3A7D72] shadow-lg shadow-[#295A55]/50' 
                    : 'w-3 bg-gray-500 group-hover:w-12 group-hover:bg-gray-400'
                  }
                `}>
                  {/* Animated Progress Bar */}
                  {currentSlide === index && (
                    <div className="absolute inset-0 bg-linear-to-r from-white/50 to-transparent rounded-full animate-pulse"></div>
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