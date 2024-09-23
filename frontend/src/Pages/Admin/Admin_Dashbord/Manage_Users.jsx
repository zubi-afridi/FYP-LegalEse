import React, { useEffect, useState } from "react";
import { FaRegTrashAlt, FaUser } from "react-icons/fa";
import { LuCalendarDays } from "react-icons/lu";
import { Link } from "react-router-dom";
import Admin_Navbar from "../Admin_Navbar";
import {
  collection,
  doc,
  getDocs,
  deleteDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../../firestore";
const Manage_Users = () => {
  const [data, setData] = useState([]);
  const [records, setRecords] = useState([]);
  const [roleRecords, setRoleRecords] = useState([]);
  const [hideLawyerTable, setHideLawyerTable] = useState(false);
  const [loading, setLoading] = useState(true);
  const getUsers = async () => {
    try {
      const q = query(collection(db, "users"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecords(users.filter((f) => f.role === "lawyer"));
      setRoleRecords(users.filter((f) => f.role === "lawyer"));
      setData(users);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);

  const searchFilter = (event) => {
    setRecords(
      roleRecords.filter((f) =>
        f.username.toLowerCase().includes(event.target.value)
      )
    );
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Click OK to Delete");
    if (confirm) {
      try {
        await deleteDoc(doc(db, "users", id));
        location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleRoleFilter = (e) => {
    setRecords(data.filter((f) => f.role === e.target.value));
    setRoleRecords(data.filter((f) => f.role === e.target.value));
    setHideLawyerTable(!hideLawyerTable);
  };
  return (
    <>
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center">
           <img className="w-12" src="/src/assets/blockspinner.svg" alt="" />
        </div>
       
      ) : (
        <div>
          <Admin_Navbar />
          <div className="p-6 pt-10 bg-white">
            <div className="border-2 border-gray-300 border-dashed rounded-lg dark:border-gray-700">
              <section className="bg-gray-50 shadow-md dark:bg-gray-900 m-4 ">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                  <div className="w-full">
                    <form className="flex flex-col gap-y-3 md:flex-row items-center justify-between">
                      <label htmlFor="simple-search" className="sr-only">
                        Search
                      </label>
                      <div className="relative w-full md:w-1/2">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <svg
                            aria-hidden="true"
                            className="w-5 h-5 text-gray-500 dark:text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <input
                          type="text"
                          id="simple-search"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Search"
                          required=""
                          onChange={searchFilter}
                        />
                      </div>
                      <div className="relative w-full md:w-1/5">
                        <select
                          onChange={handleRoleFilter}
                          name="user_roles"
                          id=""
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-4 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        >
                          <option value="lawyer"> Lawyer</option>
                          <option value="client"> Client</option>
                        </select>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  {records.length === 0 ? (
                    <div className="flex justify-center my-6 font-semibold">
                      <span>No Record Found</span>
                    </div>
                  ) : (
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
                        <tr>
                          <th
                            scope="col"
                            className={`${
                              hideLawyerTable ? "hidden" : ""
                            } px-4 py-3`}
                          >
                            License
                          </th>
                          <th scope="col" className="px-4 py-3">
                            Username
                          </th>
                          <th scope="col" className="px-4 py-3">
                            Email
                          </th>
                          <th scope="col" className="px-4 py-3">
                            Role
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 flex items-center justify-end"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {records.map((d, i) => (
                          <tr
                            key={i}
                            className="border-b  border-gray-300 align-middle"
                          >
                            <td
                              className={`${
                                hideLawyerTable ? "hidden" : ""
                              } px-4 py-3`}
                            >
                              {d.license_num}
                            </td>
                            <td className="px-4 py-3">{d.username}</td>
                            <td className="px-4 py-3">{d.email}</td>
                            <td className="px-4 py-3">{d.role}</td>
                            <td className="px-4 py-3 flex items-center justify-end space-x-3">
                              <Link
                                title="View Profile"
                                to={`/Lawyer_Profile/${d.username}`}
                                className={`${hideLawyerTable ? "hidden" : ""}`}
                              >
                                <button>
                                  <FaUser
                                    size={16}
                                    className="hover:text-blue-600"
                                  />
                                </button>
                              </Link>
                              <Link
                                title="Appoinments"
                                to={`/Client/${d.username}/Appoinments`}
                                className={`${hideLawyerTable ? "" : "hidden"}`}
                              >
                                <button>
                                  <LuCalendarDays
                                    size={16}
                                    className="hover:text-blue-600"
                                  />
                                </button>
                              </Link>
                              <Link
                                title="Delete User"
                                onClick={() => handleDelete(d.id)}
                              >
                                <button>
                                  <FaRegTrashAlt
                                    size={16}
                                    className="hover:text-red-600"
                                  />
                                </button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Manage_Users;
