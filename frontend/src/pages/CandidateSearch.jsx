import React, { useState, useEffect } from 'react';
import { Search, Filter, ShieldCheck, ChevronDown, Check } from 'lucide-react';
import client from '../api/client';
import CandidateCard from '../components/CandidateCard';
import { useNavigate } from 'react-router-dom';

const CandidateSearch = () => {
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeJobId, setActiveJobId] = useState('');
  const [employerJobs, setEmployerJobs] = useState([]);
  const [filterVerified, setFilterVerified] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch employer's jobs for the dropdown
    const fetchJobs = async () => {
      try {
        const res = await client.get('/api/jobs');
        setEmployerJobs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchJobs();
    
    // Initial fetch of top candidates
    handleSearch();
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    
    try {
      let endpoint = '/api/candidates';
      if (activeJobId) {
        // If searching context of a job, use match endpoint
        // NOTE: In a real app this would be a specific endpoint. 
        // Using base candidate endpoint for demo.
        endpoint = '/api/candidates';
      }
      
      const res = await client.get(endpoint);
      // Mock filtering based on UI state for demo
      let results = res.data;
      if (filterVerified) {
        results = results.filter(c => c.isVerified);
      }
      
      // Simulate adding match scores if job selected
      if (activeJobId) {
        results = results.map(c => ({
          ...c,
          matchScore: Math.floor(Math.random() * (99 - 60 + 1)) + 60
        })).sort((a, b) => b.matchScore - a.matchScore);
      }
      
      setCandidates(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCandidateClick = (id) => {
    navigate(`/employer/candidates/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Talent Search</h1>
        <p className="text-slate-600 mt-1">Find and verify the perfect candidates for your team.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-accent focus:border-accent text-slate-900"
                placeholder="Search by skill, role, or keywords..."
              />
            </div>
          </div>
          
          <div className="md:w-64">
            <select
              value={activeJobId}
              onChange={(e) => setActiveJobId(e.target.value)}
              className="block w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-accent focus:border-accent bg-slate-50"
            >
              <option value="">Search all candidates</option>
              {employerJobs.map(job => (
                <option key={job.id} value={job.id}>Match for: {job.title}</option>
              ))}
            </select>
          </div>
          
          <button 
            type="submit"
            className="bg-slate-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-slate-100">
          <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filters:
          </span>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <div className={`w-5 h-5 rounded border flex items-center justify-center ${filterVerified ? 'bg-success border-success text-white' : 'border-slate-300'}`}>
              {filterVerified && <Check className="h-3 w-3" />}
            </div>
            <input 
              type="checkbox" 
              className="hidden" 
              checked={filterVerified}
              onChange={() => setFilterVerified(!filterVerified)}
            />
            <span className="text-sm text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-success" /> Verified Skills Only
            </span>
          </label>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-900">
          {isLoading ? 'Searching...' : `${candidates.length} Candidates Found`}
        </h2>
        
        {activeJobId && (
          <div className="text-sm text-slate-600">
            Sorted by <span className="font-semibold text-slate-900">Match Score</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-slate-200 border-t-accent rounded-full"></div>
          <p className="mt-4 text-slate-500 font-medium">Analyzing candidate profiles...</p>
        </div>
      ) : candidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <CandidateCard 
              key={candidate.id} 
              candidate={candidate} 
              matchScore={candidate.matchScore}
              onClick={handleCandidateClick}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-16 text-center">
          <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No candidates found</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Try broadening your search terms or adjusting your filters to see more candidates.
          </p>
        </div>
      )}
    </div>
  );
};

export default CandidateSearch;
