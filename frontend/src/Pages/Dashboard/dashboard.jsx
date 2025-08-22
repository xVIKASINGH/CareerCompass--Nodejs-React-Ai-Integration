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



  // anaylis section

  const [loadingSection, setLoadingSection] = useState(null); // "score" | "skills" | "suggestions" | null
  const [summary,setsummary]=useState(null);
const [resumequality,setresumequality]=useState(null);
const [skillsGap, setSkillsGap] = useState(null);
const [suggestions, setSuggestions] = useState(null);
const [strenthsuggestion,setstrenthsuggestion]=useState(null);
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
//  APi call for anaylis
async function handleSectionFetch(section) {
  try {
    setLoadingSection(section);

    let res = await fetch(`http://localhost:8000/api/analyze/${section}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resume: resumeFile, 
        jobDescription,
      }),
    });

    const data = await res.json();

    switch (section) {
      case "summary":
        setsummary(data.summary);
        break;
      case "resumequality":
        setresumequality(data.resumequality);
        break;
      case "skillsGap":
        setSkillsGap(data.skillsGap);
        break;
      case "suggestions":
        setSuggestions(data.suggestions);
        break;
      case "strenthsuggestion":
        setstrenthsuggestion(data.strenthsuggestion);
        break;
      default:
        break;
    }
  } catch (err) {
    console.error("Error fetching section:", err);
  } finally {
    setLoadingSection(null);
  }
}


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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto ">
          <div className="flex justify-between items-center ">

            
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

      <div className="max-w-7xl  px-6 py-2">
        <div className="grid grid-cols-1 lg:grid-cols-[50%_50%_20%]  gap-8 h-full">
          
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
                  <div className="px-6 py-0 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-slate-200">
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
  {/* 🔹 Summary */}
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
    <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-slate-200 flex justify-between items-center">
      <h2 className="text-lg font-semibold text-slate-800">Summary</h2>
      <button
        onClick={() => handleSectionFetch("summary")}
        className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
      >
        {loadingSection === "summary" ? "Loading..." : "Analyze"}
      </button>
    </div>
    <div className="p-6 text-sm text-slate-600">
      {summary ? (
        <p>{summary}</p>
      ) : (
        <p className="text-slate-400">Click "Analyze" to generate summary.</p>
      )}
    </div>
  </div>

  {/* 🔹 Resume Quality */}
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
    <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-emerald-100 border-b border-slate-200 flex justify-between items-center">
      <h2 className="text-lg font-semibold text-slate-800">Resume Quality</h2>
      <button
        onClick={() => handleSectionFetch("resumequality")}
        className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700"
      >
        {loadingSection === "resumequality" ? "Loading..." : "Analyze"}
      </button>
    </div>
    <div className="p-6 text-sm text-slate-600">
      {resumequality ? (
        <p>{resumequality}</p>
      ) : (
        <p className="text-slate-400">Click "Analyze" to check resume quality.</p>
      )}
    </div>
  </div>

  {/* 🔹 Skills Gap */}
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
    <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-red-100 border-b border-slate-200 flex justify-between items-center">
      <h2 className="text-lg font-semibold text-slate-800">Skills Gap</h2>
      <button
        onClick={() => handleSectionFetch("skillsGap")}
        className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
      >
        {loadingSection === "skillsGap" ? "Loading..." : "Analyze"}
      </button>
    </div>
    <div className="p-6 text-sm text-slate-600">
      {skillsGap ? (
        <ul className="list-disc list-inside space-y-1">
          {skillsGap.map((skill, idx) => (
            <li key={idx}>{skill}</li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-400">Click "Analyze" to identify skill gaps.</p>
      )}
    </div>
  </div>

  {/* 🔹 Improvement Suggestions */}
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
    <div className="px-6 py-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border-b border-slate-200 flex justify-between items-center">
      <h2 className="text-lg font-semibold text-slate-800">Improvement Suggestions</h2>
      <button
        onClick={() => handleSectionFetch("suggestions")}
        className="px-3 py-1 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700"
      >
        {loadingSection === "suggestions" ? "Loading..." : "Analyze"}
      </button>
    </div>
    <div className="p-6 text-sm text-slate-600">
      {suggestions ? (
        <ul className="space-y-2">
          {suggestions.map((s, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <span className="w-5 h-5 flex items-center justify-center bg-yellow-100 text-yellow-600 rounded-full text-xs">
                {idx + 1}
              </span>
              <p>{s}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-400">Click "Analyze" to get improvement suggestions.</p>
      )}
    </div>
  </div>

  {/* 🔹 Strength Suggestions */}
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
    <div className="px-6 py-4 bg-gradient-to-r from-teal-50 to-teal-100 border-b border-slate-200 flex justify-between items-center">
      <h2 className="text-lg font-semibold text-slate-800">Strength Suggestions</h2>
      <button
        onClick={() => handleSectionFetch("strenthsuggestion")}
        className="px-3 py-1 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700"
      >
        {loadingSection === "strenthsuggestion" ? "Loading..." : "Analyze"}
      </button>
    </div>
    <div className="p-6 text-sm text-slate-600">
      {strenthsuggestion ? (
        <ul className="space-y-2">
          {strenthsuggestion.map((s, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <span className="w-5 h-5 flex items-center justify-center bg-teal-100 text-teal-600 rounded-full text-xs">
                {idx + 1}
              </span>
              <p>{s}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-400">Click "Analyze" to highlight your strengths.</p>
      )}
    </div>
  </div>
</div>

          {/* Third Panel - Score & Extras */}
<div className="w-[180px] bg-white border-l border-slate-200 flex flex-col items-center p-2 space-y-4 shadow-sm">
  
  {/* Score Circle */}
  <div className="flex flex-col items-center">
    <div className="w-20 h-20 rounded-full border-4 border-green-500 flex items-center justify-center">
      <span className="text-lg font-semibold text-green-600">85%</span>
    </div>
    <p className="text-xs text-slate-500 mt-1">Match Score</p>
  </div>

  {/* Previous Scores Button */}
  <button className="w-full bg-slate-100 text-slate-700 text-xs py-1 rounded-lg hover:bg-slate-200">
    Previous Scores
  </button>

  {/* Tips & Tricks */}
  <button className="w-full bg-yellow-100 text-yellow-700 text-xs py-1 rounded-lg hover:bg-yellow-200">
    Tips & Tricks
  </button>

  {/* Resources */}
  <button className="w-full bg-blue-100 text-blue-700 text-xs py-1 rounded-lg hover:bg-blue-200">
    Resources
  </button>
</div>

           

        </div>
      </div>
        {/* // third panel */}
        
        
    </div>
  );
}