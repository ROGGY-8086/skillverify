import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  FileText, 
  Save, 
  Edit3, 
  Camera, 
  ShieldCheck, 
  Trash2, 
  ExternalLink,
  Github,
  Globe,
  AlertCircle
} from 'lucide-react';
import client from '../api/client';
import CredentialStatus from '../components/CredentialStatus';
import { useAuth } from '../context/AuthContext';

const SKILL_CATEGORIES = {
  'Programming Languages': ['Python', 'Java', 'JavaScript', 'TypeScript', 'C++', 'C#', 'C', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'Dart'],
  'Web & Frontend': ['React', 'Angular', 'Vue.js', 'Next.js', 'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap', 'jQuery', 'Svelte', 'Webpack', 'Vite'],
  'Backend & APIs': ['Node.js', 'Express.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'REST API', 'GraphQL', 'gRPC', 'NestJS', 'Laravel'],
  'Databases': ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'Cassandra', 'DynamoDB', 'Firebase', 'Elasticsearch'],
  'Cloud & DevOps': ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'Terraform', 'Linux', 'GitHub Actions'],
  'Data Science & ML': ['Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'NLP', 'Computer Vision', 'Statistics', 'Tableau', 'Power BI'],
  'Mobile': ['React Native', 'Flutter', 'iOS Development', 'Android Development', 'SwiftUI'],
  'Tools & Practices': ['Git', 'GitHub', 'Jira', 'Agile', 'Scrum', 'TDD', 'Unit Testing', 'System Design', 'Docker', 'Microservices'],
  'Soft Skills': ['Leadership', 'Communication', 'Teamwork', 'Problem Solving', 'Critical Thinking', 'Project Management', 'Time Management', 'Presentation'],
};

const CATEGORY_ICONS = {
  'Programming Languages': '🖥️',
  'Web & Frontend': '🌐',
  'Backend & APIs': '⚙️',
  'Databases': '🗄️',
  'Cloud & DevOps': '☁️',
  'Data Science & ML': '📊',
  'Mobile': '📱',
  'Tools & Practices': '🛠️',
  'Soft Skills': '🤝',
  'Other': '⚡'
};

function categorizeSkill(skillName) {
  const name = (skillName || '').toLowerCase().trim();
  for (const [cat, skills] of Object.entries(SKILL_CATEGORIES)) {
    if (skills.some(s => s.toLowerCase() === name)) return cat;
  }
  return 'Other';
}

function getEvidenceMeaning(evidenceType) {
  const type = (evidenceType || '').toLowerCase().trim();
  switch (type) {
    case 'credential':
      return 'Verified by issuer credential';
    case 'assessment':
      return 'Confirmed by skill test';
    case 'project':
      return 'Found in project description';
    case 'resume':
      return 'Extracted from resume text';
    case 'self-declared':
    default:
      return 'Self-reported by candidate';
  }
}

function getProficiencyBadge(proficiency) {
  const p = (proficiency || 'basic').toLowerCase().trim();
  if (p === 'advanced' || p === 'expert') {
    return (
      <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
        Advanced
      </span>
    );
  }
  if (p === 'intermediate') {
    return (
      <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
        Intermediate
      </span>
    );
  }
  return (
    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
      Basic
    </span>
  );
}

const CandidateProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [avatar, setAvatar] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    headline: '',
    location: '',
    experience_years: 0,
    bio: '',
    education: '',
    github_url: '',
    portfolio_url: ''
  });

  // Avatar sync with localStorage
  useEffect(() => {
    if (user?.id) {
      const saved = localStorage.getItem(`avatar_${user.id}`);
      setAvatar(saved || null);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await client.get('/api/candidates/me');
      setProfile(res.data);
      setFormData({
        headline: res.data.headline || '',
        location: res.data.location || '',
        experience_years: res.data.experience_years ?? 0,
        bio: res.data.bio || '',
        education: res.data.education || '',
        github_url: res.data.github_url || '',
        portfolio_url: res.data.portfolio_url || ''
      });
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setAvatar(result);
        if (user?.id) {
          localStorage.setItem(`avatar_${user.id}`, result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const payload = {
        headline: formData.headline || null,
        location: formData.location || null,
        experience_years: formData.experience_years === '' ? 0 : Number(formData.experience_years),
        bio: formData.bio || null,
        education: formData.education || null,
        github_url: formData.github_url || null,
        portfolio_url: formData.portfolio_url || null
      };
      await client.put('/api/candidates/me', payload);
      await fetchProfile();
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to save profile changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (profile) {
      setFormData({
        headline: profile.headline || '',
        location: profile.location || '',
        experience_years: profile.experience_years ?? 0,
        bio: profile.bio || '',
        education: profile.education || '',
        github_url: profile.github_url || '',
        portfolio_url: profile.portfolio_url || ''
      });
    }
    setError('');
    setIsEditing(false);
  };

  const handleRemoveSkill = async (skillId) => {
    if (window.confirm('Are you sure you want to remove this skill?')) {
      try {
        await client.delete(`/api/candidates/skills/${skillId}`);
        await fetchProfile();
      } catch (err) {
        console.error('Failed to remove skill:', err);
      }
    }
  };

  // Group skills by category
  const groupedSkills = useMemo(() => {
    if (!profile?.skills || profile.skills.length === 0) return {};
    const groups = {};

    profile.skills.forEach((skill) => {
      const skillName = skill.normalized_skill || skill.skill_name || skill.name || '';
      const category = categorizeSkill(skillName);
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(skill);
    });

    return groups;
  }, [profile?.skills]);

  // Order category keys consistently
  const orderedCategories = useMemo(() => {
    const predefinedOrder = Object.keys(SKILL_CATEGORIES);
    const existing = Object.keys(groupedSkills);
    const sorted = predefinedOrder.filter(cat => existing.includes(cat));
    if (existing.includes('Other')) {
      sorted.push('Other');
    }
    return sorted;
  }, [groupedSkills]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-slate-500 font-medium">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
      
      {/* ───── PROFILE HEADER CARD ───── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        
        {/* Dark Blue Cover Banner with Avatar */}
        <div className="bg-primary pt-12 pb-6 px-8 flex items-end relative">
          <div className="bg-white p-1 rounded-full inline-block shadow-md">
            <div className="w-28 h-28 bg-slate-100 rounded-full flex items-center justify-center border-4 border-white overflow-hidden relative group shrink-0">
              {avatar ? (
                <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="h-14 w-14 text-slate-400" />
              )}
              <label className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="h-5 w-5 mb-0.5" />
                <span className="text-[10px] font-medium">Change</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-8 pb-8 pt-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-start gap-3 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isEditing ? (
            /* ───── EDIT MODE ───── */
            <form onSubmit={handleSave} className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
                  <p className="text-xs text-slate-500 mt-0.5">Edit your profile information</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors disabled:opacity-60"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
                  </button>
                </div>
              </div>

              {/* Headline */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Headline</label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  placeholder="e.g. Senior Full Stack Developer"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400"
                />
              </div>

              {/* Location & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Years of Experience</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={formData.experience_years}
                    onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                    placeholder="e.g. 5"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Education */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Education</label>
                <input
                  type="text"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  placeholder="e.g. B.Tech Computer Science, IIT Bombay 2022"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400"
                />
              </div>

              {/* GitHub & Portfolio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    placeholder="https://github.com/yourusername"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Portfolio URL</label>
                  <input
                    type="url"
                    value={formData.portfolio_url}
                    onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                    placeholder="https://yourportfolio.com"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Describe your technical background, major achievements, and interests..."
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400 resize-none"
                />
              </div>
            </form>
          ) : (
            /* ───── VIEW MODE ───── */
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="w-full max-w-3xl">
                {user?.name && (
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {user.name}
                  </h1>
                )}
                
                <p className="text-lg text-slate-500 mt-1 font-medium">
                  {profile?.headline || 'No headline set'}
                </p>

                {/* Metadata Pills / Icons */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-5 mt-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>{profile?.location || 'Location not added'}</span>
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>{profile?.experience_years ?? 0} years experience</span>
                  </span>

                  {profile?.education && (
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>{profile.education}</span>
                    </span>
                  )}

                  {profile?.github_url && (
                    <a
                      href={profile.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Github className="h-4 w-4 shrink-0" />
                      <span>GitHub</span>
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </a>
                  )}

                  {profile?.portfolio_url && (
                    <a
                      href={profile.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Globe className="h-4 w-4 shrink-0" />
                      <span>Portfolio</span>
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </a>
                  )}
                </div>

                {/* Bio Section */}
                {profile?.bio && (
                  <div className="mt-5 pt-5 border-t border-slate-100">
                    <h3 className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-2">About</h3>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                      {profile.bio}
                    </p>
                  </div>
                )}
              </div>

              {/* Edit Profile Button (Outlined Blue) */}
              <div className="shrink-0 mt-2 sm:mt-0">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ───── MAIN CONTENT GRID: SKILLS & CREDENTIALS ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Categorized Skills (2 cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-7">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Skills & Expertise</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Categorized skills with verified evidence and confidence metrics
                </p>
              </div>
              <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                {profile?.skills?.length || 0} Total Skills
              </span>
            </div>

            {orderedCategories.length > 0 ? (
              <div className="space-y-8">
                {orderedCategories.map((category) => {
                  const skills = groupedSkills[category] || [];
                  return (
                    <div key={category} className="space-y-3">
                      {/* Section Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{CATEGORY_ICONS[category] || '⚡'}</span>
                          <h3 className="font-semibold text-slate-800 text-sm tracking-tight">{category}</h3>
                        </div>
                        <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-0.5 rounded-full font-medium">
                          {skills.length}
                        </span>
                      </div>

                      {/* Skills Rows in this Category */}
                      <div className="space-y-2.5">
                        {skills.map((skill) => {
                          const skillName = skill.normalized_skill || skill.skill_name || skill.name || 'Skill';
                          const proficiency = skill.proficiency_level || skill.proficiency || 'Basic';
                          const rawScore = skill.confidence_score != null ? skill.confidence_score : 0.8;
                          const scorePct = Math.min(100, Math.max(0, Math.round(rawScore <= 1 ? rawScore * 100 : rawScore)));
                          const meaning = getEvidenceMeaning(skill.evidence_type);
                          const confidenceLabel = `Confidence: ${scorePct}% — ${meaning}`;

                          return (
                            <div
                              key={skill.id || skillName}
                              className="group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 border border-slate-200/80 rounded-xl hover:border-slate-300 hover:bg-slate-50/70 transition-all gap-3"
                            >
                              {/* Left: Skill name & Proficiency Badge */}
                              <div className="flex items-center gap-2.5 min-w-[180px]">
                                <span className="font-semibold text-slate-900 text-sm">{skillName}</span>
                                {getProficiencyBadge(proficiency)}
                                {skill.verified && (
                                  <ShieldCheck className="h-4 w-4 text-green-600 shrink-0" title="Verified Credential" />
                                )}
                              </div>

                              {/* Right: Confidence Bar with Detailed Label */}
                              <div className="flex-grow max-w-md">
                                <div className="flex justify-between items-center text-xs text-slate-600 mb-1.5">
                                  <span className="font-medium truncate pr-2 text-slate-700" title={confidenceLabel}>
                                    {confidenceLabel}
                                  </span>
                                </div>
                                <div 
                                  className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden" 
                                  title={confidenceLabel}
                                >
                                  <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${scorePct}%` }}
                                  />
                                </div>
                              </div>

                              {/* Optional Remove in Edit Mode */}
                              {isEditing && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSkill(skill.id)}
                                  className="text-slate-400 hover:text-red-600 transition-colors self-end sm:self-center p-1"
                                  title="Remove skill"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <FileText className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-700">No skills added yet</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Upload your resume or take skill assessments to automatically populate verified technical skills.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Credentials */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-7">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Credentials</h2>
              <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                {profile?.credentials?.length || 0}
              </span>
            </div>

            <div className="space-y-3.5">
              {profile?.credentials && profile.credentials.length > 0 ? (
                profile.credentials.map((cred) => (
                  <div key={cred.id} className="p-4 border border-slate-200/80 rounded-xl bg-slate-50/60 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h4 className="font-semibold text-sm text-slate-900 leading-snug">{cred.title}</h4>
                      <CredentialStatus status={cred.status} />
                    </div>
                    {cred.issuer && (
                      <p className="text-xs text-slate-600 font-medium mb-1">{cred.issuer}</p>
                    )}
                    {(cred.credential_id || cred.credential_id_value) && (
                      <p className="text-[11px] text-slate-400 font-mono">
                        ID: {cred.credential_id || cred.credential_id_value}
                      </p>
                    )}

                    {cred.status?.toLowerCase() === 'verified' && (
                      <div className="mt-3 text-xs bg-green-50 text-green-700 p-2.5 rounded-lg flex items-center gap-2 border border-green-200/60">
                        <ShieldCheck className="h-4 w-4 text-green-600 shrink-0" />
                        <span>
                          Verified{cred.verified_at ? ` on ${new Date(cred.verified_at).toLocaleDateString()}` : ' on Credential Network'}
                        </span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-600">No credentials yet</p>
                  <p className="text-xs text-slate-400 mt-0.5">Certificates and degrees will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CandidateProfile;
