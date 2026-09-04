import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Twitter, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-8 w-8 text-accent" />
              <span className="font-bold text-xl text-white">SkillVerify</span>
            </Link>
            <p className="text-slate-400 max-w-sm mb-6">
              The AI-powered platform for verifying skills, matching talent with opportunities, and building trust in the hiring process.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-accent transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-accent transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link to="/register?role=candidate" className="hover:text-accent transition-colors">For Candidates</Link></li>
              <li><Link to="/register?role=employer" className="hover:text-accent transition-colors">For Employers</Link></li>
              <li><a href="#" className="hover:text-accent transition-colors">Skill Assessments</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Pricing</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-accent transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} SkillVerify. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-success"></div> All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
