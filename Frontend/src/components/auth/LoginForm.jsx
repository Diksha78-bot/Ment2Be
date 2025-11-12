import React, { useState } from 'react';

const LoginForm = ({ onSubmit, onNavigateToRegister }) => {
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, role });
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

        {/* CAPTCHA Placeholder */}
        <div className="w-full border border-gray-900 rounded-md p-4 flex items-center gap-3">
          <input type="checkbox" className="w-5 h-5" />
          <span className="text-gray-800 text-sm">Verify you are human</span>
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
          className="w-full border border-gray-300 rounded-lg py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition"
        >
          <img src="/google-logo.png" alt="Google" className="w-5 h-5" />
          Log in with Google
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
            mentee
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
