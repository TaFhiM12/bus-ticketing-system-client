import React from 'react';
import { Send, Mail, Phone, MapPin } from 'lucide-react';

const ContactPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#295A55]/10 mb-6">
                        <Mail className="w-10 h-10 text-[#295A55]" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Contact <span className="text-[#295A55]">Us</span>
                    </h1>
                    <p className="text-gray-600 text-lg mb-4">
                        Thank you for reaching us! We are always happy to hear from you.
                    </p>
                    <div className="w-20 h-1 bg-[#295A55] mx-auto rounded-full"></div>
                </div>

                {/* Contact Form */}
                <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
                    <form className="space-y-6">
                        {/* Name and City Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-gray-700 font-medium">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#295A55] focus:ring-2 focus:ring-[#295A55]/20 transition-all duration-300"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-gray-700 font-medium">
                                    Your City
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your city"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#295A55] focus:ring-2 focus:ring-[#295A55]/20 transition-all duration-300"
                                />
                            </div>
                        </div>

                        {/* Phone and Email Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-gray-700 font-medium">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#295A55] focus:ring-2 focus:ring-[#295A55]/20 transition-all duration-300"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-gray-700 font-medium">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#295A55] focus:ring-2 focus:ring-[#295A55]/20 transition-all duration-300"
                                />
                            </div>
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                            <label className="text-gray-700 font-medium">
                                Your Message
                            </label>
                            <textarea
                                rows={5}
                                placeholder="Tell us how we can help you..."
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#295A55] focus:ring-2 focus:ring-[#295A55]/20 transition-all duration-300 resize-none"
                            />
                        </div>

                        {/* Send Button */}
                        <button
                            type="submit"
                            className="w-full bg-linear-to-r from-[#295A55] to-[#3A7A72] text-white py-4 rounded-lg font-semibold text-lg hover:from-[#244D49] hover:to-[#346B64] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
                        >
                            <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            Send Message
                        </button>
                    </form>
                </div>

                {/* Simple Contact Info */}
                <div className="mt-12 text-center space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg shadow-sm">
                            <div className="w-12 h-12 rounded-full bg-[#295A55]/10 flex items-center justify-center">
                                <Phone className="w-6 h-6 text-[#295A55]" />
                            </div>
                            <span className="text-gray-700 font-medium">Phone</span>
                            <span className="text-[#295A55]">+880 1234-567890</span>
                        </div>
                        
                        <div className="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg shadow-sm">
                            <div className="w-12 h-12 rounded-full bg-[#295A55]/10 flex items-center justify-center">
                                <Mail className="w-6 h-6 text-[#295A55]" />
                            </div>
                            <span className="text-gray-700 font-medium">Email</span>
                            <span className="text-[#295A55]">support@busvara.com</span>
                        </div>
                        
                        <div className="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg shadow-sm">
                            <div className="w-12 h-12 rounded-full bg-[#295A55]/10 flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-[#295A55]" />
                            </div>
                            <span className="text-gray-700 font-medium">Location</span>
                            <span className="text-[#295A55]">Dhaka, Bangladesh</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;