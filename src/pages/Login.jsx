import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Fetch all users to find matching credentials
      const response = await axios.get('http://localhost:3001/users');
      console.log('Users from database:', response.data);
      console.log('Looking for:', formData.email, formData.password);
      
      const user = response.data.find(
        u => u.email.toLowerCase() === formData.email.toLowerCase() && u.password === formData.password
      );

      console.log('User found:', user);

      if (!user) {
        toast.error('Invalid email or password');
        setLoading(false);
        return;
      }

      // Store user ID and name in localStorage
      localStorage.setItem('currentUserId', user.id);
      localStorage.setItem('currentUserName', user.name);

      toast.success(`Welcome back, ${user.name}!`);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Login error details:', error);
      if (error.code === 'ERR_NETWORK') {
        toast.error('Cannot connect to server. Make sure json-server is running on port 3001');
      } else {
        toast.error('Error logging in. Please try again.');
      }
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

      {/* Login Content - Full Page */}
      <div className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center px-6 z-10 overflow-y-auto">
        <div className="w-full max-w-md py-12">
          <div className="bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 rounded-3xl p-12 shadow-2xl border border-green-500/20 backdrop-blur-md animate-slide-up">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-black bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent mb-2">
                FitFlex
              </h1>
              <p className="text-xl text-gray-300">Welcome Back</p>
              <p className="text-gray-400 text-sm mt-2">Sign in to continue your fitness journey</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-2xl hover:shadow-green-500/50 hover:scale-105 transition-all duration-300 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {loading ? 'Signing In...' : 'Sign In'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-400">Don't have an account?</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="w-full px-8 py-4 bg-gray-800/50 border border-green-500/30 text-green-400 rounded-lg hover:border-green-500 hover:bg-gray-800 transition-all duration-300 font-semibold text-lg"
              >
                Create New Account
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
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
