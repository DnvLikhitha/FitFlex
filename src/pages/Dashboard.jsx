import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaRunning, FaPlus, FaDumbbell, FaHeartbeat, FaCalendar, FaBolt, FaTrophy, FaFire } from 'react-icons/fa';
import ProgressChart from '../components/Charts/ProgressChart';
import ActivityForm from '../components/Activity/ActivityForm';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [activities, setActivities] = useState([]);
  const [goals, setGoals] = useState([]);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [activitiesRes, goalsRes] = await Promise.all([
        axios.get('http://localhost:3001/activities'),
        axios.get('http://localhost:3001/goals')
      ]);
      setActivities(activitiesRes.data);
      setGoals(goalsRes.data);
    } catch (error) {
      // Silently handle error for frontend-only mode
      setActivities([]);
      setGoals([]);
      console.log('Running in frontend-only mode');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveActivity = () => {
    setShowActivityForm(false);
    fetchData();
  };

  const calculateStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayActivities = activities.filter(activity => activity.date === today);
    
    return {
      todayCalories: todayActivities.reduce((sum, activity) => sum + activity.calories, 0),
      todaySteps: todayActivities.reduce((sum, activity) => sum + (activity.steps || 0), 0),
      todayDuration: todayActivities.reduce((sum, activity) => sum + activity.duration, 0),
      activeGoals: goals.filter(goal => !goal.completed).length,
      completedGoals: goals.filter(goal => goal.completed).length,
      totalWorkouts: activities.length,
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section - Full Width */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[650px] bg-gradient-to-br from-gray-900 via-green-900 to-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          }}
        >
        </div>
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        
        <div className="relative z-10 h-full flex items-center px-12">
          <div className="max-w-4xl">
            <h1 className="text-8xl font-black text-white mb-6 leading-tight">
              <span className="text-white">REFRESH YOUR</span>
              <br />
              <span className="text-white">ROUTINE SHAPE</span>
              <br />
              <span className="text-white">YOUR </span>
              <span className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">FITNESS</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
              Engaging in regular exercise not only amplifies well-being and fortifies the body but also diminishes the likelihood of injuries thereby optimizing.
            </p>
            <div className="flex gap-6">
              <button
                onClick={() => setShowActivityForm(true)}
                className="px-12 py-5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-2xl hover:shadow-green-500/50 hover:scale-105 transition-all duration-300 font-bold text-xl"
              >
                Join Now
              </button>
              <button className="flex items-center gap-3 px-8 py-5 bg-transparent text-white rounded-lg hover:bg-white/10 transition-all duration-300 font-semibold text-xl">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                Watch Video
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Form Modal */}
      {showActivityForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-dark rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <ActivityForm
              onSave={handleSaveActivity}
              onCancel={() => setShowActivityForm(false)}
            />
          </div>
        </div>
      )}


    </div>
  );
};

export default Dashboard;
