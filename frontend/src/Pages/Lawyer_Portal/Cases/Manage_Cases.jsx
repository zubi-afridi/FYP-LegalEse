import React, { useState, useEffect } from "react";
import Lawyer_Bars from "../Lawyer_Bars";
import { Link, useParams } from "react-router-dom";
import { FaRegEye, FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { RiExpandUpDownFill } from "react-icons/ri";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firestore";

const Manage_Cases = () => {
  const { username } = useParams();
  const role = localStorage.getItem("role");
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [data, setData] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const getCases = async () => {
    if (role === "client") {
      try {
        const collectionRef = collection(db, "users");
        const q = query(
          collectionRef,
          where("username", "==", username, orderBy("timestamp", "desc"))
        );
        const querySnapshot = await getDocs(q);
        const user = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        try {
          const collectionRef = collection(db, "cases");
          const q = query(
            collectionRef,
            where(
              "client_email",
              "==",
              user[0].email,
              orderBy("timestamp", "desc")
            )
          );
          const querySnapshot = await getDocs(q);
          const cases = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setData(cases);
          setRecords(cases);
          setLoading(false);
        } catch (error) {
          console.log(error);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const collectionRef = collection(db, "cases");
        const q = query(
          collectionRef,
          where("userId", "==", username, orderBy("timestamp", "desc"))
        );
        const querySnapshot = await getDocs(q);
        const cases = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(cases);
        setRecords(cases);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    getCases();
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
      data.filter((f) =>
        f.client_name.toLowerCase().includes(event.target.value)
      )
    );
  };

  const handleStatus = async (id) => {
    let selected = records.find((f) => f.id === id);
    if (selected.status === "open") {
      selected.status = "closed";
    } else if (selected.status === "closed") {
      selected.status = "open";
    }
    try {
      await setDoc(doc(db, "cases", id), { ...selected });
      location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Click OK to Delete");
    if (confirm) {
      try {
        await deleteDoc(doc(db, "cases", id));
        location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleDeleteAll = async () => {
    const confirm = window.confirm("Click OK to Delete All");
    if (confirm) {
      records.map(async (d, i) => {
        try {
          await deleteDoc(doc(db, "cases", d.id));
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
          {role === "lawyer" ? <Lawyer_Bars /> : ""}
          <div
            className={`${
              role === "lawyer" ? " xl:ml-64 pt-24 p-4 " : " "
            }bg-white`}
          >
            <div className="border-2 border-gray-300 border-dashed rounded-lg dark:border-gray-700">
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
                          onChange={searchFilter}
                        />
                      </div>
                    </form>
                  </div>
                  <div
                    className={` w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0`}
                  >
                    <Link
                      to={`/Lawyer/${username}/Add_Case`}
                      type="button"
                      className={`${
                        role === "lawyer" ? "" : "hidden"
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
                      Add Case
                    </Link>
                    <div
                      className={`flex flex-row-reverse items-center  gap-3  w-full md:w-auto relative`}
                    >
                      <button
                        onClick={handleDeleteAll}
                        className={`${
                          role === "lawyer" ? "" : "hidden"
                        }  w-full md:w-auto flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 py-2 px-4 text-sm font-medium focus:outline-none rounded-lg focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700`}
                        type="button"
                      >
                        delete all
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
                      <span>No Case Found</span>
                    </div>
                  ) : (
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
                        <tr>
                          <th scope="col" className="px-4 py-3">
                            Case Detail
                          </th>
                          <th scope="col" className="px-4 py-3">
                            Court Detail
                          </th>
                          <th scope="col" className="px-4 py-3">
                            Date Time
                          </th>
                          <th scope="col" className="px-4 py-3">
                            Status
                          </th>
                          <th
                            scope="col"
                            className={`px-4 py-3 flex items-center justify-end`}
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {records.map((d, i) => (
                          <tr
                            key={i}
                            className="border-b  border-gray-300 align-top"
                          >
                            <th
                              scope="row"
                              className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                              {role === "client" ? d.userId : d.client_name}
                              <span
                                className={`${
                                  role === "lawyer" ? "" : "hidden"
                                } pl-1 text-gray-500 font-normal`}
                              >
                                {d.client_role}
                              </span>
                              <div className="font-normal text-gray-500">
                                <p
                                  className={`${
                                    role === "lawyer" ? "" : "hidden"
                                  }`}
                                >
                                  {d.client_email}
                                </p>
                                <p>
                                  Case no:{" "}
                                  <span className="font-medium">
                                    {d.case_number}
                                  </span>
                                </p>
                                <p>
                                  Case type :{" "}
                                  <span className="font-medium">
                                    {d.case_type}
                                  </span>
                                </p>
                              </div>
                            </th>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="font-normal text-gray-500">
                                <p>
                                  Court:{" "}
                                  <span className="font-medium">
                                    {d.court_branch}
                                  </span>
                                </p>
                                <p>
                                  Court no :{" "}
                                  <span className="font-medium">
                                    {d.court_number}
                                  </span>
                                </p>
                                <p>
                                  Judge:{" "}
                                  <span className="font-medium">
                                    {d.judge_name}
                                  </span>
                                </p>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <p>{d.date}</p>
                              <p>{d.time}</p>
                            </td>
                            <td className={` px-4 py-3 whitespace-nowrap`}>
                              <button
                                disabled={role === "admin" && role === "client"}
                                onClick={() => handleStatus(d.id)}
                              >
                                {d.status}{" "}
                                <RiExpandUpDownFill
                                  className={`${
                                    role === "lawyer" ? "" : "hidden"
                                  } inline`}
                                />
                              </button>
                            </td>
                            <td
                              className={`px-4 py-3 flex items-center justify-end space-x-3 whitespace-nowrap`}
                            >
                              <Link
                                to={`/Lawyer/${username}/View_Case/${d.id}`}
                              >
                                <button>
                                  <FaRegEye
                                    size={16}
                                    className="hover:text-blue-600"
                                  />
                                </button>
                              </Link>
                              <Link
                                to={`/Lawyer/${username}/Edit_Case/${d.id}`}
                                className={`${
                                  role === "lawyer" ? "" : "hidden"
                                }`}
                              >
                                <button>
                                  <FaRegEdit
                                    size={16}
                                    className="hover:text-green-600"
                                  />
                                </button>
                              </Link>
                              <Link
                              className={`${
                                role === "lawyer" ? "" : "hidden"
                              }`}
                              >
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

export default Manage_Cases;
