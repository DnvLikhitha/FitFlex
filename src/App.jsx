import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Dashboard from './pages/Dashboard';
import SignUp from './pages/SignIn';
import Login from './pages/Login';
import Activities from './pages/Activities';
import Goals from './pages/Goals';
import History from './pages/History';
import Profile from './pages/Profile';
import Nutrition from './pages/Nutrition';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
              <Header />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/activities" element={<main className="flex-grow container mx-auto px-4 py-12"><Activities /></main>} />
                <Route path="/goals" element={<main className="flex-grow container mx-auto px-4 py-12"><Goals /></main>} />
                <Route path="/history" element={<main className="flex-grow container mx-auto px-4 py-12"><History /></main>} />
                <Route path="/profile" element={<main className="flex-grow container mx-auto px-4 py-12"><Profile /></main>} />
                <Route path="/nutrition" element={<main className="flex-grow container mx-auto px-4 py-12"><Nutrition /></main>} />
              </Routes>
              <Footer />
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                toastClassName="dark-card"
              />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;