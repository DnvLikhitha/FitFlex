import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaRunning, FaPlus, FaDumbbell, FaHeartbeat, FaCalendar, FaBolt, FaTrophy, FaFire, FaAppleAlt, FaChartLine } from 'react-icons/fa';
import ProgressChart from '../components/Charts/ProgressChart';
import ActivityForm from '../components/Activity/ActivityForm';
import { toast } from 'react-toastify';
import heroText from '../assets/hero-text.svg';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activities, setActivities] = useState([]);
  const [goals, setGoals] = useState([]);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dailyIntake, setDailyIntake] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });
  const [caloriesBurned, setCaloriesBurned] = useState(0);

  useEffect(() => {
    if (currentUser) {
      fetchData();
    } else {
      setActivities([]);
      setGoals([]);
      setLoading(false);
    }
  }, [currentUser]);

  // Listen for changes - refresh data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentUser) {
        loadDailyIntake();
      }
    }, 2000); // Refresh every 2 seconds
    return () => clearInterval(interval);
  }, [currentUser]);

  const loadDailyIntake = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await axios.get(`http://localhost:3001/nutrition?userId=${currentUser.id}&date=${today}`);
      
      if (response.data && response.data.length > 0) {
        setDailyIntake({
          calories: response.data[0].calories,
          protein: response.data[0].protein,
          carbs: response.data[0].carbs,
          fat: response.data[0].fat
        });
      } else {
        setDailyIntake({
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        });
      }
    } catch (error) {
      console.error('Error loading daily intake:', error);
    }
  };

  const fetchData = async () => {
    try {
      const [activitiesRes, goalsRes] = await Promise.all([
        axios.get(`http://localhost:3001/activities?userId=${currentUser.id}`),
        axios.get(`http://localhost:3001/goals?userId=${currentUser.id}`)
      ]);
      setActivities(activitiesRes.data);
      setGoals(goalsRes.data);

      // Load daily intake from database
      const today = new Date().toISOString().split('T')[0];
      try {
        const nutritionRes = await axios.get(`http://localhost:3001/nutrition?userId=${currentUser.id}&date=${today}`);
        if (nutritionRes.data && nutritionRes.data.length > 0) {
          setDailyIntake({
            calories: nutritionRes.data[0].calories,
            protein: nutritionRes.data[0].protein,
            carbs: nutritionRes.data[0].carbs,
            fat: nutritionRes.data[0].fat
          });
        } else {
          setDailyIntake({
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0
          });
        }
      } catch (nutritionError) {
        console.error('Error loading nutrition:', nutritionError);
        setDailyIntake({
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        });
      }

      // Calculate calories burned from today's activities
      const todayActivities = activitiesRes.data.filter(activity => activity.date === today);
      const burned = todayActivities.reduce((sum, activity) => sum + activity.calories, 0);

      // Add bonus calories for completed goals
      const completedGoals = goalsRes.data.filter(goal => goal.completed).length;
      const bonusCalories = completedGoals * 50; // 50 calories per completed goal
      
      setCaloriesBurned(burned + bonusCalories);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Error fetching dashboard data:', error);
      setActivities([]);
      setGoals([]);
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
      {/* Hero Section - Full Screen with video behind navbar */}
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
        
        {/* Subtle Dark Overlay */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Hero Content with Image Overlay */}
      <div className="relative h-screen flex flex-col items-center justify-center px-12 z-10">
        {/* Gradient Text Image */}
        <div className="mb-12 animate-slide-up">
          <img 
            src={heroText} 
            alt="WE ARE FitFlex" 
            className="w-full max-w-5xl mx-auto animate-float"
            style={{filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))'}}
          />
        </div>
        
        {/* Tagline and CTA */}
        <div className="text-center max-w-3xl">
          <p className="text-2xl text-white font-semibold mb-10 leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
            A fitness movement that is worth breaking a sweat for
          </p>
          {!currentUser && (
            <div className="flex justify-center gap-6 animate-slide-up" style={{animationDelay: '0.4s'}}>
              <button
                onClick={() => navigate('/signup')}
                className="px-12 py-5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-2xl hover:shadow-green-500/50 hover:scale-110 transition-all duration-300 font-bold text-xl animate-glow relative overflow-hidden group"
              >
                <span className="relative z-10">Join Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content Section - Starts below video */}
      <div className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-gray-900 pt-8 pb-20 space-y-8">

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
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-green-500/20 shadow-lg hover:shadow-green-500/50 hover:scale-105 transition-all duration-300 transform animate-slide-up group">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-emerald-400 group-hover:bg-clip-text transition-all duration-300">
              <FaRunning className="mr-3 text-green-400 animate-bounce-slow group-hover:rotate-12 group-hover:scale-125 transition-transform duration-300" />
              Activity Distribution
            </h3>
            <DoughnutChart activities={activities} />
          </div>

          {/* Goals Progress Ring Chart */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-green-500/20 shadow-lg hover:shadow-green-500/50 hover:scale-105 transition-all duration-300 transform animate-slide-up group" style={{animationDelay: '0.1s'}}>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-amber-400 group-hover:bg-clip-text transition-all duration-300">
              <FaTrophy className="mr-3 text-green-400 animate-bounce-slow group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300" />
              Goals Progress
            </h3>
            <GoalsRingChart goals={goals} />
          </div>

          {/* Calories Burned Chart */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-green-500/20 shadow-lg hover:shadow-green-500/50 hover:scale-105 transition-all duration-300 transform animate-slide-up group" style={{animationDelay: '0.2s'}}>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-red-400 group-hover:to-orange-400 group-hover:bg-clip-text transition-all duration-300">
              <FaFire className="mr-3 text-green-400 animate-bounce-slow group-hover:animate-pulse transition-all" />
              Weekly Calories
            </h3>
            <CaloriesBarChart activities={activities} />
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="mt-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-green-500/20 shadow-lg hover:shadow-green-500/50 hover:scale-105 transition-all duration-300 transform animate-slide-up group" style={{animationDelay: '0.3s'}}>
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
            <FaCalendar className="mr-3 text-green-400 animate-bounce-slow group-hover:rotate-12 group-hover:scale-125 transition-transform duration-300" />
            Weekly Activity Overview
          </h3>
          <WeeklyActivityChart activities={activities} />
        </div>

        {/* Daily Nutrition & Calories Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calories Consumed */}
          <div className="bg-gradient-to-br from-green-900/40 to-gray-900 rounded-2xl p-6 border border-green-500/30 shadow-lg hover:shadow-green-500/50 hover:scale-105 transition-all duration-300 transform animate-slide-up group">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-emerald-400 group-hover:bg-clip-text transition-all duration-300">
              <FaAppleAlt className="mr-3 text-green-400 group-hover:rotate-12 group-hover:scale-125 transition-transform duration-300" />
              Daily Calories Consumed
            </h3>
            <div className="flex items-end justify-between group-hover:opacity-95 transition-opacity">
              <div>
                <div className="text-4xl font-black text-green-400 group-hover:scale-110 origin-left transition-transform duration-300">{Math.round(dailyIntake.calories)}</div>
                <div className="text-sm text-gray-400 mt-2 group-hover:text-gray-300 transition-colors">Today's intake</div>
              </div>
              <div className="text-right space-y-2">
                <div className="text-lg font-semibold text-gray-300 group-hover:text-gray-100 transition-colors">
                  Protein: <span className="text-red-400 font-bold group-hover:scale-110 inline-block transition-transform">{Math.round(dailyIntake.protein)}g</span>
                </div>
                <div className="text-lg font-semibold text-gray-300 group-hover:text-gray-100 transition-colors">
                  Carbs: <span className="text-blue-400 font-bold group-hover:scale-110 inline-block transition-transform">{Math.round(dailyIntake.carbs)}g</span>
                </div>
                <div className="text-lg font-semibold text-gray-300 group-hover:text-gray-100 transition-colors">
                  Fat: <span className="text-yellow-400 font-bold group-hover:scale-110 inline-block transition-transform">{Math.round(dailyIntake.fat)}g</span>
                </div>
              </div>
            </div>
          </div>

          {/* Calories Burned */}
          <div className="bg-gradient-to-br from-orange-900/40 to-gray-900 rounded-2xl p-6 border border-orange-500/30 shadow-lg hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300 transform animate-slide-up group" style={{animationDelay: '0.1s'}}>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-red-400 group-hover:bg-clip-text transition-all duration-300">
              <FaFire className="mr-3 text-orange-400 group-hover:animate-pulse transition-all" />
              Daily Calories Burned
            </h3>
            <div className="flex items-end justify-between group-hover:opacity-95 transition-opacity">
              <div>
                <div className="text-4xl font-black text-orange-400 group-hover:scale-110 origin-left transition-transform duration-300">{Math.round(caloriesBurned)}</div>
                <div className="text-sm text-gray-400 mt-2 group-hover:text-gray-300 transition-colors">
                  {stats.completedGoals > 0 && (
                    <span className="text-green-400 font-semibold group-hover:animate-bounce">+{stats.completedGoals * 50} bonus from goals ✓</span>
                  )}
                  {stats.completedGoals === 0 && <span>Complete goals for bonus calories!</span>}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-emerald-400 group-hover:bg-clip-text transition-all duration-300">
                  {Math.round(dailyIntake.calories - caloriesBurned > 0 ? dailyIntake.calories - caloriesBurned : 0)}
                </div>
                <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  {dailyIntake.calories > caloriesBurned ? 'Calories remaining' : 'Deficit'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Chart Section - Interactive Weekly Analytics */}
        <div className="mt-12 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-green-500/20 shadow-lg hover:shadow-green-500/30 transition-all duration-300 animate-slide-up" style={{animationDelay: '0.5s'}}>
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <FaChartLine className="mr-4 text-green-400 text-2xl animate-bounce-slow" />
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Weekly Analytics & Performance</span>
          </h2>
          <ProgressChart activities={activities} />
        </div>

        {/* Stats Cards */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in">
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
  const colors = ['#73795D', '#8f9683', '#abb0a2', '#646a50', '#545943'];
  
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
            <div className="text-xs text-accent-300">Total</div>
          </div>
        </div>
      </div>
      <div className="space-y-2 w-full">
        {Object.entries(activityTypes).map(([type, count], index) => (
          <div key={type} className="flex items-center justify-between text-sm group hover:bg-green-500/5 p-2 rounded transition-all">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }}></div>
              <span className="text-accent-300 group-hover:text-white transition-colors">{type}</span>
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
            stroke="#3D4F5A"
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
