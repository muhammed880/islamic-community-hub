import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import Layout from './layouts/Layout';
import AuthLayout from './layouts/AuthLayout';

// Pages - Public
import HomePage from './pages/public/HomePage';
import BrowseMasjids from './pages/public/BrowseMasjids';
import MasjidDetails from './pages/public/MasjidDetails';
import BrowseJobs from './pages/public/BrowseJobs';
import JobDetails from './pages/public/JobDetails';
import MatrimonyBrowse from './pages/public/MatrimonyBrowse';

// Pages - Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Pages - User Dashboard
import UserDashboard from './pages/user/UserDashboard';
import UserProfile from './pages/user/UserProfile';
import MyDonations from './pages/user/MyDonations';
import JobApplications from './pages/user/JobApplications';
import MatrimonyProfile from './pages/user/MatrimonyProfile';

// Pages - Masjid Authority
import MasjidDashboard from './pages/masjid/MasjidDashboard';
import MasjidRegistration from './pages/masjid/MasjidRegistration';
import NikahRegistration from './pages/masjid/NikahRegistration';
import ManageDonations from './pages/masjid/ManageDonations';
import ManageJobs from './pages/masjid/ManageJobs';

// Pages - Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageRegistrations from './pages/admin/ManageRegistrations';

// Store
import { useAuthStore } from './store/authStore';
import { useNotificationStore } from './store/notificationStore';

// Utils
import axiosInstance from './utils/axiosInstance';

function App() {
  const { user, setUser, logout } = useAuthStore();
  const { showNotification } = useNotificationStore();

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token with backend
      validateToken(token);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await axiosInstance.get('/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.data);
    } catch (error) {
      logout();
    }
  };

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <Routes>
        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/masjids" element={<BrowseMasjids />} />
          <Route path="/masjids/:masjidId" element={<MasjidDetails />} />
          <Route path="/jobs" element={<BrowseJobs />} />
          <Route path="/jobs/:jobId" element={<JobDetails />} />
          <Route path="/matrimony" element={<MatrimonyBrowse />} />
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        </Route>

        {/* Protected Routes - User */}
        {user && user.role === 'general_user' && (
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/donations" element={<MyDonations />} />
            <Route path="/applications" element={<JobApplications />} />
            <Route path="/matrimony-profile" element={<MatrimonyProfile />} />
          </Route>
        )}

        {/* Protected Routes - Masjid Authority */}
        {user && user.role === 'masjid_authority' && (
          <Route element={<Layout />}>
            <Route path="/masjid/dashboard" element={<MasjidDashboard />} />
            <Route path="/masjid/registration" element={<MasjidRegistration />} />
            <Route path="/masjid/nikah-registration" element={<NikahRegistration />} />
            <Route path="/masjid/donations" element={<ManageDonations />} />
            <Route path="/masjid/jobs" element={<ManageJobs />} />
          </Route>
        )}

        {/* Protected Routes - Super Admin */}
        {user && user.role === 'super_admin' && (
          <Route element={<Layout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/registrations" element={<ManageRegistrations />} />
          </Route>
        )}

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
