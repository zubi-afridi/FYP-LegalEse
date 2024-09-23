import Lawyer_Bars from "../Lawyer_Bars";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from 'dayjs';
import { addDoc, getDocs,query, where,orderBy, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firestore";
const Add_appoinment = () => {
  let username = localStorage.getItem("username");
  const navigate = useNavigate();
  const [clientType, setClientType] = useState("existing client");
  const [datePickerValue, setDatePickerValue] = useState(new Date());
  const [existingClient, setExistingClient] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    date: "",
    time: "",
    status:"open",
    userId: username,
  });
  const [errors, setErrors] = useState({});
  const [valid, setValid] = useState(true);

  const getClients=async ()=>{
    try {
      const collectionRef=collection(db, "clients")
      const q = query(collectionRef, where("userId", "==", username, orderBy("timestamp", "desc")));
      const querySnapshot = await getDocs(q);
      const clients = querySnapshot.docs.map((doc) => ({id: doc.id,...doc.data(),
      }));
      setExistingClient(clients);
    } catch (error) {
      console.log(error)
    }
  }
  
  useEffect(() => {
    getClients()
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

    // name Validation
    if (formData.name === "" || formData.name === null) {
      isValid = false;
      validationErrors.name = "Name required";
    }

    // mobile number Validation
     if (formData.mobile === "" || formData.mobile === null) {
      isValid = false;
      validationErrors.mobile = "Mobile number required";
    } else if (
      !/^03\d{9}$/.test(formData.mobile)
    ) {
      isValid = false;
      validationErrors.mobile = "Mobile number must be 11 digits and first two must be 03";
    }


    // email Validation
    if (formData.email === "" || formData.email === null) {
      isValid = false;
      validationErrors.email = "Email required";
    } else if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)
    ) {
      isValid = false;
      validationErrors.email = "Email is not valid";
    }

    setErrors(validationErrors);
    setValid(isValid);
    if (Object.keys(validationErrors).length === 0) {
      await handleDateTime();
      try {
        await addDoc(collection(db,"appoinments"),{...formData, timestamp:serverTimestamp()});
        navigate(`/Lawyer/${username}/Manage_appoinments`);
      } catch (error) {
        console.log(error)
      }
    }
  };

  //get the name, mobile number and email of existing client
  const getSelectedClient = (e) => {
    e.preventDefault()
    let selected = existingClient.find((f) => f.email === e.target.value);
    setFormData({ ...formData,email:e.target.value, mobile: selected.mobile, name:selected.name })
  };

  // set field based on radio button
  const handleRadio=(e)=>{
    setClientType(e.target.value)
    setFormData({ ...formData, mobile:'', name:'',email:'' })
  }
  return (
    <div>
      <Lawyer_Bars />
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 mt-16 xl:mt-0 px-4 w-full mx-auto max-w-2xl lg:py-28">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Add a new Appoinment
          </h2>
          <form onSubmit={handleSubmit}>
            <fieldset className="flex gap-4">
              <legend className="sr-only">Clients Type</legend>

              <div className="flex items-center mb-5">
                <input
                  onClick={handleRadio}
                  id="client-option-1"
                  type="radio"
                  name="client"
                  value="existing client"
                  className="w-4 h-4 border-gray-500 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                  // checked={clientType === "existing client"}
                  defaultChecked
                />
                <label
                  htmlFor="client-option-1"
                  className="block ms-2  text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Existing Client
                </label>
              </div>

              <div className="flex items-center mb-5">
                <input
                  onClick={handleRadio}
                  id="client-option-2"
                  type="radio"
                  name="client"
                  value="new client"
                  className="w-4 h-4 border-gray-500 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="client-option-2"
                  className="block ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  New Client
                </label>
              </div>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2 sm:gap-10">
              <div className="sm:col-span-2">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                {clientType === "existing client" ? (
                  <select
                    name="existing-client-name"
                    id="existing-client-name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={getSelectedClient}
                  >
                    <option selected disabled value="Choose Client">
                      Choose Client Email
                    </option>
                    {existingClient.map((d, i) => (
                      <option key={i}>{d.email}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                )}

                <div className="text-red-600">
                  {valid ? <></> : <span>{errors.email}</span>}
                </div>
              </div>
              <div className="w-full">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  disabled={clientType==="existing client"}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <div className="text-red-600">
                  {valid ? <></> : <span>{errors.name}</span>}
                </div>
              </div>
              <div className="w-full">
                <label
                  htmlFor="mobile"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Mobile
                </label>
                <input
                  type="text"
                  name="mobile"
                  id="mobile"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  disabled={clientType==="existing client"}
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                />
                <div className="text-red-600">
                  {valid ? <></> : <span>{errors.mobile}</span>}
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
                  onChange={(dateTime) => setDatePickerValue(dateTime)}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-blue-800"
              >
                Add Appoinment
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
export default Add_appoinment;
