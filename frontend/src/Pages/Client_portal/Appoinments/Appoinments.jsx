import React, { useEffect, useState } from "react";
import Client_Navbar from "../Client_Navbar";
import { Link, useParams } from "react-router-dom";
import Appoinments_Request from "./Appoinments_Request";
import Admin_Navbar from "../../Admin/Admin_Navbar";
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
const Appoinments = () => {
  const { username } = useParams();
  const role = localStorage.getItem("role");
  const [data, setData] = useState([]);
  const [appoinmentRequestData,setAppoinmentRequestData]=useState([])
  const [loading,setLoading]=useState(true)
  const getAppoinments=async()=>{
    try {
      const collectionRef=collection(db, "appoinments")
      const q = query(collectionRef, where("clientId", "==", username, orderBy("timestamp", "desc")));
      const querySnapshot = await getDocs(q);
      const records = querySnapshot.docs.map((doc) => ({id: doc.id,...doc.data(),
    }));
    setData(records);
    } catch (error) {
      console.log(error)
    }
  }

  const getAppoinments_request=async()=>{
    try {
      const collectionRef=collection(db, "appoinments_request")
      const q = query(collectionRef, where("clientId", "==", username, orderBy("timestamp", "desc")));
    const querySnapshot = await getDocs(q);
    const records = querySnapshot.docs.map((doc) => ({id: doc.id,...doc.data(),
    }));
    setAppoinmentRequestData(records);
    setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAppoinments()
    getAppoinments_request()
  }, []);

  const cancelAppoinment = async (id) => {
    let confirmCancel = confirm("Click OK to cancel the Appoinment");
    if (confirmCancel === true) {
      try {
        await deleteDoc(doc(db, "appoinments", id));
        location.reload();
      } catch (error) {
        console.log(error)
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
      {role === "admin" ? <Admin_Navbar/> : <Client_Navbar />}
      <div className="p-6 w-full mt-6">
        <h1 className="font-medium text-xl text-gray-900 ">Appoinments</h1>
        <div className=" border-2 border-gray-300 border-dashed rounded-lg dark:border-gray-700 mt-4">
          {data.length === 0 ? (
            <div className="flex justify-center my-4 font-semibold">
              <span>No Appoinment Found</span>
            </div>
          ) : (
            <section className="bg-gray-50 shadow-md dark:bg-gray-900 m-4">
              {data.map((d, i) => (
                <div
                  key={i}
                  className="w-full text-sm border-b border-gray-300 flex flex-col md:flex-row justify-between p-3 gap-4 md:items-center"
                >
                  <span>
                    {`You have appoinment with ${d.userId}`}{" "}
                    <Link
                      to={`/Profile_Preview/${d.userId}`}
                      className="text-blue-700 hover:underline cursor-pointer"
                    >
                      View Profile
                    </Link>
                  </span>
                  <div className="flex gap-8 text-sm">
                    <span className="flex flex-col md:flex-row gap-1">
                      <label className="font-medium">Date:</label>{" "}
                      <label className="text-gray-600">{d.date}</label>
                    </span>
                    <span className="flex flex-col md:flex-row gap-1">
                      <label className="font-medium">Time:</label>{" "}
                      <label className="text-gray-600">{d.time}</label>
                    </span>
                    <span className="flex flex-col md:flex-row gap-1">
                      <label className="font-medium">Status:</label>{" "}
                      <label className="text-gray-600">{d.status}</label>
                    </span>
                  </div>
                  <div
                    className={`${d.status === "closed" || role==='admin' ? "hidden" : "flex"}`}
                  >
                    <button
                      onClick={() => cancelAppoinment(d.id)}
                      disabled={d.status === "closed"}
                      type="button"
                      className={`bg-blue-700 hover:bg-blue-800 cursor-pointer text-white text-xs inline-flex items-center  px-3 py-1 rounded`}
                    >
                      Cancel Appoinment
                    </button>
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
      <Appoinments_Request appoinmentRequestData={appoinmentRequestData} />
    </div>
    )}
    </>
  );
};

export default Appoinments;
