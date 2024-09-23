import React, { useState, useEffect } from "react";
import Client_Navbar from "../Client_Navbar";
import Profile_Card from "./Profile_Card";
import Specialization_List from "../../../Array_json_Files/Specialization_List.json";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firestore";

const Explore_Profile = () => {
  const [profileData, setProfileData] = useState([]);
  const [records, setRecords] = useState([]);
  const [showAvaliable, setShowAvaliable] = useState(true);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const getLawyerProfile = async () => {
    try {
      const q = query(collection(db, "users"), where("role", "==", "lawyer"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProfileData(data.filter((obj) => obj.hasOwnProperty("profile")));
      setRecords(data.filter((obj) => obj.hasOwnProperty("profile")));
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLawyerProfile();
  }, []);

  const handleShowAvaliable = () => {
    setShowAvaliable(!showAvaliable);
    if (showAvaliable === true) {
      setProfileData(
        profileData.filter((obj) => obj.profile.availability === "available")
      );
      return;
    } else if (showAvaliable === false) {
      setProfileData(records);
    }
  };

  const searchFilter = (event) => {
    setProfileData(
      records.filter((obj) =>
        obj.profile.name.toLowerCase().includes(event.target.value)
      )
    );
  };

  const handleSpecialization = (specializationLabel) => {
    setProfileData(
      records.filter((obj) =>
        obj.profile.specialization.includes(specializationLabel)
      )
    );
  };
  const handleToggleDropdown = () => {
    setToggleDropdown(!toggleDropdown);
  };

  return (
    <>
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center">
        <img className="w-12" src="/src/assets/blockspinner.svg" alt="" />
      </div>
      ) : (
        <div>
      <Client_Navbar />
          <div className=" w-full grid lg:grid-cols-2 p-6 pb-0 mt-3">
            <form className="">
              <div className="flex">
                <div className="relative w-full">
                  <input
                    type="search"
                    id="search-dropdown"
                    className="block p-2.5 w-full ps-12 z-20 text-sm text-gray-900 bg-gray-50 rounded-s-lg border-e-gray-50 border-e-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                    placeholder="Search Name"
                    required
                    onChange={searchFilter}
                  />
                  <button
                    disabled
                    className="absolute top-0 start-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-s-lg border border-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    <svg
                      className="w-4 h-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                    <span className="sr-only">Search</span>
                  </button>
                </div>
                <div className="relative">
                  <button
                    onClick={handleToggleDropdown}
                    id="dropdown-button"
                    data-dropdown-toggle="dropdown"
                    className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-e-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
                    type="button"
                  >
                    Specialization
                    <svg
                      className="w-2.5 h-2.5 ms-2.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  </button>
                  <div
                    id="dropdown"
                    className={`${
                      toggleDropdown ? "" : "hidden"
                    } absolute right-0 w-80 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700`}
                  >
                    <ul
                      className="py-2 text-sm text-gray-700 grid grid-cols-2 dark:text-gray-200"
                      aria-labelledby="dropdown-button"
                    >
                      {Specialization_List.map((specialization) => (
                        <li key={specialization.id}>
                          <button
                            onClick={() => {
                              handleSpecialization(specialization.label);
                              handleToggleDropdown();
                            }}
                            type="button"
                            className="inline-flex w-full px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            {specialization.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </form>
            <div className="flex justify-end items-center">
              <label className="inline-flex mt-2 items-center mb-5 cursor-pointer">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  onClick={handleShowAvaliable}
                />
                <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Available
                </span>
              </label>
            </div>
          </div>
          {Object.keys(profileData).length !== 0 ? (
            <Profile_Card profileData={profileData} />
          ) : (
            <div className="text-3xl text-center mt-8">Not Found</div>
          )}
        </div>
      )}
    </>
  );
};

export default Explore_Profile;
