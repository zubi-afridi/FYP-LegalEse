import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc
} from "firebase/firestore";
import { db } from "../../../firestore";
const Appoinments_Request = ({appoinmentRequestData}) => {
  const data=appoinmentRequestData
  const {username}=useParams()
  let role=localStorage.getItem('role')
  const cancelRequest = async (id) => {
    let confirmCancel = confirm("Click OK to cancel the request");
    if (confirmCancel === true) {
      try {
        await deleteDoc(doc(db, "appoinments_request", id));
        location.reload();
      } catch (error) {
        console.log(error)
      }
    }
  };
  return (
    <div className="p-6 w-full mt-6">
      <h1 className="font-medium text-xl text-gray-900">
      Appoinments Request
      </h1>
      <div className=" border-2 border-gray-300 border-dashed rounded-lg dark:border-gray-700 mt-4">
        {data.length === 0 ? (
          <div className="flex justify-center my-4 font-semibold">
            <span>No Request Found</span>
          </div>
        ) : (
          <section className="bg-gray-50 shadow-md dark:bg-gray-900 m-4">
            {data.map((d, i) => (
              <div
                key={i}
                className="w-full text-sm border-b border-gray-300 flex flex-col md:flex-row justify-between p-3 gap-3 md:items-center"
              >
                <span>
                  {`You sent appoinment request to ${d.lawyerId}`}{" "}
                  <Link
                    to={`/Profile_Preview/${d.lawyerId}`}
                    className="text-blue-700 hover:underline cursor-pointer"
                  >
                    View Profile
                  </Link>
                </span>
                <div className={`${role === "admin" ?'hidden':'flex'}`}>
                  <button
                    onClick={() => cancelRequest(d.id)}
                    type="button"
                    className=" text-white text-xs inline-flex items-center bg-red-600 hover:bg-red-700 px-3 py-1 rounded cursor-pointer "
                  >
                    Cancel Request
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default Appoinments_Request;
