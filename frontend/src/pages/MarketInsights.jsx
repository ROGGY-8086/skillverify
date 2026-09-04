import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, MapPin, Code2, Briefcase, Award } from 'lucide-react';
import client from '../api/client';

const COLORS = ['#14B8A6', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef'];

const StatCard = ({ icon: Icon, title, value, subtitle }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start gap-4">
    <div className="p-3 bg-teal-50 rounded-lg">
      <Icon className="h-6 w-6 text-accent" />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
    </div>
  </div>
);

const MarketInsights = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await client.get('/api/stats/market-insights');
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load market insights", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center flex-col gap-4">
        <TrendingUp className="h-16 w-16 text-slate-300" />
        <h2 className="text-xl font-bold text-slate-700">Market Insights Unavailable</h2>
        <p className="text-slate-500">Failed to load dataset statistics.</p>
      </div>
    );
  }

  const expData = Object.entries(stats.exp_by_level).map(([level, years]) => ({
    name: level,
    years: years
  }));

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">AI Job Market Insights</h1>
            <p className="mt-2 text-slate-600 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Live market trends trained on {stats.total_jobs_analyzed.toLocaleString()}+ global job postings
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Job Role Distribution (Bar Chart) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Top Roles in Demand</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.top_roles} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} tick={{fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="value" fill="#14B8A6" radius={[0, 4, 4, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Work Model Distribution (Pie Chart) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Work Model Preference</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.remote_distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.remote_distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Industries */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Hiring by Industry</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.top_industries}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Average Experience by Level */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Average Years of Experience Required</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={expData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="years" stroke="#d946ef" strokeWidth={3} dot={{r: 6}} activeDot={{r: 8}} />
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
