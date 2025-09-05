import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/registerStyle.css'
import { toast } from "react-hot-toast";
import { useAuth } from '../context/authContext';

function Register() {

    //State variables
    const [form, setForm] = useState({username:'', email:'', password:''});
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const auth = useAuth();

    //Update the state form when an input feild changes.
    const handleChange = (e)=>{
        setForm({...form, [e.target.name]:e.target.value});
        setError('');
    }


    const handleSubmit = async (e) => {
        
        e.preventDefault();
        setError('');

        const email =  form.email;
        const password = form.password;
        const name = form.username;

        toast.loading("Signing Up", { id: "signup" })

        try{
            
            await auth?.signUp(name, email, password);
            toast.success("Signed Up Successfully", { id: "signup" })
            
        }catch(err){
            const errorMessage =
                err.message;
            toast.error(errorMessage, { id: "signup" });

            // Optionally also set the error state for inline display
            setError(err.message);
        }
    };

  return (
    <div className='auth-container'>
        <div className='form-box'>
            <header className='header'>Register</header>
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    name='username'
                    placeholder='Username'
                    onChange={handleChange}
                    required
                />
                <input
                    type='email'
                    name='email'
                    placeholder='Email'
                    onChange={handleChange}
                    required
                />
                <input
                    type='password'
                    name='password'
                    placeholder='Password'
                    onChange={handleChange}
                    required
                />
                <button type='submit'>Register</button>
                {error && <p className='error-message'>{error}</p>}
            </form>
            <div className='signup'>
                <span>
                    Already Have an Account? <Link to={"/login"}>Login</Link>
                </span>
            </div>
        </div>
    </div>
  )
}

export default Register
