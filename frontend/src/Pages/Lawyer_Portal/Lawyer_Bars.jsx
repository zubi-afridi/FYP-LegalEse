import React, {useState } from "react";
import Lawyer_Sidebar from "./Lawyer_Sidebar";
import Lawyer_Navbar from "./Lawyer_Navbar";
const Lawyer_Bars = ({profile_img}) => {
  const [toggleSidebar, setToggleSidebar] = useState(true);
  const handleToggleSidebar = () => {
    setToggleSidebar(!toggleSidebar);
  };
  return (
    <div>
      <Lawyer_Navbar profile_img={profile_img} handleToggleSidebar={handleToggleSidebar} />
      <Lawyer_Sidebar
        toggleSidebar={toggleSidebar}
        handleToggleSidebar={handleToggleSidebar}
      />
    </div>
  );
};

export default Lawyer_Bars;
