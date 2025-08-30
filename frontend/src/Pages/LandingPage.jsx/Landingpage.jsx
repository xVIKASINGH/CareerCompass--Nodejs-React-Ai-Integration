"use client"

import { useCallback, useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import axios from "axios"
import { Upload, FileText, Zap, Target, Star, CheckCircle, ArrowRight, Shield, Clock, TrendingUp } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom"
function ScoreDialog({ isOpen, onClose, score, responseMessage }) {
  const [animatedScore, setAnimatedScore] = useState(0)
   const navigate=useNavigate();
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
      <DialogContent className="bg-white border border-slate-200 text-slate-800 max-w-md rounded-2xl p-8 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-slate-800">Resume Analysis Complete</DialogTitle>
          <DialogDescription className="text-center text-slate-600">
            Here's how your resume matches the job requirements
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-6">
          <div className="relative w-32 h-32 mb-6">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-slate-200"
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
                style={{ transition: "stroke-dasharray 0.5s ease-in-out" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-slate-800">{animatedScore}%</span>
            </div>
          </div>

          <p className="text-center text-slate-600 mb-6 px-4">{responseMessage}</p>

          <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"onClick={()=>navigate("/signup")}>
            Sign up to improve your score
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function LandingPage() {
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
        headers: { "Content-Type": "multipart/form-data" },
      })

      const scoreValue = Number.parseInt(response.data.data)
      setScore(scoreValue)
      setResponseMessage(response.data.message || "Analysis completed successfully!")
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
      <NavBar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-slate-50 py-20 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-slate-800 mb-6">
              AI-Powered Resume{" "}
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">Analysis</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Get instant feedback on your resume and discover how well it matches job requirements. Powered by advanced
              AI to help you land your dream job.
            </p>
         
          </div>

          {/* Main Analysis Tool */}
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 mb-16 shadow-lg">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Resume Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-500" />
                  Upload Your Resume
                </h3>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                    isDragActive
                      ? "border-blue-400 bg-blue-50 scale-105"
                      : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
                  }`}
                >
                  <input {...getInputProps()} />
                  {resumeFile ? (
                    <div className="text-center">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      <p className="text-green-600 font-semibold text-lg">{resumeFile.name}</p>
                      <p className="text-sm text-slate-500 mt-1">Click to change file</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-700 font-medium">
                        {isDragActive ? "Drop your resume here..." : "Drag & drop your resume or click to browse"}
                      </p>
                      <p className="text-sm text-slate-500 mt-2">Supports PDF, DOC, DOCX (Max 10MB)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Description */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  Job Description
                </h3>
                <textarea
                  placeholder="Paste the complete job description here..."
                  className="w-full h-48 bg-white border border-slate-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm text-slate-700 placeholder-slate-400"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">{jobDescription.length} characters</span>
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading || !resumeFile || !jobDescription.trim()}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
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
                  </Button>
                </div>
              </div>
            </div>

            {responseMessage && responseType === "error" && (
              <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <p className="font-medium text-red-600">{responseMessage}</p>
                </div>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 bg-white/60 rounded-xl border border-slate-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Secure & Private</h3>
              <p className="text-slate-600 text-sm">Your resume data is encrypted and never stored permanently</p>
            </div>

            <div className="text-center p-6 bg-white/60 rounded-xl border border-slate-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Instant Results</h3>
              <p className="text-slate-600 text-sm">Get detailed analysis and feedback in under 30 seconds</p>
            </div>

            <div className="text-center p-6 bg-white/60 rounded-xl border border-slate-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Improve Your Chances</h3>
              <p className="text-slate-600 text-sm">Actionable insights to optimize your resume for any job</p>
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
