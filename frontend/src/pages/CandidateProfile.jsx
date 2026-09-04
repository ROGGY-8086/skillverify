import React, { useState, useEffect } from 'react';
import { User, MapPin, Briefcase, FileText, Plus, Save } from 'lucide-react';
import client from '../api/client';
import SkillBadge from '../components/SkillBadge';
import CredentialStatus from '../components/CredentialStatus';

const CandidateProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    headline: '',
    location: '',
    experience_years: 0,
    bio: ''
  });

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
        experience_years: res.data.experience_years || 0,
        bio: res.data.bio || ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await client.put('/api/candidates/me', formData);
      await fetchProfile();
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveSkill = async (skillId) => {
    if(window.confirm('Are you sure you want to remove this skill?')) {
      try {
        await client.delete(`/api/candidates/skills/${skillId}`);
        fetchProfile();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (isLoading) return <div className="min-h-screen flex justify-center pt-20">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header / Basic Info */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="h-32 bg-primary"></div>
        <div className="px-8 pb-8 relative">
          <div className="absolute -top-16 left-8 bg-white p-1.5 rounded-full">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
              <User className="h-12 w-12 text-slate-400" />
            </div>
          </div>
          
          <div className="mt-12 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{profile?.user?.name}</h1>
              
              {isEditing ? (
                <div className="mt-4 space-y-4 max-w-lg">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Headline</label>
                    <input 
                      type="text" 
                      value={formData.headline} 
                      onChange={(e) => setFormData({...formData, headline: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-accent focus:border-accent"
                      placeholder="e.g. Senior Full Stack Developer"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                      <input 
                        type="text" 
                        value={formData.location} 
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-accent focus:border-accent"
                        placeholder="e.g. New York, NY"
                      />
                    </div>
                    <div className="w-32">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Years Exp.</label>
                      <input 
                        type="number" 
                        value={formData.experience_years} 
                        onChange={(e) => setFormData({...formData, experience_years: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-accent focus:border-accent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                    <textarea 
                      value={formData.bio} 
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-accent focus:border-accent"
                    ></textarea>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-lg text-slate-600 mt-1">{profile?.headline || 'Add a headline'}</p>
                  <div className="flex gap-4 mt-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {profile?.location || 'Add location'}</span>
                    <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> {profile?.experience_years || 0} years experience</span>
                  </div>
                  {profile?.bio && <p className="mt-4 text-slate-700 max-w-2xl">{profile.bio}</p>}
                </>
              )}
            </div>
            
            <div>
              {isEditing ? (
                <div className="flex gap-2">
                  <button onClick={() => setIsEditing(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
                  <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-600">
                    <Save className="h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              ) : (
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col - Skills */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Skills & Expertise</h2>
              <button className="flex items-center gap-1 text-sm text-accent font-medium hover:text-teal-600">
                <Plus className="h-4 w-4" /> Add Skill
              </button>
            </div>
            
            <div className="space-y-6">
              {profile?.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill) => (
                  <div key={skill.id} className="group flex items-start gap-4 p-4 border border-slate-100 rounded-lg hover:border-slate-200 hover:bg-slate-50 transition-colors">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-slate-900">{skill.name}</span>
                        <SkillBadge skill={skill.name} proficiency={skill.proficiency} evidenceType={skill.evidence_type} verified={skill.is_verified} />
                      </div>
                      
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex-grow max-w-xs">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-500">Confidence Score</span>
                            <span className="font-medium">{Math.round((skill.confidence_score || 0) * 100)}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5">
                            <div className="bg-accent h-1.5 rounded-full" style={{ width: `${Math.round((skill.confidence_score || 0) * 100)}%` }}></div>
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 border-l border-slate-200 pl-4">
                          Source: <span className="font-medium capitalize">{skill.evidence_type}</span>
                        </div>
                      </div>
                    </div>
                    {isEditing && (
                      <button onClick={() => handleRemoveSkill(skill.id)} className="text-slate-400 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity">
                        Remove
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  <p className="text-slate-500">No skills added yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Col - Credentials */}
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-900">Credentials</h2>
              <button className="text-sm text-accent font-medium hover:text-teal-600"><Plus className="h-4 w-4" /></button>
            </div>
            
            <div className="space-y-4">
              {profile?.credentials && profile.credentials.length > 0 ? (
                profile.credentials.map((cred) => (
                  <div key={cred.id} className="p-3 border border-slate-100 rounded-lg bg-slate-50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm text-slate-900">{cred.title}</h4>
                      <CredentialStatus status={cred.status} />
                    </div>
                    <p className="text-xs text-slate-600 mb-1">{cred.issuer}</p>
                    {cred.credential_id && <p className="text-[10px] text-slate-400 font-mono">{cred.credential_id}</p>}
                    
                    {cred.status === 'verified' && (
                      <div className="mt-3 text-xs bg-green-50 text-green-700 p-2 rounded flex items-start gap-2 border border-green-100">
                        <ShieldCheck className="h-4 w-4 shrink-0" />
                        Verified on {new Date(cred.verified_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">No credentials</p>
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
