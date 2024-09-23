import axios from "axios";
import Lawyer_Bars from "../Lawyer_Bars";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from 'dayjs';
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../../firestore";

const Edit_appoinment = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  let username = localStorage.getItem("username");
  const [datePickerValue, setDatePickerValue] = useState();
  const [datePickerDisabled, setDatePickerDisabled] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    date: "",
    time: "",
    userId: username,
  });

  const getAppoinment= async ()=>{
    try {
      const docRef = doc(db, "appoinments", id);
      const docSnap = await getDoc(docRef);
      setFormData(docSnap.data())
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAppoinment()
  }, []);

  // Set Date and Time
  const handleDateTime = async () => {
    let dateTime= dayjs(datePickerValue).format('DD-MMM-YYYY hh:mma')
    let result = dateTime.split(" ");
    let date=result[0]
    let time=result[1]
    formData.date = date;
    formData.time = time;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!datePickerDisabled) {
      await handleDateTime();
    }
    try {
      await setDoc(doc(db, "appoinments", id), { ...formData });
      navigate(`/Lawyer/${username}/Manage_appoinments`);
    } catch (error) {
      console.log(error)
    }
  };
  return (
    <div>
      <Lawyer_Bars />
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 mt-16 xl:mt-0 px-4 w-full mx-auto max-w-2xl lg:py-28">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Update Appoinment
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-10">
              <div className="sm:col-span-2">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Client Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  disabled
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder={formData.name}
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="number"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Mobile
                </label>
                <input
                  type="text"
                  name="number"
                  id="number"
                  disabled
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder={formData.mobile}
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  disabled
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder={formData.email}
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="date"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Date
                </label>
                <DatePicker
                  showIcon
                  dateFormat="dd-MMM-yyyy hh:mma"
                  timeInputLabel="Time:"
                  showTimeInput
                  minDate={new Date()}
                  showMonthDropdown
                  shouldCloseOnSelect={false}
                  className="bg-gray-50 z-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  selected={datePickerValue}
                  disabled={datePickerDisabled}
                  placeholderText={`${formData.date} ${formData.time}`}
                  onChange={(dateTime) => setDatePickerValue(dateTime)}
                />
                <p
                  className="bg-none text-sm text-blue-600 hover:underline dark:text-primary-500 cursor-pointer mt-1"
                  onClick={() => {
                    setDatePickerDisabled(false);
                    setDatePickerValue(new Date());
                  }}
                >
                  Change Date and Time
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-blue-800"
              >
                Update
              </button>
              <Link to={`/Lawyer/${username}/Manage_appoinments`}>
                <button className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-gray-600 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-gray-800">
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Edit_appoinment;
