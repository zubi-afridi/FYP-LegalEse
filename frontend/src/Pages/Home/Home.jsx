import React, {useEffect } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  useEffect(()=>{
    let login=localStorage.getItem('login')
    let role=localStorage.getItem('role')
    let username=localStorage.getItem('username')
    if(login){
      if(role==='lawyer'){
        navigate(`/Lawyer/${username}/Dashbord`)
      } else if(role==='client'){
        navigate(`/Client/${username}/Explore`)
      } else if(role==='admin'){
        navigate(`/Admin/${username}/Manage_Users`)
      }
    }
  },[])
  return (
    <div>
      <Navbar/>
      <Hero/>
    </div>
  );
};

export default Home;
