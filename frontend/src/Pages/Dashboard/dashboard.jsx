import React, { useState, useEffect, useRef } from 'react';
import { Upload, FileText, Target, TrendingUp, Users, Award, AlertTriangle, CheckCircle, Loader2, Eye, Download, Sparkles, ArrowRight, Star, Zap, BookOpen } from 'lucide-react';

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

  // Local state for new uploads
  const [localResumeFile, setLocalResumeFile] = useState(null);
  const [localJobDescription, setLocalJobDescription] = useState("");
  
  // Drag & drop state
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch existing backend data on mount
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/feedback", {
          method: "GET",
          credentials: "include",
        });
        
        if (!res.ok) {
          console.error(`Error fetching data: ${res.statusText}`);
          return;
        }
        
        const data = await res.json();
        console.log("Fetched data:", data);
        
        if (data.feedbacks && data.feedbacks.length > 0) {
          const topFeedback = data.feedbacks[0];
          
          setResumeUrl(topFeedback.resume_url || null);
          setJobDescription(topFeedback.job_description || "");
          setScore(topFeedback.score ?? null);
          setComment(topFeedback.comment || null);
          setSummary(topFeedback.summary || null);
          setSkillGap(topFeedback.skill_gap ? topFeedback.skill_gap.split('\n').filter(s => s.trim()) : null);
          setSuggestions(topFeedback.suggestions ? topFeedback.suggestions.split('\n').filter(s => s.trim()) : null);
          setStrength(topFeedback.strength ? topFeedback.strength.split('\n').filter(s => s.trim()) : null);
        }
      } catch (err) {
        console.error("Error fetching backend data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBackendData();
  }, []);

  // Upload data to backend
  const uploadData = async () => {
    if (!localResumeFile && !localJobDescription) return;

    try {
      setUploadStatus("uploading");

      const formData = new FormData();
      if (localResumeFile) formData.append("resume", localResumeFile);
      if (localJobDescription) formData.append("jd", localJobDescription);

      const uploadResponse = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!uploadResponse.ok) throw new Error(`Upload failed: ${uploadResponse.status}`);

      // Fetch updated data
      const res = await fetch("http://localhost:8000/api/feedback", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      if (data.feedbacks?.length > 0) {
        const latest = data.feedbacks[0];
        setResumeUrl(latest.resume_url || null);
        setJobDescription(latest.job_description || "");
        setScore(latest.score ?? null);
        setComment(latest.comment || null);
        setSummary(latest.summary || null);
        setSkillGap(latest.skill_gap ? latest.skill_gap.split('\n').filter(s => s.trim()) : null);
        setSuggestions(latest.suggestions ? latest.suggestions.split('\n').filter(s => s.trim()) : null);
        setStrength(latest.strength ? latest.strength.split('\n').filter(s => s.trim()) : null);
      }

      // Clear local state
      setLocalResumeFile(null);
      setLocalJobDescription("");
      setUploadStatus("success");

      setTimeout(() => setUploadStatus("idle"), 3000);
    } catch (err) {
      console.error("Error uploading data:", err);
      setUploadStatus("error");
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
          <span className="text-slate-700 font-semibold text-lg">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
           
            
            {/* Status Messages */}
            <div className="flex items-center space-x-4">
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

      <div className=" mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_300px] gap-4 h-full">
          
          {/* Left Panel - Resume Upload/Viewer */}
          <div className="space-y-6">
            {hasExistingData ? (
              <>
                {/* Resume Viewer */}
                {resumeUrl && (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-xl">
                            <FileText className="w-5 h-5 text-blue-600" />
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
                            className="flex items-center space-x-1 px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
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

                    <div className="p-6">
                      <div className="w-full h-96 border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                        <iframe
                          src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                          className="w-full h-full"
                          title="Resume Preview"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload New Resume Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-200">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-emerald-100 rounded-xl">
                        <Upload className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-slate-800">Upload New Resume</h2>
                    </div>
                  </div>

                  <div className="p-6">
                    {localResumeFile ? (
                      <div className="flex items-center space-x-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
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
                        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
                          dragOver 
                            ? "border-emerald-400 bg-emerald-50 transform scale-[1.02]" 
                            : "border-slate-300 hover:border-emerald-300 hover:bg-slate-50"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="space-y-3">
                          <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <Upload className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              {dragOver ? "Drop new resume here" : "Upload new resume"}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">PDF files only</p>
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
              </>
            ) : (
              <>
                {/* Initial Resume Upload */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-xl">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-slate-800">Upload Resume</h2>
                    </div>
                  </div>

                  <div className="p-6">
                    {localResumeFile ? (
                      <div className="flex items-center space-x-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
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
                        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
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
                              {dragOver ? "Drop your resume here" : "Upload your resume"}
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
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-400 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center gap-3"
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

          {/* Middle Panel - Analysis Results */}
          <div className="space-y-6">
            {/* Summary Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-xl">
                    <FileText className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-800">Summary</h2>
                </div>
              </div>
              <div className="p-6">
                {summary ? (
                  <p className="text-slate-700 leading-relaxed">{summary}</p>
                ) : (
                  <p className="text-slate-400 italic">Upload your resume and job description to see the analysis summary.</p>
                )}
              </div>
            </div>

            {/* Skills Gap Section */}
            {skillGap && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-rose-50 border-b border-slate-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-xl">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800">Skills Gap</h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {skillGap.map((skill, idx) => (
                      <div key={idx} className="flex items-start space-x-3 p-3 bg-red-50 rounded-xl border border-red-100">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Suggestions Section */}
            {suggestions && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-slate-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-amber-100 rounded-xl">
                      <TrendingUp className="w-5 h-5 text-amber-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800">Improvement Suggestions</h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {suggestions.map((suggestion, idx) => (
                      <div key={idx} className="flex items-start space-x-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <span className="text-slate-700">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Strengths Section */}
            {strength && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-100 rounded-xl">
                      <Star className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800">Key Strengths</h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {strength.map((str, idx) => (
                      <div key={idx} className="flex items-start space-x-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                        <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{str}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Comment Section */}
            {comment && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-slate-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <Users className="w-5 h-5 text-blue-600" />
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
                <div className="text-center">
                  <div className={`w-24 h-24 mx-auto rounded-full border-4 ${getScoreBorderColor(score)} flex items-center justify-center mb-4 relative`}>
                    <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}%</span>
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${getScoreGradient(score)} opacity-10`}></div>
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
                    <p className="text-sm text-slate-600 line-clamp-6">
                      {jobDescription.substring(0, 200)}...
                    </p>
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
              <p className="text-sm text-slate-600">{score ? `${score}%` : 'Pending'}</p>
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
              <p className="text-sm text-slate-600">{suggestions ? suggestions.length : 0} Items</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}