import {  useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import "../style/loginStyle.css"
import { useAuth } from '../context/authContext';


function Login() {
    const [form, setForm] = useState({email: "", password: ""});
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const {login, isLoggedIn} = useAuth();

    const handleChange = (e)=>{

        setForm({...form, [e.target.name]: e.target.value});

    } 

   
    useEffect(() => {
        
        if(isLoggedIn){
            navigate("/Dashboard");
        }

    }, [isLoggedIn, navigate])

    const handleSubmit = async (e)=>{

        e.preventDefault();
        setError("");

        try{
            
            await login(form.email, form.password); 
            
        }catch(err){
            console.log(err)
            setError("Invalid email or password. Please try again.");
        }
    }







  return (
   
        <div className='login-page'>
            <div className='login-container'>
                <div className='login-box'>
                    <h1>Welcome Back</h1>
                    <p>Sign in to continue</p>
                    <form onSubmit={handleSubmit}>
                        <input 
                            type = 'email'
                            name = 'email'
                            value={form.email}
                            placeholder = 'Email'
                            onChange = {handleChange}
                            required
                        />
                        <input
                            type = 'password'
                            name = 'password'
                            value={form.password}
                            placeholder = 'Password'
                            onChange = {handleChange}
                            required
                        />
                        {error && <p className = "error-message">{error}</p>}

                        <button type="submit">Login</button>

                    </form>

                    <div className='forgot-password '>
                        <Link to = "/forgotPassword">Forgot password</Link>

                    </div>
                    <div className='signup-link'>
                        Don't Have an Account? <Link to = "/register">Sign up</Link>
                    </div>
                </div>
            </div>
        </div>
    )
 
}

export default Login
