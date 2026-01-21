import React from "react";
import { NavLink, useNavigate } from "react-router";
import { Bus, Ticket, Phone, User, Home, Info } from "lucide-react";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const { user , logOut } = useAuth();
  const navigate = useNavigate();
  const links = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/my-tickets', label: 'My Tickets', icon: Ticket },
    { path: '/contact', label: 'Contact', icon: Phone },
    { path: '/about', label: 'About', icon: Info }
  ];

  const handleSignOut = () => {
    logOut()
      .then(() => {
        // Sign-out successful.
        navigate('/login');
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  }

  return (
    <div className="bg-[#295A55] shadow-lg fixed top-0 left-0 right-0 z-50">
      <nav className="navbar max-w-7xl mx-auto px-4 ">
      <div className="navbar-start">
        {/* Mobile Menu Button */}
        <div className="dropdown lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost text-white hover:bg-white/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-lg dropdown-content bg-[#295A55] text-white rounded-box z-100 mt-3 w-64 p-4 shadow-2xl border border-white/10"
          >
            {links.map((link) => (
              <li key={link.path} className="my-1">
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 text-lg px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-white text-[#295A55] font-semibold' 
                        : 'hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </NavLink>
              </li>
            ))}
            
          </ul>
        </div>

        {/* Logo */}
        <div className=" items-center gap-3 ml-4">
        
          <span className="text-2xl font-bold text-white hidden sm:block">
            BUS <span className="text-cyan-200">VARA</span>
          </span>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-2 px-1">
          {links.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-5 py-3 rounded-lg text-white font-medium transition-all duration-300 relative group ${
                    isActive 
                      ? 'bg-white/20 shadow-lg' 
                      : 'hover:bg-white/10 hover:shadow-md'
                  }`
                }
              >
                <link.icon className="w-5 h-5" />
                {link.label}
                
                {/* Active Indicator */}
                {({ isActive }) => isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-1 bg-cyan-300 rounded-full"></div>
                )}
                
                {/* Hover Indicator */}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-cyan-300 rounded-full transition-all duration-300 group-hover:w-3/4"></div>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Side */}
      <div className="navbar-end mr-4">
        {/* Login Button - Desktop */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <button 
              onClick={handleSignOut}
              className="btn btn-sm bg-white text-[#295A55] hover:bg-gray-100 px-4 flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              SignOut
            </button>
          ) : (
            <NavLink 
              to="/login"
              className="btn btn-sm bg-white text-[#295A55] hover:bg-gray-100 px-4"
            >
              Login
            </NavLink>
          )}
        </div>

        {/* Login Button - Mobile */}
        <div className="lg:hidden">
          {user ? (
            <button 
              onClick={handleSignOut}
              className="btn btn-sm bg-white text-[#295A55] hover:bg-gray-100 px-4 flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              SignOut
            </button>
          ) : (
            <NavLink 
              to="/login"
              className="btn btn-sm bg-white text-[#295A55] hover:bg-gray-100 px-4"
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
    </div>
  );
};

export default Navbar;