// Default calories burned per minute for each activity
export const ACTIVITY_PRESETS = {
  walking: { name: 'Walking', caloriesPerMin: 4 },
  running: { name: 'Running', caloriesPerMin: 10 },
  cycling: { name: 'Cycling', caloriesPerMin: 8 },
  swimming: { name: 'Swimming', caloriesPerMin: 9 },
  'weight training': { name: 'Weight Training', caloriesPerMin: 7 },
  yoga: { name: 'Yoga', caloriesPerMin: 3 },
  hiit: { name: 'HIIT', caloriesPerMin: 12 },
  dance: { name: 'Dance', caloriesPerMin: 6 },
  aerobics: { name: 'Aerobics', caloriesPerMin: 7.5 },
  others: { name: 'Others', caloriesPerMin: 5 }
};

export const getActivityPreset = (activityType) => {
  const key = activityType.toLowerCase();
  return ACTIVITY_PRESETS[key] || ACTIVITY_PRESETS.others;
};

export const calculateCalories = (durationMinutes, activityType) => {
  const preset = getActivityPreset(activityType);
  return Math.round(durationMinutes * preset.caloriesPerMin);
};
