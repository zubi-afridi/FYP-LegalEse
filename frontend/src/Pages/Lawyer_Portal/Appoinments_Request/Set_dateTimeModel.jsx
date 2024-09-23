import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import {
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  collection,
} from "firebase/firestore";
import { db } from "../../../firestore";
const Set_dateTimeModel = ({ handleToggleModal, data }) => {
  const [datePickerValue, setDatePickerValue] = useState(new Date());
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    date: "",
    time: "",
    status: "open",
    userId: "",
    clientId: "",
  });
  // Set Date and Time
  const handleDateTime = async () => {
    let dateTime = dayjs(datePickerValue).format("DD-MMM-YYYY hh:mma");
    let result = dateTime.split(" ");
    let date = result[0];
    let time = result[1];
    formData.date = date;
    formData.time = time;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    formData.name = data.name;
    formData.mobile = data.mobile;
    formData.email = data.email;
    formData.userId = data.lawyerId;
    formData.clientId = data.clientId;
    await handleDateTime();
    try {
      await addDoc(collection(db, "appoinments"), {
        ...formData,
        timestamp: serverTimestamp(),
      });
      let dataSend = {
        email: formData.email,
        subject: "Appoinment Request",
        message: `${formData.userId} accept your appoinment request`,
      };
      const res = await fetch("http://localhost:8004/sendEmail", {
        method: "POST",
        body: JSON.stringify(dataSend),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const respond = await res.json();
      console.log(respond);
      alert("Appoinment Save Successfully");
      try {
        await deleteDoc(doc(db, "appoinments_request", data.id));
        location.reload();
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {/* <!-- Main modal --> */}
      <div
        id="authentication-modal"
        tabIndex="-1"
        aria-hidden="true"
        className={`overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex bg-black bg-opacity-70 justify-center items-center xl:items-start w-full h-screen xl:pt-8`}
      >
        <div className="relative p-4 w-full max-w-3xl max-h-full">
          {/* <!-- Modal content --> */}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/* <!-- Modal header --> */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Set Date and Time
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
            <form
              onSubmit={handleSubmit}
              className="flex flex-col justify-center p-7 gap-5"
            >
              <div className="w-full flex justify-center">
                <DatePicker
                  showIcon
                  toggleCalendarOnIconClick
                  dateFormat="dd-MMM-yyyy hh:mma"
                  timeInputLabel="Time:"
                  showTimeInput
                  minDate={new Date()}
                  showMonthDropdown
                  shouldCloseOnSelect={false}
                  className="bg-gray-50 z-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  selected={datePickerValue}
                  onChange={(dateTime) => setDatePickerValue(dateTime)}
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
              >
                Save Appoinment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Set_dateTimeModel;
