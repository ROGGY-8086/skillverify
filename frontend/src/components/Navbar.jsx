import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Menu, X, LogOut, User, BarChart3 } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-accent" />
              <span className="font-bold text-xl text-primary">SkillVerify</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/insights" className="text-slate-600 hover:text-accent font-medium px-3 py-2 transition-colors flex items-center gap-1">
              <BarChart3 className="h-4 w-4" /> Market Insights
            </Link>
            {!user ? (
              <>
                <Link to="/#how-it-works" className="text-slate-600 hover:text-primary transition-colors">How It Works</Link>
                <div className="flex items-center space-x-4 ml-4">
                  <Link to="/login" className="text-primary font-medium hover:text-accent transition-colors">Log In</Link>
                  <Link to="/register" className="bg-accent text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-600 transition-colors">Sign Up</Link>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-6">
                <Link 
                  to={user.role === 'employer' ? '/employer/dashboard' : '/candidate/dashboard'} 
                  className="text-slate-600 hover:text-primary transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-2 text-slate-800">
                  <User className="h-5 w-5 text-slate-500" />
                  <span className="font-medium">{user.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-slate-500 hover:text-error transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-600 hover:text-primary focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 py-4 px-4 shadow-lg">
          <div className="flex flex-col space-y-4">
            {!user ? (
              <>
                <Link to="/#how-it-works" className="text-slate-600 hover:text-primary">How It Works</Link>
                <Link to="/register?role=candidate" className="text-slate-600 hover:text-primary">For Candidates</Link>
                <Link to="/register?role=employer" className="text-slate-600 hover:text-primary">For Employers</Link>
                <hr className="border-slate-100" />
                <Link to="/login" className="text-primary font-medium">Log In</Link>
                <Link to="/register" className="bg-accent text-white px-4 py-2 rounded-lg font-medium text-center">Sign Up</Link>
              </>
            ) : (
              <>
                <Link 
                  to={user.role === 'employer' ? '/employer/dashboard' : '/candidate/dashboard'} 
                  className="text-slate-600 hover:text-primary font-medium"
                >
                  Dashboard
                </Link>
                <hr className="border-slate-100" />
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-slate-500 hover:text-error text-left w-full"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
