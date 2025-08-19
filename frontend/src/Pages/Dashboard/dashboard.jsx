import { useResume } from "@/contexts/ResumeContext";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { resumeFile, jobDescription, setResumeFile, setJobDescription } =
    useResume();

  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(null);

  useEffect(() => {
    const syncData = async () => {
      try {
        // 1️⃣ If context already has fresh resume/JD (from LandingPage), push them to backend
        if (resumeFile || jobDescription) {
          const formData = new FormData();
          if (resumeFile) formData.append("resume", resumeFile);
          if (jobDescription) formData.append("jobDescription", jobDescription);

          await fetch("http://localhost:8000/api/upload", {
            method: "POST",
            credentials: "include",
            body: formData,
          });

          // clear context so it doesn't keep resending
          setResumeFile(null);
          setJobDescription("");
        }

        // 2️⃣ Always fetch the latest saved resume/JD from backend
        const res = await fetch("http://localhost:8000/api/feedback", {
          credentials: "include",
        });
        const data = await res.json();

        if (data.resume) setResumeFile(data.resume);
        if (data.jobDescription) setJobDescription(data.jobDescription);
        if (data.score) setScore(data.score);
      } catch (err) {
        console.error("Error syncing data:", err);
      }
      setLoading(false);
    };

    syncData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resume */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-3">Resume</h2>
          {resumeFile ? (
            <p className="text-green-400">📄 {resumeFile.name || "Uploaded Resume"}</p>
          ) : (
            <p className="text-gray-400">No resume uploaded yet.</p>
          )}
        </div>

        {/* Job Description */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-3">Job Description</h2>
          <p className="text-gray-300">
            {jobDescription || "No job description uploaded yet."}
          </p>
        </div>
      </div>

      {/* Match Score */}
      {score !== null && (
        <div className="mt-6 bg-gray-900 border border-gray-700 rounded-2xl p-6">
          <h2 className="text-xl font-semibold">Match Score</h2>
          <p className="text-2xl font-bold text-blue-400 mt-2">{score}%</p>
        </div>
      )}
    </div>
  );
}
