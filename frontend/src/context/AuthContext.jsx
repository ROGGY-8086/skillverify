import React, { createContext, useState, useEffect, useContext } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await client.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data);
        } catch (error) {
          console.error("Failed to fetch user", error);
          setToken(null);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // Step 1: Validate credentials and request OTP
  const loginRequestOTP = async (email, password) => {
    const res = await client.post('/api/auth/login', { email, password });
    // Returns { otp_required, message, email, otp_preview }
    return res.data;
  };

  // Step 2: Verify OTP and get token
  const loginVerifyOTP = async (email, otp) => {
    const res = await client.post('/api/auth/verify-otp', { email, otp });
    const accessToken = res.data.access_token;
    setToken(accessToken);
    localStorage.setItem('token', accessToken);
    
    const userRes = await client.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    setUser(userRes.data);
    return userRes.data;
  };

  // Resend OTP
  const resendOTP = async (email, password) => {
    const res = await client.post('/api/auth/resend-otp', { email, password });
    return res.data;
  };

  const register = async (data) => {
    await client.post('/api/auth/register', data);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ 
      user, token, loading, 
      loginRequestOTP, loginVerifyOTP, resendOTP,
      register, logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
