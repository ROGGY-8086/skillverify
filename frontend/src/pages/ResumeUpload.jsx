import React, { useState, useRef } from 'react';
import { UploadCloud, File, X, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import client from '../api/client';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (selectedFile) => {
    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }
    setError('');
    setFile(selectedFile);
    setResults(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await client.post('/api/candidates/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResults(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to process resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Upload Resume</h1>
        <p className="text-slate-600">Let our AI extract your skills and experience automatically.</p>
      </div>
      
      {!results ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          
          <div 
            className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:bg-slate-50 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf" 
              onChange={(e) => e.target.files && handleFileSelection(e.target.files[0])}
            />
            
            {file ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                  <File className="h-8 w-8" />
                </div>
                <p className="font-medium text-slate-900 text-lg mb-1">{file.name}</p>
                <p className="text-sm text-slate-500 mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                
                <div className="flex gap-3">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-100"
                  >
                    Remove
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                    disabled={isUploading}
                    className="px-6 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-teal-600 disabled:opacity-70 flex items-center gap-2"
                  >
                    {isUploading ? 'Processing...' : 'Upload & Extract'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <UploadCloud className="mx-auto h-16 w-16 text-slate-400 mb-4" />
                <p className="text-lg font-medium text-slate-900 mb-1">Click to upload or drag and drop</p>
                <p className="text-sm text-slate-500">PDF only (max 5MB)</p>
              </>
            )}
          </div>
          
          {error && (
            <div className="mt-4 bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 text-sm border border-red-100">
              <AlertCircle className="h-5 w-5" /> {error}
            </div>
          )}
          
          {isUploading && (
            <div className="mt-8">
              <div className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                <span>Analyzing document...</span>
                <span>Extracting skills...</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-accent h-2 rounded-full animate-[pulse_2s_ease-in-out_infinite] w-full" style={{ background: 'linear-gradient(90deg, #14B8A6 0%, #3B82F6 100%)' }}></div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Extraction Complete!</h2>
            <p className="text-slate-600">We found {results.skills_added || 0} skills in your resume.</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-accent" /> Verified Skills Added
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.extracted_skills?.map((skill, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50">
                  <div>
                    <p className="font-semibold text-slate-900">{skill.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{skill.proficiency}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-success">{Math.round(skill.confidence * 100)}%</p>
                    <p className="text-[10px] text-slate-400 uppercase">Confidence</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <button 
                onClick={() => window.location.href = '/candidate/profile'}
                className="bg-accent text-white px-8 py-3 rounded-xl font-medium hover:bg-teal-600 transition-colors"
              >
                View Updated Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
