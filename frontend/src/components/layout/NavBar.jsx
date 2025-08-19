"use client"

import { useState } from "react"
import { Menu, X, Zap } from "lucide-react"
import { useNavigate } from "react-router-dom"
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <nav className="bg-gray-900 shadow-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-wide">CareerCompass</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium"
            >
              About
            </a>
            <a
              href="/login"
              className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium"
            >
              Sign in
            </a>
            <button  onClick={() => navigate("/signup")}className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md font-semibold">
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800 bg-gray-900">
            <div className="flex flex-col space-y-4">
              <a
                href="#features"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium"
              >
                Pricing
              </a>
              <a
                href="#about"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium"
              >
                Contact
              </a>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md font-semibold w-fit">
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
