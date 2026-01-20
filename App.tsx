
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import MySpace from './pages/MySpace';
import Marketplace from './pages/Marketplace';
import Profile from './pages/Profile';
import Inbox from './pages/Inbox';
import Home from './pages/Home';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import { LanguageProvider } from './contexts/LanguageContext';

// Helper to check auth status directly from storage for initial state
const checkAuth = () => localStorage.getItem('bhara_auth') === 'true';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(checkAuth);

  const handleLogin = () => {
    localStorage.setItem('bhara_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('bhara_auth');
    setIsAuthenticated(false);
  };

  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center font-sans">
          
          {/* Desktop Background Decoration */}
          <div className="fixed inset-0 pointer-events-none hidden sm:block">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
             <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
             <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          </div>

          {/* Main App Container */}
          <div className="w-full sm:max-w-[420px] md:max-w-[450px] min-h-screen sm:h-[90vh] sm:min-h-[800px] bg-white sm:rounded-[2.5rem] shadow-2xl sm:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] relative flex flex-col overflow-hidden sm:border-[8px] sm:border-white ring-1 ring-black/5">
            <Routes>
              {/* Auth Routes (Redirect to dashboard if already logged in) */}
              <Route path="/login" element={isAuthenticated ? <Navigate to="/myspace/overview" /> : <Login onLogin={handleLogin} />} />
              <Route path="/register" element={isAuthenticated ? <Navigate to="/myspace/overview" /> : <Register onLogin={handleLogin} />} />
              
              {/* Protected Routes: MySpace, Profile, Inbox */}
              <Route path="/myspace/*" element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout onLogout={handleLogout}>
                    <MySpace />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/profile" element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                   <Layout onLogout={handleLogout}>
                    <Profile onLogout={handleLogout} />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/inbox/*" element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                   <Layout onLogout={handleLogout}>
                     <Inbox />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Public Routes: Marketplace, Home */}
              <Route path="/marketplace/*" element={
                 <Layout onLogout={handleLogout}>
                  <Marketplace />
                </Layout>
              } />
              
              <Route path="/home" element={
                 <Layout onLogout={handleLogout}>
                  <Home />
                </Layout>
              } />
              
              {/* Redirects */}
              <Route path="/tolet" element={<Navigate to="/marketplace" />} />
              <Route path="/" element={<Navigate to={isAuthenticated ? "/myspace/overview" : "/home"} />} />
            </Routes>
          </div>
        </div>
      </Router>
    </LanguageProvider>
  );
};

export default App;
