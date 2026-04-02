import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StaffAccessPage from './pages/StaffAccessPage';

function App() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={isLoggedIn ? <DashboardPage /> : <Navigate to="/" />} />
        <Route path="/staff-access" element={<StaffAccessPage />} />
      </Routes>
    </Router>
  );
}

export default App;