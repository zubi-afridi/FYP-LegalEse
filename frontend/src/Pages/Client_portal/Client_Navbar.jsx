import React, { useEffect, useState } from "react";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { Link } from "react-router-dom";
const Client_Navbar = () => {
  let username = localStorage.getItem("username");
  const [toggleHamburger, setToggleHamburger] = useState(false);
  const handleToggleHamburger = () => {
    setToggleHamburger(!toggleHamburger);
  };
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("login");
  };
  return (
    <nav className={`bg-white dark:bg-gray-900 border-b border-gray-300`}>
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto py-4 px-6">
        <Link to="/" className="flex ms-2 md:me-24">
          <img
            src="\src\assets\logo.svg"
            className="h-8 me-3"
            alt="FlowBite Logo"
          />
          <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
            LegalEse
          </span>
        </Link>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
          onClick={handleToggleHamburger}
            data-collapse-toggle="navbar-user"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-user"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className={`${!toggleHamburger ? "hidden" : ""} items-center justify-between w-full md:flex md:w-auto md:order-2`}
          id="navbar-user"
        >
          <ul className="flex fixed z-40 w-full flex-col font-medium p-4 md:p-0 md:static mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
            <Link
                    to={`/Client/${username}/Explore`}
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Explore
                  </Link>
            </li>
            <li>
              <Link
                to={`/Client/${username}/Appoinments`}
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Appoinments
              </Link>
            </li>
            <li>
              <Link
                to={`/Client/${username}/Cases`}
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Cases
              </Link>
            </li>
            <li>
            <Link
                    to="/ChangePassword"
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Change Password
                  </Link>
            </li>
            <li>
            <Link
                    onClick={() => {
                      handleLogout();
                    }}
                    to="/login"
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Logout
                  </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Client_Navbar;
