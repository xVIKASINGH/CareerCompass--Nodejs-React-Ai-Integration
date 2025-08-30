"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import {toast } from "sonner";
function SignupPage() {
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();

  const submithandler = async (e) => {
  
    e.preventDefault();
    const userData = { username, email, password };
    if(username.trim()==="" || email.trim()==="" || password.trim()==="") {
      toast.error("All fields are required");
      return;
    }
   
       if(username.length<4){
      toast.error("username must be 4 character long");
      return;
    }
    if(password.length<5){
      toast.error("Password must be 6 character long");
      return;
    }
 
    try {
      const response = await axios.post(
        "http://localhost:8000/api/register",
        userData,
        { headers: { "Content-Type": "application/json" } ,
         withCredentials:true}
      );
      if (response.data.success) {
        console.log("Signup successful:", response.data);
        setusername("");
        setemail("");
        setpassword("");
        navigate("/addresume");
      } else {
        console.error("Signup failed:", response.data);
      }
    } catch (error) {
      toast.error("Signup error: " + error.message);
      console.error("Error during signup:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-950 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="w-[400px] bg-zinc-900/70 border border-zinc-800 backdrop-blur-xl shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-white tracking-tight">
               Create Your Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={submithandler}>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-zinc-300">
                  Username
                </Label>
                <Input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setusername(e.target.value)}
                  placeholder="Enter your username"
                  className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  placeholder="you@example.com"
                  className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">
                  Password
                </Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-indigo-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-5 text-md font-semibold transition-all duration-300"
              >
                Sign Up
              </Button>
            </form>
            <p className="text-center text-sm text-zinc-400 mt-6">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-indigo-400 hover:underline underline-offset-4"
              >
                Sign In
              </a>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default SignupPage;
