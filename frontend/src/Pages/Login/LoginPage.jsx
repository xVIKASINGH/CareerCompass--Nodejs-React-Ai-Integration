import React from 'react'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

function loginPage() {
    const navigate=useNavigate();
    const [username,setusername]=useState("");
    const [password,setpassword]=useState("");
    const submithandler=async(e)=>{
        e.preventDefault();
        const userData={
            username,
            password
        }
        try {
            const response = await axios.post("http://localhost:8000/api/login", userData, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (response.data.success) {
                console.log("Login successful:", response.data);
                setusername("");
                setpassword("");
                navigate("/dashboard");
            } else {
                console.error("Login failed:", response.data);
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
    }
  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={submithandler}>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" value={username} onChange={(e) => setusername(e.target.value)} />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setpassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default loginPage