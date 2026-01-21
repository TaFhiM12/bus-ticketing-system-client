// Login.jsx
import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Bus,
  Facebook,
  Github,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { NavLink, useLocation, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const { signInUser, signInWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const location = useLocation();
  const from = location.state?.from || "/";
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // In the handleSubmit function, update:
  const handleSubmit = (e) => {
    e.preventDefault();
    signInUser(formData.email, formData.password)
      .then((result) => {
        const user = result.user;
        console.log("Logged in user:", user);

        // Check for saved search data
        const savedSearchData = sessionStorage.getItem("busSearchData");
        const redirectPath =
          sessionStorage.getItem("redirectAfterLogin") || "/";

        if (savedSearchData && redirectPath === "/results") {
          const parsedData = JSON.parse(savedSearchData);
          // Navigate to results with saved search data
          navigate("/results", {
            state: parsedData,
            replace: true,
          });
        } else {
          navigate(from, { replace: true });
        }

        // Clear session storage
        sessionStorage.removeItem("busSearchData");
        sessionStorage.removeItem("redirectAfterLogin");
      })
      .catch((error) => {
        console.error("Login error:", error);
      });
  };

  // const handleGoogleSignIn = () => {
  //   signInWithGoogle()
  //     .then(result => {
  //       const user = result.user;
  //       console.log('Google signed in user:', user);
  //     })
  //     .catch(error => {
  //       console.error('Google sign-in error:', error);
  //     });
  // }

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
              Your Journey, Our Priority
            </p>
          </div>

          <div className="mt-auto">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-sm font-bold">✓</span>
                </div>
                <p className="text-lg">Secure & Fast Booking</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-sm font-bold">✓</span>
                </div>
                <p className="text-lg">Live Seat Availability</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-sm font-bold">✓</span>
                </div>
                <p className="text-lg">Real-time Tracking</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-sm font-bold">✓</span>
                </div>
                <p className="text-lg">24/7 Customer Support</p>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/20">
              <p className="text-sm opacity-80">
                &copy; 2024 Bus Vara. All rights reserved.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
              Welcome Back
            </h2>
            <p className="text-gray-600 mt-2">Login to continue your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="admin@gmail.com"
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
                  placeholder="••••••••"
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#295A55] focus:ring-[#295A55] border-gray-300 rounded"
                />
                <label className="ml-2 text-gray-700 text-sm">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-[#295A55] hover:text-[#244D49] font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-linear-to-r from-[#295A55] to-[#3A7A72] text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg hover:from-[#244D49] hover:to-[#346B64] active:from-[#1F443F] active:to-[#2D5D57] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#295A55]/25 flex items-center justify-center gap-2 sm:gap-3 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#295A55]"
            >
              Login
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
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <button
              type="button"
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

          {/* Signup Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <NavLink
                to="/signup"
                className="text-[#295A55] hover:text-[#244D49] font-semibold"
              >
                Sign up
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
