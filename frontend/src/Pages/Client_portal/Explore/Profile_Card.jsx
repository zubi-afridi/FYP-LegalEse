import React from 'react'
import { Link } from "react-router-dom";
const Profile_Card = ({profileData}) => {
  return (
    <div>
      <section className="bg-white dark:bg-gray-900">
        <div className="p-6 mx-auto max-w-screen-xl">
          <div className="grid gap-12 mb-6 lg:mb-16 md:grid-cols-2">
            {profileData.map((d, i) => (
              <Link key={i} to={`/Profile_Preview/${d.username}`}>
                <div className="bg-gray-50 rounded-lg shadow-md flex flex-col border relative border-gray-300 dark:bg-gray-800 dark:border-gray-700">
                  <img
                    className="w-32 h-32 object-cover object-top m-3"
                    src={d.profile.profile_img}
                    alt="profile img"
                  />
                  <div className="p-3">
                    <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {d.profile.name}
                    </h3>
                    <div className="h-12 overflow-hidden">
                      <span className="text-gray-500 text-sm dark:text-gray-400">
                        {d.profile.about}
                      </span>
                    </div>
                    <div>
                      {d.profile.specialization.map((specialization, index) => (
                        <label
                          key={index}
                          className="inline-block items-center bg-gray-100 border border-gray-300 rounded px-2 py-1 mr-3 mt-3 text-xs text-gray-900 "
                        >
                          {specialization}
                        </label>
                      ))}
                    </div>
                  </div>
                  <label
                    className={`${
                      d.profile.availability === "available"
                        ? "bg-lime-600"
                        : "bg-red-600"
                    } px-3 rounded-xl text-white text-xs absolute right-3 top-3`}
                  >
                    {d.profile.availability}
                  </label>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile_Card;
