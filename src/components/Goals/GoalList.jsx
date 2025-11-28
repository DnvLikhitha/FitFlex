import React from 'react';
import GoalCard from './GoalCard';
import { FaPlus } from 'react-icons/fa';

const GoalList = ({ goals, onAddGoal, onEditGoal, onDeleteGoal, onUpdateProgress }) => {
  if (goals.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-xl font-semibold text-white mb-2">No goals yet</h3>
        <p className="text-gray-300 mb-6">Set your first fitness goal to start tracking your progress!</p>
        <button
          onClick={onAddGoal}
          className="flex items-center justify-center mx-auto px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 font-semibold"
        >
          <FaPlus className="mr-2" />
          Set First Goal
        </button>
      </div>
    );
  }

  const activeGoals = goals.filter(goal => !goal.completed);
  const completedGoals = goals.filter(goal => goal.completed);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Your Goals</h2>
        <button
          onClick={onAddGoal}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 font-semibold"
        >
          <FaPlus className="mr-2" />
          Set New Goal
        </button>
      </div>

      {activeGoals.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Active Goals ({activeGoals.length})</h3>
          <div className="grid gap-6">
            {activeGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={onEditGoal}
                onDelete={onDeleteGoal}
                onUpdateProgress={onUpdateProgress}
              />
            ))}
          </div>
        </div>
      )}

      {completedGoals.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Completed Goals ({completedGoals.length})</h3>
          <div className="grid gap-6">
            {completedGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={onEditGoal}
                onDelete={onDeleteGoal}
                onUpdateProgress={onUpdateProgress}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalList;