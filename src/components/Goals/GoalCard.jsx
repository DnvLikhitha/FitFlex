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
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className={`text-2xl ${goal.completed ? 'text-green-500' : 'text-blue-500'}`}>
            {goal.completed ? <FaTrophy /> : <FaFlag />}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{goal.title}</h3>
            <div className="flex items-center text-gray-500 text-sm">
              <FaCalendar className="mr-1" />
              Due: {new Date(goal.deadline).toLocaleDateString()}
              <span className={`ml-3 ${daysRemaining < 7 ? 'text-red-500' : 'text-gray-500'}`}>
                ({daysRemaining} days left)
              </span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(goal)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Edit goal"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Delete goal"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress: {goal.current} / {goal.target} {goal.unit}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full ${getProgressColor(progress)} transition-all duration-500`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      </div>

      {!goal.completed && (
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => handleProgressUpdate(1)}
            className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm font-medium"
          >
            +1 {goal.unit}
          </button>
          <button
            onClick={() => handleProgressUpdate(5)}
            className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm font-medium"
          >
            +5 {goal.unit}
          </button>
          <button
            onClick={() => handleProgressUpdate(10)}
            className="flex-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 text-sm font-medium"
          >
            +10 {goal.unit}
          </button>
        </div>
      )}

      {goal.completed && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3 text-center">
          <FaTrophy className="text-green-500 text-2xl mx-auto mb-2" />
          <p className="text-green-700 font-semibold">Goal Completed! 🎉</p>
        </div>
      )}
    </div>
  );
};

export default GoalCard;