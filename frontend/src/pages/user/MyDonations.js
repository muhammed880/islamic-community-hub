import React, { useState, useEffect } from 'react';
import { Heart, Calendar, CheckCircle, Clock } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import LoadingSpinner from '../../components/LoadingSpinner';

function MyDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchDonations();
  }, [filter]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: 1,
        limit: 20,
        ...(filter !== 'all' && { status: filter })
      });

      const response = await axiosInstance.get(`/donations?${params}`);
      setDonations(response.data.data);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading Your Donations..." />;
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'pending_verification':
        return <Clock className="text-yellow-600" size={20} />;
      default:
        return <Clock className="text-gray-600" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending_verification':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-green-900 mb-2">My Donations</h1>
      <p className="text-gray-600 mb-8">View all your charitable contributions</p>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex gap-4">
          {['all', 'completed', 'pending_verification'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-lg font-semibold transition-smooth ${
                filter === status
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Donations List */}
      {donations.length > 0 ? (
        <div className="space-y-4">
          {donations.map((donation) => (
            <div
              key={donation._id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-smooth islamic-border"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <Heart className="text-red-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {donation.masjidId?.masjidName || 'Masjid Donation'}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {donation.donationType === 'zakat' ? 'Zakat' : 'General Donation'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-green-600" />
                      <span>
                        {new Date(donation.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(donation.transactionStatus)}
                      <span className="capitalize">
                        {donation.transactionStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-bold text-green-700 mb-2">
                    ₹{donation.amount.toLocaleString()}
                  </p>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(donation.transactionStatus)}`}>
                    {donation.transactionStatus === 'completed' ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>

              {donation.receiptNumber && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-gray-600 text-sm">
                    Receipt: <span className="font-semibold text-gray-900">{donation.receiptNumber}</span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Heart className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 text-lg">No donations yet</p>
          <p className="text-gray-500">Your charitable contributions will appear here</p>
        </div>
      )}
    </div>
  );
}

export default MyDonations;
