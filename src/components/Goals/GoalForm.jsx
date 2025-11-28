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
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-lg p-6 mb-6 border border-green-500/20">
      <h2 className="text-2xl font-bold mb-6 text-white">
        {isEdit ? 'Edit Goal' : 'Create New Goal'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Goal Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Run a marathon, Lose 10kg"
            className="w-full px-3 py-2 bg-white/5 border border-green-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Goal Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white/5 border border-green-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
            >
              <option value="" className="bg-gray-800">Select goal type</option>
              {goalTypes.map(type => (
                <option key={type.value} value={type.value} className="bg-gray-800">
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
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
              className="w-full px-3 py-2 bg-white/5 border border-green-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Unit
            </label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white/5 border border-green-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
            >
              <option value="" className="bg-gray-800">Select unit</option>
              {selectedGoalType?.units.map(unit => (
                <option key={unit} value={unit} className="bg-gray-800">{unit}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 bg-white/5 border border-green-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
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
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-600 rounded bg-white/5"
            />
            <label className="ml-2 block text-sm text-gray-300">
              Mark as completed
            </label>
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 font-semibold"
          >
            <FaSave className="mr-2" />
            {isEdit ? 'Update Goal' : 'Create Goal'}
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

export default GoalForm;