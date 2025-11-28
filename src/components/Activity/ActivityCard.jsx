import React from 'react';
import { FaRunning, FaFire, FaShoePrints, FaClock, FaCalendar, FaEdit, FaTrash } from 'react-icons/fa';

const ActivityCard = ({ activity, onEdit, onDelete }) => {
  const getActivityIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'running':
        return <FaRunning className="text-green-500" />;
      case 'walking':
        return <FaShoePrints className="text-blue-500" />;
      case 'cycling':
        return <FaRunning className="text-purple-500" />;
      case 'swimming':
        return <FaRunning className="text-cyan-500" />;
      case 'weight training':
        return <FaFire className="text-red-500" />;
      case 'yoga':
        return <FaRunning className="text-indigo-500" />;
      case 'hiit':
        return <FaFire className="text-orange-500" />;
      default:
        return <FaRunning className="text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-md p-6 hover:shadow-green-500/20 hover-lift transition-smooth border border-gray-700/50 hover:border-green-500/40 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            {getActivityIcon(activity.type)}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white group-hover:text-green-400 transition-colors duration-300">{activity.type}</h3>
            <div className="flex items-center text-gray-300 text-sm">
              <FaCalendar className="mr-1" />
              {formatDate(activity.date)}
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(activity)}
            className="p-2 text-green-400 hover:bg-green-500/20 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-12"
            title="Edit activity"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(activity.id)}
            className="p-2 text-red-400 hover:bg-red-500/20 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-12"
            title="Delete activity"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center bg-gray-700/20 rounded-lg p-3 hover:bg-green-500/10 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-center text-gray-400 mb-1">
            <FaClock className="mr-1" />
          </div>
          <div className="text-lg font-semibold text-white">{activity.duration}</div>
          <div className="text-sm text-gray-400">minutes</div>
        </div>
        
        <div className="text-center bg-gray-700/20 rounded-lg p-3 hover:bg-orange-500/10 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-center text-gray-400 mb-1">
            <FaFire className="mr-1" />
          </div>
          <div className="text-lg font-semibold text-white">{activity.calories}</div>
          <div className="text-sm text-gray-400">calories</div>
        </div>
        
        <div className="text-center bg-gray-700/20 rounded-lg p-3 hover:bg-blue-500/10 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-center text-gray-400 mb-1">
            <FaShoePrints className="mr-1" />
          </div>
          <div className="text-lg font-semibold text-white">{activity.steps?.toLocaleString() || '0'}</div>
          <div className="text-sm text-gray-400">steps</div>
        </div>
        
        <div className="text-center bg-gray-700/20 rounded-lg p-3 hover:bg-purple-500/10 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-center text-gray-400 mb-1">
            <FaRunning className="mr-1" />
          </div>
          <div className="text-lg font-semibold text-white">
            {activity.steps ? Math.round(activity.steps / 2000) : 0}
          </div>
          <div className="text-sm text-gray-400">miles</div>
        </div>
      </div>

      {activity.notes && (
        <div className="border-t border-gray-700 pt-3">
          <p className="text-gray-300 text-sm">{activity.notes}</p>
        </div>
      )}
    </div>
  );
};

export default ActivityCard;