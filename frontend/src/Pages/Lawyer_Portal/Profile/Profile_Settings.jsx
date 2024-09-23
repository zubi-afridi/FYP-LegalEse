import React, { useState, useEffect } from "react";
import Lawyer_Bars from "../Lawyer_Bars";
import { Link } from "react-router-dom";
import Specialization from "./Specialization";
import Profile_img from "./Profile_img";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firestore";
const Profile_Settings = () => {
  let username = localStorage.getItem("username");
  const [formData, setFormData] = useState({
    profile: {
      profile_img: "",
      availability: "available",
      name: "",
      mobile: "",
      about: "",
      specialization: [],
      address: "",
      location_url: "",
    },
  });
  const [errors, setErrors] = useState({});
  const [valid, setValid] = useState(true);
  const [loading, setLoading] = useState(true);
  const getUserDetails = async () => {
    const q = query(collection(db, "users"), where("username", "==", username));
    const querySnapshot = await getDocs(q);
    const userDetails = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const data = userDetails[0];
    if (data.profile) {
      setFormData(data);
    } else {
      setFormData({ ...formData, ...data });
    }
    setLoading(false)
  };
  useEffect(() => {
    getUserDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    let validationErrors = {};
    // name Validation
    if (formData.profile.name === "" || formData.profile.name === null) {
      isValid = false;
      validationErrors.name = "name required";
    }

    // mobile number Validation
    if (formData.profile.mobile === "" || formData.profile.mobile === null) {
      isValid = false;
      validationErrors.mobile = "mobile Number required";
    } else if (!/^03\d{9}$/.test(formData.profile.mobile)) {
      isValid = false;
      validationErrors.mobile =
        "mobile number must be 11 digits and first two must be 03";
    }

    // About Validation
    if (formData.profile.about === "" || formData.profile.about === null) {
      isValid = false;
      validationErrors.about = "about required";
    }

    // specialization Validation
    if (Object.keys(formData.profile.specialization).length === 0) {
      isValid = false;
      validationErrors.specialization = "select atleast 1 tag";
    }
    // Address Validation
    if (formData.profile.address === "" || formData.profile.address === null) {
      isValid = false;
      validationErrors.address = "address required";
    }

    // mobile number Validation
    if (
      formData.profile.location_url === "" ||
      formData.profile.location_url === null
    ) {
      isValid = false;
      validationErrors.location_url = "location required";
    } else if (
      !/https:\/\/maps\.app\.goo\.gl\/.*$/.test(formData.profile.location_url)
    ) {
      isValid = false;
      validationErrors.location_url = "must be google map url";
    }
    setErrors(validationErrors);
    setValid(isValid);
    if (Object.keys(validationErrors).length === 0) {
      try {
        await setDoc(doc(db, "users", formData.id), { ...formData });
        alert("Profile save successfully");
        location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <img className="w-12" src="/src/assets/blockspinner.svg" alt="" />
        </div>
      ) : (
        <div>
          <Lawyer_Bars profile_img={formData.profile.profile_img} />
          <section className="bg-white dark:bg-gray-900">
            <div className="py-8 mt-16 xl:mt-0 px-4 w-full mx-auto max-w-2xl lg:py-28">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Profile Settings
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                  <div className="sm:col-span-2">
                    <Profile_img
                      formData={formData}
                      setFormData={setFormData}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <fieldset
                      className="flex gap-16"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: {
                            ...formData.profile,
                            availability: e.target.value,
                          },
                        })
                      }
                    >
                      <legend className="block text-sm font-medium text-gray-900 dark:text-white">
                        Availability
                        <label className="block mb-2 font-normal text-sm text-gray-400 dark:text-white">
                          Client will not be able to book appoinment if you are
                          not available
                        </label>
                      </legend>
                      <div className="flex items-center mb-5">
                        <input
                          id="available"
                          type="radio"
                          name="availability"
                          value="available"
                          checked={
                            formData.profile.availability === "available"
                          }
                          className="w-4 h-4 border-gray-500 cursor-pointer focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="available"
                          className="block ms-2 cursor-pointer  text-sm text-gray-900 dark:text-gray-300"
                        >
                          Available
                        </label>
                      </div>
                      <div className="flex items-center mb-5">
                        <input
                          id="not available"
                          type="radio"
                          name="availability"
                          value="not available"
                          checked={
                            formData.profile.availability === "not available"
                          }
                          className="w-4 h-4 border-gray-500 cursor-pointer focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="not available"
                          className="block ms-2  cursor-pointer text-sm text-gray-900 dark:text-gray-300"
                        >
                          Not Available
                        </label>
                      </div>
                    </fieldset>
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="username"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Username
                    </label>
                    <h1 id="username" className="text-gray-500">
                      {formData.username}
                    </h1>
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Email
                    </label>
                    <h1 id="email" className="text-gray-500">
                      {formData.email}
                    </h1>
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
                      value={formData.profile.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: {
                            ...formData.profile,
                            name: e.target.value,
                          },
                        })
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
                      value={formData.profile.mobile}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: {
                            ...formData.profile,
                            mobile: e.target.value,
                          },
                        })
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    />
                    <div className="text-red-600">
                      {valid ? <></> : <span>{errors.mobile}</span>}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="about"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      About
                    </label>
                    <textarea
                      id="about"
                      rows="5"
                      // maxLength="350"
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder=""
                      value={formData.profile.about}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: {
                            ...formData.profile,
                            about: e.target.value,
                          },
                        })
                      }
                    ></textarea>
                    <div className="text-red-600">
                      {valid ? <></> : <span>{errors.about}</span>}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <Specialization
                      formData={formData}
                      setFormData={setFormData}
                    />
                    <div className="text-red-600">
                      {valid ? <></> : <span>{errors.specialization}</span>}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="Address"
                      className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Address
                    </label>
                    <label className="block mb-2 text-sm text-gray-400 dark:text-white">
                      Make sure to put your office address because other will
                      see it.
                    </label>
                    <input
                      type="text"
                      name="Address"
                      id="Address"
                      value={formData.profile.address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: {
                            ...formData.profile,
                            address: e.target.value,
                          },
                        })
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    />
                    <div className="text-red-600">
                      {valid ? <></> : <span>{errors.address}</span>}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="Location"
                      className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Google Map Location
                    </label>
                    <label className="block mb-2 text-sm text-gray-400 dark:text-white">
                      Make sure to put your office google map location url
                      because other will see it.
                    </label>
                    <input
                      type="text"
                      name="Location"
                      id="Location"
                      value={formData.profile.location_url}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: {
                            ...formData.profile,
                            location_url: e.target.value,
                          },
                        })
                      }
                      placeholder="copy your google map location url and past it here"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    />
                    <div className="text-red-600">
                      {valid ? <></> : <span>{errors.location_url}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-blue-800"
                  >
                    Save
                  </button>
                  <Link to={`/Profile_Preview/${username}`} target="_blank">
                    <button
                      type="button"
                      className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-blue-800"
                    >
                      Preview
                    </button>
                  </Link>
                </div>
              </form>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default Profile_Settings;
