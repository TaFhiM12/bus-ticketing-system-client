// Signup.jsx
import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Bus,
  User,
  Facebook,
  Github,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { NavLink } from "react-router";
import useAuth from "../../hooks/useAuth";
import { useEffect } from "react";

const API_URL = "http://localhost:5001";

const Signup = () => {
  const { createUser, signInWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  useEffect(() => {
      document.title = "BUS VARA | Sign Up";
    }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, agreeToTerms } = formData;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!agreeToTerms) {
      alert("You must agree to the terms and conditions!");
      return;
    }

    try {
      // ✅ Firebase Create User
      const userCredential = await createUser(email, password);
      const user = userCredential.user;

      // ✅ Send user data to MongoDB
      const res = await fetch(`${API_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          name,
          email,
        }),
      });

      // Check if response is OK
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (!data.success) {
        // console.log("Registration failed:", data);
        alert(data.error || "User registration failed");
        return;
      }

      // console.log("✅ Registered in MongoDB:", data.user);
      alert("Account created successfully ✅");

      // Optional: Redirect to login or home page
      // window.location.href = "/login";
    } catch (error) {
      console.error("Signup error:", error);

      // More specific error messages
      if (error.message.includes("Failed to fetch")) {
        alert(
          "Cannot connect to server. Please check if the server is running.",
        );
      } else if (error.message.includes("HTTP error")) {
        alert(`Server error: ${error.message}`);
      } else {
        alert(error.message || "Signup failed. Please try again.");
      }
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-white">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side - Project Name & Branding */}
        <div className="lg:w-1/2 bg-linear-to-br from-[#1a3c38] via-[#295A55] to-[#3A7A72] p-8 sm:p-12 lg:p-16 flex flex-col justify-center text-white">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <Bus size={32} />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold">Bus Vara</h1>
            </div>
            <p className="text-xl sm:text-2xl font-medium opacity-90">
              Start Your Journey With Us
            </p>
          </div>

          <div className="">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-sm font-bold">✓</span>
                </div>
                <p className="text-lg">Instant Booking Confirmation</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-sm font-bold">✓</span>
                </div>
                <p className="text-lg">Multiple Payment Options</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-sm font-bold">✓</span>
                </div>
                <p className="text-lg">Exclusive Member Discounts</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-sm font-bold">✓</span>
                </div>
                <p className="text-lg">Easy Ticket Management</p>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/20">
              <p className="text-sm opacity-80">
                &copy; 2024 Bus Vara. All rights reserved.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
              Create Account
            </h2>
            <p className="text-gray-600 mt-2">
              Join us for a seamless travel experience
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#295A55]/50 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={20} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#295A55]/50 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#295A55]/50 focus:border-transparent transition-all"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff
                      size={20}
                      className="text-gray-400 hover:text-gray-600"
                    />
                  ) : (
                    <Eye
                      size={20}
                      className="text-gray-400 hover:text-gray-600"
                    />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#295A55]/50 focus:border-transparent transition-all"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff
                      size={20}
                      className="text-gray-400 hover:text-gray-600"
                    />
                  ) : (
                    <Eye
                      size={20}
                      className="text-gray-400 hover:text-gray-600"
                    />
                  )}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="h-4 w-4 mt-1 text-[#295A55] focus:ring-[#295A55] border-gray-300 rounded"
                required
              />
              <label className="ml-2 text-gray-700 text-sm">
                I agree to the{" "}
                <button
                  type="button"
                  className="text-[#295A55] hover:text-[#244D49] font-medium"
                >
                  Terms and Conditions
                </button>
              </label>
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#295A55] to-[#3A7A72] text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg hover:from-[#244D49] hover:to-[#346B64] active:from-[#1F443F] active:to-[#2D5D57] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#295A55]/25 flex items-center justify-center gap-2 sm:gap-3 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#295A55] mt-2"
            >
              Create Account
              <ArrowRight size={20} />
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or sign up with
                </span>
              </div>
            </div>
          </div>

          {/* Social Signup Buttons */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={async () => {
                try {
                  const userCredential = await signInWithGoogle();
                  const user = userCredential.user;

                  // register to DB
                  await fetch(`${API_URL}/api/users/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      uid: user.uid,
                      name: user.displayName || "Google User",
                      email: user.email,
                      photoURL: user.photoURL,
                    }),
                  });

                  alert("Google signup successful ✅");
                } catch (err) {
                  // console.log(err);
                  alert(err.message);
                }
              }}
              className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <FcGoogle className="w-5 h-5" />
            </button>

            <button
              type="button"
              className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Facebook size={20} className="text-[#1877F2]" />
            </button>
            <button
              type="button"
              className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Github size={20} className="text-gray-800" />
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <NavLink
                to="/login"
                className="text-[#295A55] hover:text-[#244D49] font-semibold"
              >
                Login
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
