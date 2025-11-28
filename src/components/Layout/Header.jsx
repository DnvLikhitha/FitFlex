import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaRunning, FaFlag, FaHistory, FaUser, FaDumbbell, FaAppleAlt } from 'react-icons/fa';

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: FaHome, label: 'Dashboard' },
    { path: '/activities', icon: FaRunning, label: 'Activities' },
    { path: '/goals', icon: FaFlag, label: 'Goals' },
    { path: '/nutrition', icon: FaAppleAlt, label: 'Nutrition' },
    { path: '/history', icon: FaHistory, label: 'History' },
    { path: '/profile', icon: FaUser, label: 'Profile' },
  ];

  return (
    <header className="bg-gray-900/80 backdrop-blur-lg sticky top-0 z-50 border-b border-green-500/20 shadow-lg">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg group-hover:shadow-green-500/50 transition-all duration-300">
              <FaDumbbell className="text-white text-xl" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white">
                FitFlex
              </span>
              <div className="text-xs text-green-400 font-medium tracking-wider">
                REFRESH YOUR FITNESS
              </div>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={'flex items-center px-5 py-2.5 rounded-xl transition-all duration-200 font-medium ' + (
                    isActive
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  )}
                >
                  <Icon className="mr-2" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            <button className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
