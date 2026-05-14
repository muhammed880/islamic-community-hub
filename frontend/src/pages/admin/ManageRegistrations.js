import React, { useState, useEffect } from 'react');
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import LoadingSpinner from '../../components/LoadingSpinner';

function ManageRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchRegistrations();
  }, [filter]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      setRegistrations([
        {
          _id: '1',
          masjidName: 'Central Islamic Mosque',
          status: 'submitted',
          submittedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          city: 'Bangalore'
        },
        {
          _id: '2',
          masjidName: 'Community Islamic Center',
          status: 'submitted',
          submittedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          city: 'Mumbai'
        }
      ]);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading Registrations..." />;
  }

  const approveRegistration = async (regId) => {
    // TODO: Call API to approve
    alert('Approved! Credentials will be sent.');
  };

  const rejectRegistration = async (regId) => {
    // TODO: Call API to reject
    alert('Rejected!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-green-900 mb-8">Manage Masjid Registrations</h1>

      {/* Filter */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex gap-4">
          {['pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-lg font-semibold transition-smooth ${
                filter === status
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Masjid Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">City</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Submitted</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {registrations.map((reg) => (
              <tr key={reg._id} className="hover:bg-gray-50 transition-smooth">
                <td className="px-6 py-4 text-gray-900 font-semibold">{reg.masjidName}</td>
                <td className="px-6 py-4 text-gray-600">{reg.city}</td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(reg.submittedDate).toLocaleDateString('en-IN')}
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                    {reg.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-smooth">
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => approveRegistration(reg._id)}
                      className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-smooth"
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button
                      onClick={() => rejectRegistration(reg._id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-smooth"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageRegistrations;
