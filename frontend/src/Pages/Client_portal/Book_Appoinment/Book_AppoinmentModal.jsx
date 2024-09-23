import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { collection, addDoc, serverTimestamp, getDocs, query, where} from "firebase/firestore"; 
import {db} from "../../../firestore";
const Book_AppoinmentModal = ({ toggleModal, handleToggleModal, email }) => {
  let clientId = localStorage.getItem("username");
  let { username } = useParams();
  const [errors, setErrors] = useState({});
  const [valid, setValid] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    mobile: "",
    description: "",
    clientId: clientId,
    lawyerId: username,
  });

  const sendEmail=async()=>{
    try {
      const q = query(collection(db, "users"), where("username", "==", formData.lawyerId));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      let dataSend = {
        email: data[0].email,
        subject: "Appoinment Request",
        message: `${formData.clientId} sent you appoinment request`,
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
    } catch (error) {
      console.log(error);
    }
    
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    formData.email = email;
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
      validationErrors.mobile = "Phone Number required";
    } else if (!/^03\d{9}$/.test(formData.mobile)) {
      isValid = false;
      validationErrors.mobile =
        "Mobile number must be 11 digits and first two must be 03";
    }

    // description Validation
    if (formData.description === "" || formData.description === null) {
      isValid = false;
      validationErrors.description = "Description required";
    }
    setErrors(validationErrors);
    setValid(isValid);
    if (Object.keys(validationErrors).length === 0) {
      try {
        await addDoc(collection(db, "appoinments_request"), {...formData, timestamp: serverTimestamp()});
          handleToggleModal();
          sendEmail();
          alert("Request sent successfully");
      } catch (error) {
        console.log(error)
      }
    }
  };
  return (
    <div>
      {/* <!-- Main modal --> */}
      <div
        id="authentication-modal"
        tabIndex="-1"
        aria-hidden="true"
        className={` ${
          !toggleModal ? "hidden" : ""
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex bg-black bg-opacity-80 justify-center items-center w-full h-screen`}
      >
        <div className="relative p-4 w-full max-w-3xl max-h-full">
          {/* <!-- Modal content --> */}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/* <!-- Modal header --> */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Book Appoinment
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
              <form
                className="space-y-4 grid md:grid-cols-2 gap-x-5 gap-y-2"
                onSubmit={handleSubmit}
              >
                <div className="md:col-span-2">
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
                    {email}
                  </h3>
                </div>
                <div>
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
                    placeholder=""
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  />
                  <div className="text-red-600 text-sm">
                    {valid ? <></> : <span>{errors.name}</span>}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="phoneNo"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phoneNo"
                    id="phoneNo"
                    placeholder=""
                    onChange={(e) =>
                      setFormData({ ...formData, mobile: e.target.value })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  />
                  <div className="text-red-600 text-sm">
                    {valid ? <></> : <span>{errors.mobile}</span>}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={5}
                    placeholder=""
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  ></textarea>
                  <div className="text-red-600 text-sm">
                    {valid ? <></> : <span>{errors.description}</span>}
                  </div>
                </div>
                <button
                  type="submit"
                  className=" md:col-span-2 w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Sent Appoinment Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Book_AppoinmentModal;
