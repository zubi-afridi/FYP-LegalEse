import React, { useState } from "react";
import AddNewRemarks_modal from "./AddNewRemarks_modal";

const Remarks_modal = ({ handleModal, data }) => {
  let role = localStorage.getItem("role");
  const [showAddNewModal, setShowAddNewModal] = useState(false);
  const handleAddNewModal = () => {
    setShowAddNewModal(!showAddNewModal);
  };
  return (
    <>
      <div
        className={`${
          !showAddNewModal ? "hidden" : ""
        } w-full h-full fixed z-50 bg-black/75`}
      >
        {role === "lawyer" ? (
          <AddNewRemarks_modal
            handleAddNewModal={handleAddNewModal}
            data={data}
          />
        ) : (
          ""
        )}
      </div>
      {/* <!-- Main modal --> */}
      <div
        id="default-modal"
        tabindex="-1"
        aria-hidden="true"
        class="overflow-y-auto overflow-x-hidden flex z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div class="relative p-4 w-full max-w-2xl max-h-full">
          {/* <!-- Modal content --> */}
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/* <!-- Modal header --> */}
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                Case Remarks
              </h3>
              <button
                onClick={handleModal}
                type="button"
                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="default-modal"
              >
                <svg
                  class="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
            </div>
            {/* <!-- Modal body --> */}
            <div class="p-4 md:p-5 space-y-4">
              {data.remarks && data.remarks.length === 0 ? (
                <div className="flex justify-center font-semibold">
                  <span>No Remarks Found</span>
                </div>
              ) : (
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
                    <tr>
                      <th scope="col" className="px-4 py-3">
                        Date
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Judge
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.remarks &&
                      data.remarks.map((d, i) => (
                        <tr
                          key={i}
                          className="border-b border-gray-300 align-top"
                        >
                          <td className="px-4 py-3 whitespace-nowrap">
                            {d.date}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {d.judge_name}
                          </td>
                          <td className="px-4 py-3">{d.case_remarks}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
            {/* <!-- Modal footer --> */}
            <div
              className={`${
                role === "lawyer" ? "" : "hidden"
              } flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600`}
            >
              <button
                onClick={handleAddNewModal}
                data-modal-hide="default-modal"
                type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Add New
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Remarks_modal;
