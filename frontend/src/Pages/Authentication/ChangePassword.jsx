import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth,onAuthStateChanged, updatePassword } from "firebase/auth";
const ChangePassword = () => {
  let username = localStorage.getItem("username");
  const [errors, setErrors] = useState({});
  const [valid, setValid] = useState(true);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const handleSubmit = async(e) => {
    e.preventDefault();
    let isValid = true;
    let validationErrors = {};

    
    // new password Validation
    if (formData.newPassword === "" || formData.newPassword === null) {
      isValid = false;
      validationErrors.newPassword = "New password required";
    } else if (formData.newPassword.length < 6) {
      isValid = false;
      validationErrors.newPassword = "Password must be at least 6 characters";
    }

    // confirm password Validation
    if (formData.confirmPassword !== formData.newPassword) {
      isValid = false;
      validationErrors.confirmPassword = "Confirm password not match";
    }
    setErrors(validationErrors);
    setValid(isValid);

    if (Object.keys(validationErrors).length === 0) {
      try {
          const auth = getAuth();
          onAuthStateChanged(auth, (user) => {
            console.log(user)
            updatePassword(user, formData.newPassword).then(() => {
              alert("Password change successfully")
              location.reload()
              }).catch((error) => {
                alert(error.message)
                 });
          })
          
      } catch (error) {
        console.log(error)
      }
    }
  };
  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <Link
            to="/"
            className="flex items-center mb-4 text-2xl font-bold text-gray-900 dark:text-white"
          >
            <img
              className="w-8 h-8 mr-2"
              src="src\assets\logo.svg"
              alt="logo"
            />
            LegalEse
          </Link>
          <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
            <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Change Password
            </h2>
            <form
              onSubmit={handleSubmit}
              className="mt-4 space-y-2 lg:mt-5 md:space-y-4"
            >
              <div>
                <label
                  htmlFor="newPassword"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                />
                <div className="text-red-600 text-sm">
                  {valid ? <></> : <span>{errors.newPassword}</span>}
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
                <div className="text-red-600 text-sm">
                  {valid ? <></> : <span>{errors.confirmPassword}</span>}
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-black hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Change Password
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChangePassword;
