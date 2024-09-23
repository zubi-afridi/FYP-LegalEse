import React, { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
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
const Manage_License = () => {
  const { username } = useParams();
  const [data, setData] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  // get license from firestore
  const getLicense_num = async () => {
    try {
      const q = query(
        collection(db, "lawyer_license"),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      const license = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(license);
      setRecords(license);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getLicense_num();
  }, []);

  const searchByLicenseFilter = (event) => {
    setRecords(
      data.filter((f) => f.license.toLowerCase().includes(event.target.value))
    );
  };
  const searchByCNICFilter = (event) => {
    setRecords(
      data.filter((f) => f.cnic.toLowerCase().includes(event.target.value))
    );
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Click OK to Delete");
    if (confirm) {
      try {
        await deleteDoc(doc(db, "lawyer_license", id));
        location.reload();
      } catch (error) {
        console.log(error);
      }
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
          <Admin_Navbar />
          <div className="p-6 pt-10 bg-white">
            <div className="border-2 border-gray-300 border-dashed rounded-lg dark:border-gray-700">
              <section className="bg-gray-50 shadow-md dark:bg-gray-900 m-4 ">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                  <div className="w-full md:w-1/1">
                    <form className="flex items-center">
                      <label htmlFor="license-search" className="sr-only">
                        Search by License Number
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
                          id="license-search"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Search by License Number"
                          required=""
                          onChange={searchByLicenseFilter}
                        />
                      </div>
                    </form>
                  </div>
                  <div className="w-full md:w-1/1">
                    <form className="flex items-center">
                      <label htmlFor="cnic-search" className="sr-only">
                        Search by CNIC
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
                          id="cnic-search"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Search by CNIC"
                          required=""
                          onChange={searchByCNICFilter}
                        />
                      </div>
                    </form>
                  </div>
                  <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                    <Link
                      to={`/Admin/${username}/Add_License`}
                      type="button"
                      className={`flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800`}
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
                      Add License
                    </Link>
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
                          <th scope="col" className="px-4 py-3">
                            License Number
                          </th>
                          <th scope="col" className="px-4 py-3">
                            CNIC
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
                            className="border-b  border-gray-300 align-middle"
                          >
                            <td className="px-4 py-3">{d.license}</td>
                            <td className="px-4 py-3">{d.cnic}</td>
                            <td
                              className={`px-4 py-3 flex items-center justify-end space-x-3`}
                            >
                              <Link onClick={() => handleDelete(d.id)}>
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

export default Manage_License;
