import { useState } from 'react'
import {  BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Register from './component/Register'
import Login from './component/Login'
import Home from './component/home'
import Dashboard from './component/dashboard'
import ForgotPassword from './component/forgotPassword'
import ContentCoach from './component/ContentCoach'
import ResetPassword from './component/ResetPassword'

import Profile from './component/profile'


function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path = '/register' element = {<Register/>}/>
        <Route path = '/login' element = {<Login />}/>
        <Route path = '/' element = {<Home/>}/>
        <Route path='/Dashboard' element = {<Dashboard/>}/>
        <Route path='/forgotPassword' element = {<ForgotPassword/>}/>
        <Route path='/coach' element = {<ContentCoach/>}/>
        <Route path='/ResetPassword' element = {<ResetPassword/>}/>
        <Route path='/Profile' element = {<Profile/>}/>
        
      </Routes>
    </Router>
  )
}

export default App
