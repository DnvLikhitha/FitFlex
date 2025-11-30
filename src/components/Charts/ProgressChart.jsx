import React, { useState } from 'react';
import { FaRunning, FaFire, FaShoePrints, FaChartLine, FaArrowUp } from 'react-icons/fa';

const ProgressChart = ({ activities }) => {
  const [hoveredDay, setHoveredDay] = useState(null);
  const [selectedChart, setSelectedChart] = useState('all');
  // Calculate weekly totals
  const getWeeklyData = () => {
    const today = new Date();
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayActivities = activities.filter(activity => activity.date === date);
      return {
        date,
        calories: dayActivities.reduce((sum, activity) => sum + activity.calories, 0),
        steps: dayActivities.reduce((sum, activity) => sum + (activity.steps || 0), 0),
        duration: dayActivities.reduce((sum, activity) => sum + activity.duration, 0),
        workouts: dayActivities.length
      };
    });
  };

  const weeklyData = getWeeklyData();

  const getMaxValue = (key) => {
    return Math.max(...weeklyData.map(day => day[key]), 1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { weekday: 'short' });
  };

  const stats = {
    totalCalories: activities.reduce((sum, activity) => sum + activity.calories, 0),
    totalSteps: activities.reduce((sum, activity) => sum + (activity.steps || 0), 0),
    totalDuration: activities.reduce((sum, activity) => sum + activity.duration, 0),
    totalWorkouts: activities.length
  };

  const StatCard = ({ icon, value, label, color, trend }) => (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 border border-green-500/20 shadow-lg hover:shadow-green-500/50 hover:scale-105 transition-all duration-300 group cursor-pointer transform hover:border-green-500/40">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-emerald-400 group-hover:bg-clip-text transition-all duration-300">
            {value.toLocaleString()}
          </div>
          <div className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">{label}</div>
        </div>
        <div className={`p-3 rounded-xl ${color} text-white shadow-lg group-hover:shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-3 text-xs font-semibold text-green-400 group-hover:text-green-300 transition-colors animate-pulse">
          <FaArrowUp className="mr-1 animate-bounce" />
          {trend}% this week
        </div>
      )}
    </div>
  );

  const BarChart = ({ data, title, color, valueKey, formatter = (val) => val }) => {
    const maxValue = getMaxValue(valueKey);
    
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-green-500/20 shadow-lg hover:shadow-green-500/50 transition-all duration-300 group hover:border-green-500/40">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-emerald-400 group-hover:bg-clip-text transition-all duration-300">
          <div className={`w-2 h-6 ${color} rounded-full mr-3 group-hover:h-8 transition-all`}></div>
          {title}
        </h3>
        <div className="flex items-end justify-between h-40 gap-2">
          {data.map((day, index) => (
            <div
              key={index}
              className="flex flex-col items-center flex-1 group/bar cursor-pointer"
              onMouseEnter={() => setHoveredDay(index)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              {hoveredDay === index && (
                <div className="text-sm font-bold text-green-400 mb-2 animate-bounce">
                  {formatter(day[valueKey])}
                </div>
              )}
              <div
                className={`w-full ${color} rounded-t-xl transition-all duration-500 group-hover/bar:shadow-2xl group-hover/bar:shadow-green-500/50 relative hover:opacity-90 group-hover/bar:scale-y-110`}
                style={{ 
                  height: `${(day[valueKey] / maxValue) * 100}%`,
                  minHeight: day[valueKey] > 0 ? '8px' : '0',
                  animation: `slideUp 0.6s ease-out ${index * 0.05}s backwards`,
                  transformOrigin: 'bottom'
                }}
              >
                {hoveredDay === index && (
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-3 py-2 rounded-lg font-bold shadow-2xl whitespace-nowrap z-20 animate-bounce">
                    {formatter(day[valueKey])}
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-400 mt-3 font-medium group-hover/bar:font-bold group-hover/bar:text-green-400 transition-all">
                {formatDate(day.date)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
        <StatCard
          icon={<FaFire className="text-lg" />}
          value={stats.totalCalories}
          label="Total Calories"
          color="bg-gradient-to-br from-red-500 to-orange-500"
          trend="12"
        />
        <StatCard
          icon={<FaShoePrints className="text-lg" />}
          value={stats.totalSteps}
          label="Total Steps"
          color="bg-gradient-to-br from-green-500 to-emerald-600"
          trend="8"
        />
        <StatCard
          icon={<FaRunning className="text-lg" />}
          value={stats.totalDuration}
          label="Total Minutes"
          color="bg-gradient-to-br from-blue-500 to-cyan-600"
          trend="15"
        />
        <StatCard
          icon={<FaChartLine className="text-lg" />}
          value={stats.totalWorkouts}
          label="Total Workouts"
          color="bg-gradient-to-br from-purple-500 to-indigo-600"
          trend="5"
        />
      </div>

      {/* Chart Selection Tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedChart('all')}
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 transform border ${
            selectedChart === 'all'
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/50 scale-105 border-green-400'
              : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:scale-105 hover:shadow-lg hover:shadow-green-500/30'
          }`}
        >
          All Charts
        </button>
        <button
          onClick={() => setSelectedChart('calories')}
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 transform border ${
            selectedChart === 'calories'
              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/50 scale-105 border-red-400'
              : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:scale-105 hover:shadow-lg hover:shadow-red-500/30'
          }`}
        >
          🔥 Calories
        </button>
        <button
          onClick={() => setSelectedChart('steps')}
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 transform border ${
            selectedChart === 'steps'
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/50 scale-105 border-green-400'
              : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:scale-105 hover:shadow-lg hover:shadow-green-500/30'
          }`}
        >
          👟 Steps
        </button>
        <button
          onClick={() => setSelectedChart('duration')}
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 transform border ${
            selectedChart === 'duration'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/50 scale-105 border-blue-400'
              : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30'
          }`}
        >
          ⏱️ Duration
        </button>
        <button
          onClick={() => setSelectedChart('workouts')}
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 transform border ${
            selectedChart === 'workouts'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/50 scale-105 border-purple-400'
              : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30'
          }`}
        >
          💪 Workouts
        </button>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(selectedChart === 'all' || selectedChart === 'calories') && (
          <div className="animate-slide-up">
            <BarChart
              data={weeklyData}
              title="Calories Burned"
              color="bg-gradient-to-t from-red-400 to-red-500"
              valueKey="calories"
            />
          </div>
        )}
        {(selectedChart === 'all' || selectedChart === 'steps') && (
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <BarChart
              data={weeklyData}
              title="Steps Taken"
              color="bg-gradient-to-t from-green-400 to-green-500"
              valueKey="steps"
              formatter={(val) => (val / 1000).toFixed(0) + 'k'}
            />
          </div>
        )}
        {(selectedChart === 'all' || selectedChart === 'duration') && (
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <BarChart
              data={weeklyData}
              title="Workout Duration"
              color="bg-gradient-to-t from-blue-400 to-blue-500"
              valueKey="duration"
            />
          </div>
        )}
        {(selectedChart === 'all' || selectedChart === 'workouts') && (
          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <BarChart
              data={weeklyData}
              title="Workouts Completed"
              color="bg-gradient-to-t from-purple-400 to-purple-500"
              valueKey="workouts"
            />
          </div>
        )}
      </div>

      {/* Weekly Summary Card */}
      <div className="bg-gradient-to-r from-gray-800 via-gray-750 to-gray-800 rounded-2xl p-8 border border-green-500/20 shadow-lg hover:shadow-green-500/50 transition-all duration-300 group overflow-hidden relative hover:border-green-500/40">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-emerald-400 group-hover:bg-clip-text transition-all duration-300">
              📊 Weekly Performance
            </h3>
            <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
              You're doing amazing! {stats.totalWorkouts > 0 ? `You've completed ${stats.totalWorkouts} workouts this week, burning ${stats.totalCalories} calories!` : 'Start logging activities to see your progress and celebrate your wins!'}
            </p>
          </div>
          <div className="text-5xl animate-bounce group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">🚀</div>
        </div>
      </div>

      {/* Add custom CSS animations */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }

        .group-hover\\:bg-clip-text {
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default ProgressChart;