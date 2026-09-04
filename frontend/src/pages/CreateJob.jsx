import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, Plus, X, Search, CheckCircle2 } from 'lucide-react';
import client from '../api/client';

const CreateJob = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    employmentType: 'Full-time',
    description: '',
    salaryMin: '',
    salaryMax: '',
    skills: []
  });
  
  const [skillInput, setSkillInput] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);

  // Mock taxonomy for demo
  const skillTaxonomy = [
    'React', 'Node.js', 'Python', 'TypeScript', 'AWS', 'Docker', 'Kubernetes', 
    'SQL', 'MongoDB', 'GraphQL', 'CSS', 'HTML', 'Java', 'Go', 'Rust'
  ];

  const handleAddSkill = (skillName) => {
    if (!skillName || formData.skills.find(s => s.name.toLowerCase() === skillName.toLowerCase())) return;
    
    setFormData({
      ...formData,
      skills: [...formData.skills, { name: skillName, proficiency: 'intermediate', isRequired: true }]
    });
    setSkillInput('');
    setShowSkillDropdown(false);
  };

  const handleRemoveSkill = (index) => {
    const newSkills = [...formData.skills];
    newSkills.splice(index, 1);
    setFormData({ ...formData, skills: newSkills });
  };

  const updateSkill = (index, field, value) => {
    const newSkills = [...formData.skills];
    newSkills[index][field] = value;
    setFormData({ ...formData, skills: newSkills });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const dataToSubmit = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        salary_min: formData.salaryMin ? parseInt(formData.salaryMin) : null,
        salary_max: formData.salaryMax ? parseInt(formData.salaryMax) : null,
        employment_type: formData.employmentType,
        experience_required: formData.experience ? parseInt(formData.experience) : 0,
        education_required: formData.education || null,
        skills: formData.skills.map(s => ({
          skill_name: s.name,
          min_proficiency: s.proficiency || "basic",
          is_required: s.isRequired
        }))
      };
      
      await client.post('/api/jobs', dataToSubmit);
      navigate('/employer/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to create job posting');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Create Job Posting</h1>
        <p className="text-slate-600 mt-1">Define the role and required skills to find the perfect match.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">Basic Details</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Job Title *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-accent focus:border-accent"
                  placeholder="e.g. Senior Frontend Developer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-accent focus:border-accent"
                    placeholder="e.g. San Francisco, CA or Remote"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Employment Type</label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => setFormData({...formData, employmentType: e.target.value})}
                  className="block w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-accent focus:border-accent"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Salary Range (Optional)</label>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="number"
                    value={formData.salaryMin}
                    onChange={(e) => setFormData({...formData, salaryMin: e.target.value})}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-accent focus:border-accent"
                    placeholder="Min"
                  />
                </div>
                <span className="text-slate-500">to</span>
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="number"
                    value={formData.salaryMax}
                    onChange={(e) => setFormData({...formData, salaryMax: e.target.value})}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-accent focus:border-accent"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Job Description *</label>
              <textarea
                required
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="block w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-accent focus:border-accent resize-none"
                placeholder="Describe the role, responsibilities, and ideal candidate..."
              ></textarea>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Skill Requirements</h2>
            <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Smart Matching Enabled
            </span>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-1">Add Required Skills</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={skillInput}
                onChange={(e) => {
                  setSkillInput(e.target.value);
                  setShowSkillDropdown(e.target.value.length > 0);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && skillInput) {
                    e.preventDefault();
                    handleAddSkill(skillInput);
                  }
                }}
                className="block w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-accent focus:border-accent"
                placeholder="Search skills (e.g. React, Data Analysis)..."
              />
              <button 
                type="button"
                onClick={() => handleAddSkill(skillInput)}
                className="absolute inset-y-1 right-1 px-3 bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 text-sm font-medium transition-colors"
              >
                Add
              </button>
              
              {showSkillDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {skillTaxonomy
                    .filter(s => s.toLowerCase().includes(skillInput.toLowerCase()))
                    .map((skill, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddSkill(skill)}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700"
                      >
                        {skill}
                      </button>
                    ))
                  }
                  {skillInput && !skillTaxonomy.some(s => s.toLowerCase() === skillInput.toLowerCase()) && (
                    <button
                      type="button"
                      onClick={() => handleAddSkill(skillInput)}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-accent font-medium"
                    >
                      Add "{skillInput}"
                    </button>
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Our AI semantic matcher will automatically understand related skills.
            </p>
          </div>

          <div className="space-y-4">
            {formData.skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl bg-slate-50">
                <div className="w-1/3">
                  <p className="font-semibold text-slate-900">{skill.name}</p>
                </div>
                
                <div className="w-1/3">
                  <select
                    value={skill.proficiency}
                    onChange={(e) => updateSkill(index, 'proficiency', e.target.value)}
                    className="block w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-accent"
                  >
                    <option value="basic">Basic (Familiar)</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced (Expert)</option>
                  </select>
                </div>
                
                <div className="flex-1 flex justify-end items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={skill.isRequired}
                      onChange={(e) => updateSkill(index, 'isRequired', e.target.checked)}
                      className="h-4 w-4 text-accent rounded border-slate-300 focus:ring-accent"
                    />
                    <span className="text-sm font-medium text-slate-700">Required</span>
                  </label>
                  
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(index)}
                    className="p-1 text-slate-400 hover:text-error hover:bg-red-50 rounded transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
            
            {formData.skills.length === 0 && (
              <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl text-slate-500">
                No skills added yet. Add skills to enable smart matching.
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button 
            type="button"
            onClick={() => navigate('/employer/dashboard')}
            className="px-6 py-3 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={isSubmitting || formData.skills.length === 0}
            className="px-8 py-3 bg-accent text-white rounded-lg text-sm font-medium hover:bg-teal-600 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {isSubmitting ? 'Posting...' : 'Publish Job Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;
