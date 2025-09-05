import React, { useState } from 'react'
import{useLocation, useParams} from 'react-router-dom'
import "../style/ResetPassword.css"
import axios from "axios";
import {Reset_Password}from "../helpers/api-communicators";
import {  useNavigate } from 'react-router-dom';

function ResetPassword() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams =  new URLSearchParams(location.search);
    const token = searchParams.get("token");


    const handleSubmit = async(e) =>{
        
      e.preventDefault()

      if(confirmPassword !== password){

        alert("Password do not match!");
        return;

      }

      try{

        await Reset_Password(token, password);
      
     

        alert("Password reset successful!");
        navigate('/')

      }catch(err){
        console.log(err);
        alert("FAiled to reset password. The link might be invalid or expired.")
      }

    }


  return (
    <div className='page'>
      <form onSubmit={handleSubmit}>
        <h1>New Password</h1>
        <input
            type = "password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
        />
        <h2>Confirm New Password</h2>
        <input
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
        />
        <button type = "submit">Reset Password</button>
        <button type = "submit" onClick={() => navigate("/")}>Home</button>
      </form>
    </div>
  )
}

export default ResetPassword
