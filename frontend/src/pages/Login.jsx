import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, AlertCircle, KeyRound, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // OTP state
  const [step, setStep] = useState('credentials'); // 'credentials' | 'otp'
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpPreview, setOtpPreview] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [resending, setResending] = useState(false);
  const otpRefs = useRef([]);

  const { loginRequestOTP, loginVerifyOTP, resendOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-focus first OTP input when entering OTP step
  useEffect(() => {
    if (step === 'otp' && otpRefs.current[0]) {
      otpRefs.current[0].focus();
    }
  }, [step]);

  // Step 1: Submit credentials
  const handleCredentialSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await loginRequestOTP(email, password);
      setOtpPreview(data.otp_preview || null);
      setStep('otp');
      setCountdown(30);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Submit OTP
  const handleOTPSubmit = async (e) => {
    e?.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const userData = await loginVerifyOTP(email, otpString);
      if (userData?.role === 'employer') {
        navigate('/employer/dashboard');
      } else {
        navigate('/candidate/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid or expired OTP.');
      setOtp(['', '', '', '', '', '']);
      if (otpRefs.current[0]) otpRefs.current[0].focus();
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input changes
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only last char
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 5 && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1].focus();
    }

    // Auto-submit when all 6 digits are entered
    if (value && index === 5) {
      const fullOtp = newOtp.join('');
      if (fullOtp.length === 6) {
        setTimeout(() => handleOTPSubmit(), 100);
      }
    }
  };

  // Handle backspace in OTP inputs
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && otpRefs.current[index - 1]) {
      otpRefs.current[index - 1].focus();
    }
  };

  // Handle paste into OTP inputs
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pasted[i] || '';
      }
      setOtp(newOtp);
      // Focus last filled input or submit
      const lastIndex = Math.min(pasted.length, 5);
      if (otpRefs.current[lastIndex]) otpRefs.current[lastIndex].focus();
      if (pasted.length === 6) {
        setTimeout(() => handleOTPSubmit(), 100);
      }
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setResending(true);
    setError('');
    try {
      const data = await resendOTP(email, password);
      setOtpPreview(data.otp_preview || null);
      setCountdown(30);
      setOtp(['', '', '', '', '', '']);
      if (otpRefs.current[0]) otpRefs.current[0].focus();
    } catch (err) {
      setError('Failed to resend OTP.');
    } finally {
      setResending(false);
    }
  };

  // Go back to credentials step
  const goBack = () => {
    setStep('credentials');
    setOtp(['', '', '', '', '', '']);
    setOtpPreview(null);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-sm border border-slate-100">
        
        {/* ───── STEP 1: Credentials ───── */}
        {step === 'credentials' && (
          <>
            <div className="text-center">
              <ShieldCheck className="mx-auto h-12 w-12 text-accent" />
              <h2 className="mt-6 text-3xl font-extrabold text-slate-900">Welcome back</h2>
              <p className="mt-2 text-sm text-slate-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-accent hover:text-teal-600 transition-colors">
                  Sign up for free
                </Link>
              </p>
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={handleCredentialSubmit}>
              {successMessage && step === 'credentials' && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-start gap-3 text-sm">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-accent focus:border-accent bg-slate-50 text-slate-900 placeholder-slate-400 transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-accent focus:border-accent bg-slate-50 text-slate-900 placeholder-slate-400 transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors disabled:opacity-70"
                >
                  {isLoading ? 'Verifying...' : 'Continue'}
                </button>
              </div>
            </form>
          </>
        )}

        {/* ───── STEP 2: OTP Verification ───── */}
        {step === 'otp' && (
          <>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4">
                <KeyRound className="h-8 w-8 text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Verify your identity</h2>
              <p className="mt-2 text-sm text-slate-500">
                We've sent a 6-digit verification code to
              </p>
              <p className="text-sm font-semibold text-slate-700 mt-1">{email}</p>
            </div>

            {/* Demo OTP preview banner */}
            {otpPreview && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-center">
                <p className="text-xs text-amber-600 font-medium mb-1">Demo Mode — OTP Preview</p>
                <p className="text-2xl font-bold tracking-[0.5em] text-amber-700">{otpPreview}</p>
                <p className="text-xs text-amber-500 mt-1">In production, this is sent via email only</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleOTPSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-start gap-3 text-sm">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* OTP Input Boxes */}
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={index === 0 ? handleOtpPaste : undefined}
                    className="w-12 h-14 text-center text-xl font-bold border-2 border-slate-300 rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 bg-slate-50 text-slate-900 transition-all outline-none"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.join('').length !== 6}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors disabled:opacity-70"
              >
                {isLoading ? 'Verifying...' : 'Verify & Sign in'}
              </button>

              {/* Resend & Back */}
              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={goBack}
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={countdown > 0 || resending}
                  className="flex items-center gap-1 text-accent hover:text-teal-600 transition-colors disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`h-4 w-4 ${resending ? 'animate-spin' : ''}`} />
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                </button>
              </div>

              <p className="text-xs text-center text-slate-400 mt-2">
                Code expires in {5} minutes
              </p>
            </form>
          </>
        )}

      </div>
    </div>
  );
};

export default Login;
