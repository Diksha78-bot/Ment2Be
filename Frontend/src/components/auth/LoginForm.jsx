import React, { useState } from 'react';
import ProfileCarousel from "./ProfileCarousel"

const LoginForm = ({ onSubmit, onNavigateToRegister }) => {
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [captchaValue, setCaptchaValue] = useState(null);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    onSubmit({ ...formData, role });
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleGoogleLogin = () => {
    // Google OAuth would be implemented here
    window.location.href = `${window.location.origin}/api/auth/google`;
  };

  return (
    <div className="w-full max-w-md mx-auto pt-10">
      <h1 className="text-4xl font-semibold text-gray-900 text-center mb-8">Log in</h1>

      {/* Role Toggle */}
      <div className="flex justify-center text-gray-700 font-medium text-sm mb-6">
        <button
          onClick={() => setRole("student")}
          className={`px-4 pb-2 ${role === "student" ? "border-b-2 border-green-600 text-gray-900" : "text-gray-500"}`}
        >
          I'm a student
        </button>
        <button
          onClick={() => setRole("mentor")}
          className={`px-4 pb-2 ${role === "mentor" ? "border-b-2 border-green-600 text-gray-900" : "text-gray-500"}`}
        >
          I'm a mentor
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-sm text-gray-700">Email or username</label>
          <input
            name="email"
            type="text"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-2 w-full px-3 py-3 border border-gray-300 rounded-lg outline-none focus:border-green-600"
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">Password</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-2 w-full px-3 py-3 border border-gray-300 rounded-lg outline-none focus:border-green-600"
          />
        </div>


        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Log in
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-sm text-gray-500">Or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        <div className="flex justify-between text-sm mt-3">
          <a href="#" className="text-green-700">Forgot password?</a>
        </div>

        <p className="text-sm text-gray-600 text-center">
          Don't have an account? Sign up as a{" "}
          <button 
            onClick={() => onNavigateToRegister('student')}
            className="text-green-600 font-medium hover:underline focus:outline-none px-1"
          >
            student
          </button>{" "}
          or apply to be a{" "}
          <button 
            onClick={() => onNavigateToRegister('mentor')}
            className="text-blue-600 font-medium hover:underline focus:outline-none px-1"
          >
            mentor
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
