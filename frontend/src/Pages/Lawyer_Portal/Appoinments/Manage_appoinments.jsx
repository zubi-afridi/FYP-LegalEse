import Lawyer_Bars from "../Lawyer_Bars";
import React, { useEffect, useState } from "react";
import { FaRegEye, FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firestore";
const Manage_appoinments = () => {
  const { username } = useParams();
  const role = localStorage.getItem("role");
  const [data, setData] = useState([]);
  const [records, setRecords] = useState([]);
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const getAppoinments = async () => {
    try {
      const collectionRef = collection(db, "appoinments");
      const q = query(
        collectionRef,
        where("userId", "==", username, orderBy("timestamp", "desc"))
      );
      const querySnapshot = await getDocs(q);
      const appoinments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(appoinments);
      setRecords(appoinments);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAppoinments();
  }, []);

  const handleStatusDropdown = () => {
    setStatusDropdown(!statusDropdown);
  };

  const showOpenStatus = () => {
    setRecords(data.filter((f) => f.status === "open"));
  };

  const showClosedStatus = () => {
    setRecords(data.filter((f) => f.status === "closed"));
  };
  const showBoth = () => {
    setRecords(data);
  };

  const searchFilter = (event) => {
    setRecords(
      data.filter((f) => f.name.toLowerCase().includes(event.target.value))
    );
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Click OK to Delete");
    if (confirm) {
      try {
        await deleteDoc(doc(db, "appoinments", id));
        location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleDeleteAll = () => {
    const confirm = window.confirm("Click OK to Delete All");
    if (confirm) {
      records.map(async (d, i) => {
        try {
          await deleteDoc(doc(db, "appoinments", d.id));
          location.reload();
        } catch (error) {
          console.log(error);
        }
      });
    }
  };
  return (
    <>
      {loading ? (
         <div className="w-full h-screen flex justify-center items-center">
         <img className="w-12" src="/src/assets/blockspinner.svg" alt="" />
       </div>
      ) : (
        <div>
          {role === "admin" ? "" : <Lawyer_Bars />}
          <div
            className={`${
              role === "admin" ? "" : " xl:ml-64 pt-24 p-4 "
            }bg-white`}
          >
            <div className=" border-2 border-gray-300 border-dashed rounded-lg dark:border-gray-700">
              <section className="bg-gray-50 shadow-md dark:bg-gray-900 m-4">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                  <div className="w-full md:w-1/1">
                    <form className="flex items-center">
                      <label htmlFor="simple-search" className="sr-only">
                        Search
                      </label>
                      <div className="relative w-full">
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
                    </form>
                  </div>
                  <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                    <Link
                      to={`/Lawyer/${username}/Add_appoinment`}
                      type="button"
                      className={`${
                        role === "admin" ? "hidden" : ""
                      } flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800`}
                    >
                      <svg
                        className="h-3.5 w-3.5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          clipRule="evenodd"
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        />
                      </svg>
                      Add Appoinment
                    </Link>
                    <div className="flex flex-row-reverse items-center  gap-3  w-full md:w-auto relative">
                      <button
                        onClick={handleDeleteAll}
                        className={`${
                          role === "admin" ? "hidden" : ""
                        } w-full md:w-auto flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 py-2 px-4 text-sm font-medium focus:outline-none rounded-lg focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700`}
                        type="button"
                      >
                        Delete all
                      </button>
                      <div className="flex flex-col space-y-12 relative">
                        <button
                          onClick={handleStatusDropdown}
                          id="dropdownDelayButton"
                          data-dropdown-toggle="dropdownDelay"
                          data-dropdown-delay="500"
                          data-dropdown-trigger="hover"
                          className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                          type="button"
                        >
                          Status
                          <svg
                            className="w-2.5 h-2.5 ms-3"
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

                        {/* <!-- Status Dropdown menu --> */}
                        <div
                          id="dropdownDelay"
                          className={`${
                            !statusDropdown ? "hidden" : ""
                          } absolute right-0  z-50 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}
                        >
                          <ul
                            className="py-2 text-sm text-gray-700 dark:text-gray-200"
                            aria-labelledby="dropdownDelayButton"
                          >
                            <li className="cursor-pointer">
                              <a
                                onClick={() => {
                                  showOpenStatus();
                                  handleStatusDropdown();
                                }}
                                className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                Open
                              </a>
                            </li>
                            <li className="cursor-pointer">
                              <a
                                onClick={() => {
                                  showClosedStatus();
                                  handleStatusDropdown();
                                }}
                                className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                Closed
                              </a>
                            </li>
                            <li className="cursor-pointer">
                              <a
                                onClick={() => {
                                  showBoth();
                                  handleStatusDropdown();
                                }}
                                className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                Both
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  {records.length === 0 ? (
                    <div className="flex justify-center my-6 font-semibold">
                      <span>No Appoinment Found</span>
                    </div>
                  ) : (
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
                        <tr>
                          <th scope="col" className="px-4 py-3">
                            Name
                          </th>
                          <th scope="col" className="px-4 py-3">
                            Mobile
                          </th>
                          <th scope="col" className="px-4 py-3">
                            Email
                          </th>
                          <th scope="col" className="px-4 py-3">
                            Date Time
                          </th>
                          <th scope="col" className="px-4 py-3">
                            Status
                          </th>
                          <th
                            scope="col"
                            className={`${
                              role === "admin" ? "hidden" : ""
                            } px-4 py-3 flex items-center justify-end`}
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
                            <th
                              scope="row"
                              className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                              {d.name}
                            </th>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {d.mobile}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {d.email}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap ">
                              {d.date} <span className="ml-3">{d.time}</span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {d.status}
                            </td>
                            <td
                              className={`${
                                role === "admin" ? "hidden" : ""
                              } px-4 py-3 flex items-center justify-end space-x-3 whitespace-nowrap`}
                            >
                              <Link
                                to={`/Lawyer/${username}/View_appoinment/${d.id}`}
                              >
                                <button>
                                  <FaRegEye
                                    size={16}
                                    className="hover:text-blue-600"
                                  />
                                </button>
                              </Link>
                              <Link
                                to={`/Lawyer/${username}/Edit_appoinment/${d.id}`}
                              >
                                <button>
                                  <FaRegEdit
                                    size={16}
                                    className="hover:text-green-600"
                                  />
                                </button>
                              </Link>
                              <Link>
                                <button onClick={() => handleDelete(d.id)}>
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

export default Manage_appoinments;
