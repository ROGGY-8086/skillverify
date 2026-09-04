import React, { useState, useEffect } from 'react';
import { Filter, Search, Target } from 'lucide-react';
import client from '../api/client';
import JobCard from '../components/JobCard';

const JobRecommendations = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await client.get('/api/matching/jobs');
        setJobs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleApply = (jobId) => {
    alert(`Applied to job ${jobId}!`);
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'high') return job.match_score >= 80;
    if (filter === 'remote') return job.job?.location?.toLowerCase().includes('remote');
    return true;
  });

  if (isLoading) return <div className="min-h-screen flex justify-center pt-20">Loading jobs...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Recommended Jobs</h1>
          <p className="text-slate-600">Based on your verified skills and experience</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search roles..."
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-accent focus:border-accent w-full sm:w-64"
            />
          </div>
          <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600 flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <span className="hidden sm:inline text-sm font-medium">Filters</span>
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          All Matches
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
              key={job.job?.id || job.id} 
              job={job.job || job} 
              matchScore={job.match_score} 
              onApply={handleApply}
            />
          ))
        ) : (
          <div className="col-span-full py-16 text-center bg-white rounded-xl border border-slate-200 border-dashed">
            <Target className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">No matches found</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              We couldn't find any jobs matching your current filters. Try adjusting them or update your profile to get more matches.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobRecommendations;
