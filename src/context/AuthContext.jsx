import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('currentUserId');
    const userName = localStorage.getItem('currentUserName');
    const userEmail = localStorage.getItem('currentUserEmail');
    
    if (userId) {
      setCurrentUser({
        id: parseInt(userId),
        name: userName,
        email: userEmail
      });
    }
    setLoading(false);
  }, []);

  const login = (user) => {
    localStorage.setItem('currentUserId', user.id);
    localStorage.setItem('currentUserName', user.name);
    localStorage.setItem('currentUserEmail', user.email);
    setCurrentUser(user);
  };

  const logout = () => {
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('currentUserName');
    localStorage.removeItem('currentUserEmail');
    setCurrentUser(null);
  };

  const isAuthenticated = () => {
    return currentUser !== null;
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
