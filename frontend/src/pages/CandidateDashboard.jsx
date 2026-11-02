import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FileUp, Target, Briefcase, User as UserIcon, Award, ChevronRight, Code2, Users2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import SkillBadge from '../components/SkillBadge';
import CredentialStatus from '../components/CredentialStatus';
import JobCard from '../components/JobCard';

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

function getBasicSkillCategory(skill) {
  const cat = (skill.category || '').toLowerCase().trim();
  if (cat === 'soft skills' || cat === 'soft skill') {
    return 'Soft Skills';
  }
  if (cat === 'programming languages' || cat === 'programming skills') {
    return 'Programming Skills';
  }

  const name = (skill.name || skill.skill_name || skill.normalized_skill || '').toLowerCase().trim();
  if (SOFT_SKILLS.has(name) || [...SOFT_SKILLS].some(s => name === s || name.includes(s))) {
    return 'Soft Skills';
  }
  if (PROGRAMMING_SKILLS.has(name) || [...PROGRAMMING_SKILLS].some(p => name === p || name.includes(p))) {
    return 'Programming Skills';
  }
  return null;
}

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [skillFilter, setSkillFilter] = useState('all'); // 'all' | 'programming' | 'soft'

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const profileRes = await client.get('/api/candidates/me');
        setProfile(profileRes.data);
        
        try {
          const jobsRes = await client.get('/api/matching/jobs');
          const list = Array.isArray(jobsRes.data) ? jobsRes.data : (jobsRes.data?.jobs || []);
          setJobs(list.slice(0, 3));
        } catch (jobErr) {
          console.error("Could not fetch jobs", jobErr);
        }
      } catch (err) {
        console.error("Could not fetch profile", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Filter skills: show ONLY basic skills (Soft Skills and Programming Skills)
  const basicSkills = useMemo(() => {
    if (!profile?.skills) return [];
    return profile.skills
      .map(skill => ({
        ...skill,
        name: skill.name || skill.skill_name || skill.normalized_skill,
        basicType: getBasicSkillCategory(skill)
      }))
      .filter(skill => skill.basicType !== null);
  }, [profile?.skills]);

  const programmingSkills = useMemo(() => {
    return basicSkills.filter(s => s.basicType === 'Programming Skills');
  }, [basicSkills]);

  const softSkills = useMemo(() => {
    return basicSkills.filter(s => s.basicType === 'Soft Skills');
  }, [basicSkills]);

  const displayedSkills = useMemo(() => {
    if (skillFilter === 'programming') return programmingSkills;
    if (skillFilter === 'soft') return softSkills;
    return basicSkills;
  }, [skillFilter, basicSkills, programmingSkills, softSkills]);

  const specializedSkillsCount = useMemo(() => {
    if (!profile?.skills) return 0;
    return Math.max(0, profile.skills.length - basicSkills.length);
  }, [profile?.skills, basicSkills]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  }

  // Calculate profile completion
  const completionSteps = [
    !!profile?.headline,
    !!profile?.location,
    profile?.experience_years !== undefined,
    profile?.skills?.length > 0,
    profile?.credentials?.length > 0
  ];
  const completionPercentage = Math.round((completionSteps.filter(Boolean).length / completionSteps.length) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.name.split(' ')[0]}!</h1>
        <p className="text-slate-600 mt-1">Here's what's happening with your profile today.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link to="/candidate/upload" className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-accent hover:shadow-md transition-all text-center group">
              <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-accent transition-colors">
                <FileUp className="h-5 w-5 text-accent group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm font-medium text-slate-700">Upload Resume</span>
            </Link>
            <Link to="/candidate/assessments" className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-accent hover:shadow-md transition-all text-center group">
              <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-accent transition-colors">
                <Target className="h-5 w-5 text-accent group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm font-medium text-slate-700">Take Assessment</span>
            </Link>
            <Link to="/candidate/jobs" className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-accent hover:shadow-md transition-all text-center group">
              <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-accent transition-colors">
                <Briefcase className="h-5 w-5 text-accent group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm font-medium text-slate-700">View Jobs</span>
            </Link>
            <Link to="/candidate/profile" className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-accent hover:shadow-md transition-all text-center group">
              <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-accent transition-colors">
                <UserIcon className="h-5 w-5 text-accent group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm font-medium text-slate-700">Edit Profile</span>
            </Link>
          </div>

          {/* Recommended Jobs */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">Recommended Jobs</h2>
              <Link to="/candidate/jobs" className="text-sm font-medium text-accent hover:text-teal-600 flex items-center">
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="p-6 space-y-4 bg-slate-50">
              {jobs.length > 0 ? (
                jobs.map(job => (
                  <JobCard key={job.id || job.job_id || job.job?.id} job={job.job || job} matchScore={job.match_score} />
                ))
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No jobs matched yet.</p>
                  <p className="text-sm text-slate-400 mt-1">Complete your profile and add skills to get matched.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-8">
          
          {/* Profile Completion */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Profile Completion</h2>
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-slate-600">Progress</span>
              <span className="text-accent">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6">
              <div className="bg-accent h-2.5 rounded-full transition-all duration-1000" style={{ width: `${completionPercentage}%` }}></div>
            </div>
            
            {completionPercentage < 100 && (
              <div className="space-y-3 text-sm">
                <p className="font-medium text-slate-700">Next steps:</p>
                <ul className="space-y-2">
                  {!profile?.headline && (
                    <li className="flex items-start gap-2 text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5"></div>
                      <Link to="/candidate/profile" className="hover:text-accent">Add a professional headline</Link>
                    </li>
                  )}
                  {(!profile?.skills || profile.skills.length === 0) && (
                    <li className="flex items-start gap-2 text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5"></div>
                      <Link to="/candidate/upload" className="hover:text-accent">Upload resume to extract skills</Link>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Basic Skills (Programming & Soft Skills) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Basic Skills</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-accent border border-teal-200">
                  {basicSkills.length} Verified
                </span>
              </div>
              <Link to="/candidate/profile" className="text-xs font-medium text-accent hover:underline">
                Manage All
              </Link>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Only showing core programming & soft skills extracted from your resume.
            </p>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg mb-4 text-xs font-medium">
              <button
                type="button"
                onClick={() => setSkillFilter('all')}
                className={`flex-1 py-1 px-1.5 rounded-md transition-all text-center ${
                  skillFilter === 'all'
                    ? 'bg-white shadow-xs font-bold text-slate-900'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All ({basicSkills.length})
              </button>
              <button
                type="button"
                onClick={() => setSkillFilter('programming')}
                className={`flex-1 py-1 px-1.5 rounded-md transition-all text-center flex items-center justify-center gap-1 ${
                  skillFilter === 'programming'
                    ? 'bg-white shadow-xs font-bold text-slate-900'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>🖥️</span> Code ({programmingSkills.length})
              </button>
              <button
                type="button"
                onClick={() => setSkillFilter('soft')}
                className={`flex-1 py-1 px-1.5 rounded-md transition-all text-center flex items-center justify-center gap-1 ${
                  skillFilter === 'soft'
                    ? 'bg-white shadow-xs font-bold text-slate-900'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>🤝</span> Soft ({softSkills.length})
              </button>
            </div>

            {/* Basic Skills List */}
            <div className="space-y-3">
              {displayedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {displayedSkills.map((skill, idx) => (
                    <SkillBadge 
                      key={idx} 
                      skill={skill.name} 
                      proficiency={skill.proficiency || skill.proficiency_level} 
                      confidence={skill.confidence_score}
                      evidenceType={skill.evidence_type}
                      verified={skill.is_verified ?? skill.verified}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-5 text-center border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                  <p className="text-xs font-medium text-slate-600">
                    No {skillFilter === 'programming' ? 'programming' : skillFilter === 'soft' ? 'soft' : 'basic'} skills found.
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 mb-2">
                    Upload your resume to automatically extract your programming and soft skills.
                  </p>
                  <Link
                    to="/candidate/upload"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                  >
                    Upload Resume →
                  </Link>
                </div>
              )}
            </div>

            {/* Note about other specialized skills */}
            {specializedSkillsCount > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="truncate">
                  +{specializedSkillsCount} other technical skills (DevOps, Cloud)
                </span>
                <Link to="/candidate/profile" className="text-accent font-semibold hover:underline shrink-0 ml-2">
                  View Profile →
                </Link>
              </div>
            )}
          </div>

          {/* Recent Credentials */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900">Recent Credentials</h2>
              <Link to="/candidate/profile" className="text-sm text-accent hover:underline">View All</Link>
            </div>
            <div className="space-y-4">
              {profile?.credentials && profile.credentials.length > 0 ? (
                profile.credentials.slice(0, 3).map((cred, idx) => (
                  <div key={idx} className="flex justify-between items-start gap-3">
                    <div className="flex gap-3">
                      <div className="mt-0.5"><Award className="h-4 w-4 text-slate-400" /></div>
                      <div>
                        <p className="text-sm font-medium text-slate-800 line-clamp-1">{cred.title}</p>
                        <p className="text-xs text-slate-500">{cred.issuer}</p>
                      </div>
                    </div>
                    <CredentialStatus status={cred.status} />
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 italic">No credentials uploaded yet.</p>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
