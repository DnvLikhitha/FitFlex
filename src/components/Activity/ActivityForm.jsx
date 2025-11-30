import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import ActivityCard from './ActivityCard';
import ActivityModal from './ActivityModal';
import { ACTIVITY_TYPES } from '../../data/activityTypes';
import { saveActivity, getTodayActivities, getRecommendedActivities } from '../../data/activityService';

const ActivityForm = ({ onSave, onCancel }) => {
  const { currentUser } = useAuth();
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [todayActivities, setTodayActivities] = useState([]);
  const [recommendedActivities, setRecommendedActivities] = useState([]);

  useEffect(() => {
    if (currentUser) {
      loadTodayActivities();
      loadRecommendations();
    }
  }, [currentUser]);

  const loadTodayActivities = async () => {
    try {
      const activities = await getTodayActivities(currentUser.id);
      setTodayActivities(activities);
    } catch (error) {
      console.error('Error loading today activities:', error);
    }
  };

  const loadRecommendations = async () => {
    try {
      const recommendations = await getRecommendedActivities(currentUser.id, 'general');
      setRecommendedActivities(recommendations);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      setRecommendedActivities(['walking', 'cycling', 'yoga']);
    }
  };

  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
    setShowModal(true);
  };

  const handleModalSave = async (activityData) => {
    if (!currentUser) {
      toast.error('Please log in to add activities');
      return;
    }

    setIsLoading(true);
    try {
      await saveActivity(currentUser.id, activityData);
      toast.success(`${activityData.type} logged successfully!`);
      setShowModal(false);
      setSelectedActivity(null);
      loadTodayActivities();
      onSave && onSave();
    } catch (error) {
      toast.error('Failed to save activity');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show recommendations if no activities logged today
  const showRecommendations = todayActivities.length === 0 && recommendedActivities.length > 0;

  return (
    <div className="space-y-8">
      {/* Recommendations */}
      {showRecommendations && (
        <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-green-500/30 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">✨ Get Started With</h3>
          <div className="grid grid-cols-3 gap-3">
            {recommendedActivities.map((activityId) => {
              const activity = ACTIVITY_TYPES.find(a => a.id === activityId);
              if (!activity) return null;
              return (
                <button
                  key={activityId}
                  onClick={() => handleActivitySelect(activity)}
                  className="relative group overflow-hidden rounded-xl h-20 transition-all hover:scale-105 hover:shadow-lg"
                >
                  <img
                    src={activity.image}
                    alt={activity.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${activity.color} opacity-60`} />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all" />
                  <div className="relative h-full flex items-center justify-center">
                    <p className="text-white font-bold text-sm text-center px-2">{activity.name}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Activity Grid */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <FaPlus className="mr-3 text-green-400" />
          Select Activity
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {ACTIVITY_TYPES.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              isSelected={selectedActivity?.id === activity.id}
              onClick={() => handleActivitySelect(activity)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedActivity && (
        <ActivityModal
          activity={selectedActivity}
          onClose={() => {
            setShowModal(false);
            setSelectedActivity(null);
          }}
          onSave={handleModalSave}
          isLoading={isLoading}
        />
      )}

      {/* Cancel Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
};
export default ActivityForm;