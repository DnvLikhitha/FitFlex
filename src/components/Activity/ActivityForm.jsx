import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSave, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const ActivityForm = ({ activity, onSave, onCancel, isEdit = false }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    type: '',
    duration: '',
    calories: '',
    steps: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (activity && isEdit) {
      setFormData({
        type: activity.type,
        duration: activity.duration,
        calories: activity.calories,
        steps: activity.steps,
        date: activity.date,
        notes: activity.notes
      });
    }
  }, [activity, isEdit]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Please log in to add activities');
      return;
    }
    
    try {
      const activityData = {
        ...formData,
        userId: currentUser.id,
        duration: parseInt(formData.duration),
        calories: parseInt(formData.calories),
        steps: parseInt(formData.steps)
      };

      let savedActivity = null;

      if (isEdit) {
        const res = await axios.put(`http://localhost:3001/activities/${activity.id}`, activityData);
        savedActivity = res.data;
        toast.success('Activity updated successfully!');
      } else {
        const res = await axios.post('http://localhost:3001/activities', activityData);
        savedActivity = res.data;
        toast.success('Activity logged successfully!');
      }

      onSave && onSave(savedActivity);
      setFormData({
        type: '',
        duration: '',
        calories: '',
        steps: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    } catch (error) {
      toast.error('Failed to save activity');
      console.error('Error saving activity:', error);
    }
  };

  const activityTypes = ['Running', 'Walking', 'Cycling', 'Swimming', 'Weight Training', 'Yoga', 'HIIT', 'Other'];

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-lg p-6 mb-6 border border-green-500/20">
      <h2 className="text-2xl font-bold mb-6 text-white">
        {isEdit ? 'Edit Activity' : 'Log New Activity'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Activity Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white/5 border border-green-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
            >
              <option value="" className="bg-gray-800">Select activity type</option>
              {activityTypes.map(type => (
                <option key={type} value={type} className="bg-gray-800">{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white/5 border border-green-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 bg-white/5 border border-green-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Calories Burned
            </label>
            <input
              type="number"
              name="calories"
              value={formData.calories}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 bg-white/5 border border-green-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Steps
            </label>
            <input
              type="number"
              name="steps"
              value={formData.steps}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 bg-white/5 border border-green-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 bg-white/5 border border-green-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-500"
            placeholder="Any additional notes about your workout..."
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 font-semibold"
          >
            <FaSave className="mr-2" />
            {isEdit ? 'Update Activity' : 'Log Activity'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 font-semibold"
          >
            <FaTimes className="mr-2" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActivityForm;