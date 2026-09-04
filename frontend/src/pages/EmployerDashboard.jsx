import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, Plus, ChevronRight, BarChart2, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await client.get('/api/jobs');
        // In a real app, this would filter by the employer's ID.
        // For demo, we just show whatever jobs come back.
        setJobs(res.data);
      } catch (err) {
        console.error("Could not fetch jobs", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Company Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back, {user?.name.split(' ')[0]}. Here's an overview of your hiring pipeline.</p>
        </div>
        <Link 
          to="/employer/create-job" 
          className="bg-accent text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Post New Job
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Active Jobs</h3>
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{jobs.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Candidates Matched</h3>
            <div className="w-10 h-10 bg-teal-50 text-accent rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">42</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Avg. Match Score</h3>
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
              <BarChart2 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 flex items-baseline gap-1">
            87<span className="text-lg text-slate-500">%</span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900">Your Job Postings</h2>
        </div>
        
        {jobs.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {jobs.map((job) => (
              <div key={job.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">{job.title}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                      <span>{job.location || 'Remote'}</span>
                      <span>•</span>
                      <span>{job.employmentType || 'Full-time'}</span>
                      <span>•</span>
                      <span className="text-slate-400">Posted {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-900">12</p>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">Matches</p>
                    </div>
                    <div className="w-px h-10 bg-slate-200"></div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-success flex items-center justify-center gap-1">
                        94<span className="text-sm">%</span>
                      </p>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">Top Match</p>
                    </div>
                    <Link 
                      to="/employer/search" 
                      className="ml-4 p-2 text-slate-400 hover:text-accent hover:bg-teal-50 rounded-lg transition-colors"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium mb-4">You haven't posted any jobs yet.</p>
            <Link 
              to="/employer/create-job" 
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              <Plus className="h-4 w-4" /> Create Your First Job
            </Link>
          </div>
        )}
      </div>
      
      <div className="mt-8 bg-gradient-to-br from-primary to-slate-800 rounded-xl p-8 text-white flex flex-col md:flex-row items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Star className="h-6 w-6 text-yellow-400" />
            Proactive Sourcing
          </h2>
          <p className="text-slate-300 max-w-xl">
            Don't wait for applicants. Search our entire database of verified candidates and filter by exact skills, proficiency levels, and verification status.
          </p>
        </div>
        <Link 
          to="/employer/search" 
          className="mt-6 md:mt-0 whitespace-nowrap bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors"
        >
          Search Candidates
        </Link>
      </div>
    </div>
  );
};

export default EmployerDashboard;
