import React from "react";
import { Link, useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate=useNavigate()
  const setRole=()=>{
    sessionStorage.setItem("userRole", "client");
    navigate('/signup')
  }
  return (
    <div>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-10 py-4">
          <Link
            to="/"
            className="flex items-center space-x-2 rtl:space-x-reverse"
          >
            <img
              src="src\assets\logo.svg"
              className="h-8"
              alt="LegalEse Logo"
            />
            <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-white">
              LegalEse
            </span>
          </Link>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse md:gap-3">
            <Link to="/Login">
              <button
                type="button"
                className="text-black hover:text-white border border-black hover:bg-gray-800 hover:border-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Login
              </button>
            </Link>
          
              <button
              onClick={setRole}
                type="button"
                className="text-white hidden sm:flex bg-black hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Signup
              </button>
              
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
