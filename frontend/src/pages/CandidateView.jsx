import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Briefcase, Mail, Download, ShieldCheck, ExternalLink, Award } from 'lucide-react';
import client from '../api/client';
import SkillBadge from '../components/SkillBadge';
import CredentialStatus from '../components/CredentialStatus';

const CandidateView = () => {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const res = await client.get(`/api/candidates/${id}`);
        setCandidate(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCandidate();
  }, [id]);

  if (isLoading) return <div className="min-h-screen flex justify-center pt-20">Loading profile...</div>;
  if (!candidate) return <div className="min-h-screen flex justify-center pt-20 text-error">Candidate not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/employer/search" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Search
      </Link>

      {/* Header Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="p-8 flex flex-col md:flex-row gap-8 items-start">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center shrink-0 border border-slate-200 text-3xl font-bold text-slate-400">
            {candidate.user?.name?.charAt(0)}
          </div>
          
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                {candidate.user?.name}
                {candidate.isVerified && (
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 border border-green-200">
                    <ShieldCheck className="h-4 w-4" /> Verified Identity
                  </span>
                )}
              </h1>
              
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors flex items-center gap-2">
                  <Download className="h-4 w-4" /> Resume
                </button>
                <button className="px-6 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors flex items-center gap-2 shadow-sm">
                  <Mail className="h-4 w-4" /> Contact
                </button>
              </div>
            </div>
            
            <p className="text-lg text-slate-600 font-medium mb-4">{candidate.headline}</p>
            
            <div className="flex flex-wrap gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {candidate.location}</span>
              <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> {candidate.experience_years} years experience</span>
            </div>
            
            {candidate.bio && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">About</h3>
                <p className="text-slate-700 leading-relaxed max-w-3xl">{candidate.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col - Skills Analysis */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-accent" /> Verified Skills Matrix
            </h2>
            
            <div className="space-y-6">
              {candidate.skills?.map((skill, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 border border-slate-100 rounded-xl bg-slate-50 hover:bg-white transition-colors hover:shadow-sm">
                  <div className="w-full sm:w-1/3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900 text-lg">{skill.name}</span>
                      {skill.is_verified && <CheckCircle2 className="h-4 w-4 text-success" />}
                    </div>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider border border-slate-200 px-2 py-0.5 rounded-full bg-white">
                      {skill.proficiency}
                    </span>
                  </div>
                  
                  <div className="w-full sm:w-1/3 border-l border-slate-200 pl-4">
                    <p className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Confidence Score</p>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg text-slate-900">{Math.round((skill.confidence_score || 0) * 100)}%</span>
                      <div className="flex-grow bg-slate-200 rounded-full h-2 max-w-[100px]">
                        <div 
                          className={`h-2 rounded-full ${skill.confidence_score > 0.8 ? 'bg-success' : 'bg-warning'}`} 
                          style={{ width: `${Math.round((skill.confidence_score || 0) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full sm:w-1/3 border-l border-slate-200 pl-4">
                    <p className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Evidence Source</p>
                    <div className="flex items-center gap-2">
                      <span className="capitalize text-sm font-medium text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-md">
                        {skill.evidence_type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {(!candidate.skills || candidate.skills.length === 0) && (
                <p className="text-slate-500 italic">No skills listed.</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Col - Credentials & Assessments */}
        <div className="space-y-8">
          
          {/* Credentials */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Verified Credentials</h2>
            
            <div className="space-y-4">
              {candidate.credentials?.map((cred, index) => (
                <div key={index} className="p-4 border border-slate-100 rounded-xl bg-slate-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center shrink-0">
                        <Award className="h-4 w-4 text-slate-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-slate-900 leading-tight mb-1">{cred.title}</h4>
                        <p className="text-xs text-slate-500">{cred.issuer}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                    <CredentialStatus status={cred.status} />
                    {cred.credential_url && (
                      <a href={cred.credential_url} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline flex items-center gap-1">
                        View <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
              
              {(!candidate.credentials || candidate.credentials.length === 0) && (
                <p className="text-sm text-slate-500 italic text-center py-4">No credentials uploaded.</p>
              )}
            </div>
          </div>

          {/* Assessment Results */}
          <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-6 text-white">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Target className="h-5 w-5 text-accent" /> Assessment Results
            </h2>
            
            <div className="space-y-4">
              {/* Mock assessments for demo */}
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">React Development</span>
                  <span className="text-success font-bold">92%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1.5 mb-2">
                  <div className="bg-success h-1.5 rounded-full w-[92%]"></div>
                </div>
                <p className="text-xs text-slate-400">Advanced Level • Verified 2 weeks ago</p>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Node.js API Design</span>
                  <span className="text-success font-bold">88%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1.5 mb-2">
                  <div className="bg-success h-1.5 rounded-full w-[88%]"></div>
                </div>
                <p className="text-xs text-slate-400">Advanced Level • Verified 1 month ago</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default CandidateView;
