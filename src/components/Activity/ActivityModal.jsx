import React, { useState, useEffect } from 'react';
import { FaTimes, FaClock, FaFire, FaVolumeMute } from 'react-icons/fa';
import { calculateCalories, getActivityPreset } from '../../data/activityPresets';

const ActivityModal = ({ activity, onClose, onSave, isLoading }) => {
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [intensity, setIntensity] = useState('medium');
  const [calories, setCalories] = useState(0);
  const [useTimeRange, setUseTimeRange] = useState(false);

  useEffect(() => {
    // Auto-calculate calories when duration changes
    if (duration > 0) {
      const calculated = calculateCalories(duration, activity.name);
      setCalories(calculated);
    }
  }, [duration, activity.name]);

  // Calculate duration from time range
  useEffect(() => {
    if (useTimeRange && startTime && endTime) {
      const start = new Date(`2025-01-01 ${startTime}`);
      const end = new Date(`2025-01-01 ${endTime}`);
      const diff = Math.max(0, (end - start) / (1000 * 60)); // Convert to minutes
      setDuration(Math.round(diff));
    }
  }, [startTime, endTime, useTimeRange]);

  const handleSave = () => {
    if (duration <= 0) {
      alert('Please enter a valid duration');
      return;
    }

    onSave({
      type: activity.name,
      duration: Math.round(duration),
      calories: Math.round(calories),
      intensity,
      startTime: useTimeRange ? startTime : null,
      endTime: useTimeRange ? endTime : null
    });
  };

  const preset = getActivityPreset(activity.name);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full border border-green-500/20 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{activity.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Toggle between Duration and Time Range */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setUseTimeRange(false)}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
              !useTimeRange
                ? 'bg-green-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <FaClock className="inline mr-2" />
            Duration
          </button>
          <button
            onClick={() => setUseTimeRange(true)}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
              useTimeRange
                ? 'bg-green-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Time Range
          </button>
        </div>

        {/* Duration Input */}
        {!useTimeRange && (
          <div className="mb-6">
            <label className="block text-gray-300 font-semibold mb-3">
              Duration (minutes)
            </label>
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              placeholder="Enter duration in minutes"
            />
            <p className="text-xs text-gray-400 mt-2">
              Based on: {preset.caloriesPerMin} kcal/min
            </p>
          </div>
        )}

        {/* Time Range Input */}
        {useTimeRange && (
          <div className="mb-6 space-y-3">
            <div>
              <label className="block text-gray-300 font-semibold mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-semibold mb-2">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              />
            </div>
            {duration > 0 && (
              <p className="text-sm text-green-400 font-semibold">
                Duration: {Math.round(duration)} minutes
              </p>
            )}
          </div>
        )}

        {/* Intensity */}
        <div className="mb-6">
          <label className="block text-gray-300 font-semibold mb-3">
            <FaVolumeMute className="inline mr-2" />
            Intensity
          </label>
          <select
            value={intensity}
            onChange={(e) => setIntensity(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Calories */}
        <div className="mb-6">
          <label className="block text-gray-300 font-semibold mb-3">
            <FaFire className="inline mr-2 text-orange-500" />
            Calories Burned
          </label>
          <input
            type="number"
            min="0"
            value={calories}
            onChange={(e) => setCalories(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
            placeholder="Calories"
          />
          <p className="text-xs text-gray-400 mt-2">
            (Manually edit if needed)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-all"
          >
            {isLoading ? 'Saving...' : 'Save Activity'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityModal;
