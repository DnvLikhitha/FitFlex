import React from 'react';
import { FaHeart, FaGithub, FaTwitter, FaInstagram, FaDumbbell } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-green-500/20 mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
                <FaDumbbell className="text-white text-xl" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white">
                  FitCore
                </span>
                <div className="text-xs text-green-400 font-medium tracking-wider">
                  Fitness & Wellness
                </div>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Your ultimate fitness companion. Track workouts, set goals, and achieve your fitness dreams with our intuitive tracking platform.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="p-3 bg-gray-800 rounded-xl hover:bg-green-500/20 transition-colors border border-green-500/20">
                <FaGithub className="text-xl text-gray-300 hover:text-green-400" />
              </a>
              <a href="#" className="p-3 bg-gray-800 rounded-xl hover:bg-green-500/20 transition-colors border border-green-500/20">
                <FaTwitter className="text-xl text-gray-300 hover:text-green-400" />
              </a>
              <a href="#" className="p-3 bg-gray-800 rounded-xl hover:bg-green-500/20 transition-colors border border-green-500/20">
                <FaInstagram className="text-xl text-gray-300 hover:text-green-400" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Features</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-green-400 transition-colors">Activity Tracking</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Goal Setting</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Progress Analytics</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Workout History</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-green-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-green-500/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="flex items-center text-gray-400 mb-4 md:mb-0">
            Made with <FaHeart className="text-green-500 mx-2" /> for fitness enthusiasts worldwide
          </p>
          <p className="text-gray-500">
            &copy; 2025 FitCore. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
