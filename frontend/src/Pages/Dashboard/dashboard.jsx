"use client";

import { useState, useEffect, useRef } from "react";
import {
  Upload,
  FileText,
  Target,
  TrendingUp,
  Users,
  Award,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Eye,
  Download,
  Sparkles,
  ArrowRight,
  Star,
  Zap,
  BookOpen,
  ExternalLink,
  Plus,
  BarChart3,
  LogOut,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Dashboard() {
  // Backend data state
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [score, setScore] = useState(null);
  const [comment, setComment] = useState(null);
  const [summary, setSummary] = useState(null);
  const [skillGap, setSkillGap] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [strength, setStrength] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [backendError, setBackendError] = useState(null);
  const navigate = useNavigate();

  // Local state for new uploads
  const [localResumeFile, setLocalResumeFile] = useState(null);
  const [localJobDescription, setLocalJobDescription] = useState("");

  // Drag & drop state
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const parseMarkdownJSON = (jsonString) => {
    if (!jsonString) return null;

    try {
      // Remove markdown code block wrapper if present
      let cleanJson = jsonString.trim();
      if (cleanJson.startsWith("```json\n")) {
        cleanJson = cleanJson.replace(/^```json\n/, "").replace(/\n```$/, "");
      } else if (cleanJson.startsWith("```\n")) {
        cleanJson = cleanJson.replace(/^```\n/, "").replace(/\n```$/, "");
      }

      return JSON.parse(cleanJson);
    } catch (e) {
      console.error("Failed to parse JSON:", e, "Original string:", jsonString);
      return null;
    }
  };

  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const res = await fetch("http://localhost:8000/api/feedback", {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`Server responded with ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        console.log("Fetched data:", data);
        setBackendError(null); // Clear any previous errors

        if (data.feedbacks && data.feedbacks.length > 0) {
          const feedback = data.feedbacks[0];

          setResumeUrl(feedback.resume_url || null);
          setJobDescription(feedback.job_description || "");
          setScore(feedback.score ?? null); // Score remains as number
          setComment(feedback.comment || null);

          const parsedSummary = parseMarkdownJSON(feedback.summary);
          setSummary(parsedSummary?.summary || feedback.summary || null);

          const parsedSkillGap = parseMarkdownJSON(feedback.skill_gap);
          setSkillGap(
            parsedSkillGap?.skill_gap ||
              (feedback.skill_gap ? feedback.skill_gap.split("\n").filter((s) => s.trim()) : null)
          );

          const parsedSuggestions = parseMarkdownJSON(feedback.suggestions);
          setSuggestions(
            parsedSuggestions ||
              (feedback.suggestions ? feedback.suggestions.split("\n").filter((s) => s.trim()) : null)
          );

          const parsedStrength = parseMarkdownJSON(feedback.strength);
          setStrength(
            parsedStrength?.strength ||
              (feedback.strength ? feedback.strength.split("\n").filter((s) => s.trim()) : null)
          );
        }
      } catch (err) {
        console.error("Error fetching backend data:", err);
        if (err.name === "AbortError") {
          setBackendError("Connection timeout. Please check if your backend server is running.");
        } else if (err.message.includes("Failed to fetch")) {
          setBackendError("Cannot connect to backend server. Please ensure it's running on http://localhost:8000");
        } else {
          setBackendError(`Backend error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBackendData();
  }, []);

  const handleLogOut = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/logout", {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        navigate("/");
      }
    } catch (error) {
      toast.error("Failed to Log out", error);
    }
  };

  const uploadData = async () => {
    if (!localResumeFile && !localJobDescription) return;

    try {
      setUploadStatus("uploading");
      setBackendError(null); // Clear any previous errors

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for uploads

      const formData = new FormData();
      if (localResumeFile) formData.append("resume", localResumeFile);
      if (localJobDescription) formData.append("jobDescription", localJobDescription);

      const uploadResponse = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!uploadResponse.ok) throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);

      // Fetch updated data
      const res = await fetch("http://localhost:8000/api/feedback", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      if (data.feedbacks?.length > 0) {
        const feedback = data.feedbacks[0];
        setResumeUrl(feedback.resume_url || null);
        setJobDescription(feedback.job_description || "");
        setScore(feedback.score ?? null);
        setComment(feedback.comment || null);

        const parsedSummary = parseMarkdownJSON(feedback.summary);
        setSummary(parsedSummary?.summary || feedback.summary || null);

        const parsedSkillGap = parseMarkdownJSON(feedback.skill_gap);
        setSkillGap(
          parsedSkillGap?.skill_gap ||
            (feedback.skill_gap ? feedback.skill_gap.split("\n").filter((s) => s.trim()) : null)
        );

        const parsedSuggestions = parseMarkdownJSON(feedback.suggestions);
        setSuggestions(
          parsedSuggestions || (feedback.suggestions ? feedback.suggestions.split("\n").filter((s) => s.trim()) : null)
        );

        const parsedStrength = parseMarkdownJSON(feedback.strength);
        setStrength(
          parsedStrength?.strength ||
            (feedback.strength ? feedback.strength.split("\n").filter((s) => s.trim()) : null)
        );
      }

      // Clear local state
      setLocalResumeFile(null);
      setLocalJobDescription("");
      setUploadStatus("success");

      setTimeout(() => setUploadStatus("idle"), 3000);
    } catch (err) {
      console.error("Error uploading data:", err);
      setUploadStatus("error");
      if (err.name === "AbortError") {
        setBackendError("Upload timeout. Please try again.");
      } else {
        setBackendError(`Upload failed: ${err.message}`);
      }
      setTimeout(() => setUploadStatus("idle"), 3000);
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFileUpload(files[0]);
  };

  const handleFileUpload = (file) => {
    if (file && file.type === "application/pdf") {
      setLocalResumeFile(file);
    } else {
      alert("Please upload a PDF file");
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return "from-emerald-500 to-teal-600";
    if (score >= 60) return "from-amber-500 to-orange-600";
    return "from-red-500 to-rose-600";
  };

  const getScoreBorderColor = (score) => {
    if (score >= 80) return "border-emerald-500";
    if (score >= 60) return "border-amber-500";
    return "border-red-500";
  };

  // Check if we have existing data to show
  const hasExistingData = resumeUrl || jobDescription || score !== null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-4 animate-fade-in-up">
          {/* Loader Box */}
          <div className="w-16 h-16 bg-white border border-blue-100 shadow-lg rounded-2xl flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>

          {/* Text */}
          <span className="text-blue-500 font-medium text-lg tracking-wide">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className=" mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {hasExistingData && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => (window.location.href = "/addresume")}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium shadow-sm hover:shadow-md transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Resume</span>
                </button>
                <button
                  onClick={handleLogOut}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-400 to-red-400 hover:from-red-400 hover:to-red-700 text-white rounded-xl font-medium shadow-sm hover:shadow-md transition-all"
                >
                  <LogOut className="w-5 h-4" />
                  <span>Log out</span>
                </button>
              </div>
            )}

            {/* Status Messages */}
            <div className="flex items-center space-x-4">
              {backendError && (
                <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2 max-w-md">
                  <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span className="text-red-700 text-sm font-medium truncate">{backendError}</span>
                </div>
              )}

              {uploadStatus === "success" && (
                <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 text-sm font-medium">Analysis Complete</span>
                </div>
              )}
              {uploadStatus === "error" && (
                <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-red-700 text-sm font-medium">Upload Failed</span>
                </div>
              )}
              {uploadStatus === "uploading" && (
                <div className="flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-blue-700 text-sm font-medium">Analyzing...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {backendError && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-800 mb-1">Backend Connection Issue</h3>
                <p className="text-red-700 text-sm mb-2">{backendError}</p>
                <div className="text-red-600 text-sm space-y-1">
                  <p>
                    • Ensure your backend server is running on{" "}
                    <code className="bg-red-100 px-1 rounded">http://localhost:8000</code>
                  </p>
                  <p>• Check that CORS is properly configured to allow requests from this domain</p>
                  <p>
                    • Verify the <code className="bg-red-100 px-1 rounded">/api/feedback</code> and{" "}
                    <code className="bg-red-100 px-1 rounded">/api/upload</code> endpoints are working
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto px-2 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_300px] gap-8 h-full">
          {/* Left Panel - Resume Upload/Viewer */}
          <div className="space-y-6">
            {hasExistingData ? (
              <>
                {/* Resume Viewer */}
                {resumeUrl && (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-4 py-2 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-slate-100 rounded-xl">
                            <FileText className="w-5 h-5 text-slate-700" />
                          </div>
                          <div>
                            <h2 className="text-lg font-semibold text-slate-800">Current Resume</h2>
                            <p className="text-sm text-slate-600">Your uploaded resume</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <a
                            href={resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 px-3 py-1 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </a>
                          <a
                            href={resumeUrl}
                            download
                            className="flex items-center space-x-1 px-3 py-1 text-sm font-medium text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="w-full h-150 border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                        <iframe
                          src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                          className="w-full h-full"
                          title="Resume Preview"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slate-100 rounded-xl">
                        <FileText className="w-5 h-5 text-slate-700" />
                      </div>
                      <h2 className="text-lg font-semibold text-slate-800">Add Your Resume</h2>
                    </div>
                  </div>

                  <div className="p-2">
                    <div className="text-center space-y-4">
                      <div className="mx-auto w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center">
                        <FileText className="w-8 h-8 text-slate-700" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">No Resume Found</h3>
                        <p className="text-slate-600 mb-4">
                          Upload your resume to get started with AI-powered analysis
                        </p>
                        <button
                          onClick={() => (window.location.href = "/addresume")}
                          className="px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-950 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
                        >
                          <Upload className="w-5 h-5" />
                          Add Your Resume
                        </button>
                      </div>
                    </div>

                    {localResumeFile ? (
                      <div className="flex items-center space-x-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl mt-6">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <div className="flex-1">
                          <p className="font-medium text-emerald-800">{localResumeFile.name}</p>
                          <p className="text-sm text-emerald-600">Ready for analysis</p>
                        </div>
                        <button
                          onClick={() => setLocalResumeFile(null)}
                          className="text-sm text-red-600 hover:text-red-700 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div
                        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 mt-6 ${
                          dragOver
                            ? "border-blue-400 bg-blue-50 transform scale-[1.02]"
                            : "border-slate-300 hover:border-blue-300 hover:bg-slate-50"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="space-y-4">
                          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Upload className="w-8 h-8 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-lg font-medium text-slate-700">
                              {dragOver ? "Drop your resume here" : "Or upload directly"}
                            </p>
                            <p className="text-sm text-slate-500 mt-1">
                              Drag & drop or click to browse • PDF files only
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    />
                  </div>
                </div>

                {/* Job Description Input */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-slate-200">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-xl">
                        <Target className="w-5 h-5 text-purple-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-slate-800">Job Description</h2>
                    </div>
                  </div>

                  <div className="p-6">
                    <textarea
                      value={localJobDescription}
                      onChange={(e) => setLocalJobDescription(e.target.value)}
                      placeholder="Paste the job description here to analyze compatibility with your resume..."
                      className="w-full h-40 bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none transition-all"
                    />
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-sm text-slate-500">{localJobDescription.length} characters</span>
                      {localJobDescription.trim() && (
                        <button
                          onClick={() => setLocalJobDescription("")}
                          className="text-sm text-red-600 hover:text-red-700 transition-colors"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Action Button */}
            {(localResumeFile || localJobDescription) && (
              <div className="flex justify-center">
                <button
                  onClick={uploadData}
                  disabled={uploadStatus === "uploading" || (!localResumeFile && !localJobDescription.trim())}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-400 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {uploadStatus === "uploading" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Analyze Resume</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Analysis Cards with Dialog Triggers */}
            <div className="grid grid-cols-1 gap-4">
              {/* Summary Card */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                    <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-slate-100 rounded-xl">
                            <FileText className="w-5 h-5 text-slate-700" />
                          </div>
                          <h2 className="text-lg font-semibold text-slate-800">Summary</h2>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-500" />
                      </div>
                    </div>
                    <div className="p-6">
                      {summary ? (
                        <p className="text-slate-700 leading-relaxed line-clamp-3">{summary}</p>
                      ) : (
                        <p className="text-slate-400 italic">
                          Upload your resume and job description to see the analysis summary.
                        </p>
                      )}
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-white border border-slate-200 shadow-xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-slate-700" />
                      Analysis Summary
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    {summary ? (
                      <div className="bg-slate-50 rounded-xl p-6">
                        <p className="text-slate-700 leading-relaxed text-base">{summary}</p>
                      </div>
                    ) : (
                      <p className="text-slate-400 italic text-center py-8">
                        No summary available. Upload your resume and job description to get started.
                      </p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Skills Gap Card */}
              {skillGap && (
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                      <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-rose-50 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-red-100 rounded-xl">
                              <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-slate-800">Skills Gap</h2>
                          </div>
                          <Badge variant="destructive" className="text-xs">
                            {skillGap.length} missing
                          </Badge>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-slate-600 text-sm">
                          {skillGap.length} skills identified that could strengthen your profile
                        </p>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-white border border-slate-200 shadow-xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        Skills Gap Analysis
                      </DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
                      {skillGap.map((skill, idx) => (
                        <div
                          key={idx}
                          className="flex items-start space-x-3 p-4 bg-red-50 rounded-xl border border-red-100"
                        >
                          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {/* Suggestions Card */}
              {suggestions && (
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                      <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-amber-100 rounded-xl">
                              <TrendingUp className="w-5 h-5 text-amber-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-slate-800">Improvement Suggestions</h2>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {Object.keys(suggestions).length} categories
                          </Badge>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-slate-600 text-sm">Detailed recommendations to enhance your resume</p>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-9xl max-h-[90vh] bg-white border border-slate-200 shadow-xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-amber-600" />
                        Improvement Suggestions
                      </DialogTitle>
                    </DialogHeader>
                    {/* The fix: add max-h- and overflow-y-auto to the content div */}
                    <div className="mt-4 space-y-6 overflow-y-auto max-h-[70vh]">
                      {typeof suggestions === "object" ? (
                        Object.entries(suggestions).map(([category, items]) => (
                          <div key={category} className="space-y-3">
                            <h3 className="font-semibold text-slate-800 text-lg border-b border-slate-200 pb-2">
                              {category}
                            </h3>
                            <div className="space-y-2">
                              {Array.isArray(items) ? (
                                items.map((item, idx) => (
                                  <div key={idx} className="flex items-start space-x-3 p-3 bg-amber-50 rounded-xl">
                                    <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                      {idx + 1}
                                    </div>
                                    {typeof item === "object" && item.original && item.suggestion ? (
                                      <div className="space-y-2">
                                        <div className="text-red-600 text-sm">❌ {item.original}</div>
                                        <div className="text-green-600 text-sm">✅ {item.suggestion}</div>
                                      </div>
                                    ) : (
                                      <span className="text-slate-700">{item}</span>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <div className="p-3 bg-amber-50 rounded-xl">
                                  <span className="text-slate-700">{items}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="space-y-3">
                          {suggestions.map((suggestion, idx) => (
                            <div key={idx} className="flex items-start space-x-3 p-4 bg-amber-50 rounded-xl">
                              <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                {idx + 1}
                              </div>
                              <span className="text-slate-700">{suggestion}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {/* Strengths Card */}
              {strength && (
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                      <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-emerald-100 rounded-xl">
                              <Star className="w-5 h-5 text-emerald-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-slate-800">Key Strengths</h2>
                          </div>
                          <Badge className="text-xs bg-emerald-100 text-emerald-700">{strength.length} found</Badge>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-slate-600 text-sm">Your strongest qualifications for this role</p>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-white border border-slate-200 shadow-xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-emerald-600" />
                        Key Strengths
                      </DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
                      {strength.map((str, idx) => (
                        <div
                          key={idx}
                          className="flex items-start space-x-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100"
                        >
                          <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700">{str}</span>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Comment Section */}
            {comment && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-100 rounded-xl">
                      <Users className="w-5 h-5 text-slate-700" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800">Additional Comments</h2>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-slate-700 leading-relaxed">{comment}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Score & Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-fit">
            <div className="p-6 space-y-6">
              {/* Score Display */}
              {score !== null && (
                <div className="text-center" data-score-section>
                  <div
                    className={`w-24 h-24 mx-auto rounded-full border-4 ${getScoreBorderColor(
                      score
                    )} flex items-center justify-center mb-4 relative`}
                  >
                    <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}%</span>
                    <div
                      className={`absolute inset-0 rounded-full bg-gradient-to-br ${getScoreGradient(
                        score
                      )} opacity-10`}
                    ></div>
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">Match Score</h3>
                  <p className="text-sm text-slate-600">
                    {score >= 80 ? "Excellent match!" : score >= 60 ? "Good potential" : "Needs improvement"}
                  </p>
                </div>
              )}

              {/* Job Description Preview */}
              {jobDescription && (
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-purple-600" />
                    Job Description
                  </h3>
                  <div className="bg-slate-50 rounded-xl p-4 max-h-32 overflow-y-auto">
                    <p className="text-sm text-slate-600 line-clamp-6">{jobDescription.substring(0, 200)}...</p>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="space-y-3 border-t border-slate-200 pt-6">
                <button className="w-full bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 text-sm font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Previous Analyses
                </button>

                <button className="w-full bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-amber-700 text-sm font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4" />
                  Tips & Tricks
                </button>

                <button className="w-full bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 text-emerald-700 text-sm font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                  <Award className="w-4 h-4" />
                  Resources
                </button>
              </div>

              {/* Progress Indicators */}
              {hasExistingData && (
                <div className="space-y-3 border-t border-slate-200 pt-6">
                  <h3 className="font-semibold text-slate-800 mb-3">Analysis Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Resume Upload</span>
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Job Description</span>
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">AI Analysis</span>
                      {score !== null ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Stats Row */}
        {hasExistingData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Resume</h3>
              <p className="text-sm text-slate-600">Analyzed</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Job Match</h3>
              <p className="text-sm text-slate-600">{score ? `${score}%` : "Pending"}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Strengths</h3>
              <p className="text-sm text-slate-600">{strength ? strength.length : 0} Found</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Suggestions</h3>
              <p className="text-sm text-slate-600">{suggestions ? Object.keys(suggestions).length : 0} Items</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}