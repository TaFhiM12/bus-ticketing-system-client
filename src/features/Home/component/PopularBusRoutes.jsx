import React from 'react';
import { ArrowRight } from 'lucide-react';
import { popularroutes } from '../../../assets/data/popularRoutesData';

const PopularBusRoutes = () => {
    return (
        <div className='max-w-7xl mx-auto px-4 mt-20'>
            {/* Header */}
            <div className='text-center mb-12'>
                <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-3 animate-fade-in'>
                    Popular <span className='text-[#295A55]'>Bus Routes</span>
                </h2>
                <p className='text-gray-600 text-lg max-w-2xl mx-auto animate-fade-in animation-delay-100'>
                    Most traveled routes with best prices
                </p>
                <div className='w-20 h-1 bg-[#295A55] mx-auto mt-4 rounded-full animate-grow-width animation-delay-200'></div>
            </div>

            {/* Route Cards Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {popularroutes.map((route, index) => (
                    <div 
                        key={index} 
                        className="group relative h-64 rounded-xl overflow-hidden shadow-lg cursor-pointer animate-slide-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
                            <img 
                                src={route.image} 
                                alt={route.destination} 
                                className="w-full h-full object-cover"
                            />
                            {/* Gradient Overlays */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-black/10 to-black/60"></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/70"></div>
                        </div>

                        {/* Content Overlay - Bottom Left */}
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                            <div className="flex items-end justify-between">
                                {/* Left Content */}
                                <div className="transform transition-transform duration-300 group-hover:translate-x-2">
                                    <h3 className="text-2xl font-bold text-white mb-2 transition-all duration-300 group-hover:text-white/90">
                                        {route.destination}
                                    </h3>
                                    <div className="text-white/80 mb-1 flex items-center gap-2 transition-all duration-300 group-hover:text-white">
                                        <span>Bus Ticket</span>
                                        <ArrowRight size={16} className="opacity-70 transition-transform duration-300 group-hover:translate-x-1" />
                                    </div>
                                </div>

                                {/* Right Content */}
                                <div className="transform transition-all duration-300 group-hover:translate-x-[-8px]">
                                    <div className="text-3xl font-bold text-white drop-shadow-lg transition-all duration-300 group-hover:text-[#295A55]">
                                        {route.price}
                                    </div>
                                    <div className="text-white/70 text-sm mt-1 transition-all duration-300 group-hover:text-white">
                                        {route.duration}
                                    </div>
                                </div>
                            </div>

                            {/* Hover Indicator Line */}
                            <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#295A55] to-cyan-400 rounded-full w-0 transition-all duration-400 group-hover:w-full"></div>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#295A55]/0 to-transparent transition-all duration-300 group-hover:from-[#295A55]/20"></div>

                        {/* Glow Effect on Hover */}
                        <div className="absolute inset-0 rounded-xl ring-2 ring-transparent transition-all duration-300 group-hover:ring-4 group-hover:ring-[#295A55]/30 group-hover:shadow-2xl group-hover:shadow-[#295A55]/20"></div>

                        {/* Click Pulse Effect */}
                        <div className="absolute inset-0 rounded-xl opacity-0 group-active:opacity-100 group-active:animate-ping-slow group-active:bg-[#295A55]/20"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PopularBusRoutes;