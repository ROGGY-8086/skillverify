import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileUp, Target, Briefcase, User as UserIcon, Award, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import SkillBadge from '../components/SkillBadge';
import CredentialStatus from '../components/CredentialStatus';
import JobCard from '../components/JobCard';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const profileRes = await client.get('/api/candidates/me');
        setProfile(profileRes.data);
        
        try {
          const jobsRes = await client.get('/api/matching/jobs');
          setJobs(jobsRes.data.slice(0, 3));
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  <JobCard key={job.id} job={job.job || job} matchScore={job.match_score} />
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

          {/* Top Skills */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900">Your Top Skills</h2>
              <Link to="/candidate/profile" className="text-sm text-accent hover:underline">Manage</Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile?.skills && profile.skills.length > 0 ? (
                profile.skills.slice(0, 8).map((skill, idx) => (
                  <SkillBadge 
                    key={idx} 
                    skill={skill.name} 
                    proficiency={skill.proficiency} 
                    confidence={skill.confidence_score}
                    evidenceType={skill.evidence_type}
                    verified={skill.is_verified}
                  />
                ))
              ) : (
                <p className="text-sm text-slate-500 italic">No skills added yet.</p>
              )}
            </div>
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
