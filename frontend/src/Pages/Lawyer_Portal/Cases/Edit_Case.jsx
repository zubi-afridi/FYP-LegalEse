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
const Edit_Case = () => {
  let username = localStorage.getItem("username");
  let { id } = useParams();
  const navigate = useNavigate();
  const [datePickerValue, setDatePickerValue] = useState();
  const [datePickerDisabled, setDatePickerDisabled] = useState(true);
  const [formData, setFormData] = useState({
    client_role: "plaintiff",
    client_name: "",
    client_email: "",
    case_number: "",
    case_type: "",
    court_branch: "",
    court_number: "",
    judge_name: "",
    date: "",
    time: "",
    status: "open",
     remarks:[],
    userId: username,
  });
  const [errors, setErrors] = useState({});
  const [valid, setValid] = useState(true);

  const getCase= async ()=>{
    try {
      const docRef = doc(db, "cases", id);
      const docSnap = await getDoc(docRef);
      setFormData(docSnap.data())
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getCase()
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
    let isValid = true;
    let validationErrors = {};

    // Case Number Validation
    if (formData.case_number === "" || formData.case_number === null) {
      isValid = false;
      validationErrors.case_number = "Case number required";
    }
    // Case Type Validation
    if (formData.case_type === "" || formData.case_type === null) {
      isValid = false;
      validationErrors.case_type = "Case type required";
    }
    // Court Branch Validation
    if (formData.court_branch === "" || formData.court_branch === null) {
      isValid = false;
      validationErrors.court_branch = "Court branch required";
    }
    // Court Number Validation
    if (formData.court_number === "" || formData.court_number === null) {
      isValid = false;
      validationErrors.court_number = "Court number required";
    }
    // Judge Name Validation
    if (formData.judge_name === "" || formData.judge_name === null) {
      isValid = false;
      validationErrors.judge_name = "Judge name required";
    }

    setErrors(validationErrors);
    setValid(isValid);
    if (Object.keys(validationErrors).length === 0) {
      if (!datePickerDisabled) {
        await handleDateTime();
      }
      try {
        await setDoc(doc(db, "cases", id), { ...formData });
          navigate(`/Lawyer/${username}/Manage_Cases`);
      } catch (error) {
        console.log(error)
      }
    }
  };
  return (
    <div>
      <Lawyer_Bars />
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 mt-16 xl:mt-0 px-4 w-full mx-auto max-w-2xl lg:py-28">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Update Case
          </h2>
          <form onSubmit={handleSubmit}>
            <fieldset
              className="grid grid-cols-2 sm:grid-cols-4"
              onChange={(e) =>
                setFormData({ ...formData, client_role: e.target.value })
              }
            >
              <legend className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Client Role
              </legend>
              <div className="flex items-center mb-5">
                <input
                  id="client-role-1"
                  type="radio"
                  name="client-role"
                  value="plaintiff"
                  checked={formData.client_role === "plaintiff"}
                  className="w-4 h-4 border-gray-500 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="client-role-1"
                  className="block ms-2  text-sm text-gray-900 dark:text-gray-300"
                >
                  Plaintiff
                </label>
              </div>
              <div className="flex items-center mb-5">
                <input
                  id="client-role-2"
                  type="radio"
                  name="client-role"
                  value="defendant"
                  checked={formData.client_role === "defendant"}
                  className="w-4 h-4 border-gray-500 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="client-role-2"
                  className="block ms-2  text-sm  text-gray-900 dark:text-gray-300"
                >
                  Defendant
                </label>
              </div>
              <div className="flex items-center mb-5">
                <input
                  id="client-role-3"
                  type="radio"
                  name="client-role"
                  value="petitioner"
                  checked={formData.client_role === "petitioner"}
                  className="w-4 h-4 border-gray-500 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="client-role-3"
                  className="block ms-2  text-sm text-gray-900 dark:text-gray-300"
                >
                  Petitioner
                </label>
              </div>
              <div className="flex items-center mb-5">
                <input
                  id="client-role-4"
                  type="radio"
                  name="client-role"
                  value="respondent"
                  checked={formData.client_role === "respondent"}
                  className="w-4 h-4 border-gray-500 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="client-role-4"
                  className="block ms-2  text-sm  text-gray-900 dark:text-gray-300"
                >
                  Respondent
                </label>
              </div>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2 sm:gap-10">
              <div className="sm:col-span-2">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Client email
                </label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  disabled
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder={formData.client_email}
                />
              </div>
              <div className="w-full">
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
                  placeholder={formData.client_name}
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="case-no"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Case Number
                </label>
                <input
                  type="text"
                  name="case-no"
                  id="case-no"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={formData.case_number}
                  onChange={(e) =>
                    setFormData({ ...formData, case_number: e.target.value })
                  }
                />
                <div className="text-red-600">
                  {valid ? <></> : <span>{errors.case_number}</span>}
                </div>
              </div>
              <div className="w-full">
                <label
                  htmlFor="case-type"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Case Type
                </label>
                <input
                  type="text"
                  name="case-type"
                  id="case-type"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={formData.case_type}
                  onChange={(e) =>
                    setFormData({ ...formData, case_type: e.target.value })
                  }
                />
                <div className="text-red-600">
                  {valid ? <></> : <span>{errors.case_type}</span>}
                </div>
              </div>
              <div className="w-full">
                <label
                  htmlFor="court-branch"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Court Branch
                </label>
                <input
                  type="text"
                  name="court-branch"
                  id="court-branch"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={formData.court_branch}
                  onChange={(e) =>
                    setFormData({ ...formData, court_branch: e.target.value })
                  }
                />
                <div className="text-red-600">
                  {valid ? <></> : <span>{errors.court_branch}</span>}
                </div>
              </div>

              <div className="w-full">
                <label
                  htmlFor="court-no"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Court Number
                </label>
                <input
                  type="text"
                  name="court-no"
                  id="court-no"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={formData.court_number}
                  onChange={(e) =>
                    setFormData({ ...formData, court_number: e.target.value })
                  }
                />
                <div className="text-red-600">
                  {valid ? <></> : <span>{errors.court_number}</span>}
                </div>
              </div>
              <div className="w-full">
                <label
                  htmlFor="judge-name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Judge Name
                </label>
                <input
                  type="text"
                  name="judge-name"
                  id="judge-name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={formData.judge_name}
                  onChange={(e) =>
                    setFormData({ ...formData, judge_name: e.target.value })
                  }
                />
                <div className="text-red-600">
                  {valid ? <></> : <span>{errors.judge_name}</span>}
                </div>
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
                  toggleCalendarOnIconClick
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
                Update Case
              </button>
              <Link to={`/Lawyer/${username}/Manage_Cases`}>
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

export default Edit_Case;
