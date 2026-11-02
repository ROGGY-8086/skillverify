import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UploadCloud, File, X, CheckCircle2, ShieldCheck, AlertCircle, ArrowRight, Sparkles, Code2, Users2, LayoutDashboard } from 'lucide-react';
import client from '../api/client';

const PROGRAMMING_SKILLS = new Set([
  'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'c', 'go', 'rust',
  'ruby', 'php', 'swift', 'kotlin', 'scala', 'r', 'matlab', 'perl', 'dart',
  'lua', 'shell scripting', 'bash', 'zsh', 'sql', 'html', 'css', 'sass', 'less'
]);

const SOFT_SKILLS = new Set([
  'leadership', 'communication', 'teamwork', 'problem solving', 'critical thinking',
  'project management', 'time management', 'presentation', 'adaptability', 'collaboration',
  'work ethic', 'creativity', 'emotional intelligence', 'decision making', 'negotiation',
  'interpersonal skills', 'analytical thinking', 'organization', 'mentoring',
  'conflict resolution', 'active listening', 'attention to detail', 'public speaking',
  'customer service', 'analytical skills'
]);

function getSkillType(skillName, skillCategory) {
  const cat = (skillCategory || '').toLowerCase();
  if (cat === 'soft skills' || cat === 'soft skill') return 'Soft Skill';
  if (cat === 'programming languages' || cat === 'programming skills') return 'Programming Skill';

  const name = (skillName || '').toLowerCase().trim();
  if (SOFT_SKILLS.has(name) || [...SOFT_SKILLS].some(s => name === s || name.includes(s))) {
    return 'Soft Skill';
  }
  if (PROGRAMMING_SKILLS.has(name) || [...PROGRAMMING_SKILLS].some(p => name === p || name.includes(p))) {
    return 'Programming Skill';
  }
  return 'Specialized Skill';
}

const ResumeUpload = () => {
  const navigate = useNavigate();
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

      const rawList = Array.isArray(res.data) ? res.data : (res.data?.extracted_skills || res.data?.skills || []);
      const formattedSkills = rawList.map(s => {
        const name = s.name || s.skill_name || s.normalized_skill || 'Skill';
        const proficiency = s.proficiency || s.proficiency_level || 'intermediate';
        const confidence = s.confidence_score !== undefined ? s.confidence_score : (s.confidence ?? 0.5);
        const category = s.category || '';
        const skillType = getSkillType(name, category);
        return { name, proficiency, confidence, category, skillType };
      });

      setResults({
        skills_added: formattedSkills.length,
        extracted_skills: formattedSkills
      });
    } catch (err) {
      console.error(err);
      setError('Failed to process resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const basicSkillsCount = results?.extracted_skills?.filter(
    s => s.skillType === 'Programming Skill' || s.skillType === 'Soft Skill'
  ).length || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
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
                <span>Extracting programming & soft skills...</span>
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
            <p className="text-slate-600">
              We identified <span className="font-bold text-slate-900">{results.skills_added}</span> total skills, including{' '}
              <span className="font-bold text-accent">{basicSkillsCount} basic skills</span> (programming & soft skills).
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-accent text-xs font-semibold mt-3">
              <Sparkles className="h-3.5 w-3.5" /> Basic programming & soft skills are now featured on your Dashboard
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-accent" /> Extracted Skills Added to Profile
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                {results.extracted_skills?.length || 0} skills found
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.extracted_skills?.map((skill, i) => {
                const isBasic = skill.skillType === 'Programming Skill' || skill.skillType === 'Soft Skill';
                return (
                  <div 
                    key={i} 
                    className={`flex items-center justify-between p-4 border rounded-xl transition-all ${
                      isBasic 
                        ? 'border-teal-200 bg-teal-50/30' 
                        : 'border-slate-100 bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900">{skill.name}</p>
                        {isBasic && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            skill.skillType === 'Programming Skill' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {skill.skillType === 'Programming Skill' ? '🖥️ Code' : '🤝 Soft'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 capitalize mt-0.5">{skill.proficiency} proficiency</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-success">{Math.round(skill.confidence * 100)}%</p>
                      <p className="text-[10px] text-slate-400 uppercase">Confidence</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/candidate/dashboard')}
                className="w-full sm:w-auto bg-accent text-white px-8 py-3.5 rounded-xl font-medium hover:bg-teal-600 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <LayoutDashboard className="h-4 w-4" /> Go to Dashboard (View Basic Skills)
              </button>
              <button 
                onClick={() => navigate('/candidate/profile')}
                className="w-full sm:w-auto border border-slate-300 text-slate-700 px-8 py-3.5 rounded-xl font-medium hover:bg-slate-50 transition-colors"
              >
                View Full Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
