import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCalendar, FaFilter, FaRunning, FaFire, FaShoePrints, FaClock } from 'react-icons/fa';

const History = () => {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await axios.get('http://localhost:3001/activities');
      setActivities(response.data);
    } catch (error) {
      // Silently handle error for frontend-only mode
      setActivities([]);
      console.log('Running in frontend-only mode');
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = activities.filter(activity => {
    if (filter !== 'all' && activity.type.toLowerCase() !== filter.toLowerCase()) {
      return false;
    }
    
    if (dateRange.start && activity.date < dateRange.start) {
      return false;
    }
    
    if (dateRange.end && activity.date > dateRange.end) {
      return false;
    }
    
    return true;
  });

  const getActivityIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'running':
        return <FaRunning className="text-white" />;
      case 'walking':
        return <FaShoePrints className="text-white" />;
      case 'cycling':
        return <FaRunning className="text-white" />;
      case 'swimming':
        return <FaRunning className="text-white" />;
      case 'weight training':
        return <FaFire className="text-white" />;
      case 'yoga':
        return <FaRunning className="text-white" />;
      case 'hiit':
        return <FaFire className="text-white" />;
      default:
        return <FaRunning className="text-white" />;
    }
  };

  const getActivityStats = () => {
    const total = {
      calories: filteredActivities.reduce((sum, activity) => sum + activity.calories, 0),
      steps: filteredActivities.reduce((sum, activity) => sum + (activity.steps || 0), 0),
      duration: filteredActivities.reduce((sum, activity) => sum + activity.duration, 0),
      workouts: filteredActivities.length
    };

    const byType = filteredActivities.reduce((acc, activity) => {
      if (!acc[activity.type]) {
        acc[activity.type] = { count: 0, totalDuration: 0, totalCalories: 0 };
      }
      acc[activity.type].count++;
      acc[activity.type].totalDuration += activity.duration;
      acc[activity.type].totalCalories += activity.calories;
      return acc;
    }, {});

    return { total, byType };
  };

  const stats = getActivityStats();

  const activityTypes = [...new Set(activities.map(activity => activity.type))];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden h-48 bg-gradient-to-r from-gray-900 via-green-900 to-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
        <div className="relative z-10 h-full flex items-center px-8">
          <div>
            <h1 className="text-5xl font-black text-white mb-2">Workout History</h1>
            <p className="text-xl text-gray-300">Review your journey, celebrate your progress</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-green-500/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <FaFilter className="text-green-400" />
            <span className="font-medium text-white">Filter by:</span>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all" className="bg-gray-800">All Activities</option>
              {activityTypes.map(type => (
                <option key={type} value={type} className="bg-gray-800">{type}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <FaCalendar className="text-green-400" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Start Date"
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="End Date"
            />
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-center border border-green-500/20 hover:border-green-500/40 transition-all hover:scale-105 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <FaFire className="text-white text-2xl" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.total.calories}</div>
          <div className="text-sm text-gray-400">Total Calories</div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-center border border-green-500/20 hover:border-green-500/40 transition-all hover:scale-105 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <FaShoePrints className="text-white text-2xl" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.total.steps.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Total Steps</div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-center border border-green-500/20 hover:border-green-500/40 transition-all hover:scale-105 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <FaClock className="text-white text-2xl" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.total.duration}</div>
          <div className="text-sm text-gray-400">Total Minutes</div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-center border border-green-500/20 hover:border-green-500/40 transition-all hover:scale-105 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <FaRunning className="text-white text-2xl" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.total.workouts}</div>
          <div className="text-sm text-gray-400">Total Workouts</div>
        </div>
      </div>

      {/* Activity History */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-green-500/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full mr-3"></div>
          Activity History ({filteredActivities.length} workouts)
        </h2>
        
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">No activities found</h3>
            <p className="text-gray-400">Try adjusting your filters to see more results.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredActivities
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map(activity => (
                <div key={activity.id} className="bg-white/5 border border-green-500/10 rounded-xl p-5 hover:bg-white/10 hover:border-green-500/30 transition-all duration-300">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-4">
                      <div className={'p-4 rounded-xl ' + (
                        activity.type === 'Running' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                        activity.type === 'Weight Training' ? 'bg-gradient-to-br from-red-500 to-orange-600' :
                        activity.type === 'Yoga' ? 'bg-gradient-to-br from-purple-500 to-pink-600' :
                        'bg-gradient-to-br from-blue-500 to-cyan-600'
                      )}>
                        <div className="text-white text-2xl">
                          {getActivityIcon(activity.type)}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg">{activity.type}</h3>
                        <p className="text-gray-400 text-sm">
                          {new Date(activity.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        {activity.notes && (
                          <p className="text-gray-300 text-sm mt-1">{activity.notes}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex gap-6 text-center">
                        <div>
                          <div className="font-bold text-white text-lg">{activity.duration}</div>
                          <div className="text-gray-400 text-xs">minutes</div>
                        </div>
                        <div>
                          <div className="font-bold text-white text-lg">{activity.calories}</div>
                          <div className="text-gray-400 text-xs">calories</div>
                        </div>
                        <div>
                          <div className="font-bold text-white text-lg">{activity.steps?.toLocaleString() || 0}</div>
                          <div className="text-gray-400 text-xs">steps</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;