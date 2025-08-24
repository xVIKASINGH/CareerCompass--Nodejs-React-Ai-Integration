"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { User, Menu, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
   const navigate=useNavigate();
  useEffect(() => {
    checkLoginStatus()
  }, [])

  const checkLoginStatus = async () => {
    try {
      const response=await fetch("http://localhost:8000/api/auth",{
        method:"GET",
        credentials:"include",
        
      })
      if (!response.ok) {
      setIsLoggedIn(false)
      return
    }

      const data = await response.json()
    setIsLoggedIn(data?.data?.authenticated === true)
    } catch (error) {
      setIsLoggedIn(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RA</span>
            </div>
            <span className="text-xl font-semibold text-slate-800">ResumeAnalyzer</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-600 hover:text-slate-800 transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-slate-600 hover:text-slate-800 transition-colors">
              Pricing
            </a>
            <a href="#about" className="text-slate-600 hover:text-slate-800 transition-colors">
              About
            </a>

            {isLoading ? (
              <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
            ) : isLoggedIn ? (
              <Button 
  className="bg-blue-500 hover:bg-blue-600 text-white"
  onClick={() => navigate("/dashboard")}
>
  <User className="w-4 h-4 mr-2" />
  Go to Dashboard
</Button>

            ) : (
              <div className="flex items-center gap-3">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-800" onClick={()=>navigate("/login")}>
                  Sign In
                </Button>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={()=>navigate("/signup")}>Get Started</Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-800"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-slate-600 hover:text-slate-800 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-800 transition-colors">
                Pricing
              </a>
              <a href="#about" className="text-slate-600 hover:text-slate-800 transition-colors">
                About
              </a>

              {isLoading ? (
                <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
              ) : isLoggedIn ? (
               <Button 
  className="bg-blue-500 hover:bg-blue-600 text-white w-fit"
  onClick={() => navigate("/dashboard")}
>
  <User className="w-4 h-4 mr-2" />
  Go to Dashboard
</Button>

              ) : (
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" className="text-slate-600 hover:text-slate-800 w-fit">
                    Sign In
                  </Button>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white w-fit">Get Started</Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
