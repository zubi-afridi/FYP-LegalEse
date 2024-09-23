import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [valid, setValid] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    let login = localStorage.getItem("login");
    let role = localStorage.getItem("role");
    let username = localStorage.getItem("username");
    if (login) {
      if (role === "lawyer") {
        navigate(`/Lawyer/${username}/Dashbord`);
      } else if (role === "client") {
        navigate(`/Client/${username}/Explore`);
      } else if (role === "admin") {
        navigate(`/Admin/${username}/Manage_Users`);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    let validationErrors = {};

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

    // password Validation
    if (formData.password === "" || formData.password === null) {
      isValid = false;
      validationErrors.password = "Password required";
    } else if (formData.password.length < 6) {
      isValid = false;
      validationErrors.password = "Password must be at least 6 characters";
    }

    // check user is avalaible or not (fetch from DataBase)
    if (
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email) &&
      formData.password.length >= 6
    ) {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, formData.email, formData.password)
        .then((userCredential) => {
          // Signed in
          auth.onAuthStateChanged(async (userCredential) => {
            const { email, emailVerified } = userCredential;
            // console.log(email,emailVerified)
            if (emailVerified) {
              const q = query(
                collection(db, "users"),
                where("email", "==", formData.email)
              );
              const querySnapshot = await getDocs(q);
              const user = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              localStorage.setItem("username", user[0].username);
              localStorage.setItem("role", user[0].role);
              localStorage.setItem("login", true);
              if (user[0].role === "lawyer") {
                navigate(`/Lawyer/${user[0].username}/Dashbord`);
              } else if (user[0].role === "client") {
                navigate(`/Client/${user[0].username}/Explore`);
              } else if (user[0].role === "admin") {
                navigate(`/Admin/${user[0].username}/Manage_Users`);
              }
            } else {
              isValid = false;
              validationErrors.email = "Email is not verified";
            }
            setErrors(validationErrors);
            setValid(isValid);
          });
        })
        .catch((error) => {
          isValid = false;
          validationErrors.password = "Password and Email is not match";
          setErrors(validationErrors);
          setValid(isValid);
        });
    }
    setErrors(validationErrors);
    setValid(isValid);
  };
  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 ">
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
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Log in to your account
              </h1>
              <form className="space-y-2 md:space-y-4" onSubmit={handleSubmit}>
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
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <div className="text-red-600 text-sm">
                    {valid ? <></> : <span>{errors.password}</span>}
                  </div>
                </div>
                <div className="flex items-center justify-start">
                  <Link
                    to="/ForgotPassword"
                    className="text-sm font-medium text-blue-600 hover:underline dark:text-primary-500"
                  >
                    Forgot password?
                  </Link>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-black hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Login
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <Link
                    to="/Signup"
                    onClick={() => sessionStorage.setItem("userRole", "client")}
                    className="font-medium text-blue-600 hover:underline dark:text-primary-500"
                  >
                    Signup
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

export default Login;
