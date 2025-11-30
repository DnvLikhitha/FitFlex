import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import GoalForm from '../components/Goals/GoalForm';
import GoalList from '../components/Goals/GoalList';
import { FaBullseye, FaTrophy, FaFire, FaChartLine } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Goals = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchGoals();
    } else {
      setGoals([]);
      setLoading(false);
    }
  }, [currentUser]);

  const fetchGoals = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/goals?userId=${currentUser.id}`);
      setGoals(response.data);
    } catch (error) {
      toast.error('Failed to load goals');
      console.error('Error fetching goals:', error);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = () => {
    if (!currentUser) {
      toast.info('Please sign in to create goals');
      navigate('/login');
      return;
    }
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

  const calculateGoalStats = () => {
    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.completed === true).length;
    const activeGoals = totalGoals - completedGoals;
    
    // Calculate average progress - use current field if available, fallback to progress
    const avgProgress = totalGoals > 0 
      ? goals.reduce((sum, g) => {
          const currentValue = g.current !== undefined ? g.current : (g.progress || 0);
          const targetValue = g.target || 1;
          return sum + (currentValue / targetValue) * 100;
        }, 0) / totalGoals 
      : 0;

    return { totalGoals, completedGoals, activeGoals, avgProgress: Math.round(Math.min(avgProgress, 100)) };
  };

  const stats = calculateGoalStats();

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden h-48 bg-gradient-to-r from-gray-900 via-green-900 to-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/3490348/pexels-photo-3490348.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
        <div className="relative z-10 h-full flex items-center px-8">
          <div>
            <h1 className="text-5xl font-black text-white mb-2">Your Goals</h1>
            <p className="text-xl text-gray-300">Set targets, track progress, achieve greatness</p>
          </div>
        </div>
      </div>

      {/* Goal Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-green-500/20 hover:border-green-500/40 transition-all group hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Goals</span>
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <FaBullseye className="text-white" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{stats.totalGoals}</div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-green-500/20 hover:border-green-500/40 transition-all group hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Completed</span>
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <FaTrophy className="text-white" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{stats.completedGoals}</div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-green-500/20 hover:border-green-500/40 transition-all group hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Active Goals</span>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <FaFire className="text-white" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{stats.activeGoals}</div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-green-500/20 hover:border-green-500/40 transition-all group hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Avg Progress</span>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <FaChartLine className="text-white" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{stats.avgProgress}%</div>
        </div>
      </div>

      {/* Motivational Quote */}
      {stats.activeGoals > 0 && (
        <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl">💪</div>
            <div>
              <p className="text-lg font-semibold text-white">Keep pushing forward!</p>
              <p className="text-gray-300">You have {stats.activeGoals} active {stats.activeGoals === 1 ? 'goal' : 'goals'}. Stay focused and achieve them!</p>
            </div>
          </div>
        </div>
      )}

      {/* Goal Form or List */}
      {showForm ? (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-green-500/20 shadow-lg">
          <GoalForm
            goal={editingGoal}
            onSave={handleSaveGoal}
            onCancel={handleCancelForm}
            isEdit={!!editingGoal}
          />
        </div>
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