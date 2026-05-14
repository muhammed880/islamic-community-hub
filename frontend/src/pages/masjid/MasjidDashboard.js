import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, Gift, Briefcase, Heart, Calendar } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import LoadingSpinner from '../../components/LoadingSpinner';

function MasjidDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      setStats({
        totalDonations: 50,
        totalDonatedAmount: 250000,
        totalMembers: 1500,
        recentDonations: [
          { amount: 5000, donor: 'Anonymous', date: new Date() },
          { amount: 10000, donor: 'Ahmed Ali', date: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        ],
        recentJobs: 3,
        pendingVerifications: 2
      });
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return <LoadingSpinner message="Loading Masjid Dashboard..." />;
  }

  const quickActions = [
    {
      icon: Gift,
      label: 'Manage Donations',
      path: '/masjid/donations',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: Briefcase,
      label: 'Manage Jobs',
      path: '/masjid/jobs',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Heart,
      label: 'Nikah Registration',
      path: '/masjid/nikah-registration',
      color: 'bg-pink-100 text-pink-600'
    },
    {
      icon: Calendar,
      label: 'Events',
      path: '#',
      color: 'bg-yellow-100 text-yellow-600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 text-white rounded-lg p-8 mb-12">
        <h1 className="text-4xl font-bold mb-2">Masjid Dashboard</h1>
        <p className="text-green-100">Manage your masjid activities and community</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md islamic-border">
          <p className="text-gray-600 text-sm mb-2">Total Donations</p>
          <p className="text-3xl font-bold text-green-700">{stats.totalDonations}</p>
          <p className="text-gray-500 text-sm mt-2">₹{stats.totalDonatedAmount.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md islamic-border">
          <p className="text-gray-600 text-sm mb-2">Total Members</p>
          <p className="text-3xl font-bold text-blue-700">{stats.totalMembers.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md islamic-border">
          <p className="text-gray-600 text-sm mb-2">Pending Verifications</p>
          <p className="text-3xl font-bold text-orange-700">{stats.pendingVerifications}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {quickActions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <Link
              key={idx}
              to={action.path}
              className={`${action.color} p-6 rounded-lg shadow-md hover:shadow-lg transition-smooth`}
            >
              <Icon size={32} className="mb-4" />
              <p className="font-semibold">{action.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Donations */}
        <div className="bg-white p-6 rounded-lg shadow-md islamic-border">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Donations</h3>

          {stats.recentDonations.length > 0 ? (
            <div className="space-y-4">
              {stats.recentDonations.map((donation, idx) => (
                <div key={idx} className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <p className="font-semibold text-gray-900">{donation.donor}</p>
                    <p className="text-gray-600 text-sm">
                      {new Date(donation.date).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <p className="text-green-700 font-bold">₹{donation.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No recent donations</p>
          )}
        </div>

        {/* Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md islamic-border">
          <h3 className="text-xl font-bold text-gray-900 mb-6">This Month</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b">
              <div className="flex items-center space-x-3">
                <Gift className="text-red-600" size={24} />
                <span className="font-semibold text-gray-900">New Donations</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">₹{stats.totalDonatedAmount.toLocaleString()}</p>
            </div>

            <div className="flex justify-between items-center pb-4 border-b">
              <div className="flex items-center space-x-3">
                <Briefcase className="text-blue-600" size={24} />
                <span className="font-semibold text-gray-900">Active Jobs</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.recentJobs}</p>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Users className="text-green-600" size={24} />
                <span className="font-semibold text-gray-900">Members</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMembers.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MasjidDashboard;
