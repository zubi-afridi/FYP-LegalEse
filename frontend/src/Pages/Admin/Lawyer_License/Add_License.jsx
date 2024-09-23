import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Admin_Navbar from "../Admin_Navbar";
import { collection, addDoc, getDocs, query, serverTimestamp} from "firebase/firestore"; 
import {db} from "../../../firestore";

const Add_License = () => {
  const navigate = useNavigate();
  let username = localStorage.getItem("username");
  const [formData, setFormData] = useState({
    cnic: "",
    license: "",
  });
  const [errors, setErrors] = useState({});
  const [valid, setValid] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    let validationErrors = {};

    if (formData.cnic === "" || formData.cnic === null) {
      isValid = false;
      validationErrors.cnic = "CNIC required";
    } else if (!/^\d{13}$/.test(formData.cnic)) {
      isValid = false;
      validationErrors.cnic = "CNIC must be 13 digits";
    }

    if (formData.license === "" || formData.license === null) {
      isValid = false;
      validationErrors.license = "License Number required";
    }

    if (Object.keys(validationErrors).length === 0) {
      try {
        const q = query(collection(db, "lawyer_license"))
        const querySnapshot = await getDocs(q);
        const records = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
        let isCnicExist = records.filter((f) => f.cnic === formData.cnic);
        let isLicenseExist = records.filter((f) => f.license === formData.license);
        if (isCnicExist.length !== 0) {
          isValid = false;
          validationErrors.cnic = "CNIC is already taken";
        }
        if (isLicenseExist.length !== 0) {
          isValid = false;
          validationErrors.license = "License Number is already taken";
        }
        if (Object.keys(validationErrors).length === 0) {
          try {
           await addDoc(collection(db, "lawyer_license"), {...formData, timestamp: serverTimestamp()});
           navigate(`/Admin/${username}/Lawyer_License`);
          } catch (error) {
            console.log(error)
          }
        }
        setErrors(validationErrors);
        setValid(isValid);
      } catch (error) {
        console.log(error)
      }
    }
    setErrors(validationErrors);
    setValid(isValid);
  };
  return (
    <div>
      <Admin_Navbar />
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 mt-16 xl:mt-0 px-4 w-full mx-auto max-w-2xl lg:py-28">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Add a new License Number
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:gap-6">
              <div className="w-full">
                <label
                  htmlFor="cnic"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  CNIC
                </label>
                <input
                  type="text"
                  name="cnic"
                  id="cnic"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={(e) =>
                    setFormData({ ...formData, cnic: e.target.value })
                  }
                />
                <div className="text-red-600 text-sm">
                  {valid ? <></> : <span>{errors.cnic}</span>}
                </div>
              </div>
              <div className="w-full">
                <label
                  htmlFor="license"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  License Number
                </label>
                <input
                  type="text"
                  name="license"
                  id="license"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={(e) =>
                    setFormData({ ...formData, license: e.target.value })
                  }
                />
                <div className="text-red-600 text-sm">
                  {valid ? <></> : <span>{errors.license}</span>}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-blue-800"
              >
                Add Client
              </button>
              <Link to={`/Admin/${username}/Lawyer_License`}>
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

export default Add_License;
