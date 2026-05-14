import React, { useState, useEffect } from 'react';
import { Briefcase, CheckCircle, Clock, XCircle } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import LoadingSpinner from '../../components/LoadingSpinner';

function JobApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      setApplications([
        {
          _id: '1',
          jobTitle: 'Islamic Teacher',
          masjidName: 'Central Masjid',
          status: 'shortlisted',
          appliedDate: new Date(),
          feedback: 'Your profile looks promising. Moving to next round.'
        },
        {
          _id: '2',
          jobTitle: 'Community Coordinator',
          masjidName: 'Community Islamic Center',
          status: 'pending',
          appliedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          feedback: null
        }
      ]);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading Applications..." />;
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'shortlisted':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'selected':
        return <CheckCircle className="text-blue-600" size={20} />;
      case 'rejected':
        return <XCircle className="text-red-600" size={20} />;
      default:
        return <Clock className="text-yellow-600" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'shortlisted':
        return 'bg-green-100 text-green-800';
      case 'selected':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-green-900 mb-2">Job Applications</h1>
      <p className="text-gray-600 mb-8">Track your application status</p>

      {applications.length > 0 ? (
        <div className="space-y-6">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-smooth islamic-border"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{app.jobTitle}</h3>
                    <p className="text-gray-600">{app.masjidName}</p>
                  </div>
                </div>

                <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 ${getStatusColor(app.status)}`}>
                  {getStatusIcon(app.status)}
                  <span className="capitalize">{app.status}</span>
                </span>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                <span>
                  Applied on {new Date(app.appliedDate).toLocaleDateString('en-IN')}
                </span>
              </div>

              {app.feedback && (
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-blue-800 text-sm">
                    <span className="font-semibold">Feedback: </span>
                    {app.feedback}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <button className="flex-1 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-smooth font-semibold">
                  View Job
                </button>
                <button className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-smooth font-semibold">
                  Contact Masjid
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 text-lg">No applications yet</p>
          <p className="text-gray-500 mb-6">Start applying to job openings</p>
          <a href="/jobs" className="inline-block px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-smooth font-semibold">
            Browse Jobs
          </a>
        </div>
      )}
    </div>
  );
}

export default JobApplications;
