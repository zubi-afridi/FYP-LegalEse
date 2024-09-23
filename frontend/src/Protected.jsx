import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Protected = ({Page, Role}) => {
    const navigate=useNavigate();
    useEffect(()=>{
        let login=localStorage.getItem('login')
        let role=localStorage.getItem('role')
        if(role==='admin'){
          Role=''
        }
        if(!login) {
            navigate('/Login')
        }
         else if( Role!=='' &&  role!==Role ){
           navigate('/Login')
        }
    },[])
  return (
    <div>
        <Page/>
    </div>
  )
}

export default Protected
