import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import ProfileCarousel from '../components/auth/ProfileCarousel';
import LoadingScreen from '../components/LoadingScreen';
import { useGoogleOneTapLogin } from '@react-oauth/google';

const API_URL = "http://localhost:4000/api";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerRole, setRegisterRole] = useState('student');
  const [showLoading, setShowLoading] = useState(false);
  const [isProcessingLogin, setIsProcessingLogin] = useState(false);

  // --------------------------
  // GOOGLE LOGIN HANDLER
  // --------------------------
  const handleGoogleAuth = async (code, role) => {
    try {
      setError('');
      setShowLoading(true);
      setIsProcessingLogin(true);

      const res = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          role
        })
      });

      const data = await res.json();
      console.log("Google login response:", data);
      
      if (!res.ok) {
        setShowLoading(false);
        throw new Error(data.message || "Google login failed");
      }

      // Save user + token
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      console.log("Navigating to dashboard for role:", data.role);
      
      // Redirect immediately without loading screen
      const dashboardUrl = data.role === "mentor" ? "/mentor/dashboard" : "/student/dashboard";
      console.log("Redirecting to:", dashboardUrl);
      
      // Try navigate first, then force redirect as fallback
      navigate(dashboardUrl);
      
      // Force redirect as backup
      setTimeout(() => {
        window.location.href = dashboardUrl;
      }, 100);

    } catch (err) {
      setShowLoading(false);
      setError(err.message);
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    // Skip if currently processing a login
    if (isProcessingLogin) return;
    
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      const parsedUser = JSON.parse(user);

      if (parsedUser.role === "mentor") {
        navigate("/mentor/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    }

    // Handle Google OAuth redirect callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      // Get the stored role and process the login immediately
      const storedRole = sessionStorage.getItem('selectedRole') || 'student';
      console.log("Google redirect detected, code:", code, "stored role:", storedRole);
      handleGoogleAuth(code, storedRole);
      // Clean up URL and session storage
      window.history.replaceState({}, document.title, window.location.pathname);
      sessionStorage.removeItem('selectedRole');
    }

    // If came from "Register as Mentor/Student"
    if (location.pathname === "/register" && location.state?.role) {
      setIsRegistering(true);
      setRegisterRole(location.state.role);
    }
  }, [navigate, location, isProcessingLogin]);

  // --------------------------
  // SIMPLE LOGIN FETCH HANDLER
  // --------------------------
  const handleLogin = async (formData) => {
    try {
      setError('');
      setShowLoading(true);

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setShowLoading(false);
        throw new Error(data.message || "Login failed");
      }

      // Save user + token
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      // Redirect immediately without loading screen
      if (data.role === "mentor") {
        navigate("/mentor/dashboard");
      } else {
        navigate("/student/dashboard");
      }

    } catch (err) {
      setShowLoading(false);
      setError(err.message);
    }
  };

  // ------------------------------
  // REGISTER AND AUTO-LOGIN HANDLER
  // ------------------------------
  const handleRegister = async (formData) => {
    try {
      setError('');
      setShowLoading(true);

      // 1. First, register the user
      const registerRes = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role: registerRole
        })
      });

      const registerData = await registerRes.json();
      if (!registerRes.ok) {
        setShowLoading(false);
        throw new Error(registerData.message || "Registration failed");
      }

      // 2. If registration is successful, log the user in
      const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        setShowLoading(false);
        throw new Error(loginData.message || "Auto-login after registration failed");
      }

      // Save the token and user data from login response
      localStorage.setItem("token", loginData.token);
      localStorage.setItem("user", JSON.stringify(loginData));

      // Redirect immediately without loading screen
      if (registerRole === "mentor") {
        navigate("/mentor/dashboard");
      } else {
        navigate("/student/dashboard");
      }

    } catch (err) {
      setShowLoading(false);
      setError(err.message);
    }
  };

  const handleNavigateToRegister = (role) => {
    setIsRegistering(true);
    setRegisterRole(role);
    window.history.pushState({}, "", "/register");
  };

  const handleSwitchToLogin = () => {
    setIsRegistering(false);
    window.history.pushState({}, "", "/login");
  };

  // Loading handled inline, no full screen loading

  // Check if we should show the two-column layout
  const showTwoColumnLayout = isRegistering;

  return (
    <div className={`h-screen bg-gray-900 ${showTwoColumnLayout ? 'flex flex-col lg:flex-row' : 'flex items-center justify-center'}`}>
      {showTwoColumnLayout ? (
        <>
          {/* Left Side - Login/Register Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
            <div className="w-full max-w-md">
              {isRegistering ? (
                <RegisterForm
                  onSubmit={handleRegister}
                  onSwitchToLogin={handleSwitchToLogin}
                  role={registerRole}
                  isLoading={showLoading}
                />
              ) : (
                <LoginForm
                  onSubmit={handleLogin}
                  onNavigateToRegister={handleNavigateToRegister}
                  onGoogleAuth={handleGoogleAuth}
                  isLoading={showLoading}
                />
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-900 border border-red-700 text-red-300 rounded-lg">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div className="hidden lg:block lg:w-1/2 h-screen">
            <ProfileCarousel />
          </div>
        </>
      ) : (
        /* Centered Login Form for main buttons */
        <div className="w-full max-w-md px-6">
          <LoginForm
            onSubmit={handleLogin}
            onNavigateToRegister={handleNavigateToRegister}
            isLoading={showLoading}
          />

          {error && (
            <div className="mt-4 p-4 bg-red-900 border border-red-700 text-red-300 rounded-lg">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Login;
