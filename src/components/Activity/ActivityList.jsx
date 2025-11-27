import React from 'react';
import ActivityCard from './ActivityCard';
import { FaPlus } from 'react-icons/fa';

const ActivityList = ({ activities, onAddActivity, onEditActivity, onDeleteActivity }) => {
  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏃‍♂️</div>
        <h3 className="text-xl font-semibold text-white mb-2">No activities yet</h3>
        <p className="text-gray-300 mb-6">Start tracking your fitness journey by logging your first activity!</p>
        <button
          onClick={onAddActivity}
          className="flex items-center justify-center mx-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 font-semibold"
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
          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 font-semibold"
        >
          <FaPlus className="mr-2" />
          Log Activity
        </button>
      </div>
      
      <div className="grid gap-6">
        {activities.map(activity => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onEdit={onEditActivity}
            onDelete={onDeleteActivity}
          />
        ))}
      </div>
    </div>
  );
};

export default ActivityList;