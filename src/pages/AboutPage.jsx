import React from 'react';
import { Bus } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#295A55]/10 mb-6">
                        <Bus className="w-10 h-10 text-[#295A55]" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        About <span className="text-[#295A55]">BUS VARA</span>
                    </h1>
                    <div className="w-20 h-1 bg-[#295A55] mx-auto rounded-full"></div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
                    <div className="prose prose-lg max-w-none">
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Welcome to BUS VASA, your trusted partner in comfortable and convenient bus travel!
                        </p>
                        
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Founded and managed by our dedicated team, BUS VASA is committed to providing a seamless 
                            and reliable ticket booking experience for travelers across the region.
                        </p>
                        
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Our platform allows passengers to book their bus tickets online quickly and effortlessly, 
                            ensuring a stress-free start to their journey. With a focus on safety, punctuality, and 
                            customer satisfaction, BUS VASA is here to enhance your travel experience with quality 
                            service and affordable fares.
                        </p>
                        
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Whether you're planning a short trip or a longer journey, we make it easy to find the 
                            right options to suit your schedule and budget.
                        </p>
                        
                        <p className="text-gray-700 leading-relaxed">
                            Thank you for choosing BUS VASA. We look forward to being a part of your travels!
                        </p>
                    </div>
                </div>

                {/* Simple Contact Info */}
                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-2 text-[#295A55] font-medium">
                        <span>✉️</span>
                        <span>support@busvasa.com</span>
                        <span className="mx-4">|</span>
                        <span>📞</span>
                        <span>+880 1234 567890</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;