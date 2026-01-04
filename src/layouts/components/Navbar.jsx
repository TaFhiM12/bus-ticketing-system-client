import React from "react";
import { NavLink } from "react-router";

const Navbar = () => {
  const links = (
    <>
      <li><NavLink>Home</NavLink></li>
      <li><NavLink>My Ticket</NavLink></li>
      <li><NavLink>Contact</NavLink></li>
      <li><NavLink>About</NavLink></li>
    </>
  );
  return (
    <div className="navbar bg-[#295A55] shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content text-white rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {links}
          </ul>
        </div>
        <a className="btn btn-ghost text-xl text-white">Bus Ticket</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-white">
          {links}
        </ul>
      </div>
      <div className="navbar-end">
        <NavLink className="btn text-[#295A55]">Login</NavLink>
      </div>
    </div>
  );
};

export default Navbar;
