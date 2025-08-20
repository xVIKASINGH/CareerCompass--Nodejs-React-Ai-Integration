import { createContext, useContext, useState } from "react";

const ResumeContext = createContext();

export function ResumeProvider({ children }) {
  const [resumeFile, setResumeFile] = useState(null);  // can hold File object
  const [jobDescription, setJobDescription] = useState("");

  return (
    <ResumeContext.Provider
      value={{ resumeFile, setResumeFile, jobDescription, setJobDescription }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  return useContext(ResumeContext);
}
