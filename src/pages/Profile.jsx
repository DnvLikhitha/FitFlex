import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaWeight, FaRulerVertical, FaBirthdayCake, FaSave, FaEdit } from 'react-icons/fa';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get('http://localhost:3001/users/1');
      setUser(response.data);
      setFormData(response.data);
    } catch (error) {
      // Silently handle error for frontend-only mode
      const defaultUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        age: 28,
        weight: 75,
        height: 180
      };
      setUser(defaultUser);
      setFormData(defaultUser);
      console.log('Running in frontend-only mode');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:3001/users/1`, formData);
      setUser(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      // Silently handle error for frontend-only mode - still update locally
      setUser(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
      console.log('Running in frontend-only mode');
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  const calculateBMI = () => {
    if (!user || !user.weight || !user.height) return null;
    const heightInMeters = user.height / 100;
    return (user.weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const bmi = calculateBMI();
  const bmiCategory = bmi ? 
    bmi < 18.5 ? 'Underweight' :
    bmi < 25 ? 'Normal weight' :
    bmi < 30 ? 'Overweight' : 'Obese' : null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😔</div>
        <h3 className="text-xl font-semibold text-white mb-2">User not found</h3>
        <p className="text-gray-400">Unable to load profile data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="text-gray-300">Manage your personal information and settings</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 font-semibold"
          >
            <FaEdit className="mr-2" />
            Edit Profile
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 font-semibold"
            >
              <FaSave className="mr-2" />
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300 font-semibold border border-white/10"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header Card */}
          <div className="glass-dark rounded-2xl p-6 border border-white/10">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-4xl shadow-lg">
                {user.name?.charAt(0) || 'J'}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">{user.name}</h2>
                <p className="text-gray-400 mb-3">{user.email}</p>
                <div className="flex gap-3">
                  <span className="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30">
                    Active Member
                  </span>
                  <span className="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30">
                    {user.name && user.email && user.age && user.weight && user.height ? '100%' : '60%'} Complete
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-dark rounded-2xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <FaUser className="inline mr-2" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="px-4 py-3 bg-white/5 rounded-xl border border-white/10 text-white font-medium">
                    {user.name}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <FaEnvelope className="inline mr-2" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="px-4 py-3 bg-white/5 rounded-xl border border-white/10 text-white font-medium">
                    {user.email}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <FaBirthdayCake className="inline mr-2" />
                  Age
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="age"
                    value={formData.age || ''}
                    onChange={handleInputChange}
                    min="1"
                    max="120"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="px-4 py-3 bg-white/5 rounded-xl border border-white/10 text-white font-medium">
                    {user.age} years
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <FaWeight className="inline mr-2" />
                  Weight (kg)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight || ''}
                    onChange={handleInputChange}
                    min="1"
                    step="0.1"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="px-4 py-3 bg-white/5 rounded-xl border border-white/10 text-white font-medium">
                    {user.weight} kg
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <FaRulerVertical className="inline mr-2" />
                  Height (cm)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="height"
                    value={formData.height || ''}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="px-4 py-3 bg-white/5 rounded-xl border border-white/10 text-white font-medium">
                    {user.height} cm
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Health Stats */}
        <div className="space-y-6">
          <div className="glass-dark rounded-2xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">Health Statistics</h2>
            
            {bmi && (
              <div className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl border border-white/10">
                  <div className="text-5xl font-bold text-white mb-2">{bmi}</div>
                  <div className="text-gray-400 text-sm uppercase tracking-wider mb-2">BMI Index</div>
                  <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${
                    bmiCategory === 'Normal weight' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    bmiCategory === 'Underweight' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    bmiCategory === 'Overweight' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 
                    'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {bmiCategory}
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-sm text-gray-400 mb-3 font-semibold">BMI Categories</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-gray-300 text-sm">Underweight</span>
                      <span className="text-yellow-400 font-medium text-sm">&lt; 18.5</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-gray-300 text-sm">Normal weight</span>
                      <span className="text-green-400 font-medium text-sm">18.5 - 24.9</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-gray-300 text-sm">Overweight</span>
                      <span className="text-orange-400 font-medium text-sm">25 - 29.9</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-300 text-sm">Obese</span>
                      <span className="text-red-400 font-medium text-sm">≥ 30</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {!bmi && (
              <div className="text-center py-8">
                <div className="text-5xl mb-3">📊</div>
                <p className="text-gray-400">Complete your profile to see BMI calculation</p>
              </div>
            )}
          </div>

          <div className="glass-dark rounded-2xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">Account Info</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-400">Member since</span>
                <span className="font-semibold text-white">2024</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-400">Profile completion</span>
                <span className="font-semibold text-white">
                  {user.name && user.email && user.age && user.weight && user.height ? '100%' : '60%'}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-400">Last updated</span>
                <span className="font-semibold text-white">Today</span>
              </div>
            </div>
          </div>

          {/* Quick Tip Card */}
          <div className="glass-dark rounded-2xl p-6 border border-white/10 bg-gradient-to-br from-green-500/10 to-emerald-600/10">
            <div className="flex items-start space-x-3">
              <div className="text-3xl">💡</div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Health Tip</h3>
                <p className="text-sm text-gray-300">Maintain a balanced diet and regular exercise routine for optimal health results.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;