import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Twitter, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white text-slate-600 py-16 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-accent uppercase tracking-wider mb-2">Do what you do best.</h2>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0B3A36] uppercase tracking-wider mb-6">We'll handle the rest.</h2>
          <Link to="/register" className="bg-[#0B3A36] text-white px-6 py-2 rounded-full font-bold hover:bg-slate-800 transition-colors">
            Get Started
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-sm">
          <div>
            <h3 className="font-bold text-slate-900 mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link to="/register?role=candidate" className="hover:text-accent transition-colors">For Candidates</Link></li>
              <li><Link to="/register?role=employer" className="hover:text-accent transition-colors">For Employers</Link></li>
              <li><a href="#" className="hover:text-accent transition-colors">Skill Assessments</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Pricing</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-slate-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-accent transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-accent transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">API Docs</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Cookie Settings</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-200 text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-accent" />
            <span className="font-serif font-bold text-base text-[#0B3A36]">SkillVerify</span>
          </div>
          <p>&copy; {new Date().getFullYear()} SkillVerify. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-accent transition-colors"><Twitter className="h-4 w-4" /></a>
            <a href="#" className="hover:text-accent transition-colors"><Linkedin className="h-4 w-4" /></a>
            <a href="#" className="hover:text-accent transition-colors"><Github className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
