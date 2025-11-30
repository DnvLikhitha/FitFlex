import { FaRunning, FaWalking, FaDumbbell, FaSwimmer, FaBicycle, FaOm, FaFire, FaMusic, FaHeartbeat } from 'react-icons/fa';
import walkingImg from '../images/walking.jpeg';
import runningImg from '../images/running.jpeg';
import cyclingImg from '../images/cycling.jpeg';
import swimmingImg from '../images/swimming.jpeg';
import weighttrainingImg from '../images/weighttraining.jpeg';
import yogaImg from '../images/yoga.jpeg';
import hiitImg from '../images/hiit.jpeg';
import danceImg from '../images/dance.jpeg';
import aerobicsImg from '../images/aerobics.jpeg';

export const ACTIVITY_TYPES = [
  {
    id: 'walking',
    name: 'Walking',
    icon: FaWalking,
    image: walkingImg,
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'running',
    name: 'Running',
    icon: FaRunning,
    image: runningImg,
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'cycling',
    name: 'Cycling',
    icon: FaBicycle,
    image: cyclingImg,
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'swimming',
    name: 'Swimming',
    icon: FaSwimmer,
    image: swimmingImg,
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'weight training',
    name: 'Weight Training',
    icon: FaDumbbell,
    image: weighttrainingImg,
    color: 'from-red-500 to-pink-600'
  },
  {
    id: 'yoga',
    name: 'Yoga',
    icon: FaOm,
    image: yogaImg,
    color: 'from-orange-500 to-yellow-600'
  },
  {
    id: 'hiit',
    name: 'HIIT',
    icon: FaFire,
    image: hiitImg,
    color: 'from-red-600 to-orange-600'
  },
  {
    id: 'dance',
    name: 'Dance',
    icon: FaMusic,
    image: danceImg,
    color: 'from-pink-500 to-rose-600'
  },
  {
    id: 'aerobics',
    name: 'Aerobics',
    icon: FaHeartbeat,
    image: aerobicsImg,
    color: 'from-green-600 to-teal-600'
  },
  {
    id: 'others',
    name: 'Others',
    icon: FaRunning,
    image: runningImg,
    color: 'from-gray-500 to-slate-600'
  }
];

export const getActivityType = (id) => {
  return ACTIVITY_TYPES.find(activity => activity.id === id.toLowerCase());
};
