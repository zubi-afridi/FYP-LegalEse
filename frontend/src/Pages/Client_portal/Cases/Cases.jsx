import React, { } from "react";
import Client_Navbar from "../Client_Navbar";
import Manage_Cases from "../../Lawyer_Portal/Cases/Manage_Cases";
const Cases = () => {
  return (
    <>
    <Client_Navbar/>
    <div className="w-full p-6 mt-6">
    <Manage_Cases/>
    </div>
    </>
  )
}

export default Cases
