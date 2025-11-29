import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock, FaWeight, FaRuler, FaCalendar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    weight: '',
    height: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
      return;
    }

    setLoading(true);
    try {
      // Fetch existing users
      const response = await axios.get('http://localhost:3001/users');
      const existingUser = response.data.find(user => user.email === formData.email);

      if (existingUser) {
        toast.error('Email already registered. Please use a different email.');
        setLoading(false);
        return;
      }

      // Create new user
      const newUser = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age: formData.age || '',
        weight: formData.weight || '',
        height: formData.height || ''
      };

      const createResponse = await axios.post('http://localhost:3001/users', newUser);
      
      login(createResponse.data);

      toast.success('Sign up successful! Welcome to FitFlex!');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error('Email already exists');
      } else {
        toast.error('Error creating account. Please try again.');
      }
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Background Video - Full Page */}
      <div className="fixed top-0 left-0 w-full h-screen z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://cdn-images.cure.fit/www-curefit-com/video/upload/w_1400,ar_1.77,q_auto:eco,f_auto,dpr_2,vc_auto/video/test/we-are-cult-web.mp4" type="video/mp4" />
        </video>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70"></div>
      </div>

      {/* Sign In Content - Full Page */}
      <div className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center px-6 z-10 overflow-y-auto">
        <div className="w-full max-w-2xl py-12">
          <div className="bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 rounded-3xl p-12 shadow-2xl border border-green-500/20 backdrop-blur-md animate-slide-up">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-6xl font-black bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent mb-4">
                FitFlex
              </h1>
              <p className="text-xl text-gray-300 mb-2">Join Your Fitness Journey</p>
              <p className="text-gray-400">Transform your body and mind with our fitness platform</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Two Column Layout for Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Input */}
                <div className="relative group">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name *</label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400/60 group-focus-within:text-green-400 transition-colors" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:bg-gray-800 transition-all duration-300 group-focus-within:border-green-500"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="relative group">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Email *</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400/60 group-focus-within:text-green-400 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:bg-gray-800 transition-all duration-300 group-focus-within:border-green-500"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-300 mb-2">Password *</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400/60 group-focus-within:text-green-400 transition-colors" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:bg-gray-800 transition-all duration-300 group-focus-within:border-green-500"
                    placeholder="Create a password"
                    required
                  />
                </div>
              </div>

              {/* Health Information - Three Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Age Input */}
                <div className="relative group">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Age</label>
                  <div className="relative">
                    <FaCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400/60 group-focus-within:text-green-400 transition-colors" />
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:bg-gray-800 transition-all duration-300 group-focus-within:border-green-500"
                      placeholder="Age"
                    />
                  </div>
                </div>

                {/* Weight Input */}
                <div className="relative group">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Weight (kg)</label>
                  <div className="relative">
                    <FaWeight className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400/60 group-focus-within:text-green-400 transition-colors" />
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:bg-gray-800 transition-all duration-300 group-focus-within:border-green-500"
                      placeholder="Weight"
                    />
                  </div>
                </div>

                {/* Height Input */}
                <div className="relative group">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Height (cm)</label>
                  <div className="relative">
                    <FaRuler className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400/60 group-focus-within:text-green-400 transition-colors" />
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:bg-gray-800 transition-all duration-300 group-focus-within:border-green-500"
                      placeholder="Height"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-10 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-2xl hover:shadow-green-500/50 hover:scale-105 transition-all duration-300 font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {loading ? 'Creating Account...' : 'Sign Up Now'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-400">Already have an account?</span>
                </div>
              </div>

              {/* Sign In Link */}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full px-8 py-4 bg-gray-800/50 border border-green-500/30 text-green-400 rounded-lg hover:border-green-500 hover:bg-gray-800 transition-all duration-300 font-semibold text-lg"
              >
                Sign In
              </button>

              {/* Back to Dashboard Link */}
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full px-8 py-3 text-gray-400 hover:text-gray-300 transition-colors duration-300 font-semibold text-sm"
              >
                Back to Dashboard
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-xs text-gray-500 mt-8">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
