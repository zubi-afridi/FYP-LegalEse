import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import {
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../../firestore";
import { useNavigate } from "react-router-dom";
const AddNewRemarks_modal = ({ handleAddNewModal, data }) => {
  let username = localStorage.getItem("username");
  const [datePickerValue, setDatePickerValue] = useState(new Date());
  const [caseClosedChecked, setCaseClosedChecked] = useState(false);
  const [errors, setErrors] = useState({});
  const [valid, setValid] = useState(true);
  const navigate=useNavigate()
  const handleCaseClosedChecked = () => {
    setCaseClosedChecked(!caseClosedChecked);
  };
  const [formData, setFormData] = useState({
    date: "",
    judge_name: "",
    case_remarks: "",
  });

  // Set Date and Time
  const handleDateTime = async () => {
    let dateTime= dayjs(datePickerValue).format('DD-MMM-YYYY hh:mma')
    let result = dateTime.split(" ");
    let date=result[0]
    let time=result[1]
    data.date = date;
    data.time = time;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    let validationErrors = {};
    formData.date = data.date;
    formData.judge_name = data.judge_name;
    if (formData.case_remarks === "" || formData.case_remarks === null) {
      isValid = false;
      validationErrors.case_remarks = "Enter remarks";
    }
    if (Object.keys(validationErrors).length === 0) {
      data.remarks.unshift(formData)
      if(!caseClosedChecked){
        await handleDateTime();
      }if(caseClosedChecked){
        data.status='closed'
      }
      try {
        await setDoc(doc(db, "cases", data.id), { ...data});
        navigate(`/Lawyer/${username}/Manage_Cases`);
        if(!caseClosedChecked){
          let dataSend = {
            email: data.client_email,
            subject: "Next hearing date",
            message: `${data.userId} has set case hearing date on ${data.date} at ${data.time} `,
          };
          const res = await fetch("http://localhost:8004/sendEmail", {
            method: "POST",
            body: JSON.stringify(dataSend),
            headers: {
                "Content-Type": "application/json"
            },
        });
        const respond = await res.json();
        console.log(respond);
        }
          
      } catch (error) {
        console.log(error)
      }
    }
    setErrors(validationErrors);
    setValid(isValid);
  };
  return (
    <>
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
                Add New Remarks
              </h3>
              <button
                onClick={handleAddNewModal}
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
              <div className="grid md:grid-cols-2 gap-y-5">
                <label className="font-medium text-sm">
                  Date: <label className="font-normal">{data.date}</label>
                </label>
                <label className="font-medium text-sm ">
                  Judge Name:{" "}
                  <label className="font-normal">{data.judge_name}</label>
                </label>
                <textarea
                  className="col-span-2 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  rows={5}
                  name="remarks"
                  id="remarks"
                  placeholder="Write Judge Remarks"
                  onChange={(e) =>
                    setFormData({ ...formData, case_remarks: e.target.value })
                  }
                >
                </textarea>
                <div className="text-red-600 text-sm">
                  {valid ? <></> : <span>{errors.case_remarks}</span>}
                </div>
              </div>
            </div>

            <div className="p-4 md:p-5 border-t">
              <div className="flex items-center">
                <input
                  onClick={handleCaseClosedChecked}
                  checked={caseClosedChecked}
                  id="checked-checkbox"
                  type="checkbox"
                  value=""
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-400 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  for="checked-checkbox"
                  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Case is Closed
                </label>
              </div>
              <div className={`${caseClosedChecked ? "hidden" : ""} pt-5`}>
                <label
                  htmlFor="date"
                  className=" block text-sm font-medium text-gray-900 dark:text-white pb-2"
                >
                  Case Next hearing Date
                </label>
                <DatePicker
                  showIcon
                  toggleCalendarOnIconClick
                  dateFormat="dd-MMM-yyyy hh:mma"
                  timeInputLabel="Time:"
                  showTimeInput
                  minDate={new Date()}
                  showMonthDropdown
                  shouldCloseOnSelect={false}
                  className="bg-gray-50 z-50 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  selected={datePickerValue}
                  onChange={(dateTime) => setDatePickerValue(dateTime)}
                />
              </div>
            </div>
            {/* <!-- Modal footer --> */}
            <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                onClick={handleSubmit}
                data-modal-hide="default-modal"
                type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Add Remarks
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddNewRemarks_modal;
