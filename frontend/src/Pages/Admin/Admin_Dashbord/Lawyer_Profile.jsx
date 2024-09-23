import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Profile_Preview from "../../Lawyer_Portal/Profile/Profile_Preview";
import Admin_Navbar from "../Admin_Navbar";
import Manage_Clients from "../../Lawyer_Portal/Clients/Manage_Clients";
import Manage_appoinments from "../../Lawyer_Portal/Appoinments/Manage_appoinments";
import Manage_Cases from "../../Lawyer_Portal/Cases/Manage_Cases";
const Lawyer_Profile = () => {
  const [showPage, setShowPage] = useState("profile");
  return (
    <div>
      <Admin_Navbar />
      <div className="w-full pt-6">
        <ul className="flex w-full font-medium items-center justify-center md:justify-start p-6 gap-5 md:gap-10 border-b border-gray-300">
          <li>
            <Link
              onClick={() => setShowPage("profile")}
              className="block text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
            >
              Profile
            </Link>
          </li>
          <li>
            <Link
              onClick={() => setShowPage("clients")}
              className="block text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
            >
              Clients
            </Link>
          </li>
          <li>
            <Link
              onClick={() => setShowPage("cases")}
              className="block  text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
            >
              Cases
            </Link>
          </li>
          <li>
            <Link
              onClick={() => setShowPage("appoinments")}
              className="block text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
            >
              Appoinments
            </Link>
          </li>
        </ul>
        {showPage === "profile" ? <Profile_Preview /> : ""}
        <div className="w-full p-6">
          {showPage === "clients" ? <Manage_Clients /> : ""}
          {showPage === "cases" ? <Manage_Cases/> : ""}
          {showPage === "appoinments" ? <Manage_appoinments/> : ""}
        </div>
      </div>
    </div>
  );
};

export default Lawyer_Profile;
