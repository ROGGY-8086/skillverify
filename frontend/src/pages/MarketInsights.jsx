import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, MapPin, Code2, Briefcase, Award, Activity } from 'lucide-react';
import client from '../api/client';

const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#0ea5e9', '#38bdf8', '#818cf8'];

const StatCard = ({ icon: Icon, title, value, subtitle }) => (
  <div className="bg-white/90 backdrop-blur-sm p-6 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 flex items-start gap-5 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all cursor-default">
    <div className="p-3.5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100/50 shadow-sm">
      <Icon className="h-6 w-6 text-blue-600" />
    </div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
      {subtitle && <p className="text-sm font-medium text-slate-500 mt-1">{subtitle}</p>}
    </div>
  </div>
);

const MarketInsights = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await client.get('/api/stats/market-insights');
        if (res.data.error) {
          setErrorMsg(res.data.error);
        } else {
          setStats(res.data);
        }
      } catch (err) {
        console.error("Failed to load market insights", err);
        setErrorMsg(err.message || "Network Error: Could not connect to API");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (errorMsg || !stats) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center flex-col gap-4 bg-slate-50">
        <TrendingUp className="h-16 w-16 text-slate-300" />
        <h2 className="text-xl font-bold text-slate-700">Market Insights Unavailable</h2>
        <p className="text-slate-500 font-medium">{errorMsg || "Failed to load dataset statistics."}</p>
      </div>
    );
  }

  const expData = Object.entries(stats.exp_by_level).map(([level, years]) => ({
    name: level,
    years: years
  }));

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Subtle Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[400px] bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-[80px] pointer-events-none rounded-full"></div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200/60 bg-blue-50/50 text-xs font-bold text-blue-600 mb-4 backdrop-blur-sm uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5 animate-pulse" /> Live Data
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">AI Job Market Insights</h1>
            <p className="mt-3 text-lg font-medium text-slate-500">
              Real-time analytics trained on <span className="text-slate-800 font-bold">{stats.total_jobs_analyzed.toLocaleString()}+</span> global job postings.
            </p>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={Briefcase} 
            title="Total Jobs Analyzed" 
            value={stats.total_jobs_analyzed.toLocaleString()} 
            subtitle="Across 7 global regions"
          />
          <StatCard 
            icon={Code2} 
            title="Python Requirement" 
            value={`${stats.python_stats.percentage}%`} 
            subtitle="Require Python skills"
          />
          <StatCard 
            icon={MapPin} 
            title="Top Remote Share" 
            value={`${Math.round((stats.remote_distribution.find(r => r.name === 'Remote')?.value || 0) / stats.total_jobs_analyzed * 100)}%`} 
            subtitle="Fully remote roles"
          />
          <StatCard 
            icon={Award} 
            title="Top Hiring Sector" 
            value={stats.top_industries[0]?.name || 'Technology'} 
            subtitle="Most active industry"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Reusable Gradient Defs for Charts */}
          <svg style={{ height: 0 }}>
            <defs>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              <linearGradient id="verticalBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Job Role Distribution */}
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 relative overflow-hidden transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 to-blue-500"></div>
            <h3 className="text-xl font-bold text-slate-800 mb-8 tracking-tight">Top Roles in Demand</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.top_roles} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                  <XAxis type="number" tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" width={100} tick={{fill: '#475569', fontSize: 12, fontWeight: 600}} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontWeight: 600 }} />
                  <Bar dataKey="value" fill="url(#blueGradient)" radius={[0, 6, 6, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Work Model Distribution */}
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 relative overflow-hidden transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
            <h3 className="text-xl font-bold text-slate-800 mb-8 tracking-tight">Work Model Preference</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.remote_distribution}
                    cx="50%"
                    cy="45%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {stats.remote_distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontWeight: 600 }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontWeight: 600, color: '#475569', fontSize: '13px' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Industries */}
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 relative overflow-hidden transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-purple-500"></div>
            <h3 className="text-xl font-bold text-slate-800 mb-8 tracking-tight">Hiring by Industry</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.top_industries} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{fill: '#475569', fontSize: 12, fontWeight: 600}} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontWeight: 600 }} />
                  <Bar dataKey="value" fill="url(#verticalBlue)" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Average Experience by Level */}
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 relative overflow-hidden transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 to-cyan-500"></div>
            <h3 className="text-xl font-bold text-slate-800 mb-8 tracking-tight">Average Experience Required</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={expData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{fill: '#475569', fontSize: 12, fontWeight: 600}} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontWeight: 600 }} />
                  <Line type="monotone" dataKey="years" stroke="#3b82f6" strokeWidth={4} dot={{r: 6, fill: '#fff', stroke: '#3b82f6', strokeWidth: 2}} activeDot={{r: 8, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MarketInsights;
