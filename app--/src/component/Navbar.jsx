import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "../style/Navbar.css"
import { useAuth } from '../context/authContext';

function Navbar() {

    const navigate = useNavigate();

    const handleNavigation = (path) =>{
        navigate(path);

    }

    const {logout, user} =  useAuth();

  return (
    <div className='menu'>
        <div className='leftmenu'>
            <Link to={"/"}>Movie Coach</Link>
        </div>
        <div className='menu-icon'>
            
        </div>
        <ul className='rightmenu'>
            <li onClick={ () => navigate("/coach") }>Content Coach</li>
            <li onClick={ () => navigate("/Profile") }>Profile</li>
            <li onClick={logout}>Log-out</li>
        </ul>
      
    </div>
  )
}

export default Navbar
