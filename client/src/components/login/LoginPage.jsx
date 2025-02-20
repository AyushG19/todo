import { React, useState } from 'react'
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom'
import { Eye, EyeOff } from "lucide-react";
import './loginpage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [recheckPassword, setRecheckPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(true);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res =await fetch(
        "http://localhost:4000/login",
        {
          method: 'POST',
          headers:{'Content-Type': 'application/json'},
          body: JSON.stringify({ username, password }),
          credentials:"include",
        });

      if (res.status === 401 || res.status === 403) {
        setMessage("username or password incorrect");
        return;
      }
      console.log(res);
      const data = await res.json();
      localStorage.setItem('accessToken', data.accessToken);
      navigate('/todo');
      return;
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleSignup = async (e) => {
    if (password != recheckPassword) {
      e.target.classList.add("vibrate");
      e.target.style.border = '1px solid red'
      setTimeout(() => {
        e.target.classList.remove('vibrate');
      }, 100)
      setMessage("*check password");
      return;
    };

    try {
      const res = fetch(
        "http://localhost:4000/signup",
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

      if (res.status === 403 || res.status === 401) {
        setUsernameAvailable(false);
        return;
      }
      navigate('/login');
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="wrapper">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path={'/login'}
          element={
            <>
              <h2>Login Account</h2>
              <input type='text' className='username' placeholder='Username' onChange={(e) => { setUsername(e.target.value) }} />
              {usernameAvailable ? "" : (<p className='message'>username not found</p>)}
              <div className='input-container'>
                <input type={showPassword ? "text" : "password"} className='password' placeholder='Enter Password' onChange={(e) => { setPassword(e.target.value) }} >
                </input>
                {showPassword ?
                  (<Eye className='eye-icon' size={13} onClick={() => { setShowPassword((prev) => !prev) }} />) :
                  (<EyeOff className='eye-icon' size={13} onClick={() => { setShowPassword((prev) => !prev) }} />)}
              </div>
              <button onClick={handleLogin} className='login-button'>Login</button>
              <p className='message'>{message}</p>
              <div div className='lower'>Don't have an account?
                <span onClick={() => navigate("/signup")}>signup</span></div>
            </>}></Route>
        <Route path='/signup'
          element={
            <>
              <h2>Sign Up Account</h2>
              <input type='text' className='username' placeholder='Choose Username' onChange={(e) => { setUsername(e.target.value) }} />
              {usernameAvailable ? "" : (<p className='message'>username unavailable</p>)}
              <div className='input-container'>
                <input type={showPassword ? "text" : "password"} className='password' placeholder='Enter Password' onChange={(e) => { setPassword(e.target.value) }} >
                </input>
                {showPassword ?
                  (<Eye className='eye-icon' size={13} onClick={() => { setShowPassword((prev) => !prev) }} />) :
                  (<EyeOff className='eye-icon' size={13} onClick={() => { setShowPassword((prev) => !prev) }} />)}
              </div>
              <div className='input-container'>
                <input type={showPassword ? "text" : "password"} className='password' placeholder='Re-enter Password' onChange={(e) => { setRecheckPassword(e.target.value) }} >
                </input>
                {showPassword ?
                  (<Eye className='eye-icon' size={13} onClick={() => { setShowPassword((prev) => !prev) }} />) :
                  (<EyeOff className='eye-icon' size={13} onClick={() => { setShowPassword((prev) => !prev) }} />)}
              </div>


              <button onClick={handleSignup} className='login-button'>Sign UP</button>
              <p className='message'>{message}</p>

              <div div className='lower'>Already have an account?
                <span onClick={() => navigate("/login")}>login</span></div>
            </>
          }></Route>
      </Routes>
    </div>
  )
}

export default LoginPage