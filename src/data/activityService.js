import axios from 'axios';
import { calculateCalories, getActivityPreset } from './activityPresets';

const API_BASE = 'http://localhost:3001';

// Get today's activities for a user
export const getTodayActivities = async (userId) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const response = await axios.get(`${API_BASE}/activities?userId=${userId}&date=${today}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching today activities:', error);
    return [];
  }
};

// Get all activities for a user (for history/recommendations)
export const getUserActivities = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE}/activities?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user activities:', error);
    return [];
  }
};

// Save or merge activity
export const saveActivity = async (userId, activityData) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const todayActivities = await getTodayActivities(userId);

    // Check if activity of same type already exists today
    const existingActivity = todayActivities.find(
      a => a.type.toLowerCase() === activityData.type.toLowerCase()
    );

    if (existingActivity) {
      // Merge: update duration and calories
      const newDuration = (existingActivity.duration || 0) + (activityData.duration || 0);
      const newCalories = calculateCalories(newDuration, activityData.type);

      const updatedActivity = {
        ...existingActivity,
        duration: newDuration,
        calories: newCalories,
        intensity: activityData.intensity || existingActivity.intensity,
        notes: `${existingActivity.notes || ''} + ${activityData.notes || ''}`.trim()
      };

      const response = await axios.put(
        `${API_BASE}/activities/${existingActivity.id}`,
        updatedActivity
      );
      return response.data;
    } else {
      // Create new entry
      const newActivity = {
        userId,
        type: activityData.type,
        duration: activityData.duration || 0,
        calories: activityData.calories || calculateCalories(activityData.duration || 0, activityData.type),
        intensity: activityData.intensity || 'medium',
        steps: activityData.steps || 0,
        date: today,
        notes: activityData.notes || ''
      };

      const response = await axios.post(`${API_BASE}/activities`, newActivity);
      return response.data;
    }
  } catch (error) {
    console.error('Error saving activity:', error);
    throw error;
  }
};

// Get recommended activities based on user history and goals
export const getRecommendedActivities = async (userId, userGoal = null) => {
  try {
    const activities = await getUserActivities(userId);

    // Base recommendations by goal
    const goalRecommendations = {
      'weight loss': ['walking', 'running', 'cycling'],
      endurance: ['running', 'cycling', 'swimming'],
      strength: ['weight training', 'hiit', 'aerobics'],
      flexibility: ['yoga', 'dance', 'aerobics'],
      general: ['walking', 'cycling', 'yoga']
    };

    const recommendations = goalRecommendations[userGoal?.toLowerCase()] || goalRecommendations.general;

    // If user has activity history, include their favorite activities
    if (activities.length > 0) {
      const activityTypes = activities.map(a => a.type.toLowerCase());
      const favoriteActivity = Object.keys(activityTypes).reduce((a, b) =>
        activityTypes.filter(v => v === a).length > activityTypes.filter(v => v === b).length ? a : b
      );

      // Ensure variety: don't recommend same activity twice
      if (!recommendations.includes(favoriteActivity)) {
        recommendations[recommendations.length - 1] = favoriteActivity;
      }
    }

    return recommendations.slice(0, 3); // Return top 3 recommendations
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return ['walking', 'cycling', 'yoga'];
  }
};
