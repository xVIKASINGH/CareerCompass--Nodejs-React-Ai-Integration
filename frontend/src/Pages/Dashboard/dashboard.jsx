import { useState, useEffect, useRef } from "react";
import { Upload, FileText, Target, TrendingUp, Users, Award, AlertTriangle, CheckCircle, Loader2, Eye, Download } from "lucide-react";
import { toast } from "sonner"
export default function Dashboard() {
  // Backend data state
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [score, setScore] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState("idle");

  // Local state for new uploads
  const [localResumeFile, setLocalResumeFile] = useState(null);
  const [localJobDescription, setLocalJobDescription] = useState("");
  const [showJDInput, setShowJDInput] = useState(false);

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
        
        if(!res.ok){
          toast.error(`Error fetching data: ${res.statusText}`);
        }
        const data = await res.json();
        console.log("Fetched data:", data);
   if (data.feedbacks && data.feedbacks.length > 0) {
  // if you want the top-most (latest) feedback
  const topFeedback = data.feedbacks[0];  

  setResumeFile(topFeedback.resume || null);
  setResumeUrl(topFeedback.resume_url || null);
  setJobDescription(topFeedback.job_description || "");
  setScore(topFeedback.score ?? null);
  setAnalysis(topFeedback.analysis || null);
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
      if (localJobDescription) formData.append("jobDescription", localJobDescription);

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
  setResumeFile(latest.resume || null);
  setResumeUrl(latest.resume_url || null);
  setJobDescription(latest.jobDescription || "");
  setScore(latest.score ?? null);
  setAnalysis(latest.analysis || null);
}


      // Clear local state
      setLocalResumeFile(null);
      setLocalJobDescription("");
      setShowJDInput(false);
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

  const handleJDSubmit = () => {
    if (localJobDescription.trim()) {
      setShowJDInput(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return "from-emerald-500 to-teal-600";
    if (score >= 60) return "from-amber-500 to-orange-600";
    return "from-red-500 to-rose-600";
  };

  // Check if we have existing data to show
  const hasExistingData = resumeFile || jobDescription || score !== null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-slate-700 font-medium">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto ">
          <div className="flex justify-between items-center">

            
            {/* Status Messages */}
            <div className="flex items-center space-x-4">
              {uploadStatus === "success" && (
                <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 text-sm font-medium">Analysis Complete</span>
                </div>
              )}
              {uploadStatus === "error" && (
                <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-red-700 text-sm font-medium">Upload Failed</span>
                </div>
              )}
              {uploadStatus === "uploading" && (
                <div className="flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-blue-700 text-sm font-medium">Analyzing...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          
          {/* Left Panel */}
          <div className="space-y-0">
            {hasExistingData ? (
              <>
                {/* Resume Viewer */}
                {resumeUrl && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h2 className="text-lg font-semibold text-slate-800">Current Resume</h2>
                            <p className="text-sm text-slate-600">{resumeFile}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <a
                            href={resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </a>
                          <a
                            href={resumeUrl}
                            download
                            className="flex items-center space-x-1 text-sm font-medium text-slate-600 hover:text-slate-700 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </a>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                          >
                            Replace
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* PDF Embed */}
                      <div className="w-full h-156 border border-slate-200 rounded-lg overflow-hidden">
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
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-200">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Upload className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-slate-800">Upload New Resume</h2>
                    </div>
                  </div>

                  <div className="p-6">
                    {localResumeFile ? (
                      <div className="flex items-center space-x-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <div>
                          <p className="font-medium text-emerald-800">{localResumeFile.name}</p>
                          <p className="text-sm text-emerald-600">Ready for analysis</p>
                        </div>
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
                          <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
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
                {/* Resume Upload Section - Original */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-800">Upload Resume</h2>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {localResumeFile ? (
                      <div className="flex items-center space-x-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <div>
                          <p className="font-medium text-emerald-800">{localResumeFile.name}</p>
                          <p className="text-sm text-emerald-600">Ready for analysis</p>
                        </div>
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
                          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
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

                {/* Job Description Section - Original */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Target className="w-5 h-5 text-purple-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-800">Job Description</h2>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="space-y-4">
                      <textarea
                        value={localJobDescription}
                        onChange={(e) => setLocalJobDescription(e.target.value)}
                        placeholder="Paste the job description here to analyze compatibility..."
                        className="w-full h-40 bg-slate-50 border border-slate-200 rounded-lg p-4 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none transition-all"
                      />
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
                  disabled={uploadStatus === "uploading"}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-slate-400 disabled:to-slate-400 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                >
                  {uploadStatus === "uploading" ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing...</span>
                    </div>
                  ) : (
                    "Analyze Resume"
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right Panel - Analysis Section */}
          <div className="space-y-6">
            {score !== null && (
              <>
                {/* Match Score */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-200">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Award className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-slate-800">Match Score</h2>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${getScoreGradient(score)} text-white text-2xl font-bold mb-4 shadow-lg`}>
                      {score}%
                    </div>
                    <p className={`text-lg font-semibold ${getScoreColor(score)} mb-2`}>
                      {score >= 80 ? "Excellent Match! 🎉" : score >= 60 ? "Good Match 📈" : "Needs Improvement 💡"}
                    </p>
                    <p className="text-slate-600 text-sm">
                      Your resume compatibility with the job requirements
                    </p>
                  </div>
                </div>

                {/* Skills Gap Analysis */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-slate-200">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-amber-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-slate-800">Skills Gap Analysis</h2>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-slate-700 mb-3">Missing Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-full text-sm">React.js</span>
                          <span className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-full text-sm">AWS</span>
                          <span className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-full text-sm">Docker</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-700 mb-3">Matching Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-sm">JavaScript</span>
                          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-sm">Python</span>
                          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-sm">SQL</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Improvement Suggestions */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-slate-200">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-slate-800">Improvement Suggestions</h2>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 text-sm font-medium">1</span>
                        </div>
                        <p className="text-slate-700 text-sm">Add more specific technical skills mentioned in the job description</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 text-sm font-medium">2</span>
                        </div>
                        <p className="text-slate-700 text-sm">Include quantifiable achievements and metrics</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 text-sm font-medium">3</span>
                        </div>
                        <p className="text-slate-700 text-sm">Emphasize relevant project experience</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Job Description at bottom right */}
            {hasExistingData && jobDescription && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Target className="w-5 h-5 text-purple-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-slate-800">Job Description</h2>
                    </div>
                    {!showJDInput && (
                      <button
                        onClick={() => {
                          setLocalJobDescription(jobDescription);
                          setShowJDInput(true);
                        }}
                        className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  {showJDInput ? (
                    <div className="space-y-4">
                      <textarea
                        value={localJobDescription}
                        onChange={(e) => setLocalJobDescription(e.target.value)}
                        placeholder="Paste the job description here to analyze compatibility..."
                        className="w-full h-32 bg-slate-50 border border-slate-200 rounded-lg p-4 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none transition-all"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={handleJDSubmit}
                          disabled={!localJobDescription.trim()}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all text-sm"
                        >
                          Save Description
                        </button>
                        <button
                          onClick={() => {
                            setShowJDInput(false);
                            setLocalJobDescription("");
                          }}
                          className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="max-h-48 overflow-y-auto">
                      <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {jobDescription}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!score && (resumeFile || jobDescription) && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-800 mb-2">Ready for Analysis</h3>
                  <p className="text-slate-600 text-sm">
                    Upload both your resume and job description to see detailed analysis and improvement suggestions.
                  </p>
                </div>
              </div>
            )}

            {!score && !resumeFile && !jobDescription && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-dashed border-blue-200 p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-800 mb-2">Welcome to Resume Analyzer</h3>
                <p className="text-slate-600 text-sm">
                  Upload your resume and job description to get started with AI-powered analysis and improvement suggestions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}