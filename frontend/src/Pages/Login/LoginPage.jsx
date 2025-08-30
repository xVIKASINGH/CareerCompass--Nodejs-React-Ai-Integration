
import React, { useState } from "react";
import { data, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { toast } from "sonner"
function LoginPage() {
  const navigate = useNavigate();
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");

  const submithandler = async (e) => {
    e.preventDefault();
    const userData = { username, password };
    if(username.trim()==0 || password.trim()=="") {
      toast.error("Username and Password cannot be empty");
      return;
    }
   
    try {
      const response = await axios.post(
        "http://localhost:8000/api/login",
        userData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        console.log("Login successful:", response.data);
        setusername("");
        setpassword("");
        navigate("/addresume");
      } else {
        toast.error("Login failed: " + response.data.message);
        console.error("Login failed:", response.data);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong";
    toast.error(msg);
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
              Welcome Back
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
                  className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-indigo-500"
                  placeholder="Enter your username"
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
                  className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-indigo-500"
                  placeholder="••••••••"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-5 text-md font-semibold transition-all duration-300"
              >
                Sign In
              </Button>
            </form>
            <p className="text-center text-sm text-zinc-400 mt-6">
              Don’t have an account?{" "}
              <a
                href="/signup"
                className="text-indigo-400 hover:underline underline-offset-4"
              >
                Create one
              </a>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default LoginPage;
