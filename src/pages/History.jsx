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
      <div>
        <h1 className="text-3xl font-bold text-white">Workout History</h1>
        <p className="text-gray-300">View your complete workout history and statistics</p>
      </div>

      {/* Filters */}
      <div className="glass-dark rounded-2xl p-6 border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <FaFilter className="text-blue-400" />
            <span className="font-medium text-white">Filter by:</span>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all" className="bg-gray-800">All Activities</option>
              {activityTypes.map(type => (
                <option key={type} value={type} className="bg-gray-800">{type}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <FaCalendar className="text-purple-400" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Start Date"
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="End Date"
            />
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-dark rounded-2xl p-6 text-center border border-white/10 card-hover">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mx-auto mb-3">
            <FaFire className="text-white text-2xl" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.total.calories}</div>
          <div className="text-sm text-gray-400">Total Calories</div>
        </div>
        
        <div className="glass-dark rounded-2xl p-6 text-center border border-white/10 card-hover">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-3">
            <FaShoePrints className="text-white text-2xl" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.total.steps.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Total Steps</div>
        </div>
        
        <div className="glass-dark rounded-2xl p-6 text-center border border-white/10 card-hover">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-3">
            <FaClock className="text-white text-2xl" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.total.duration}</div>
          <div className="text-sm text-gray-400">Total Minutes</div>
        </div>
        
        <div className="glass-dark rounded-2xl p-6 text-center border border-white/10 card-hover">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-3">
            <FaRunning className="text-white text-2xl" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.total.workouts}</div>
          <div className="text-sm text-gray-400">Total Workouts</div>
        </div>
      </div>

      {/* Activity History */}
      <div className="glass-dark rounded-2xl p-6 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
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
                <div key={activity.id} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-300 card-hover">
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