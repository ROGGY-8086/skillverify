import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Camera, ArrowRight, ArrowLeft, Check, AlertCircle, Briefcase, MapPin, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';

const CandidateOnboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [avatar, setAvatar] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    headline: '',
    location: '',
    experience_years: '',
    bio: '',
    education: '',
    github_url: '',
    portfolio_url: ''
  });

  // Load avatar from localStorage
  useEffect(() => {
    if (user?.id) {
      const savedAvatar = localStorage.getItem(`avatar_${user.id}`);
      if (savedAvatar) {
        setAvatar(savedAvatar);
      }
    }
  }, [user?.id]);

  // Optionally load existing profile data if present
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await client.get('/api/candidates/me');
        if (res.data) {
          setFormData({
            headline: res.data.headline || '',
            location: res.data.location || '',
            experience_years: res.data.experience_years ?? '',
            bio: res.data.bio || '',
            education: res.data.education || '',
            github_url: res.data.github_url || '',
            portfolio_url: res.data.portfolio_url || ''
          });
        }
      } catch (err) {
        // If profile doesn't exist yet, ignore
      }
    };
    loadProfile();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setAvatar(result);
        if (user?.id) {
          localStorage.setItem(`avatar_${user.id}`, result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError('');
    setStep(2);
  };

  const handleBack = () => {
    setError('');
    setStep(1);
  };

  const handleFinish = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        headline: formData.headline || null,
        location: formData.location || null,
        experience_years: formData.experience_years === '' ? 0 : Number(formData.experience_years),
        bio: formData.bio || null,
        education: formData.education || null,
        github_url: formData.github_url || null,
        portfolio_url: formData.portfolio_url || null
      };

      await client.put('/api/candidates/me', payload);
      navigate('/candidate/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to complete onboarding. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-28">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* Dark Blue Header */}
        <div className="bg-primary px-8 py-7 text-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-7 w-7 text-white" />
              <span className="font-bold text-xl tracking-tight text-white">SkillVerify</span>
            </div>
            <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold bg-white/10 px-3 py-1 rounded-full">
              Step {step} of 2
            </span>
          </div>

          {/* Step Pills */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                step === 1
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white/10 text-slate-300 hover:bg-white/15'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 1 ? 'bg-white text-blue-600' : 'bg-slate-700 text-slate-300'
              }`}>
                1
              </span>
              <span>1: About</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(2)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                step === 2
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white/10 text-slate-300 hover:bg-white/15'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 2 ? 'bg-white text-blue-600' : 'bg-slate-700 text-slate-300'
              }`}>
                2
              </span>
              <span>2: Education</span>
            </button>
          </div>
        </div>

        {/* Content Form Body */}
        <div className="p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-start gap-3 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleNext} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Tell us about yourself</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Introduce yourself to potential employers and set up your candidate profile.
                </p>
              </div>

              {/* Avatar Upload */}
              <div className="flex items-center gap-5 pt-2 pb-2">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full border-2 border-slate-200 bg-slate-100 flex items-center justify-center overflow-hidden shadow-inner">
                    {avatar ? (
                      <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-12 w-12 text-slate-400" />
                    )}
                  </div>
                  <label className="absolute inset-0 rounded-full bg-slate-900/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="h-5 w-5 mb-0.5" />
                    <span className="text-[10px] font-medium">Change</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Profile Photo</label>
                  <p className="text-xs text-slate-500 mt-0.5 mb-2">Upload a clean, professional headshot.</p>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors">
                    <Camera className="h-3.5 w-3.5" />
                    <span>Upload photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
              </div>

              {/* Headline */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Headline
                </label>
                <input
                  type="text"
                  required
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  placeholder="e.g. Full Stack Developer"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400 transition-colors"
                />
              </div>

              {/* Location & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. San Francisco, CA or Remote"
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={formData.experience_years}
                    onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                    placeholder="e.g. 3"
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400 transition-colors"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Bio
                </label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell recruiters about your key strengths, projects you have built, and technologies you love working with..."
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400 transition-colors resize-none"
                />
              </div>

              {/* Footer Buttons */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-sm transition-colors"
                >
                  <span>Next: Education</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleFinish} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Your education & links</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Add your credentials and online profiles so employers can review your work.
                </p>
              </div>

              {/* Education */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Education
                </label>
                <input
                  type="text"
                  required
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  placeholder="e.g. B.Tech Computer Science, IIT Bombay 2022"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400 transition-colors"
                />
              </div>

              {/* GitHub URL */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  GitHub URL <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="url"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  placeholder="https://github.com/yourusername"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400 transition-colors"
                />
              </div>

              {/* Portfolio URL */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Portfolio URL <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="url"
                  value={formData.portfolio_url}
                  onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                  placeholder="https://yourportfolio.com"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400 transition-colors"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium px-5 py-3 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg shadow-sm transition-colors disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Finish</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateOnboarding;
