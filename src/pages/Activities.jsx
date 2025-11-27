import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ActivityForm from '../components/Activity/ActivityForm';
import ActivityList from '../components/Activity/ActivityList';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await axios.get('http://localhost:3001/activities');
      setActivities(response.data);
      // keep local cache in sync
      try { localStorage.setItem('activities', JSON.stringify(response.data)); } catch (e) {}
    } catch (error) {
      // Silently handle error for frontend-only mode - load from localStorage if available
      const stored = localStorage.getItem('activities');
      if (stored) {
        try {
          setActivities(JSON.parse(stored));
        } catch (e) {
          setActivities([]);
        }
      } else {
        setActivities([]);
      }
      console.log('Running in frontend-only mode');
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = () => {
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

  const handleSaveActivity = (savedActivity) => {
    // Called after ActivityForm posts/puts (or falls back). If parent receives savedActivity,
    // persist it to local state and localStorage so frontend-only mode works.
    setShowForm(false);
    setEditingActivity(null);

    if (savedActivity) {
      setActivities(prev => {
        const exists = prev.find(a => a.id === savedActivity.id);
        let next;
        if (exists) {
          next = prev.map(a => (a.id === savedActivity.id ? savedActivity : a));
        } else {
          next = [...prev, savedActivity];
        }
        try { localStorage.setItem('activities', JSON.stringify(next)); } catch (e) {}
        return next;
      });
    } else {
      fetchActivities();
    }
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Activities</h1>
          <p className="text-gray-300">Track and manage your workout activities</p>
        </div>
      </div>

      {showForm ? (
        <ActivityForm
          activity={editingActivity}
          onSave={handleSaveActivity}
          onCancel={handleCancelForm}
          isEdit={!!editingActivity}
        />
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