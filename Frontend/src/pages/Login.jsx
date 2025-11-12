import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import ProfileCarousel from '../components/auth/ProfileCarousel';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerRole, setRegisterRole] = useState('student');

  // Redirect if already logged in
  useEffect(() => {
    if (authAPI.isAuthenticated()) {
      navigate('/');
    }
    
    // Check if coming from register link
    if (location.pathname === '/register' && location.state?.role) {
      setIsRegistering(true);
      setRegisterRole(location.state.role);
    }
  }, [navigate, location]);

  const handleLogin = async (formData) => {
    try {
      setError('');
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password
      });

      if (!response || !response.token) {
        throw new Error('Invalid response from server');
      }

      // Store token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));

      // Redirect to home or intended page
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegister = async (formData) => {
    try {
      setError('');
      const response = await authAPI.register({
        ...formData,
        role: registerRole
      });

      // Auto-login after registration
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  const handleNavigateToRegister = (role) => {
    setIsRegistering(true);
    setRegisterRole(role);
    // Update URL without triggering a full page reload
    window.history.pushState({}, '', `/register`);
  };

  const handleSwitchToLogin = () => {
    setIsRegistering(false);
    window.history.pushState({}, '', '/login');
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-gradient-to-br from-gray-100 to-gray-300">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          {isRegistering ? (
            <RegisterForm 
              onSubmit={handleRegister}
              onSwitchToLogin={handleSwitchToLogin}
              role={registerRole}
            />
          ) : (
            <LoginForm 
              onSubmit={handleLogin}
              onNavigateToRegister={handleNavigateToRegister}
            />
          )}
          
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Profile Carousel */}
      <div className="hidden lg:block lg:w-1/2 h-screen">
        <ProfileCarousel />
      </div>
    </div>
  );
};

export default Login;
