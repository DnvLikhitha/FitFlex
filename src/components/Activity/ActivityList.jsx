import React from 'react';
import { FaPlus, FaRunning, FaWalking, FaBicycle, FaSwimmer, FaDumbbell, FaEdit, FaTrash, FaClock, FaFire } from 'react-icons/fa';

const ActivityList = ({ activities, onAddActivity, onEditActivity, onDeleteActivity }) => {
  const getActivityIcon = (type) => {
    const typeMap = {
      'running': FaRunning,
      'walking': FaWalking,
      'cycling': FaBicycle,
      'swimming': FaSwimmer,
      'weight training': FaDumbbell,
      'yoga': FaRunning,
      'hiit': FaDumbbell,
      'aerobics': FaRunning,
      'dance': FaRunning
    };
    const Icon = typeMap[type.toLowerCase()] || FaRunning;
    return Icon;
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏃‍♂️</div>
        <h3 className="text-xl font-semibold text-white mb-2">No activities yet</h3>
        <p className="text-gray-300 mb-6">Start tracking your fitness journey by logging your first activity!</p>
        <button
          onClick={onAddActivity}
          className="flex items-center justify-center mx-auto px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 font-semibold"
        >
          <FaPlus className="mr-2" />
          Log First Activity
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Your Activities</h2>
        <button
          onClick={onAddActivity}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 font-semibold"
        >
          <FaPlus className="mr-2" />
          Log Activity
        </button>
      </div>
      
      <div className="grid gap-4">
        {activities.map(activity => {
          const Icon = getActivityIcon(activity.type);
          return (
            <div 
              key={activity.id}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="text-white text-xl" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{activity.type}</h3>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold border border-green-500/30">
                        {activity.intensity || 'Medium'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-gray-400 text-sm mb-3">
                      <div className="flex items-center gap-1">
                        <FaClock className="text-blue-400" />
                        <span>{activity.duration} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaFire className="text-orange-400" />
                        <span>{activity.calories} cal</span>
                      </div>
                      <div className="text-gray-500">
                        {new Date(activity.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                    </div>
                    
                    {activity.notes && (
                      <p className="text-gray-400 text-sm">{activity.notes}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditActivity(activity)}
                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all"
                    title="Edit activity"
                  >
                    <FaEdit className="text-lg" />
                  </button>
                  <button
                    onClick={() => onDeleteActivity(activity.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Delete activity"
                  >
                    <FaTrash className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityList;