import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Twitter, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-50 pt-16 border-t border-slate-200 overflow-hidden relative">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
        
        {/* Logo Left */}
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-slate-900" />
          <span className="font-bold text-base text-slate-900 tracking-tight">SkillVerify</span>
        </div>
        
        {/* Links Center */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-xs font-bold text-slate-500 uppercase tracking-widest">
          <Link to="/" className="hover:text-slate-900 transition-colors">Platform</Link>
          <Link to="/insights" className="hover:text-slate-900 transition-colors">Insights</Link>
          <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
          <Link to="/register" className="hover:text-slate-900 transition-colors">Get Started</Link>
        </div>

        {/* Socials Right */}
        <div className="flex gap-4">
          <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors"><Twitter className="h-4 w-4" /></a>
          <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors"><Linkedin className="h-4 w-4" /></a>
          <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors"><Github className="h-4 w-4" /></a>
        </div>
      </div>
      
      {/* Giant Watermark Text */}
      <div className="w-full text-center mt-12 mb-[-5vw] pointer-events-none select-none relative z-0">
        <h1 className="text-[14vw] font-black text-slate-100 leading-none tracking-tighter uppercase">
          SkillVerify
        </h1>
      </div>
    </footer>
  );
};

export default Footer;
