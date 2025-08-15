

import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
function Page() {
   const [username,setusername]=useState("");
   const [email,setemail]=useState("");
   const [password,setpassword]=useState("");
  const navigate = useNavigate();
   const submithandler=async(e)=>{
      console.log("Submitted");
      e.preventDefault();
      const userData={
        username,
        email,
        password
      }
    try {
            const response = await axios.post("http://localhost:8000/api/register", userData, {
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.data.success) {
            console.log("Signup successful:", response.data);
            setusername("");
            setemail("");
            setpassword("");
            navigate("/login");
        } else {
            console.error("Signup failed:", response.data);
        }
    } catch (error) {
        console.error("Error during signup:", error);
    }
}

  return (
   <>
   <div>
        <h1>Signup Page</h1>
        <form onSubmit={submithandler}>
             <div>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" value={username} onChange={(e) => setusername(e.target.value)} />
             </div>
             <div>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" value={email} onChange={(e) => setemail(e.target.value)} />
             </div>
             <div>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" value={password} onChange={(e) => setpassword(e.target.value)} />
             </div>
             <button type="submit">Submit</button>
        </form>
   </div>
   </>
  )
}

export default Page