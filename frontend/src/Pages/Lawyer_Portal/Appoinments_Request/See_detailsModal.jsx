import React from "react";

const See_detailsModal = ({ handleToggleModal, data }) => {
  return (
    <div>
      {/* <!-- Main modal --> */}
      <div
        id="authentication-modal"
        tabIndex="-1"
        aria-hidden="true"
        className={`overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex bg-black bg-opacity-70 justify-center items-center w-full h-screen`}
      >
        <div className="relative p-4 w-full max-w-3xl max-h-full">
          {/* <!-- Modal content --> */}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/* <!-- Modal header --> */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Details
              </h3>
              <button
                onClick={handleToggleModal}
                type="button"
                className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="authentication-modal"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* <!-- Modal body --> */}
            <div className="p-4 md:p-5 ">
              <form className="grid md:grid-cols-2 gap-x-5 gap-y-2">
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Username
                  </label>
                  <h3
                    name="username"
                    id="username"
                    className="text-gray-500 text-sm block w-full"
                  >
                    {data.clientId}
                  </h3>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <h3
                    name="email"
                    id="email"
                    className="text-gray-500 text-sm block w-full"
                  >
                    {data.email}
                  </h3>
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Name
                  </label>
                  <h3
                    name="name"
                    id="name"
                    className="text-gray-500 text-sm block w-full"
                  >
                    {data.name}
                  </h3>
                </div>
                <div>
                  <label
                    htmlFor="mobile"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Phone Number
                  </label>
                  <h3
                    name="mobile"
                    id="mobile"
                    className="text-gray-500 text-sm block w-full"
                  >
                    {data.mobile}
                  </h3>
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Description
                  </label>
                  <h3
                    name="description"
                    id="description"
                    className="text-gray-500 text-sm block w-full"
                  >
                    {data.description}
                  </h3>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default See_detailsModal;
