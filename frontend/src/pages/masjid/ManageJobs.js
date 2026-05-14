import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import LoadingSpinner from '../../components/LoadingSpinner';

function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      setJobs([
        {
          _id: '1',
          jobTitle: 'Islamic Teacher',
          jobType: 'full_time',
          applicantCount: 15,
          status: 'active',
          closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        {
          _id: '2',
          jobTitle: 'Community Coordinator',
          jobType: 'part_time',
          applicantCount: 8,
          status: 'active',
          closingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        }
      ]);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading Jobs..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-green-900">Manage Jobs</h1>
        <Link
          to="#"
          className="flex items-center space-x-2 px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-smooth font-semibold"
        >
          <Plus size={20} />
          <span>Post New Job</span>
        </Link>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Job Title</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Applications</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Closing Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {jobs.map((job) => (
              <tr key={job._id} className="hover:bg-gray-50 transition-smooth">
                <td className="px-6 py-4 text-gray-900 font-semibold">{job.jobTitle}</td>
                <td className="px-6 py-4 text-gray-600 capitalize">{job.jobType.replace('_', ' ')}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                    {job.applicantCount} applications
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(job.closingDate).toLocaleDateString('en-IN')}
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-smooth">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-smooth">
                      <Edit size={18} />
                    </button>
                    <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-smooth">
                      <Trash2 size={18} />
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

export default ManageJobs;
