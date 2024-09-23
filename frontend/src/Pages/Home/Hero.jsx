import React from 'react'
import { Link,useNavigate } from 'react-router-dom'
const Hero = ({handleSignupModal}) => {
  const navigate=useNavigate()
  const setRole=()=>{
    sessionStorage.setItem("userRole", "client");
    navigate('/signup')
  }
  return (
    <div>
      <section className="bg-white dark:bg-gray-900">
        <div className="grid max-w-screen-xl p-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
              Lawyers and Clients Management System
            </h1>
            <p className="max-w-2xl mb-6 font-regular text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
              LegalEse is a Management System which helps the Lawyers to Manage
              Cases, Clients, Appointments and much more. It also help the
              Client to book Appointment with lawyer.{" "}
            </p>
            
              <button
              onClick={setRole}
                type="button"
                className="text-white sm:hidden bg-black hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Signup
              </button>
              
          </div>
          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <img src="src\assets\heroimage.svg" alt="mockup" />
          </div>
        </div>
      </section>
    </div>
  )
}

export default Hero
