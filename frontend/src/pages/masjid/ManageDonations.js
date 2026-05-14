import React, { useState, useEffect } from 'react';
import { Heart, CheckCircle, Clock } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import LoadingSpinner from '../../components/LoadingSpinner';

function ManageDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchDonations();
  }, [filter]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      setDonations([
        {
          _id: '1',
          amount: 5000,
          donor: 'Ahmed Ali',
          status: 'pending_verification',
          utrNumber: 'XXXXXXX',
          date: new Date()
        },
        {
          _id: '2',
          amount: 10000,
          donor: 'Fatima Khan',
          status: 'completed',
          utrNumber: 'YYYYYYY',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      ]);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading Donations..." />;
  }

  const verifyDonation = async (donationId) => {
    try {
      await axiosInstance.put(`/donations/${donationId}/verify`);
      fetchDonations();
    } catch (error) {
      console.error('Error verifying donation:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-green-900 mb-8">Manage Donations</h1>

      {/* Filter */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex gap-4">
          {['pending', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-lg font-semibold transition-smooth ${
                filter === status
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'pending' ? 'Pending Verification' : 'Verified'}
            </button>
          ))}
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Donor</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">UTR Number</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {donations.map((donation) => (
              <tr key={donation._id} className="hover:bg-gray-50 transition-smooth">
                <td className="px-6 py-4 text-gray-900 font-semibold">{donation.donor}</td>
                <td className="px-6 py-4 text-green-700 font-bold">₹{donation.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-gray-600">{donation.utrNumber}</td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(donation.date).toLocaleDateString('en-IN')}
                </td>
                <td className="px-6 py-4">
                  {donation.status === 'completed' ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle size={18} />
                      <span className="font-semibold">Verified</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-yellow-600">
                      <Clock size={18} />
                      <span className="font-semibold">Pending</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {donation.status === 'pending_verification' && (
                    <button
                      onClick={() => verifyDonation(donation._id)}
                      className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-smooth font-semibold text-sm"
                    >
                      Verify
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageDonations;
