import React from 'react';

const ActivityCard = ({ activity, isSelected, onClick }) => {
  const Icon = activity?.icon;

  if (!Icon) {
    return null; // Don't render if icon is missing
  }

  return (
    <button
      onClick={onClick}
      className={`relative group overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-105 h-40 w-full ${
        isSelected ? 'ring-4 ring-green-500 scale-105' : 'hover:shadow-lg'
      }`}
    >
      {/* Background Image */}
      <img
        src={activity.image}
        alt={activity.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      />

      {/* Overlay Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${activity.color} opacity-60 group-hover:opacity-70 transition-opacity`} />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center">
        <Icon className="text-white text-4xl mb-2" />
        <p className="text-white font-bold text-lg text-center">{activity.name}</p>
      </div>

      {/* Selected Checkmark */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-green-500 rounded-full w-8 h-8 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </button>
  );
};

export default ActivityCard;