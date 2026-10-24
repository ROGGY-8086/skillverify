import React, { useState, useEffect } from 'react';
import { Filter, Search, Target, Sparkles, Briefcase } from 'lucide-react';
import client from '../api/client';
import JobCard from '../components/JobCard';

const JobRecommendations = () => {
  const [jobs, setJobs] = useState([]);
  const [candidateSkills, setCandidateSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'high' | 'remote'
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch candidate's own skills for quick filter tags
        try {
          const profileRes = await client.get('/api/candidates/me');
          if (profileRes.data?.skills) {
            const skillNames = profileRes.data.skills.map(s => s.name || s.skill_name).filter(Boolean);
            setCandidateSkills(Array.from(new Set(skillNames)));
          }
        } catch (pErr) {
          console.error("Could not fetch candidate profile", pErr);
        }

        // Fetch matched jobs
        const res = await client.get('/api/matching/jobs');
        const list = Array.isArray(res.data) ? res.data : (res.data?.jobs || res.data?.items || []);
        setJobs(list);
      } catch (err) {
        console.error("Could not fetch recommended jobs", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApply = (jobId) => {
    alert(`Application submitted successfully for job #${jobId}!`);
  };

  const filteredJobs = jobs.filter(job => {
    // Score filter
    if (filter === 'high' && (job.match_score || 0) < 80) return false;
    
    // Remote filter
    const loc = (job.location || job.job?.location || '').toLowerCase();
    if (filter === 'remote' && !loc.includes('remote')) return false;

    // Search query matching (matches title, company, or any required skill)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const title = (job.title || job.job_title || job.job?.title || '').toLowerCase();
      const comp = (job.company || job.company_name || job.job?.company || '').toLowerCase();
      const jobLoc = loc;
      
      const skills = (job.skills || job.job?.skills || job.job_skills || []).map(s => 
        (typeof s === 'string' ? s : (s.name || s.skill_name || '')).toLowerCase()
      );
      const matchedSkills = (job.skill_matches || []).map(s => s.toLowerCase());

      const matchesTitle = title.includes(q);
      const matchesCompany = comp.includes(q);
      const matchesLocation = jobLoc.includes(q);
      const matchesSkill = skills.some(s => s.includes(q));
      const matchesSkillMatches = matchedSkills.some(s => s.includes(q));

      return matchesTitle || matchesCompany || matchesLocation || matchesSkill || matchesSkillMatches;
    }

    return true;
  });

  if (isLoading) return <div className="min-h-screen flex justify-center pt-28 text-slate-500 font-medium">Loading jobs...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-teal-200 bg-teal-50 text-xs font-bold text-accent mb-3 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> AI Smart Matching
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Recommended Jobs</h1>
          <p className="text-slate-600">Matched in real-time based on your verified skills, experience, and credentials</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, company, or skill (e.g. React, Python)..."
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-accent focus:border-accent w-full sm:w-80 text-sm"
            />
          </div>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Quick Skill Filters */}
      {candidateSkills.length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5 text-accent" /> Filter by your skills:
            </span>
            {candidateSkills.map((skillName, idx) => {
              const isSelected = searchQuery.toLowerCase() === skillName.toLowerCase();
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSearchQuery(isSelected ? '' : skillName)}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition-all flex items-center gap-1 ${
                    isSelected 
                      ? 'bg-accent text-white shadow-sm ring-2 ring-teal-400/50' 
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-accent hover:text-accent shadow-2xs'
                  }`}
                >
                  {skillName} {isSelected && '✕'}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          All Matches ({jobs.length})
        </button>
        <button 
          onClick={() => setFilter('high')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'high' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          Top Matches (&gt;80%)
        </button>
        <button 
          onClick={() => setFilter('remote')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'remote' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          Remote Only
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <JobCard 
              key={job.job?.id || job.job_id || job.id} 
              job={job.job || job} 
              matchScore={job.match_score} 
              onApply={handleApply}
            />
          ))
        ) : (
          <div className="col-span-full py-16 text-center bg-white rounded-xl border border-slate-200 border-dashed">
            <Target className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">No jobs match your search</h3>
            <p className="text-slate-500 max-w-md mx-auto text-sm">
              {searchQuery 
                ? `No roles found matching "${searchQuery}". Try searching for another skill like React, Python, or Java.`
                : "Try adjusting your filters or complete your profile skills to get higher match scores."
              }
            </p>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobRecommendations;
