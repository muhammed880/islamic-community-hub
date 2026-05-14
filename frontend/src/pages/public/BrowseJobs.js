import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Briefcase, MapPin, DollarSign, Loader } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import LoadingSpinner from '../../components/LoadingSpinner';

function BrowseJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobType, setJobType] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchJobs();
  }, [searchTerm, jobType, page]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 12,
        ...(searchTerm && { search: searchTerm }),
        ...(jobType && { jobType })
      });

      const response = await axiosInstance.get(`/jobs?${params}`);
      setJobs(response.data.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && jobs.length === 0) {
    return <LoadingSpinner message="Loading Jobs..." />;
  }

  const jobTypeOptions = [
    { value: 'full_time', label: 'Full Time' },
    { value: 'part_time', label: 'Part Time' },
    { value: 'volunteer', label: 'Volunteer' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-green-900 mb-8">Islamic Jobs</h1>

      {/* Search & Filter */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search job title..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-700 focus:outline-none"
            />
          </div>

          <select
            value={jobType}
            onChange={(e) => {
              setJobType(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-700 focus:outline-none"
          >
            <option value="">All Job Types</option>
            {jobTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setJobType('');
              setPage(1);
            }}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-smooth"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Jobs List */}
      {jobs.length > 0 ? (
        <div className="space-y-6">
          {jobs.map((job) => (
            <Link
              key={job._id}
              to={`/jobs/${job._id}`}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-smooth islamic-border group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-green-900 group-hover:text-green-700 transition-smooth mb-2">
                    {job.jobTitle}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{job.jobDescription.substring(0, 100)}...</p>

                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin size={16} className="text-green-600" />
                      <span>{job.location.city}, {job.location.state}</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <Briefcase size={16} className="text-green-600" />
                      <span className="capitalize">
                        {job.jobType.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <DollarSign size={16} className="text-green-600" />
                      <span>
                        ₹{job.salaryRange?.minSalary?.toLocaleString()} - ₹{job.salaryRange?.maxSalary?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <button className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-smooth font-semibold whitespace-nowrap">
                    Apply Now
                  </button>
                </div>
              </div>

              {job.skills && job.skills.length > 0 && (
                <div className="flex gap-2 flex-wrap pt-4 border-t">
                  {job.skills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 3 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                      +{job.skills.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No jobs found</p>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-12">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-6 py-2 border-2 border-green-700 text-green-700 rounded-lg hover:bg-green-50 disabled:opacity-50 transition-smooth"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-gray-700">Page {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          className="px-6 py-2 border-2 border-green-700 text-green-700 rounded-lg hover:bg-green-50 transition-smooth"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default BrowseJobs;
