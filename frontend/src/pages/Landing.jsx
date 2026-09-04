import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Target, Zap, FileText, CheckCircle2 } from 'lucide-react';
import StepCard from '../components/StepCard';

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
                Verify Skills. <br/>
                <span className="text-accent">Match Talent.</span> <br/>
                Build Trust.
              </h1>
              <p className="text-xl text-slate-600 mb-10 max-w-lg">
                The AI-powered platform that extracts, verifies, and matches real skills to perfectly align candidates with employer needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register?role=candidate" className="bg-accent text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-teal-600 transition-colors text-center shadow-lg shadow-teal-500/30">
                  Get Started
                </Link>
                <Link to="/register?role=employer" className="bg-white text-slate-800 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-slate-200 hover:border-slate-800 transition-colors text-center">
                  For Employers
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-4 text-sm font-medium text-slate-500 uppercase tracking-wider">
                <p>Trusted By</p>
                <div className="h-px bg-slate-200 flex-grow max-w-[200px]"></div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-blue-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-white border border-slate-100 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-slate-400">JD</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      Jane Doe
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    </h3>
                    <p className="text-slate-500">Senior Frontend Developer</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-semibold text-slate-400 uppercase mb-3">Verified Skills</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-800 border-green-200">
                        <CheckCircle2 className="h-3 w-3 text-success" /> React
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-800 border-green-200">
                        <CheckCircle2 className="h-3 w-3 text-success" /> TypeScript
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-blue-100 text-blue-800 border-blue-200">
                        <CheckCircle2 className="h-3 w-3 text-success" /> Node.js
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">Match Score</p>
                      <p className="text-sm text-slate-500">Sr. Engineer Role</p>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-success flex items-center justify-center text-success font-bold text-sm">
                      94%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-50 py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
              <p className="text-4xl font-extrabold text-accent mb-2">10K+</p>
              <p className="font-medium text-slate-600">Candidates Verified</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
              <p className="text-4xl font-extrabold text-accent mb-2">500+</p>
              <p className="font-medium text-slate-600">Employers Trust Us</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
              <p className="text-4xl font-extrabold text-accent mb-2">95%</p>
              <p className="font-medium text-slate-600">Match Accuracy</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-accent font-semibold tracking-wider uppercase text-sm mb-3">How It Works</p>
            <h2 className="text-4xl font-bold text-slate-900">From resume to verified talent in 3 simple steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard 
              number="1"
              title="Upload Credentials"
              description="Candidates upload their resume, certifications, and portfolios. Our system securely stores them."
              icon={FileText}
            />
            <StepCard 
              number="2"
              title="AI Verifies & Extracts"
              description="Our AI extracts skills and cross-references credentials to verify proficiency and assign confidence scores."
              icon={ShieldCheck}
            />
            <StepCard 
              number="3"
              title="Get Matched"
              description="Employers define required skills, and our semantic matching engine instantly finds the perfect fit."
              icon={Target}
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-accent font-semibold tracking-wider uppercase text-sm mb-3">Platform Features</p>
            <h2 className="text-4xl font-bold text-slate-900">Everything you need for trusted hiring</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex gap-6">
              <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">AI Skill Extraction</h3>
                <p className="text-slate-600">Automatically map unstructured text from resumes into a structured taxonomy of over 10,000 skills.</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex gap-6">
              <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
                <ShieldCheck className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Credential Verification</h3>
                <p className="text-slate-600">Cross-reference badges, certificates, and work history to provide a transparent confidence score.</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex gap-6">
              <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
                <Target className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Job Matching</h3>
                <p className="text-slate-600">Go beyond keyword matching with semantic vector search that understands context and proficiency levels.</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex gap-6">
              <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Skill Assessments</h3>
                <p className="text-slate-600">Provide candidates with technical assessments to instantly verify claimed skills and boost their profile.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Employers */}
      <section className="bg-primary py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Find genuinely qualified candidates</h2>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Stop wasting time interviewing candidates who look good on paper but lack the actual skills. SkillVerify gives you transparent confidence scores and verified evidence for every candidate you review.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="h-5 w-5 text-accent" /> Cut time-to-hire by 40%
                </li>
                <li className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="h-5 w-5 text-accent" /> Eliminate resume fraud
                </li>
                <li className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="h-5 w-5 text-accent" /> Discover hidden talent based on true capability
                </li>
              </ul>
              <Link to="/register?role=employer" className="inline-block bg-accent text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-teal-400 transition-colors">
                Start Hiring Smarter
              </Link>
            </div>
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl">
              <h3 className="text-xl font-semibold mb-6">Top Matches for "Full Stack Developer"</h3>
              <div className="space-y-4">
                {[
                  { name: "Alex Chen", score: 98, skills: ["React", "Node.js", "PostgreSQL"] },
                  { name: "Sarah Jenkins", score: 92, skills: ["Vue", "Express", "MongoDB"] },
                  { name: "Michael Ross", score: 87, skills: ["React", "Django", "AWS"] }
                ].map((candidate, i) => (
                  <div key={i} className="bg-slate-700/50 rounded-xl p-4 flex items-center justify-between border border-slate-600/50">
                    <div>
                      <p className="font-semibold text-white">{candidate.name}</p>
                      <p className="text-sm text-slate-400">{candidate.skills.join(" • ")}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-success">{candidate.score}%</p>
                      <p className="text-xs text-slate-400 uppercase">Match</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Ready to prove your skills?</h2>
          <p className="text-xl text-slate-600 mb-10">
            Join thousands of professionals who have verified their credentials and found their dream jobs through SkillVerify.
          </p>
          <Link to="/register?role=candidate" className="inline-block bg-slate-900 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-slate-800 transition-colors shadow-lg">
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
