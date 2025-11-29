import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaRunning, FaFlag, FaHistory, FaUser, FaDumbbell, FaAppleAlt, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navItems = [
    { path: '/', icon: FaHome, label: 'Dashboard' },
    { path: '/activities', icon: FaRunning, label: 'Activities' },
    { path: '/goals', icon: FaFlag, label: 'Goals' },
    { path: '/nutrition', icon: FaAppleAlt, label: 'Nutrition' },
    { path: '/history', icon: FaHistory, label: 'History' },
    { path: '/profile', icon: FaUser, label: 'Profile' },
  ];

  return (
    <header className="bg-transparent backdrop-md sticky top-0 z-50  border-green-500/10 animate-slide-up">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg group-hover:shadow-green-500/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 animate-glow">
              <FaDumbbell className="text-white text-xl" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">
                FitFlex
              </span>
              <div className="text-xs text-green-400 font-medium tracking-wider">
                REFRESH YOUR FITNESS
              </div>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={'flex items-center px-5 py-2.5 rounded-xl transition-all duration-300 font-medium group hover:scale-105 animate-fade-in ' + (
                    isActive
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30 animate-glow'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  )}
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <Icon className="mr-2 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center space-x-3 animate-fade-in" style={{animationDelay: '0.6s'}}>
            {currentUser ? (
              <>
                <div className="text-white font-semibold text-sm px-4 py-2 bg-green-500/20 rounded-lg border border-green-500/30">
                  Welcome, {currentUser.name}
                </div>
                <button 
                  onClick={handleLogout}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-110 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <FaSignOutAlt />
                    Logout
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 hover:scale-110 animate-glow relative overflow-hidden group"
              >
                <span className="relative z-10">Sign In</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
