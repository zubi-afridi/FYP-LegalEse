import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

const Signup = () => {
  const [userRole, setUserRole] = useState();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [valid, setValid] = useState(true);
  useEffect(() => {
    let role= sessionStorage.getItem("userRole")
    setUserRole(role);
    if (role === "lawyer") {
      setFormData({ ...formData, license_num: "" });
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    let validationErrors = {};
    console.log(userRole);
    console.log(formData)
    // Licence Number Validation
    if (userRole === "lawyer") {
      if (formData.license_num === "" || formData.license_num === null) {
        isValid = false;
        validationErrors.license_num = "License number required";
      } else {
        const q = query(
          collection(db, "lawyer_license"),
          where("license", "==", formData.license_num)
        );
        const querySnapshot = await getDocs(q);
        const user = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (Object.keys(user).length === 0) {
          isValid = false;
          validationErrors.license_num = "Wrong license number";
        } else {
          const q = query(
            collection(db, "users"),
            where("license_num", "==", formData.license_num)
          );
          const querySnapshot = await getDocs(q);
          const user = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          if (Object.keys(user).length !== 0) {
            isValid = false;
            validationErrors.license_num =
              "Account is already created by this license number";
          }
        }
      }
      setErrors(validationErrors);
      setValid(isValid);
    }

    // username Validation
    if (formData.username === "" || formData.username === null) {
      isValid = false;
      validationErrors.username = "Username required";
    } else if (formData.username.length < 6) {
      isValid = false;
      validationErrors.username = "Username must be at least 6 characters";
    } else {
      const q = query(
        collection(db, "users"),
        where("username", "==", formData.username)
      );
      const querySnapshot = await getDocs(q);
      const user = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      if (Object.keys(user).length !== 0) {
        isValid = false;
        validationErrors.username = "Username already taken";
      }
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
    } else {
      const q = query(
        collection(db, "users"),
        where("email", "==", formData.email)
      );
      const querySnapshot = await getDocs(q);
      const user = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      if (Object.keys(user).length !== 0) {
        isValid = false;
        validationErrors.email = "Account is already created by this email";
      }
    }

    // password Validation
    if (password === "" || password === null) {
      isValid = false;
      validationErrors.password = "Password required";
    } 
    else if (password.length < 6) {
      isValid = false;
      validationErrors.password = "Password must be at least 6 characters";
    }

    // confirm password Validation
    if (confirmPassword !== password) {
      isValid = false;
      validationErrors.confirmPassword = "Confirm password not match";
    }
    setErrors(validationErrors);
    setValid(isValid);

    // Add user in Database
    if (Object.keys(validationErrors).length === 0) {
      formData.role = userRole;
      sessionStorage.removeItem("userRole");
      try {
        const auth = getAuth();
        await createUserWithEmailAndPassword(auth, formData.email, password)
          .then(async (userCredential) => {
            // Signed up
            const user = userCredential.user;
            // ...
            await sendEmailVerification(user)
              .then(async () => {
                await addDoc(collection(db, "users"), {
                  ...formData,
                  timestamp: serverTimestamp(),
                });
                navigate("/Login");
              })
              .catch((error) => {
                console.log(error.code);
                console.log(error.message);
                // const errorCode = error.code;
                // const errorMessage = error.message;
                // ...
              });
          })
          .catch((error) => {
            isValid = false;
            validationErrors.email = error.message;
            setErrors(validationErrors);
            setValid(isValid);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900 ">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto mt-7 lg:py-0">
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
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              {userRole === "lawyer" ? (
                <div className="flex justify-between items-center">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Lawyer Signup
                  </h1>
                  <button
                    className=" bg-none text-blue-600 hover:underline dark:text-primary-500"
                    onClick={() => {
                      sessionStorage.setItem("userRole", "client");
                      location.reload();
                    }}
                  >
                    Client Signup
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Client Signup
                  </h1>
                  <button
                    className=" bg-none text-blue-600 hover:underline dark:text-primary-500"
                    onClick={() => {
                      sessionStorage.setItem("userRole", "lawyer");
                      location.reload();
                    }}
                  >
                    Lawyer Signup
                  </button>
                </div>
              )}
              <form
                className="space-y-2 md:space-y-4"
                action="#"
                onSubmit={handleSubmit}
              >
                <div className={userRole !== "lawyer" ? "hidden" : "block"}>
                  <label
                    htmlFor="license_num"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Licence Number
                  </label>
                  <input
                    type="text"
                    name="license_num"
                    id="license_num"
                    placeholder="xxxxxxxxxx"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                    onChange={(e) =>
                      setFormData({ ...formData, license_num: e.target.value })
                    }
                  />
                  <div className="text-red-600 text-sm">
                    {valid ? <></> : <span>{errors.license_num}</span>}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="userName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="userName"
                    id="userName"
                    placeholder="username"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                  <div className="text-red-600 text-sm">
                    {valid ? <></> : <span>{errors.username}</span>}
                  </div>
                </div>
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
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="text-red-600 text-sm">
                    {valid ? <></> : <span>{errors.password}</span>}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm password
                  </label>
                  <input
                    type="password"
                    name="confirm-password"
                    id="confirm-password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <div className="text-red-600 text-sm">
                    {valid ? <></> : <span>{errors.confirmPassword}</span>}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-black hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Signup
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
        </div>
      </section>
    </div>
  );
};

export default Signup;
