import React, { useState } from 'react';
import { Upload, FileText, Briefcase, Sparkles, CheckCircle, AlertCircle, ArrowRight, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const InsertResumeApp = () => {
  const [currentPage, setCurrentPage] = useState('upload');
  const [resumeFile, setResumeFile] = useState(null);
  const [jdText, setJdText] = useState('');
  const [dragOver, setDragOver] = useState({ resume: false });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const navigate=useNavigate();
  const handleDragOver = (e, type) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [type]: true }));
  };

  const handleDragLeave = (e, type) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [type]: false }));
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [type]: false }));
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      if (type === 'resume') {
        setResumeFile(pdfFile);
      } else {
        setJdFile(pdfFile);
      }
    }
  };

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      if (type === 'resume') {
        setResumeFile(file);
      } else {
        setJdFile(file);
      }
    }
  };

const handleUploadAndAnalyze = async () => {
  if (!resumeFile || !jdText) {
    setUploadError("Please upload both files");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jdText);

    const uploadResponse = await fetch("http://localhost:8000/api/upload", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (uploadResponse.ok) {
      navigate("/dashboard");
      setIsUploading(false);
    } else {
      toast.error("Upload failed. Please try again.");
    }
  } catch (error) {
    console.error("Upload failed", error);
    toast.error("Upload failed. Please try again.");
  }
};


  const removeFile = (type) => {
    if (type === 'resume') {
      setResumeFile(null);
    }
    setUploadError(null); // Clear any previous errors
  };

  const FileUploadZone = ({ type, file, icon, title, description, color }) => (
    <div
      className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 cursor-pointer group
        ${dragOver[type] 
          ? `border-${color}-500 bg-${color}-50` 
          : file 
            ? `border-${color}-400 bg-${color}-50` 
            : 'border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50'
        }`}
      onDragOver={(e) => handleDragOver(e, type)}
      onDragLeave={(e) => handleDragLeave(e, type)}
      onDrop={(e) => handleDrop(e, type)}
      onClick={() => !file && document.getElementById(`${type}-input`).click()}
    >
      <input
        id={`${type}-input`}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => handleFileSelect(e, type)}
      />
      
      {!file ? (
        <div className="text-center">
          <div className={`mx-auto w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-${color}-400 to-${color}-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{description}</p>
          <div className="text-sm text-gray-500">
            <span className="font-medium">Click to upload</span> or drag and drop
            <br />PDF files only
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className={`mx-auto w-16 h-16 mb-4 rounded-full bg-${color}-500 flex items-center justify-center text-white`}>
            <CheckCircle size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">File Uploaded</h3>
          <p className="text-gray-600 mb-4 truncate max-w-xs mx-auto">{file.name}</p>
          <div className="flex justify-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFile(type);
              }}
              className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Remove
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById(`${type}-input`).click();
              }}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Replace
            </button>
          </div>
        </div>
      )}
    </div>
  );



 

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Resume Analyzer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your resume and job description to get instant AI-powered insights and recommendations
          </p>
        </div>

        {/* Upload Section */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <FileUploadZone
              type="resume"
              file={resumeFile}
              icon={<FileText size={32} />}
              title="Upload Resume"
              description="Upload your resume in PDF format"
              color="blue"
            />
            
            {/* Job Description Textarea */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <Briefcase className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Job Description</h3>
                    <p className="text-gray-600">Paste the job description text</p>
                  </div>
                </div>
              </div>
              
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the complete job description here including responsibilities, requirements, skills, and qualifications..."
                className="w-full h-64 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-400"
              />
              
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-gray-500">
                  {jdText.length} characters
                </span>
                {jdText.trim() && (
                  <button
                    onClick={() => setJdText('')}
                    className="text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    Clear text
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          {(resumeFile || jdText.trim()) && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Progress</h3>
                <span className="text-sm text-gray-500">
                  {(resumeFile && jdText.trim()) ? '2' : '1'} of 2 items completed
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className={`${resumeFile ? 'text-green-600' : 'text-gray-300'}`} size={20} />
                  <span className={`${resumeFile ? 'text-gray-900' : 'text-gray-500'}`}>Resume PDF</span>
                  {resumeFile && <span className="text-sm text-gray-500 ml-auto">{resumeFile.name}</span>}
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className={`${jdText.trim() ? 'text-green-600' : 'text-gray-300'}`} size={20} />
                  <span className={`${jdText.trim() ? 'text-gray-900' : 'text-gray-500'}`}>Job Description Text</span>
                  {jdText.trim() && <span className="text-sm text-gray-500 ml-auto">{jdText.length} characters</span>}
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {uploadError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-600" size={20} />
                <div>
                  <h3 className="text-red-800 font-semibold">Upload Failed</h3>
                  <p className="text-red-700">{uploadError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Get Insights Button */}
          <div className="text-center">
            <button
              onClick={handleUploadAndAnalyze}
              disabled={!resumeFile || !jdText.trim() || isUploading}
              className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center gap-3 mx-auto
                ${resumeFile && jdText.trim() && !isUploading
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-2xl hover:scale-105 cursor-pointer'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                  Uploading & Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={24} />
                  Get AI Insights
                  <ArrowRight size={24} />
                </>
              )}
            </button>
            
            {(!resumeFile || !jdText.trim()) && !isUploading && (
              <p className="text-gray-500 mt-4">
                Please upload your resume and enter the job description to continue
              </p>
            )}
            
            {isUploading && (
              <p className="text-blue-600 mt-4">
                Processing your files... This may take a moment.
              </p>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">What You'll Get</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Match Analysis</h3>
              <p className="text-gray-600">See how well your resume matches the job requirements</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-purple-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Suggestions</h3>
              <p className="text-gray-600">Get personalized recommendations based on your resume and job description</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="text-green-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Keyword Analysis</h3>
              <p className="text-gray-600">Identify missing keywords and skills to add</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsertResumeApp;


// Kal tujhse iss page me resume dalwana hai drag and drop se job Description  bhi aur fir upload api pe jaake post req marni hai
// fir ek loading dalna hai aur pura Dashboard setup krke rakhna hai jisme left center and right panel rakhnege jisko modification ki jrurt hai
// fir apne feedbacks me aur bhi cheeze add krni padengi anaylizez section 