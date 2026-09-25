import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Target, Zap, FileText, CheckCircle2, Award, Briefcase, Users, LayoutDashboard, BrainCircuit, Activity } from 'lucide-react';

const Landing = () => {
  return (
    <div className="font-sans text-slate-900 bg-[#FAFAFA] min-h-screen selection:bg-accent/20">
      
      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden flex flex-col items-center text-center">
        
        {/* Background Glow */}
        <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] max-w-5xl h-[100px] bg-gradient-to-r from-sky-200 via-blue-300 to-indigo-200 opacity-[0.2] blur-[60px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200/60 bg-white/50 text-xs font-medium text-slate-500 mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-accent"></span> Introducing SkillVerify 2.0
          </div>
          
          <h1 className="text-5xl md:text-[4rem] font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
            Hire the top 1% with AI, <br /> scale your company
          </h1>
          
          <p className="text-lg text-slate-500 mb-10 max-w-xl mx-auto font-medium">
            The platform built to instantly map unstructured resumes into verified skills, score candidates, and semantically match them to your roles.
          </p>
          
          <Link to="/register" className="inline-block bg-slate-900 text-white px-8 py-3.5 rounded-full font-medium text-sm hover:bg-slate-800 transition-all shadow-[0_0_20px_rgba(15,23,42,0.15)] hover:shadow-[0_0_25px_rgba(15,23,42,0.25)]">
            Start hiring free
          </Link>
        </div>

        {/* Dashboard Mockup */}
        <div className="relative z-20 w-full max-w-5xl mx-auto mt-20">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-200/60 p-4 relative">
            <div className="flex gap-4">
              {/* Sidebar Mock */}
              <div className="w-48 bg-slate-50 rounded-xl p-4 hidden md:block border border-slate-100">
                <div className="h-4 w-20 bg-slate-200 rounded-full mb-8"></div>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-md bg-slate-200"></div>
                      <div className="h-2 w-16 bg-slate-200 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Main Content Mock */}
              <div className="flex-1 bg-white rounded-xl border border-slate-100 p-6 flex flex-col gap-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Candidate Pipeline</h3>
                    <p className="text-xs text-slate-400">Showing top semantic matches</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100"></div>
                    <div className="w-8 h-8 rounded-full bg-slate-100"></div>
                  </div>
                </div>
                
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 font-medium mb-1">Total Verified</p>
                    <p className="text-2xl font-bold text-slate-800">4,892</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 font-medium mb-1">Perfect Matches</p>
                    <p className="text-2xl font-bold text-success">143</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 font-medium mb-1">Time to Hire</p>
                    <p className="text-2xl font-bold text-accent">12 days</p>
                  </div>
                </div>

                {/* Table Mock */}
                <div className="space-y-3 mt-4">
                  <div className="grid grid-cols-4 gap-4 text-xs font-medium text-slate-400 pb-2">
                    <div className="col-span-2">CANDIDATE</div>
                    <div>MATCH SCORE</div>
                    <div>STATUS</div>
                  </div>
                  {[
                    { name: 'Alex Smith', role: 'Frontend Engineer', score: '98%', status: 'Verified' },
                    { name: 'Sarah Jenkins', role: 'Full Stack', score: '92%', status: 'Pending' },
                    { name: 'Michael Ross', role: 'Backend Engineer', score: '87%', status: 'Verified' }
                  ].map((row, i) => (
                    <div key={i} className="grid grid-cols-4 gap-4 items-center bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                      <div className="col-span-2 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100"></div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{row.name}</p>
                          <p className="text-xs text-slate-500">{row.role}</p>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-slate-800">{row.score}</div>
                      <div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${row.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {row.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Absolute floating UI element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 text-white p-3 rounded-full shadow-2xl flex items-center gap-2 pr-4 border border-slate-700/50">
              <div className="bg-accent/20 p-1.5 rounded-full"><BrainCircuit className="w-4 h-4 text-accent-100" /></div>
              <span className="text-xs font-medium tracking-wide">AI Extraction Complete</span>
            </div>
          </div>
        </div>
      </section>

      {/* INTEGRATIONS & CARDS SECTION */}
      <section id="features" className="py-24 px-4 overflow-hidden relative">
        <div className="max-w-4xl mx-auto text-center mb-16 relative">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight mb-4">
            Offer your candidates a better <br /> hiring experience, scale your agency
          </h2>
          <p className="text-slate-500 font-medium">Seamlessly integrates with tools you already know and love.</p>
        </div>

        {/* Hub and Spoke Mock */}
        <div className="relative max-w-4xl mx-auto h-[300px] flex items-center justify-center mb-16 hidden md:flex">
          {/* Center */}
          <div className="relative z-20 bg-slate-900 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-xl shadow-slate-900/10">
            <ShieldCheck className="w-5 h-5" /> <span className="font-bold tracking-tight">SkillVerify</span>
          </div>

          {/* SVG connecting lines */}
          <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" style={{ filter: 'opacity(0.15)' }}>
            <path d="M 450 150 C 300 150, 200 80, 150 80" stroke="#000" strokeWidth="2" fill="none" />
            <path d="M 450 150 C 300 150, 200 220, 150 220" stroke="#000" strokeWidth="2" fill="none" />
            <path d="M 450 150 C 600 150, 700 80, 750 80" stroke="#000" strokeWidth="2" fill="none" />
            <path d="M 450 150 C 600 150, 700 220, 750 220" stroke="#000" strokeWidth="2" fill="none" />
          </svg>

          {/* Nodes */}
          <div className="absolute top-[60px] left-[50px] bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm z-20 flex items-center gap-2 font-bold text-slate-700 text-sm">
            <div className="w-4 h-4 bg-green-500 rounded-sm"></div> Greenhouse
          </div>
          <div className="absolute bottom-[60px] left-[50px] bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm z-20 flex items-center gap-2 font-bold text-slate-700 text-sm">
            <div className="w-4 h-4 bg-blue-500 rounded-sm"></div> LinkedIn
          </div>
          <div className="absolute top-[60px] right-[50px] bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm z-20 flex items-center gap-2 font-bold text-slate-700 text-sm">
            <div className="w-4 h-4 bg-orange-500 rounded-sm"></div> Workday
          </div>
          <div className="absolute bottom-[60px] right-[50px] bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm z-20 flex items-center gap-2 font-bold text-slate-700 text-sm">
            <div className="w-4 h-4 bg-purple-500 rounded-sm"></div> Lever
          </div>
        </div>

        {/* 3 Column Feature Cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative z-20">
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
            <div className="w-10 h-10 bg-sky-50 text-sky-500 rounded-xl flex items-center justify-center mb-6">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Resume Parsing</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium mb-8">
              Upload unstructured PDFs. Our engine maps text directly to a standardized 10,000+ skill taxonomy instantly.
            </p>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-300 to-blue-400"></div>
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Parsed Output</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-white px-2 py-1 rounded text-xs font-medium border border-slate-200">React</span>
                <span className="bg-white px-2 py-1 rounded text-xs font-medium border border-slate-200">TypeScript</span>
                <span className="bg-white px-2 py-1 rounded text-xs font-medium border border-slate-200">Node.js</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Instant Verification</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium mb-8">
              We cross-reference certificates, GitHub repos, and assessments to generate a transparent confidence score.
            </p>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-400"></div>
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Confidence Score</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-slate-800">98%</span>
                <span className="text-xs text-success font-medium mb-1 flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> Verified</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
            <div className="w-10 h-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Semantic Matching</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium mb-8">
              Go beyond simple keyword matching. Find candidates based on contextual capability and proficiency levels.
            </p>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-400 to-slate-500"></div>
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Requirement Match</p>
              <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                <div className="bg-slate-500 h-2 rounded-full w-[85%]"></div>
              </div>
              <p className="text-xs font-medium text-slate-600 text-right">85% Alignment</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/3 w-full">
            <div className="bg-slate-900 rounded-3xl p-8 text-white relative shadow-xl shadow-slate-900/10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-slate-700 rounded-full overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=100&h=100" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-sm">Tom Banks</p>
                  <p className="text-xs text-slate-400">VP of Engineering</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">Time Saved</p>
              <p className="text-4xl font-bold tracking-tight">120+ hrs</p>
              <div className="absolute -right-4 -bottom-4 text-slate-800 opacity-50">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.017 21L16.411 14.122C16.892 12.63 17.159 11.233 17.214 9.932H14.542V3H21V9.718C21 12.016 20.472 14.237 19.418 16.38L16.48 21H14.017ZM3.017 21L5.411 14.122C5.892 12.63 6.159 11.233 6.214 9.932H3.542V3H10V9.718C10 12.016 9.472 14.237 8.418 16.38L5.48 21H3.017Z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="md:w-2/3">
            <p className="text-2xl md:text-3xl font-medium text-slate-800 leading-snug">
              <span className="font-bold text-slate-900">SkillVerify has been a game changer for our engineering team.</span> Before using it, screening candidates was chaotic and difficult to scale. With the automated skill verification, we completely eliminated resume fraud and reduced our time-to-hire by 40%—without adding operational headaches.
            </p>
          </div>
        </div>
      </section>

      {/* BENTO BOX SECTION */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto bg-slate-100 rounded-[3rem] p-10 md:p-16 border border-slate-200/50 overflow-hidden relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Hiring Management, Reinvented
            </h2>
            <p className="text-slate-500 font-medium mt-2">Everything you need to hire the right person, the first time.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {/* Bento Card 1 */}
            <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-sky-50/50 to-blue-50/50 rounded-3xl p-8 border border-blue-100/50 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
              <div>
                <p className="text-blue-600 font-bold text-sm uppercase tracking-wider mb-2">Automated Assessments</p>
                <h3 className="text-2xl font-bold text-slate-900 max-w-sm">Provide candidates with instant technical assessments.</h3>
              </div>
              <div className="mt-8 bg-white/60 backdrop-blur-md rounded-xl p-4 border border-white flex justify-between items-end w-3/4 self-end shadow-sm">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Average Score</p>
                  <p className="text-3xl font-bold text-slate-800">86<span className="text-lg text-slate-400">%</span></p>
                </div>
                <div className="w-16 h-12 bg-blue-100 rounded-lg"></div>
              </div>
            </div>

            {/* Bento Card 2 */}
            <div className="col-span-1 bg-gradient-to-br from-slate-50/50 to-gray-50/50 rounded-3xl p-8 border border-slate-200/50 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
              <div>
                <p className="text-slate-600 font-bold text-sm uppercase tracking-wider mb-2">Skill Gaps</p>
                <h3 className="text-xl font-bold text-slate-900">Instantly view missing skills</h3>
              </div>
              <div className="mt-8 space-y-2">
                <div className="bg-white/60 p-2 rounded flex justify-between text-xs font-medium text-slate-600"><span>Docker</span><span className="text-slate-400">Missing</span></div>
                <div className="bg-white/60 p-2 rounded flex justify-between text-xs font-medium text-slate-600"><span>AWS</span><span className="text-slate-400">Missing</span></div>
              </div>
            </div>

            {/* Bento Card 3 */}
            <div className="col-span-1 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 rounded-3xl p-8 border border-indigo-100/50 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
              <div>
                <p className="text-indigo-600 font-bold text-sm uppercase tracking-wider mb-2">AI Insights</p>
                <h3 className="text-xl font-bold text-slate-900">Smart summary for every candidate</h3>
              </div>
              <div className="mt-8 flex justify-center">
                <div className="w-16 h-16 bg-white/60 rounded-full flex items-center justify-center border border-white shadow-sm">
                  <BrainCircuit className="w-8 h-8 text-indigo-500" />
                </div>
              </div>
            </div>

            {/* Bento Card 4 */}
            <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-blue-50/50 to-sky-50/50 rounded-3xl p-8 border border-blue-100/50 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
               <div>
                <p className="text-blue-600 font-bold text-sm uppercase tracking-wider mb-2">Real-time Matching</p>
                <h3 className="text-2xl font-bold text-slate-900 max-w-sm">Rank candidates instantly based on contextual capability.</h3>
              </div>
              <div className="mt-8 bg-white/60 backdrop-blur-md rounded-xl p-4 border border-white shadow-sm flex flex-col gap-3">
                <div className="h-8 bg-white rounded-md w-full border border-slate-100 flex items-center px-3"><div className="w-4 h-4 bg-blue-400 rounded-full mr-3"></div><div className="h-2 w-1/3 bg-slate-200 rounded"></div></div>
                <div className="h-8 bg-white rounded-md w-3/4 border border-slate-100 flex items-center px-3"><div className="w-4 h-4 bg-blue-200 rounded-full mr-3"></div><div className="h-2 w-1/2 bg-slate-200 rounded"></div></div>
              </div>
            </div>
          </div>
          
          {/* Centered Floating Play Button (Mock) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-slate-900 rounded-full z-20 flex items-center justify-center text-white shadow-xl cursor-pointer hover:scale-105 transition-transform">
             <Activity className="w-6 h-6" />
          </div>
        </div>
      </section>

      {/* PRE-FOOTER CTA */}
      <section className="py-24 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-6">
          Offer your candidates a better <br /> experience, scale your team
        </h2>
        <p className="text-slate-500 mb-8 max-w-xl mx-auto font-medium">
          Join thousands of modern teams hiring the top 1% with AI.
        </p>
        <Link to="/register" className="inline-block bg-slate-900 text-white px-8 py-3.5 rounded-full font-medium text-sm hover:bg-slate-800 transition-all shadow-[0_0_15px_rgba(15,23,42,0.15)]">
          Get Started
        </Link>
      </section>

    </div>
  );
};

export default Landing;
