import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="bg-white/70 backdrop-blur-xl border border-slate-200/50 rounded-full px-4 py-2.5 flex items-center justify-between w-full max-w-5xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] pointer-events-auto transition-all">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 pl-2">
          <ShieldCheck className="h-6 w-6 text-slate-900" />
          <span className="font-bold text-lg text-slate-900 tracking-tight">SkillVerify</span>
        </Link>
        
        {/* Center Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/insights" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Insights</Link>
          <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">How it Works</a>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link to="/login" className="hidden md:block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-2">Log in</Link>
              <Link to="/register" className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-all shadow-[0_0_15px_rgba(15,23,42,0.2)]">
                Get Started
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                to={user.role === 'employer' ? '/employer/dashboard' : '/candidate/dashboard'} 
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Dashboard
              </Link>
              <button 
                onClick={() => { logout(); navigate('/'); }}
                className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-all"
              >
                Log out
              </button>
            </div>
          )}
        </div>

      </nav>
    </div>
  );
};

export default Navbar;
