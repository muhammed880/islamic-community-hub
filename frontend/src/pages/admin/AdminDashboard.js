import React, { useState, useEffect } from 'react';
import { Building2, Users, TrendingUp, CreditCard, CheckCircle, Clock } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import LoadingSpinner from '../../components/LoadingSpinner';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingRegistrations, setPendingRegistrations] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [statsRes, registrationsRes, paymentsRes] = await Promise.all([
        axiosInstance.get('/admin/dashboard/stats'),
        axiosInstance.get('/admin/registrations/pending'),
        axiosInstance.get('/admin/payments/pending')
      ]);

      setStats(statsRes.data.data);
      setPendingRegistrations(registrationsRes.data.data.length);
      setPendingPayments(paymentsRes.data.data.length);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return <LoadingSpinner message="Loading Admin Dashboard..." />;
  }

  const dashboardCards = [
    {
      icon: Building2,
      title: 'Total Masjids',
      value: stats.masjids.total,
      subtitle: `${stats.masjids.approved} approved`,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Users,
      title: 'Total Users',
      value: stats.users.total,
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: TrendingUp,
      title: 'Total Donations',
      value: `₹${(stats.donations.totalAmount / 100000).toFixed(1)}L`,
      subtitle: `${stats.donations.total} transactions`,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      icon: CreditCard,
      title: 'Needy Persons',
      value: stats.needyPersons.total,
      color: 'bg-red-100 text-red-600'
    }
  ];

  const actionCards = [
    {
      icon: Clock,
      title: 'Pending Registrations',
      count: pendingRegistrations,
      action: 'Review',
      color: 'bg-orange-100 text-orange-600',
      link: '/admin/registrations'
    },
    {
      icon: CheckCircle,
      title: 'Payment Verification',
      count: pendingPayments,
      action: 'Verify',
      color: 'bg-purple-100 text-purple-600',
      link: '/admin/payments'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-green-900 mb-2">Admin Dashboard</h1>
      <p className="text-gray-600 mb-8">System Overview & Management</p>

      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 text-white rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-bold mb-2">Welcome, Admin! 👋</h2>
        <p className="text-green-100">Manage registrations, verify payments, and oversee the community platform.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {dashboardCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md islamic-border">
              <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <Icon size={24} />
              </div>
              <p className="text-gray-600 text-sm mb-2">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{card.value}</p>
              {card.subtitle && <p className="text-gray-500 text-sm">{card.subtitle}</p>}
            </div>
          );
        })}
      </div>

      {/* Action Cards */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Action Items</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {actionCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <a
              key={index}
              href={card.link}
              className={`${card.color} p-6 rounded-lg shadow-md hover:shadow-lg transition-smooth border-l-4`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon size={32} />
                <span className="text-3xl font-bold">{card.count}</span>
              </div>
              <p className="font-semibold mb-4">{card.title}</p>
              <button className="w-full py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-smooth font-semibold text-sm">
                {card.action}
              </button>
            </a>
          );
        })}
      </div>

      {/* Recent Activity */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Stats</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md islamic-border">
          <p className="text-gray-600 text-sm mb-2">Masjids Awaiting Approval</p>
          <p className="text-3xl font-bold text-orange-600">{stats.masjids.pending}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md islamic-border">
          <p className="text-gray-600 text-sm mb-2">Total Zakat Distributed</p>
          <p className="text-3xl font-bold text-green-600">
            ₹{(stats.donations.totalAmount * 0.25 / 100000).toFixed(1)}L
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md islamic-border">
          <p className="text-gray-600 text-sm mb-2">Verified Transactions</p>
          <p className="text-3xl font-bold text-blue-600">{stats.donations.total}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
