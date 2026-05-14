import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Briefcase, Users, Gift, Loader } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import axiosInstance from '../../utils/axiosInstance';

function UserDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // TODO: Replace with actual API call
      setStats({
        totalDonations: 5,
        totalDonated: 15000,
        applications: 2,
        matrimonyInterests: 3
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-green-700" size={40} />
      </div>
    );
  }

  const quickLinks = [
    {
      icon: Heart,
      label: 'My Donations',
      path: '/donations',
      color: 'bg-red-100 text-red-600',
      count: stats?.totalDonations
    },
    {
      icon: Briefcase,
      label: 'Job Applications',
      path: '/applications',
      color: 'bg-blue-100 text-blue-600',
      count: stats?.applications
    },
    {
      icon: Users,
      label: 'Matrimony',
      path: '/matrimony-profile',
      color: 'bg-pink-100 text-pink-600',
      count: stats?.matrimonyInterests
    },
    {
      icon: Gift,
      label: 'Browse Masjids',
      path: '/masjids',
      color: 'bg-green-100 text-green-600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 text-white rounded-lg p-8 mb-12">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.firstName}! 👋</h1>
        <p className="text-green-100">You're doing great! Keep contributing to the community.</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md islamic-border">
          <p className="text-gray-600 text-sm mb-2">Total Donations</p>
          <p className="text-3xl font-bold text-green-700">{stats?.totalDonations}</p>
          <p className="text-gray-500 text-sm mt-2">₹{stats?.totalDonated?.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md islamic-border">
          <p className="text-gray-600 text-sm mb-2">Applications</p>
          <p className="text-3xl font-bold text-green-700">{stats?.applications}</p>
          <p className="text-gray-500 text-sm mt-2">Job Applications</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md islamic-border">
          <p className="text-gray-600 text-sm mb-2">Matrimony Interests</p>
          <p className="text-3xl font-bold text-green-700">{stats?.matrimonyInterests}</p>
          <p className="text-gray-500 text-sm mt-2">Awaiting response</p>
        </div>
      </div>

      {/* Quick Links */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickLinks.map((link, index) => {
          const Icon = link.icon;
          return (
            <Link
              key={index}
              to={link.path}
              className={`${link.color} p-6 rounded-lg transition-smooth hover:shadow-lg`}
            >
              <Icon size={32} className="mb-4" />
              <p className="font-semibold mb-2">{link.label}</p>
              {link.count !== undefined && (
                <p className="text-sm opacity-75">{link.count} pending</p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default UserDashboard;
