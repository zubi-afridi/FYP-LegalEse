import React, { useEffect,useState } from "react";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firestore";
const Lawyer_Navbar = ({handleToggleSidebar }) => {
  let username = localStorage.getItem("username");
  const [toggleProfileDropdown, setToggleProfileDropdown] = useState(true);
  const [userImg, setUserImg] = useState();
  const handleToggleProfileDropdown = () => {
    setToggleProfileDropdown(!toggleProfileDropdown);
  };
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("login");
  };

  const getUserDetails = async () => {
    const q = query(collection(db, "users"), where("username", "==", username));
    const querySnapshot = await getDocs(q);
    const userDetails = querySnapshot.docs.map((doc) => ({id: doc.id,...doc.data(),
    }));

    const data = userDetails[0];
    if (data.profile.profile_img) {
      setUserImg(data.profile.profile_img);
    }
  };
  useEffect(() => {
    getUserDetails()
  }, []);
  return (
    <div>
      <div className="flex justify-end w-full">
        {/* Navbar */}
        <nav className="fixed top-0 z-40 w-full bg-white border-b border-gray-300 dark:bg-gray-800 dark:border-gray-700">
          <div className="px-3 py-3 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-start rtl:justify-end self-start">
                <button
                  onClick={handleToggleSidebar}
                  data-drawer-target="logo-sidebar"
                  data-drawer-toggle="logo-sidebar"
                  aria-controls="logo-sidebar"
                  type="button"
                  className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg xl:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                >
                  <HiOutlineMenuAlt2 size={25} />
                </button>
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
              </div>
              <div className="flex items-end flex-col">
                <div>
                  <button
                    onClick={handleToggleProfileDropdown}
                    type="button"
                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    aria-expanded="false"
                    data-dropdown-toggle="dropdown-user"
                  >
                    {userImg ? (
                      <img
                        className="w-8 h-8 object-cover object-top rounded-full"
                        src={userImg}
                        alt="user photo"
                      />
                    ) : (
                      <img
                        className="w-8 h-8 object-cover object-top rounded-full"
                        src="/src/assets/profile_img.jpg"
                        alt="user photo"
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Profile Dropdown */}
        <div
          id="dropdown"
          className={`${
            toggleProfileDropdown ? "hidden" : "block"
          } z-50 mt-16 mr-4 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 fixed top-0 right-0`}
        >
          <div className="flex justify-center">
            <ul
              className="py-2 px-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownDefaultButton"
            >
              <li>
                <Link
                  onClick={handleToggleProfileDropdown}
                  to={`/Lawyer/${username}/Profile`}
                  className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Profile Settings
                </Link>
              </li>
              <li>
                <Link
                  onClick={handleToggleProfileDropdown}
                  to="/ChangePassword"
                  className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Change Password
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => {
                    handleToggleProfileDropdown();
                    handleLogout();
                  }}
                  to="/login"
                  className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lawyer_Navbar;
