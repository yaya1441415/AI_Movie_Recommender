import React, { useState } from 'react'
import "../style/forgotPassword.css"
import { forgotPassword } from '../helpers/api-communicators';
import toast from 'react-hot-toast';
import {useNavigate } from 'react-router-dom';


function ForgotPassword() {
    
    const [email, setEmail] = useState("");
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
      e.preventDefault()
      toast.loading("Sending reset link...", { id: "password" })


      try{

        await forgotPassword(email)
        toast.success("Link Sent",  { id: "password" })
        
      }catch(error){
        console.log(error)
        toast.error("Something went wrong", { id: "password" });

      }
      
    }
  return (
    <div className='page'>
      <div className='box'>
        <h1>Enter Your Email:</h1>
        
        <form className= "y" onSubmit={handleSubmit}>
          <input
            name='email'
            type='Email'
            placeholder='Email'
            onChange={ (e) => {setEmail(e.target.value)}}
            required
          />
          <button className= "btn" type='submit'>Submit</button>
        </form>
        <button type = "submit" onClick={() => navigate("/")}>Home</button>
        
      </div>
      
    </div>
  )
}

export default ForgotPassword
