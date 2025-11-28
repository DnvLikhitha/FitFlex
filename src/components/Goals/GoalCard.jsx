import React from 'react';
import { FaFlag, FaCalendar, FaEdit, FaTrash, FaTrophy } from 'react-icons/fa';

const GoalCard = ({ goal, onEdit, onDelete, onUpdateProgress }) => {
  const progress = (goal.current / goal.target) * 100;
  const daysRemaining = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-green-400';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const handleProgressUpdate = (increment) => {
    const newCurrent = Math.min(goal.current + increment, goal.target);
    onUpdateProgress(goal.id, newCurrent);
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-md p-6 hover:shadow-green-500/20 hover-lift transition-smooth border border-gray-700/50 hover:border-green-500/40 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className={`text-2xl ${goal.completed ? 'text-green-500 animate-bounce-slow' : 'text-blue-500'} group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
            {goal.completed ? <FaTrophy /> : <FaFlag />}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white group-hover:text-green-400 transition-colors duration-300">{goal.title}</h3>
            <div className="flex items-center text-gray-300 text-sm">
              <FaCalendar className="mr-1" />
              Due: {new Date(goal.deadline).toLocaleDateString()}
              <span className={`ml-3 ${daysRemaining < 7 ? 'text-red-400 animate-pulse' : 'text-gray-300'}`}>
                ({daysRemaining} days left)
              </span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(goal)}
            className="p-2 text-green-400 hover:bg-green-500/20 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-12"
            title="Edit goal"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="p-2 text-red-400 hover:bg-red-500/20 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-12"
            title="Delete goal"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-300 mb-2">
          <span>Progress: {goal.current} / {goal.target} {goal.unit}</span>
          <span className="font-bold text-white">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden relative">
          <div
            className={`h-3 rounded-full ${getProgressColor(progress)} transition-all duration-500 relative overflow-hidden`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          >
            <div className="absolute inset-0 shimmer"></div>
          </div>
        </div>
      </div>

      {!goal.completed && (
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => handleProgressUpdate(1)}
            className="flex-1 px-3 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 hover:scale-105 text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20"
          >
            +1 {goal.unit}
          </button>
          <button
            onClick={() => handleProgressUpdate(5)}
            className="flex-1 px-3 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 hover:scale-105 text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20"
          >
            +5 {goal.unit}
          </button>
          <button
            onClick={() => handleProgressUpdate(10)}
            className="flex-1 px-3 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 hover:scale-105 text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20"
          >
            +10 {goal.unit}
          </button>
        </div>
      )}

      {goal.completed && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center animate-zoom-in">
          <FaTrophy className="text-green-400 text-2xl mx-auto mb-2 animate-bounce-slow" />
          <p className="text-green-400 font-semibold">Goal Completed! 🎉</p>
        </div>
      )}
    </div>
  );
};

export default GoalCard;