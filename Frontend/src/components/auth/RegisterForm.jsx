import React, { useState } from 'react';

const RegisterForm = ({ onSubmit, onSwitchToLogin, role, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    onSubmit({ ...formData, role });
  };

  return (
    <div className="w-full max-w-md mx-auto text-left">
      {/* Back Button */}
      <button
        onClick={onSwitchToLogin}
        className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <h1 className="text-3xl font-bold text-white mb-2">
        Join as a {role}
      </h1>
      
      <p className="text-gray-400 mb-8">
        Already have an account?{" "}
        <button 
          type="button"
          onClick={onSwitchToLogin}
          className="text-blue-400 hover:text-blue-300 font-medium"
        >
          Log in
        </button>
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-sm text-gray-300 block mb-2">Full Name</label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="text-sm text-gray-300 block mb-2">Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="text-sm text-gray-300 block mb-2">Password</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            placeholder="Enter your password"
          />
        </div>

        <div>
          <label className="text-sm text-gray-300 block mb-2">Confirm Password</label>
          <input
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            placeholder="Confirm your password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded font-semibold transition-colors ${
            isLoading 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-gray-600 hover:bg-gray-700'
          } text-white`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Signing up...
            </div>
          ) : (
            `Sign up as ${role}`
          )}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
