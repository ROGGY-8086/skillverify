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

  // Direct login — credentials → JWT token in one step
  const loginRequestOTP = async (email, password) => {
    const res = await client.post('/api/auth/login', { email, password });
    // Now returns access_token directly
    const accessToken = res.data.access_token;
    setToken(accessToken);
    localStorage.setItem('token', accessToken);
    const userRes = await client.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    setUser(userRes.data);
    // Return shape Login.jsx expects for OTP step — skip OTP by passing token directly
    return { _token: accessToken, _user: userRes.data };
  };

  // No-op — kept so Login.jsx doesn't crash (OTP step is skipped now)
  const loginVerifyOTP = async (email, otp) => {
    return user;
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
