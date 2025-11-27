import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import GoalForm from '../components/Goals/GoalForm';
import GoalList from '../components/Goals/GoalList';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await axios.get('http://localhost:3001/goals');
      setGoals(response.data);
    } catch (error) {
      // Silently handle error for frontend-only mode
      setGoals([]);
      console.log('Running in frontend-only mode');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = () => {
    setEditingGoal(null);
    setShowForm(true);
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleDeleteGoal = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await axios.delete(`http://localhost:3001/goals/${goalId}`);
        toast.success('Goal deleted successfully!');
        fetchGoals();
      } catch (error) {
        // Silently handle error for frontend-only mode
        console.log('Running in frontend-only mode');
      }
    }
  };

  const handleUpdateProgress = async (goalId, newCurrent) => {
    try {
      const goal = goals.find(g => g.id === goalId);
      const updatedGoal = {
        ...goal,
        current: newCurrent,
        completed: newCurrent >= goal.target
      };
      
      await axios.put(`http://localhost:3001/goals/${goalId}`, updatedGoal);
      
      if (newCurrent >= goal.target && !goal.completed) {
        toast.success('🎉 Goal completed! Congratulations!');
      }
      
      fetchGoals();
    } catch (error) {
      // Silently handle error for frontend-only mode
      console.log('Running in frontend-only mode');
    }
  };

  const handleSaveGoal = () => {
    setShowForm(false);
    setEditingGoal(null);
    fetchGoals();
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingGoal(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Goals</h1>
          <p className="text-gray-300">Set and track your fitness goals</p>
        </div>
      </div>

      {showForm ? (
        <GoalForm
          goal={editingGoal}
          onSave={handleSaveGoal}
          onCancel={handleCancelForm}
          isEdit={!!editingGoal}
        />
      ) : (
        <GoalList
          goals={goals}
          onAddGoal={handleAddGoal}
          onEditGoal={handleEditGoal}
          onDeleteGoal={handleDeleteGoal}
          onUpdateProgress={handleUpdateProgress}
        />
      )}
    </div>
  );
};

export default Goals;