import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ActivityForm from '../components/Activity/ActivityForm';
import ActivityList from '../components/Activity/ActivityList';
import { FaRunning, FaBolt, FaFire, FaTrophy } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Activities = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchActivities();
    } else {
      setActivities([]);
      setLoading(false);
    }
  }, [currentUser]);

  const fetchActivities = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/activities?userId=${currentUser.id}`);
      setActivities(response.data);
    } catch (error) {
      toast.error('Failed to load activities');
      console.error('Error fetching activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = () => {
    if (!currentUser) {
      toast.info('Please sign in to log activities');
      navigate('/login');
      return;
    }
    setEditingActivity(null);
    setShowForm(true);
  };

  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
    setShowForm(true);
  };

  const handleDeleteActivity = async (activityId) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await axios.delete(`http://localhost:3001/activities/${activityId}`);
        toast.success('Activity deleted successfully!');
        fetchActivities();
      } catch (error) {
        // Silently handle error for frontend-only mode
        // Remove from local state and localStorage as a fallback
        const next = activities.filter(a => a.id !== activityId);
        setActivities(next);
        try { localStorage.setItem('activities', JSON.stringify(next)); } catch (e) {}
        toast.success('Activity deleted locally (offline).');
        console.log('Running in frontend-only mode');
      }
    }
  };

  const handleSaveActivity = () => {
    setShowForm(false);
    setEditingActivity(null);
    fetchActivities();
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingActivity(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const calculateStats = () => {
    const total = {
      calories: activities.reduce((sum, a) => sum + a.calories, 0),
      duration: activities.reduce((sum, a) => sum + a.duration, 0),
      workouts: activities.length,
      steps: activities.reduce((sum, a) => sum + (a.steps || 0), 0)
    };

    const byType = activities.reduce((acc, a) => {
      acc[a.type] = (acc[a.type] || 0) + 1;
      return acc;
    }, {});

    return { total, byType };
  };

  const stats = calculateStats();
  const topActivity = Object.entries(stats.byType).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="space-y-6">
      {/* Header with Hero Image */}
      <div className="relative rounded-2xl overflow-hidden h-48 bg-gradient-to-r from-gray-900 via-green-900 to-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/3076509/pexels-photo-3076509.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
        <div className="relative z-10 h-full flex items-center px-8">
          <div>
            <h1 className="text-5xl font-black text-white mb-2">Your Activities</h1>
            <p className="text-xl text-gray-300">Track every workout, conquer every goal</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-green-500/20 hover:border-green-500/40 transition-all group hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Workouts</span>
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <FaRunning className="text-white" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{stats.total.workouts}</div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-green-500/20 hover:border-green-500/40 transition-all group hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Active Minutes</span>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <FaBolt className="text-white" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{stats.total.duration}</div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-green-500/20 hover:border-green-500/40 transition-all group hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Calories Burned</span>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <FaFire className="text-white" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{stats.total.calories}</div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-green-500/20 hover:border-green-500/40 transition-all group hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Top Activity</span>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <FaTrophy className="text-white" />
            </div>
          </div>
          <div className="text-xl font-bold text-white truncate">{topActivity ? topActivity[0] : 'None'}</div>
        </div>
      </div>

      {/* Activity Form or List */}
      {showForm ? (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-green-500/20 shadow-lg">
          <ActivityForm
            activity={editingActivity}
            onSave={handleSaveActivity}
            onCancel={handleCancelForm}
            isEdit={!!editingActivity}
          />
        </div>
      ) : (
        <ActivityList
          activities={activities}
          onAddActivity={handleAddActivity}
          onEditActivity={handleEditActivity}
          onDeleteActivity={handleDeleteActivity}
        />
      )}
    </div>
  );
};

export default Activities;