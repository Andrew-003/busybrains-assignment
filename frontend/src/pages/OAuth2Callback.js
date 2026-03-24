import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

const OAuth2Callback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      localStorage.setItem('token', token);
      
      // Get user info using authService to avoid CORS issues
      authService.getCurrentUser()
      .then(userData => {
        login({ token, ...userData });
        navigate('/dashboard');
      })
      .catch(error => {
        console.error('OAuth2 callback error:', error);
        // Even if we can't get user data, we can still navigate to dashboard
        navigate('/dashboard');
      });
    } else {
      navigate('/login?error=no_token');
    }
  }, [navigate, login]);

  return (
    <div className="oauth2-callback">
      <h2>Processing login...</h2>
      <p>Please wait while we complete your authentication.</p>
    </div>
  );
};

export default OAuth2Callback;
