import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Target, Zap, FileText, CheckCircle2, ChevronRight, Award, Briefcase, BookOpen, Clock, Users, Building, Lock } from 'lucide-react';

const Landing = () => {
  return (
    <div className="font-sans text-slate-900 bg-[#FDFBF7]">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-[#F25C54] via-[#F25C54] to-[#f97316] pt-32 pb-48 px-4 overflow-hidden rounded-b-[3rem] shadow-sm">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 tracking-tight leading-tight">
            Verify, match, and <br/> hire like a pro.
          </h1>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium">
            SkillVerify is the AI-powered credential platform that helps you find genuinely qualified talent, instantly.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/register" className="bg-white text-[#0B3A36] px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition-colors shadow-lg shadow-black/10">
              Get Started
            </Link>
            <Link to="/#how-it-works" className="bg-transparent border border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-colors">
              How it works
            </Link>
          </div>
        </div>

        {/* Floating Mockup (Pure CSS) */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 w-[90%] max-w-4xl bg-white rounded-t-xl md:rounded-xl shadow-2xl border border-slate-200 p-2 z-20 flex gap-4 hidden md:flex">
          <div className="w-1/4 bg-slate-50 rounded-lg p-4 border border-slate-100 flex flex-col gap-3">
            <div className="h-4 w-1/2 bg-slate-200 rounded-full mb-4"></div>
            <div className="h-10 w-full bg-white border border-slate-200 rounded flex items-center px-3"><ShieldCheck className="w-5 h-5 text-accent mr-2" /><div className="h-2 w-1/2 bg-slate-200 rounded"></div></div>
            <div className="h-10 w-full bg-white border border-slate-200 rounded flex items-center px-3"><Target className="w-5 h-5 text-accent mr-2" /><div className="h-2 w-2/3 bg-slate-200 rounded"></div></div>
          </div>
          <div className="flex-1 bg-white rounded-lg p-6 border border-slate-100 relative">
             <h3 className="text-2xl font-serif font-bold text-[#0B3A36] mb-1">Senior Frontend Developer</h3>
             <p className="text-slate-500 mb-6 text-sm">New York, NY • Remote</p>
             <div className="space-y-4">
               <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center"><span className="text-accent font-bold">AS</span></div>
                   <div><p className="font-bold text-slate-800">Alex Smith</p><p className="text-sm text-slate-500">React • Node.js</p></div>
                 </div>
                 <div className="text-right">
                   <p className="text-success font-bold text-xl">98%</p>
                   <p className="text-xs text-slate-400 font-medium">MATCH</p>
                 </div>
               </div>
               <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-info/20 rounded-full flex items-center justify-center"><span className="text-info font-bold">SJ</span></div>
                   <div><p className="font-bold text-slate-800">Sarah Jenkins</p><p className="text-sm text-slate-500">Vue • Express</p></div>
                 </div>
                 <div className="text-right">
                   <p className="text-success font-bold text-xl">92%</p>
                   <p className="text-xs text-slate-400 font-medium">MATCH</p>
                 </div>
               </div>
             </div>
             
             {/* Floating Badge */}
             <div className="absolute -right-6 -top-6 bg-white p-3 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3">
               <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><CheckCircle2 className="w-6 h-6" /></div>
               <div><p className="text-xs font-bold text-slate-400 uppercase">Status</p><p className="text-sm font-bold text-slate-800">Verified</p></div>
             </div>
          </div>
        </div>
      </section>

      {/* spacer for mockup */}
      <div className="h-32 md:h-64"></div>

      {/* TRUST SECTION */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#0B3A36] mb-8">
          10,000+ businesses <br/> hire on SkillVerify.
        </h2>
        <Link to="/insights" className="inline-flex items-center gap-2 text-[#0B3A36] font-bold border-b-2 border-[#0B3A36] pb-1 hover:text-accent hover:border-accent transition-all">
          See the insights <ChevronRight className="w-4 h-4" />
        </Link>
      </section>

      {/* FEATURE 1 */}
      <section className="py-24 px-4 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16">
        <div className="md:w-1/2">
          <div className="inline-block bg-teal-100 text-teal-800 px-3 py-1 rounded-md text-sm font-bold mb-6">Verification 💨</div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#0B3A36] leading-tight mb-6">
            Verification at the speed of... wait, that's it?
          </h2>
          <p className="text-lg text-slate-600 mb-8 font-medium">
            AI instantly extracts skills, cross-references credentials, and scores candidates. What used to take days of manual background checks now takes seconds.
          </p>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3"><CheckCircle2 className="w-6 h-6 text-accent shrink-0" /><span className="text-slate-700 font-medium">Zero manual resume reading required.</span></li>
            <li className="flex items-start gap-3"><CheckCircle2 className="w-6 h-6 text-accent shrink-0" /><span className="text-slate-700 font-medium">Transparent confidence scores on every skill.</span></li>
          </ul>
        </div>
        <div className="md:w-1/2 relative">
          <div className="bg-gradient-to-tr from-rose-200 to-orange-100 rounded-3xl w-full h-[500px] flex items-center justify-center p-8 relative overflow-hidden">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm h-full border-[8px] border-slate-900 overflow-hidden relative z-10 flex flex-col">
              <div className="bg-slate-50 p-4 border-b border-slate-200 text-center"><p className="font-bold text-sm">Skill Profile</p></div>
              <div className="p-6 flex-1 bg-white">
                <div className="w-20 h-20 bg-slate-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto mb-8"></div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center"><div className="h-3 bg-slate-200 rounded w-1/3"></div><div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><CheckCircle2 className="w-4 h-4" /></div></div>
                  <div className="flex justify-between items-center"><div className="h-3 bg-slate-200 rounded w-1/2"></div><div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><CheckCircle2 className="w-4 h-4" /></div></div>
                  <div className="flex justify-between items-center"><div className="h-3 bg-slate-200 rounded w-1/4"></div><div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><CheckCircle2 className="w-4 h-4" /></div></div>
                </div>
                <div className="mt-8 bg-accent text-white py-3 rounded-full text-center font-bold text-sm">Verified Perfect Match</div>
              </div>
            </div>
            {/* Background decorative blob */}
            <div className="absolute top-1/4 -right-10 w-48 h-48 bg-accent/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* FEATURE 2 FULL WIDTH */}
      <section className="relative bg-slate-900 py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80" alt="Team working" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight mb-6">
              Hiring in 48 hours.<br/>On your terms.
            </h2>
            <p className="text-xl text-white/90 mb-10 font-medium">
              We verify the talent. You make the offer. Eliminate endless interview rounds and technical screens.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-accent font-bold text-lg mb-1">Fast</h4>
                <p className="text-slate-300 text-sm">Semantic matching connects you in minutes.</p>
              </div>
              <div>
                <h4 className="text-accent font-bold text-lg mb-1">Trusted</h4>
                <p className="text-slate-300 text-sm">Every skill backed by verifiable evidence.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CARDS SECTION */}
      <section className="py-24 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#0B3A36] mb-4">
              Hiring success is no small thing. 🚀
            </h2>
            <p className="text-lg text-slate-600 font-medium">Everything you need to build your dream team.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0B3A36] rounded-3xl p-8 text-white relative overflow-hidden group hover:-translate-y-1 transition-transform">
              <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-16">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">AI Resume Parsing</h3>
              <p className="text-teal-50 font-medium text-sm leading-relaxed mb-6">
                Upload unstructured resumes. Our engine maps it directly to a standardized 10,000+ skill taxonomy instantly.
              </p>
            </div>
            
            <div className="bg-[#0B3A36] rounded-3xl p-8 text-white relative overflow-hidden group hover:-translate-y-1 transition-transform">
              <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-16">
                <ShieldCheck className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">Instant Verification</h3>
              <p className="text-teal-50 font-medium text-sm leading-relaxed mb-6">
                We cross-reference certificates, GitHub repos, and portfolios to generate a transparent confidence score.
              </p>
            </div>
            
            <div className="bg-[#0B3A36] rounded-3xl p-8 text-white relative overflow-hidden group hover:-translate-y-1 transition-transform">
              <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-16">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">Semantic Matching</h3>
              <p className="text-teal-50 font-medium text-sm leading-relaxed mb-6">
                Go beyond simple keyword matching. Find candidates based on contextual capability and proficiency levels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ICON GRID */}
      <section className="py-24 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-3xl font-serif font-bold text-[#0B3A36] mb-16">
            Your hiring process does a lot. We do, too.
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 text-center">
            {[
              { icon: ShieldCheck, label: "Verifications" },
              { icon: Target, label: "Semantic Search" },
              { icon: FileText, label: "Resume Parsing" },
              { icon: Award, label: "Certificates" },
              { icon: Building, label: "Company Profiles" },
              { icon: Users, label: "Candidate Portals" },
              { icon: Briefcase, label: "Job Postings" },
              { icon: BookOpen, label: "Skill Assessments" },
              { icon: Clock, label: "Fast Matching" },
              { icon: Lock, label: "Secure Data" },
              { icon: Zap, label: "AI Insights" },
              { icon: CheckCircle2, label: "Automated Hiring" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-3 group">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                  <item.icon className="w-5 h-5 text-slate-700 group-hover:text-accent" />
                </div>
                <p className="text-sm font-bold text-slate-700">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRE-FOOTER CTA */}
      <section className="bg-[#0B3A36] py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              Ready to work with <br/> SkillVerify?
            </h2>
          </div>
          <div className="flex gap-4">
            <Link to="/register?role=employer" className="bg-white text-[#0B3A36] px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition-colors">
              I'm hiring
            </Link>
            <Link to="/register?role=candidate" className="bg-accent text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-red-500 transition-colors">
              I'm a candidate
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
