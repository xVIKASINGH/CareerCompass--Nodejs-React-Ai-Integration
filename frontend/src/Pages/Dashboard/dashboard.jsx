import { useResume } from "@/contexts/ResumeContext";
import { useEffect, useState, useRef } from "react";

export default function Dashboard() {
  const { setResumeFile, setJobDescription } = useResume(); // Only for updating context
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("idle");

  // Backend data state
  const [resumeFile, setResumeFileLocal] = useState(null);
  const [jobDescription, setJobDescriptionLocal] = useState("");

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
        const data = await res.json();

        if (data.resume) {
          setResumeFileLocal(data.resume);
          setResumeFile(data.resume);
        }
        if (data.jobDescription) {
          setJobDescriptionLocal(data.jobDescription);
          setJobDescription(data.jobDescription);
        }
        if (data.score !== undefined) setScore(data.score);
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

      if (data.resume) setResumeFileLocal(data.resume);
      if (data.jobDescription) setJobDescriptionLocal(data.jobDescription);
      if (data.score !== undefined) setScore(data.score);

      // Update context
      if (data.resume) setResumeFile(data.resume);
      if (data.jobDescription) setJobDescription(data.jobDescription);

      // Clear local state
      setLocalResumeFile(null);
      setLocalJobDescription("");
      setUploadStatus("success");

      setTimeout(() => setUploadStatus("idle"), 3000);
    } catch (err) {
      console.error("Error uploading data:", err);
      setUploadStatus("error");
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
    if (file && file.type === "application/pdf") setLocalResumeFile(file);
    else alert("Please upload a PDF file");
  };

  const handleJDSubmit = () => {
    if (localJobDescription.trim()) setShowJDInput(false);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return "Excellent match! 🎉";
    if (score >= 60) return "Good match with room for improvement 📈";
    return "Needs significant improvement 💡";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          {uploadStatus === "success" && (
            <div className="bg-green-900/50 border border-green-700 rounded-lg px-4 py-2">
              <span className="text-green-400">✓ Data synced successfully</span>
            </div>
          )}
          {uploadStatus === "error" && (
            <div className="bg-red-900/50 border border-red-700 rounded-lg px-4 py-2">
              <span className="text-red-400">⚠ Sync failed</span>
            </div>
          )}
          {uploadStatus === "uploading" && (
            <div className="bg-blue-900/50 border border-blue-700 rounded-lg px-4 py-2">
              <span className="text-blue-400">⏳ Uploading...</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resume Card */}
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
                📄 Resume
                {(resumeFile || localResumeFile) && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Replace
                  </button>
                )}
              </h2>

              {localResumeFile ? (
                <p className="text-green-400">{localResumeFile.name}</p>
              ) : resumeFile ? (
                <p className="text-green-400">{resumeFile}</p>
              ) : (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
                    dragOver ? "border-blue-400 bg-blue-400/10" : "border-gray-600 hover:border-gray-500"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="text-gray-400 text-4xl mb-4">📁</div>
                  <p>{dragOver ? "Drop your resume here" : "Drag & drop your resume"}</p>
                  <p className="text-gray-500 text-xs mt-2">PDF files only</p>
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

            {/* Job Description Card */}
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
                💼 Job Description
                {jobDescription && !showJDInput && (
                  <button
                    onClick={() => {
                      setLocalJobDescription(jobDescription);
                      setShowJDInput(true);
                    }}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Edit
                  </button>
                )}
              </h2>

              {showJDInput ? (
                <div className="space-y-4">
                  <textarea
                    value={localJobDescription}
                    onChange={(e) => setLocalJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    className="w-full h-32 bg-gray-800 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleJDSubmit}
                      disabled={!localJobDescription.trim()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium"
                    >
                      Save JD
                    </button>
                    <button
                      onClick={() => {
                        setShowJDInput(false);
                        setLocalJobDescription("");
                      }}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-300">{localJobDescription || jobDescription || "No job description yet"}</p>
              )}
            </div>

            {/* Submit / Analyze Button */}
            {(localResumeFile || localJobDescription) && (
              <div className="mt-4">
                <button
                  onClick={uploadData}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                >
                  Analyze / Submit
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Score */}
          <div className="space-y-6">
            {score !== null && (
              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 text-center">
                <h2 className="text-xl font-semibold mb-2">Match Score</h2>
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(score)}`}>{score}%</div>
                <p className="text-sm text-gray-300">{getScoreMessage(score)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
