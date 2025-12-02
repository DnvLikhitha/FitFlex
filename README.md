# 🏋️‍♂️ Fitness Tracker Application

A comprehensive full-stack web application for tracking fitness activities, monitoring nutrition, and visualizing progress towards health goals.

![Fitness Tracker Banner](https://images.pexels.com/photos/3076509/pexels-photo-3076509.jpeg?auto=compress&cs=tinysrgb&w=1920)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Components Overview](#components-overview)
- [Routing](#routing)
- [State Management](#state-management)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🎯 Overview

The Fitness Tracker is a modern, responsive web application designed to help users maintain a healthy lifestyle by tracking their daily activities, monitoring nutritional intake, and visualizing their fitness progress through interactive charts and analytics.

### Key Highlights

- **User Authentication** - Secure login and registration system
- **Activity Tracking** - Log various types of workouts with detailed metrics
- **Nutrition Monitoring** - Track meals and macronutrient intake
- **Progress Analytics** - Visual representation of fitness data through charts
- **Responsive Design** - Works seamlessly across desktop, tablet, and mobile devices
- **Real-time Updates** - Instant feedback and live data synchronization

## ✨ Features

### 🔐 Authentication
- User registration with validation
- Secure login system
- Password encryption
- Session management
- Protected routes

### 🏃 Activity Tracking
- Log multiple activity types (Running, Cycling, Yoga, Swimming, Weight Training, etc.)
- Track duration, calories burned, and steps
- Intensity level selection
- Add personal notes to workouts
- Edit and delete activities
- Auto-calculate calories based on activity type and duration
- Beautiful card-based activity display

### 🍎 Nutrition Monitoring
- Log meals by type (Breakfast, Lunch, Dinner, Snacks)
- Track calories and macronutrients (Protein, Carbs, Fats)
- View nutritional breakdown
- Daily meal history
- Edit and delete meal entries
- Macro distribution visualization

### 📊 Progress Dashboard
- Real-time statistics cards
- Weekly activity charts
- Nutrition breakdown pie charts
- Activity type distribution
- Calories burned trends
- Interactive data visualization

### 👤 User Profile
- View and edit personal information
- BMI calculation
- Weight and height tracking
- Account management

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library with functional components and hooks
- **React Router v6** - Client-side routing and navigation
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Recharts** - Composable charting library for data visualization
- **Axios** - HTTP client for API requests
- **React Icons** - Icon library (Font Awesome, Material Design)
- **React Toastify** - Toast notifications for user feedback

### Backend
- **JSON Server** - Mock REST API for rapid prototyping
- **Node.js** - Runtime environment
- **Express** (via JSON Server) - Web framework

### Development Tools
- **Create React App** - Project bootstrapping
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

## 📦 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git** (optional, for cloning)

Check versions:
```bash
node --version
npm --version