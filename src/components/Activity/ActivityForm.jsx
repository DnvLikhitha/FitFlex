import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSave, FaTimes } from 'react-icons/fa';

const ActivityForm = ({ activity, onSave, onCancel, isEdit = false }) => {
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
    try {
      const activityData = {
        ...formData,
        userId: 1, // Default user ID
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
      // Silently handle error for frontend-only mode
      // Create a fallback saved activity object and pass it up so parent can persist to localStorage
      const fallbackActivity = {
        id: isEdit && activity && activity.id ? activity.id : Date.now(),
        ...formData,
        userId: 1,
        duration: parseInt(formData.duration) || 0,
        calories: parseInt(formData.calories) || 0,
        steps: parseInt(formData.steps) || 0
      };

      toast.success(isEdit ? 'Activity updated locally (offline).' : 'Activity logged locally (offline).');
      onSave && onSave(fallbackActivity);
      setFormData({
        type: '',
        duration: '',
        calories: '',
        steps: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      console.log('Running in frontend-only mode');
    }
  };

  const activityTypes = ['Running', 'Walking', 'Cycling', 'Swimming', 'Weight Training', 'Yoga', 'HIIT', 'Other'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {isEdit ? 'Edit Activity' : 'Log New Activity'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Activity Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select activity type</option>
              {activityTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Calories Burned
            </label>
            <input
              type="number"
              name="calories"
              value={formData.calories}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Steps
            </label>
            <input
              type="number"
              name="steps"
              value={formData.steps}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Any additional notes about your workout..."
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FaSave className="mr-2" />
            {isEdit ? 'Update Activity' : 'Log Activity'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
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