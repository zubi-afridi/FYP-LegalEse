import React, { useState } from "react";
import { MdHome } from "react-icons/md";
import { FaHandshake } from "react-icons/fa";
import { ImHammer2 } from "react-icons/im";
import { LuCalendarDays } from "react-icons/lu";
import { Link} from "react-router-dom";
const Lawyer_Sidebar = ({ toggleSidebar, handleToggleSidebar }) => {
  let username = localStorage.getItem("username");
  const [toggleAppoinmentDropdown, setToggleAppoinmentDropdown] =
    useState(true);
  const handleToggleAppoinmentDropdown = () => {
    setToggleAppoinmentDropdown(!toggleAppoinmentDropdown);
  };
  return (
    <div>
      {/* Sidebar */}
      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-30 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-300 xl:translate-x-0 ${
          toggleSidebar ? "translate-x-[-100%]" : "translate-x-0"
        } `}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                onClick={handleToggleSidebar}
                to={`/Lawyer/${username}/Dashbord`}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <MdHome
                  size={25}
                  className="text-gray-500 transition duration-75 group-hover:text-black"
                />
                <span className="ms-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                onClick={handleToggleSidebar}
                to={`/Lawyer/${username}/Manage_Clients`}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FaHandshake
                  size={25}
                  className="text-gray-500 transition duration-75 group-hover:text-black"
                />
                <span className="flex-1 ms-3 whitespace-nowrap">Clients</span>
              </Link>
            </li>
            <li>
              <Link
              to={`/Lawyer/${username}/Manage_Cases`}
                onClick={handleToggleSidebar}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <ImHammer2
                  size={25}
                  className="text-gray-500 transition duration-75 group-hover:text-black"
                />
                <span className="flex-1 ms-3 whitespace-nowrap">Cases</span>
              </Link>
            </li>
            <li>
              <button
                onClick={handleToggleAppoinmentDropdown}
                type="button"
                className="flex items-center p-2 w-full text-base font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                aria-controls="dropdown-pages"
                data-collapse-toggle="dropdown-pages"
              >
                <LuCalendarDays
                  size={25}
                  className="text-gray-500 transition duration-75 group-hover:text-black"
                />
                <span className="flex-1 ml-3 text-left whitespace-nowrap">
                  Appoinments
                </span>
                <svg
                  aria-hidden="true"
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
              <ul
                id="dropdown-pages"
                className={`${
                  toggleAppoinmentDropdown ? "hidden" : "block"
                } py-2 space-y-2`}
              >
                <li>
                  <Link
                    onClick={handleToggleSidebar}
                    to={`/Lawyer/${username}/Manage_appoinments`}
                    className="flex items-center p-2 pl-11 w-full text-base font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                    Manage Appoinments
                  </Link>
                </li>
                <li>
                  <Link
                   to={`/Lawyer/${username}/Appoinments_Request`}
                    onClick={handleToggleSidebar}
                    className="flex items-center p-2 pl-11 w-full text-base font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                    Appoinments Request
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Lawyer_Sidebar;
