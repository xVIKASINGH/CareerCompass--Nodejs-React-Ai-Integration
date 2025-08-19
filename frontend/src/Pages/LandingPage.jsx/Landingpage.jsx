import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import {
  Upload,
  FileText,
  Zap,
  Target,
  Star,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Navbar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { useResume } from "@/contexts/ResumeContext";

function ScoreDialog({ isOpen, onClose, score, responseMessage }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (isOpen && score != null) {
      let current = 0;
      const increment = score / 30;
      const timer = setInterval(() => {
        current += increment;
        if (current >= score) {
          current = score;
          clearInterval(timer);
        }
        setAnimatedScore(Math.round(current));
      }, 50);

      return () => clearInterval(timer);
    }
  }, [isOpen, score]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border border-white/20 text-white max-w-md rounded-2xl p-8 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Resume Analysis Complete
          </DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            Here's how your resume matches the job requirements
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-6">
          <div className="relative w-32 h-32 mb-6">
            <svg
              className="w-32 h-32 transform -rotate-90"
              viewBox="0 0 120 120"
            >
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
                style={{ transition: "stroke-dasharray 0.5s ease-in-out" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {animatedScore}%
              </span>
            </div>
          </div>

          <p className="text-center text-gray-300 mb-6 px-4">
            {responseMessage}
          </p>

          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center gap-2">
            Sign up to improve your score
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function LandingPage() {

  const { resumeFile, setResumeFile, jobDescription, setJobDescription } =
    useResume();

  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseType, setResponseType] = useState("");
  const [showScoreDialog, setShowScoreDialog] = useState(false);
  const [score, setScore] = useState(0);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setResumeFile(acceptedFiles[0]);
    },
    [setResumeFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc", ".docx"],
    },
    multiple: false,
  });

  const handleSubmit = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      setResponseMessage(
        "Please upload a resume and provide a job description."
      );
      setResponseType("error");
      return;
    }

    setIsLoading(true);
    setResponseMessage("");

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("jobDescription", jobDescription);

      const response = await axios.post(
        "http://localhost:8000/api/checkscore",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const scoreValue = parseInt(response.data.data);
      setScore(scoreValue);
      setResponseMessage(
        response.data.message || "Analysis completed successfully!"
      );
      setResponseType("success");
      setShowScoreDialog(true);
    } catch (error) {
      setResponseMessage(
        error.response?.data?.message ||
          "An error occurred while processing your request."
      );
      setResponseType("error");
    } finally {
      setIsLoading(false);
    }
  };

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
                      <p className="text-green-400 font-semibold text-lg">
                        {resumeFile.name}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Click to change file
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-white font-medium">
                        {isDragActive
                          ? "Drop your resume here..."
                          : "Drag & drop your resume or click to browse"}
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        Supports PDF, DOC, DOCX (Max 10MB)
                      </p>
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
                  placeholder="Paste the complete job description here..."
                  className="w-full h-48 bg-white/5 border border-white/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm text-white placeholder-gray-400"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    {jobDescription.length} characters
                  </span>
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

      <Footer />

      <ScoreDialog
        isOpen={showScoreDialog}
        onClose={() => setShowScoreDialog(false)}
        score={score}
        responseMessage={responseMessage}
      />
    </>
  );
}
