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
    <>
      {/* Hero Section - Full Screen minus header */}
      <div className="relative w-full" style={{ height: 'calc(100vh - 80px)' }}>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://cdn-images.cure.fit/www-curefit-com/video/upload/w_1400,ar_1.77,q_auto:eco,f_auto,dpr_2,vc_auto/video/test/we-are-cult-web.mp4" type="video/mp4" />
        </video>
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        
        <div className="absolute inset-0 flex items-center px-12">
          <div className="max-w-4xl">
            <h1 className="text-8xl font-black mb-6 leading-tight animate-slide-up">
              <span className="text-green-300 animate-float">WE ARE</span>
              <br />
              <span className="bg-gradient-to-r from-green-300 via-green-400 to-yellow-300 bg-clip-text text-transparent animate-gradient">FitFlex</span>
            </h1>
            <p className="text-2xl text-white font-semibold mb-10 max-w-2xl leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
              A fitness movement that is worth breaking a sweat for
            </p>
            <div className="flex gap-6 animate-slide-up" style={{animationDelay: '0.4s'}}>
              <button
                onClick={() => setShowActivityForm(true)}
                className="px-12 py-5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-2xl hover:shadow-green-500/50 hover:scale-110 transition-all duration-300 font-bold text-xl animate-glow relative overflow-hidden group"
              >
                <span className="relative z-10">Join Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button className="flex items-center gap-3 px-8 py-5 bg-white/5 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all duration-300 font-semibold text-xl border border-white/10 hover:border-white/30 hover:scale-105 group">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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

      {/* Content Section - Starts below video */}
      <div className="relative">
        <div className="bg-gradient-to-b from-gray-900 via-gray-900 to-gray-900 pt-8 space-y-8">

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

      {/* Stats & Charts Section */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Distribution Doughnut Chart */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-green-500/20 shadow-lg hover:shadow-green-500/30 hover-lift transition-smooth animate-slide-up">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <FaRunning className="mr-3 text-green-400 animate-bounce-slow" />
              Activity Distribution
            </h3>
            <DoughnutChart activities={activities} />
          </div>

          {/* Goals Progress Ring Chart */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-green-500/20 shadow-lg hover:shadow-green-500/30 hover-lift transition-smooth animate-slide-up" style={{animationDelay: '0.1s'}}>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <FaTrophy className="mr-3 text-green-400 animate-bounce-slow" />
              Goals Progress
            </h3>
            <GoalsRingChart goals={goals} />
          </div>

          {/* Calories Burned Chart */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-green-500/20 shadow-lg hover:shadow-green-500/30 hover-lift transition-smooth animate-slide-up" style={{animationDelay: '0.2s'}}>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <FaFire className="mr-3 text-green-400 animate-bounce-slow" />
              Weekly Calories
            </h3>
            <CaloriesBarChart activities={activities} />
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="mt-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-green-500/20 shadow-lg hover:shadow-green-500/30 hover-lift transition-smooth animate-slide-up" style={{animationDelay: '0.3s'}}>
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <FaCalendar className="mr-3 text-green-400 animate-bounce-slow" />
            Weekly Activity Overview
          </h3>
          <WeeklyActivityChart activities={activities} />
        </div>

        {/* Stats Cards */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="animate-zoom-in" style={{animationDelay: '0.4s'}}>
            <StatsCard 
              icon={<FaDumbbell />}
              value={stats.totalWorkouts}
              label="Total Workouts"
              color="green"
            />
          </div>
          <div className="animate-zoom-in" style={{animationDelay: '0.5s'}}>
            <StatsCard 
              icon={<FaBolt />}
              value={stats.todayDuration}
              label="Active Minutes"
              color="blue"
            />
          </div>
          <div className="animate-zoom-in" style={{animationDelay: '0.6s'}}>
            <StatsCard 
              icon={<FaFire />}
              value={stats.todayCalories}
              label="Calories Burned"
              color="orange"
            />
          </div>
          <div className="animate-zoom-in" style={{animationDelay: '0.7s'}}>
            <StatsCard 
              icon={<FaTrophy />}
              value={stats.activeGoals}
              label="Active Goals"
              color="purple"
            />
          </div>
        </div>
      </div>
      </div>
      </div>
    </>
  );
};

// Doughnut Chart Component
const DoughnutChart = ({ activities }) => {
  const activityTypes = activities.reduce((acc, activity) => {
    acc[activity.type] = (acc[activity.type] || 0) + 1;
    return acc;
  }, {});

  const total = activities.length || 1;
  const colors = ['#22c55e', '#10b981', '#059669', '#047857', '#065f46'];
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48 mb-4">
        <svg viewBox="0 0 100 100" className="transform -rotate-90">
          {Object.entries(activityTypes).map(([type, count], index) => {
            const percentage = (count / total) * 100;
            const offset = Object.entries(activityTypes)
              .slice(0, index)
              .reduce((sum, [, c]) => sum + (c / total) * 100, 0);
            
            return (
              <circle
                key={type}
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={colors[index % colors.length]}
                strokeWidth="20"
                strokeDasharray={`${percentage * 2.51} ${251}`}
                strokeDashoffset={-offset * 2.51}
                className="transition-all duration-1000 ease-out hover:stroke-width-[22]"
                style={{ animationDelay: `${index * 0.2}s` }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-black text-white">{activities.length}</div>
            <div className="text-xs text-gray-400">Total</div>
          </div>
        </div>
      </div>
      <div className="space-y-2 w-full">
        {Object.entries(activityTypes).map(([type, count], index) => (
          <div key={type} className="flex items-center justify-between text-sm group hover:bg-white/5 p-2 rounded transition-all">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }}></div>
              <span className="text-gray-300 group-hover:text-white transition-colors">{type}</span>
            </div>
            <span className="text-white font-semibold">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Goals Ring Chart Component
const GoalsRingChart = ({ goals }) => {
  const completedGoals = goals.filter(g => g.completed).length;
  const totalGoals = goals.length || 1;
  const percentage = (completedGoals / totalGoals) * 100;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48 mb-4">
        <svg viewBox="0 0 100 100" className="transform -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#374151"
            strokeWidth="12"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="12"
            strokeDasharray={`${percentage * 2.51} 251`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-black text-white">{Math.round(percentage)}%</div>
            <div className="text-xs text-gray-400">Complete</div>
          </div>
        </div>
      </div>
      <div className="space-y-3 w-full">
        <div className="flex justify-between items-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
          <span className="text-gray-300">Completed</span>
          <span className="text-green-400 font-bold text-lg">{completedGoals}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
          <span className="text-gray-300">In Progress</span>
          <span className="text-orange-400 font-bold text-lg">{totalGoals - completedGoals}</span>
        </div>
      </div>
    </div>
  );
};

// Calories Bar Chart Component
const CaloriesBarChart = ({ activities }) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const caloriesByDay = last7Days.map(date => {
    const dayActivities = activities.filter(a => a.date === date);
    return dayActivities.reduce((sum, a) => sum + a.calories, 0);
  });

  const maxCalories = Math.max(...caloriesByDay, 1);

  return (
    <div className="h-64 flex items-end justify-between gap-2">
      {caloriesByDay.map((calories, index) => {
        const height = (calories / maxCalories) * 100;
        const day = new Date(last7Days[index]).toLocaleDateString('en-US', { weekday: 'short' });
        
        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
            <div className="relative w-full bg-gray-700/30 rounded-t-lg overflow-hidden" style={{ height: '200px' }}>
              <div 
                className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all duration-1000 ease-out hover:from-green-400 hover:to-green-300"
                style={{ 
                  height: `${height}%`,
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-bold text-white whitespace-nowrap">{calories}</span>
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-400 font-medium">{day}</span>
          </div>
        );
      })}
    </div>
  );
};

// Weekly Activity Chart Component
const WeeklyActivityChart = ({ activities }) => {
  const activityTypes = ['Running', 'Weight Training', 'Yoga', 'Cycling', 'Swimming'];
  const colors = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444'];

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const activityData = activityTypes.map(type => ({
    type,
    data: last7Days.map(date => 
      activities.filter(a => a.date === date && a.type === type).length
    )
  }));

  const maxActivities = Math.max(...activityData.flatMap(d => d.data), 1);

  return (
    <div className="space-y-6">
      {activityData.map((typeData, typeIndex) => (
        <div key={typeData.type} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-300">{typeData.type}</span>
            <span className="text-xs text-gray-500">{typeData.data.reduce((a, b) => a + b, 0)} total</span>
          </div>
          <div className="flex items-center gap-2 h-8">
            {typeData.data.map((count, dayIndex) => {
              const width = (count / maxActivities) * 100;
              return (
                <div 
                  key={dayIndex} 
                  className="relative flex-1 h-full bg-gray-700/30 rounded-lg overflow-hidden group cursor-pointer"
                >
                  <div 
                    className="h-full rounded-lg transition-all duration-700 ease-out"
                    style={{ 
                      width: `${width}%`,
                      backgroundColor: colors[typeIndex],
                      animationDelay: `${(typeIndex * 0.1) + (dayIndex * 0.05)}s`
                    }}
                  >
                    {count > 0 && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-bold text-white">{count}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div className="flex justify-between text-xs text-gray-500 mt-4 pt-4 border-t border-gray-700">
        {last7Days.map(date => (
          <span key={date}>{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
        ))}
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ icon, value, label, color }) => {
  const colors = {
    green: 'from-green-500 to-green-600',
    blue: 'from-blue-500 to-blue-600',
    orange: 'from-orange-500 to-orange-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-green-500/40 hover-lift transition-smooth group cursor-pointer overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className={`w-12 h-12 bg-gradient-to-br ${colors[color]} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 animate-glow relative z-10`}>
        <span className="text-white text-2xl">{icon}</span>
      </div>
      <div className="text-4xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300 relative z-10">{value}</div>
      <div className="text-sm text-gray-400 group-hover:text-green-400 transition-colors duration-300 relative z-10">{label}</div>
    </div>
  );
};

export default Dashboard;
