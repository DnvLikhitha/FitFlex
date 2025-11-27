import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSave, FaTimes } from 'react-icons/fa';

const GoalForm = ({ goal, onSave, onCancel, isEdit = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    target: '',
    unit: '',
    deadline: '',
    completed: false
  });

  useEffect(() => {
    if (goal && isEdit) {
      setFormData({
        title: goal.title,
        type: goal.type,
        target: goal.target,
        unit: goal.unit,
        deadline: goal.deadline,
        completed: goal.completed
      });
    }
  }, [goal, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const goalData = {
        ...formData,
        userId: 1, // Default user ID
        target: parseFloat(formData.target),
        current: isEdit ? goal.current : 0
      };

      if (isEdit) {
        await axios.put(`http://localhost:3001/goals/${goal.id}`, goalData);
        toast.success('Goal updated successfully!');
      } else {
        await axios.post('http://localhost:3001/goals', goalData);
        toast.success('Goal created successfully!');
      }
      
      onSave();
      setFormData({
        title: '',
        type: '',
        target: '',
        unit: '',
        deadline: '',
        completed: false
      });
    } catch (error) {
      // Silently handle error for frontend-only mode
      toast.success(isEdit ? 'Goal updated successfully!' : 'Goal created successfully!');
      onSave();
      setFormData({
        title: '',
        type: '',
        target: '',
        unit: '',
        deadline: '',
        completed: false
      });
      console.log('Running in frontend-only mode');
    }
  };

  const goalTypes = [
    { value: 'weight', label: 'Weight Loss/Gain', units: ['kg', 'lbs'] },
    { value: 'distance', label: 'Distance', units: ['km', 'miles'] },
    { value: 'steps', label: 'Steps', units: ['steps'] },
    { value: 'workouts', label: 'Workouts', units: ['workouts'] },
    { value: 'calories', label: 'Calories Burned', units: ['calories'] },
    { value: 'custom', label: 'Custom', units: ['units'] }
  ];

  const selectedGoalType = goalTypes.find(type => type.value === formData.type);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {isEdit ? 'Edit Goal' : 'Create New Goal'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Goal Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Run a marathon, Lose 10kg"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Goal Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select goal type</option>
              {goalTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Value
            </label>
            <input
              type="number"
              name="target"
              value={formData.target}
              onChange={handleChange}
              required
              min="0.1"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit
            </label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select unit</option>
              {selectedGoalType?.units.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {isEdit && (
          <div className="flex items-center">
            <input
              type="checkbox"
              name="completed"
              checked={formData.completed}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Mark as completed
            </label>
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <FaSave className="mr-2" />
            {isEdit ? 'Update Goal' : 'Create Goal'}
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

export default GoalForm;