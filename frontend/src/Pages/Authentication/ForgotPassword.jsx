import React, { useState } from "react";
import { Link } from "react-router-dom";
import { collection,getDocs,query, where } from "firebase/firestore";
import {db} from "../../firestore";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [valid, setValid] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    let validationErrors = {};

    // email Validation
    if (formData.email === "" || formData.email === null) {
      isValid = false;
      validationErrors.email = "Email required";
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      isValid = false;
      validationErrors.email = "Email is not valid";
    }

    // check user is avalaible or not (fetch from DataBase)
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      try {
        const q = query(collection(db, "users"), where("email","==",formData.email))
      const querySnapshot = await getDocs(q);
      const user = querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data(),}));
      if (Object.keys(user).length !== 0) {
        const auth = getAuth();
        sendPasswordResetEmail(auth, formData.email)
        .then(() => {
          // Password reset email sent!
          alert("Check your email");
        })
        .catch((error) => {
          console.log(error.code)
          console.log(error.message)
        });
      } else {
        isValid = false;
        validationErrors.email = "Wrong email";
      }
      } catch (error) {
        console.log(error)
      }
    }
    setErrors(validationErrors);
    setValid(isValid);
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
              Forgot Password
            </h2>
            <form
              className="mt-4 space-y-2 lg:mt-5 md:space-y-4"
              onSubmit={handleSubmit}
            >
              <div>
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required=""
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <div className="text-red-600 text-sm">
                  {valid ? <></> : <span>{errors.email}</span>}
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-black hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Submit
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/Login"
                  className="font-medium text-blue-600 hover:underline dark:text-primary-500"
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForgotPassword;
