

import { useCallback, useState ,useEffect} from "react"
import { useDropzone } from "react-dropzone"
import axios from "axios"
import {
  Upload,
  FileText,
  Zap,
  Target,
  TrendingUp,
  Star,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  Twitter,
  Linkedin,
  Github,
  Mail,
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-black/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">ResumeAI</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">
              About
            </a>
            <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
              Contact
            </a>
            <button className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">
                About
              </a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </a>
              <button className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors w-fit font-medium">
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ResumeAI</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              AI-powered resume analysis that helps job seekers optimize their resumes for better job matching and
              higher interview rates.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Product</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Integrations
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 ResumeAI. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function ScoreDialog({ isOpen, onClose, score, responseMessage }) {
  const [animatedScore, setAnimatedScore] = useState(0)

  
  useEffect(() => {
    if (isOpen && score != null) {
      let current = 0
      const increment = score / 30
      const timer = setInterval(() => {
        current += increment
        if (current >= score) {
          current = score
          clearInterval(timer)
        }
        setAnimatedScore(Math.round(current))
      }, 50)

      return () => clearInterval(timer)
    }
  }, [isOpen, score])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Resume Analysis Complete</DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            Here's how your resume matches the job requirements
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-8">
          {/* Animated Score Circle */}
          <div className="relative w-32 h-32 mb-6">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-700"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                className="text-blue-500"
                strokeDasharray={`${(animatedScore / 100) * 314} 314`}
                style={{
                  transition: "stroke-dasharray 0.5s ease-in-out",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">{animatedScore}%</span>
            </div>
          </div>

          {/* Score Message */}
          <p className="text-center text-gray-300 mb-8 px-4">{responseMessage}</p>

          {/* Sign Up Button */}
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center gap-2">
            Sign up to improve your score
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}



export default function Landingpage() {
  const [resumeFile, setResumeFile] = useState(null)
  const [jobDescription, setJobDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [responseMessage, setResponseMessage] = useState("")
  const [responseType, setResponseType] = useState("")
  const [showScoreDialog, setShowScoreDialog] = useState(false)
  const [score, setScore] = useState(0)

  const onDrop = useCallback((acceptedFiles) => {
    setResumeFile(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc", ".docx"],
    },
    multiple: false,
  })

  const handleSubmit = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      setResponseMessage("Please upload a resume and provide a job description.")
      setResponseType("error")
      return
    }

    setIsLoading(true)
    setResponseMessage("")

    try {
      const formData = new FormData()
      formData.append("resume", resumeFile)
      formData.append("jobDescription", jobDescription)

      const response = await axios.post("http://localhost:8000/api/checkscore", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      const responseData = response.data
        console.log("Response data:", responseData.data)
      const scoreValue = parseInt(responseData.data)
       console.log("here is score value"+scoreValue);
      setScore(scoreValue)
      setResponseMessage(responseData.message || "Analysis completed successfully!")
      setResponseType("success")
      setShowScoreDialog(true)
    } catch (error) {
      setResponseMessage(error.response?.data?.message || "An error occurred while processing your request.")
      setResponseType("error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navbar />

      <section className="bg-gradient-to-br from-black via-gray-900 to-black py-20 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">
              AI-Powered Resume{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Analysis
              </span>
            </h1>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>Trusted by 50,000+ job seekers</span>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-16">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Resume Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-400" />
                  Upload Your Resume
                </h3>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                    isDragActive
                      ? "border-blue-400 bg-blue-500/10 scale-105"
                      : "border-white/20 hover:border-blue-400/50 hover:bg-white/5"
                  }`}
                >
                  <input {...getInputProps()} />
                  {resumeFile ? (
                    <div className="text-center">
                      <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                      <p className="text-green-400 font-semibold text-lg">{resumeFile.name}</p>
                      <p className="text-sm text-gray-400 mt-1">Click to change file</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-white font-medium">
                        {isDragActive ? "Drop your resume here..." : "Drag & drop your resume or click to browse"}
                      </p>
                      <p className="text-sm text-gray-400 mt-2">Supports PDF, DOC, DOCX (Max 10MB)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Description */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  Job Description
                </h3>
                <textarea
                  placeholder="Paste the complete job description here. Include requirements, responsibilities, and qualifications for the best analysis..."
                  className="w-full h-48 bg-white/5 border border-white/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm text-white placeholder-gray-400"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">{jobDescription.length} characters</span>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || !resumeFile || !jobDescription.trim()}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Analyze Resume
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {responseMessage && responseType === "error" && (
              <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <p className="font-medium text-red-400">{responseMessage}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-900" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powerful AI-Driven Features</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our advanced AI technology provides comprehensive resume analysis to help you stand out
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-white/10 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Smart Matching</h3>
              <p className="text-gray-300">
                AI analyzes keyword alignment, skill matching, and requirement coverage between your resume and job
                description.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-white/10 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Resume Scoring</h3>
              <p className="text-gray-300">
                Get a detailed compatibility score with actionable insights on how to improve your resume for specific
                roles.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/10 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Instant Feedback</h3>
              <p className="text-gray-300">
                Receive immediate, detailed feedback on missing keywords, skills gaps, and optimization suggestions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">What's New</h2>
            <p className="text-xl text-gray-300">Latest updates and improvements to our AI resume analyzer</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium text-green-400">NEW</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Enhanced AI Model v2.0</h3>
              <p className="text-gray-300 mb-4">
                Our latest AI model provides 40% more accurate matching and better understands industry-specific
                terminology.
              </p>
              <div className="flex items-center text-blue-400 font-medium">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm font-medium text-blue-400">UPDATED</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Multi-Format Support</h3>
              <p className="text-gray-300 mb-4">
                Now supports more resume formats including creative designs, ATS-friendly templates, and international
                formats.
              </p>
              <div className="flex items-center text-blue-400 font-medium">
                <span>Try it now</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-blue-100">Resumes Analyzed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">85%</div>
              <div className="text-blue-100">Match Accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">2.5x</div>
              <div className="text-blue-100">Interview Rate Increase</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100">AI Availability</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <ScoreDialog
        isOpen={showScoreDialog}
        onClose={() => setShowScoreDialog(false)}
        score={score}
        responseMessage={responseMessage}
      />
    </>
  )
}

