import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import CandidateDashboard from './pages/CandidateDashboard';
import CandidateProfile from './pages/CandidateProfile';
import ResumeUpload from './pages/ResumeUpload';
import SkillAssessment from './pages/SkillAssessment';
import JobRecommendations from './pages/JobRecommendations';
import EmployerDashboard from './pages/EmployerDashboard';
import CreateJob from './pages/CreateJob';
import CandidateSearch from './pages/CandidateSearch';
import CandidateView from './pages/CandidateView';
import MarketInsights from './pages/MarketInsights';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  
  return children;
};

const AppRoutes = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/insights" element={<MarketInsights />} />
          
          {/* Candidate Routes */}
          <Route path="/candidate/dashboard" element={
            <ProtectedRoute role="candidate"><CandidateDashboard /></ProtectedRoute>
          } />
          <Route path="/candidate/profile" element={
            <ProtectedRoute role="candidate"><CandidateProfile /></ProtectedRoute>
          } />
          <Route path="/candidate/upload" element={
            <ProtectedRoute role="candidate"><ResumeUpload /></ProtectedRoute>
          } />
          <Route path="/candidate/assessments" element={
            <ProtectedRoute role="candidate"><SkillAssessment /></ProtectedRoute>
          } />
          <Route path="/candidate/jobs" element={
            <ProtectedRoute role="candidate"><JobRecommendations /></ProtectedRoute>
          } />

          {/* Employer Routes */}
          <Route path="/employer/dashboard" element={
            <ProtectedRoute role="employer"><EmployerDashboard /></ProtectedRoute>
          } />
          <Route path="/employer/create-job" element={
            <ProtectedRoute role="employer"><CreateJob /></ProtectedRoute>
          } />
          <Route path="/employer/search" element={
            <ProtectedRoute role="employer"><CandidateSearch /></ProtectedRoute>
          } />
          <Route path="/employer/candidates/:id" element={
            <ProtectedRoute role="employer"><CandidateView /></ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
