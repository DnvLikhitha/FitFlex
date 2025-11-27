import React from 'react';
import { FaRunning, FaFire, FaShoePrints, FaChartLine, FaArrowUp } from 'react-icons/fa';

const ProgressChart = ({ activities }) => {
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
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-800">{value.toLocaleString()}</div>
          <div className="text-gray-500 text-sm">{label}</div>
        </div>
        <div className={`p-3 rounded-xl ${color} text-white shadow-lg`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-2 text-xs text-green-600">
          <FaArrowUp className="mr-1" />
          {trend}% this week
        </div>
      )}
    </div>
  );

  const BarChart = ({ data, title, color, valueKey, formatter = (val) => val }) => {
    const maxValue = getMaxValue(valueKey);
    
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <div className={`w-2 h-6 ${color} rounded-full mr-3`}></div>
          {title}
        </h3>
        <div className="flex items-end justify-between h-32">
          {weeklyData.map((day, index) => (
            <div key={index} className="flex flex-col items-center flex-1 mx-1 group">
              <div className="text-xs text-gray-500 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {formatter(day[valueKey])}
              </div>
              <div
                className={`w-full ${color} rounded-t-xl transition-all duration-500 group-hover:shadow-lg relative`}
                style={{ height: `${(day[valueKey] / maxValue) * 80}%` }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {formatter(day[valueKey])}
                </div>
              </div>
              <div className="text-xs text-gray-600 mt-2 font-medium">
                {formatDate(day.date)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          data={weeklyData}
          title="Calories Burned"
          color="bg-gradient-to-t from-red-400 to-red-500"
          valueKey="calories"
        />
        <BarChart
          data={weeklyData}
          title="Steps Taken"
          color="bg-gradient-to-t from-green-400 to-green-500"
          valueKey="steps"
          formatter={(val) => (val / 1000).toFixed(0) + 'k'}
        />
        <BarChart
          data={weeklyData}
          title="Workout Duration"
          color="bg-gradient-to-t from-blue-400 to-blue-500"
          valueKey="duration"
        />
        <BarChart
          data={weeklyData}
          title="Workouts Completed"
          color="bg-gradient-to-t from-purple-400 to-purple-500"
          valueKey="workouts"
        />
      </div>

      {/* Weekly Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Weekly Performance</h3>
            <p className="text-gray-600 text-sm">
              You're doing great! {stats.totalWorkouts > 0 ? `You've completed ${stats.totalWorkouts} workouts this week.` : 'Start logging activities to see your progress.'}
            </p>
          </div>
          <div className="text-4xl">🚀</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;