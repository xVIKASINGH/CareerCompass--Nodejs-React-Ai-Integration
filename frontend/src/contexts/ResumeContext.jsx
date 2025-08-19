import { createContext, useContext, useState, useEffect } from "react";

const ResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    const storedResume = localStorage.getItem("resumeFile");
    const storedJD = localStorage.getItem("jobDescription");

    if (storedResume) {
      // Restore only file name (cannot restore full File object)
      setResumeFile({ name: storedResume });
    }
    if (storedJD) setJobDescription(storedJD);
  }, []);

  // Save to localStorage whenever they change
  useEffect(() => {
    if (resumeFile) localStorage.setItem("resumeFile", resumeFile.name);
    if (jobDescription) localStorage.setItem("jobDescription", jobDescription);
  }, [resumeFile, jobDescription]);

  return (
    <ResumeContext.Provider
      value={{ resumeFile, setResumeFile, jobDescription, setJobDescription }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => useContext(ResumeContext);
