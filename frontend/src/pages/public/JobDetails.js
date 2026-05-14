import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, Clock, Share2, BookOpen } from 'lucide-react';
import { toast } from 'react-toastify';
import FormTextarea from '../../components/FormTextarea';
import axiosInstance from '../../utils/axiosInstance';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuthStore } from '../../store/authStore';

function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/jobs/${jobId}`);
      setJob(response.data.data);
    } catch (error) {
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setSubmitting(true);
      // TODO: Upload resume and submit application
      await axiosInstance.post(`/jobs/${jobId}/apply`, {
        coverLetter
      });

      toast.success('Application submitted successfully!');
      setShowApplyForm(false);
      setCoverLetter('');
    } catch (error) {
      toast.error('Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading Job Details..." />;
  }

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 text-lg">Job not found</p>
      </div>
    );
  }

  const daysUntilClosing = Math.ceil(
    (new Date(job.closingDate) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-lg p-8 mb-8">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{job.jobTitle}</h1>
            <p className="text-blue-100 mb-4">{job.masjidId?.masjidName}</p>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin size={18} />
                <span>{job.location.city}, {job.location.state}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Briefcase size={18} />
                <span className="capitalize">{job.jobType.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={18} />
                <span>{daysUntilClosing > 0 ? `${daysUntilClosing} days left` : 'Closed'}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <button className="flex items-center space-x-2 px-6 py-3 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-smooth font-semibold mb-3">
              <Share2 size={20} />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Description */}
          <div className="bg-white p-6 rounded-lg shadow-md islamic-border">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{job.jobDescription}</p>
          </div>

          {/* Requirements */}
          <div className="bg-white p-6 rounded-lg shadow-md islamic-border">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>

            {job.qualifications && job.qualifications.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Qualifications</h3>
                <ul className="space-y-2">
                  {job.qualifications.map((qual, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <span className="text-gray-700">{qual}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.experience && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Experience Required</h3>
                <p className="text-gray-700">{job.experience} years</p>
              </div>
            )}

            {job.skills && job.skills.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* About Company */}
          <div className="bg-white p-6 rounded-lg shadow-md islamic-border">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About {job.masjidId?.masjidName}</h2>
            <p className="text-gray-700 mb-4">
              {job.masjidId?.description || 'A respected Islamic organization dedicated to community service and development.'}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-gray-600 text-sm mb-1">Location</p>
                <p className="font-semibold text-gray-900">{job.masjidId?.address?.city}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Contact</p>
                <p className="font-semibold text-gray-900">{job.masjidId?.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Apply Card */}
        <div>
          {/* Salary Card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow-md border-l-4 border-green-700 mb-6">
            <p className="text-gray-600 text-sm mb-2">Salary Range</p>
            <p className="text-3xl font-bold text-green-700 mb-3">
              ₹{job.salaryRange?.minSalary?.toLocaleString()} - ₹{job.salaryRange?.maxSalary?.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">{job.salaryRange?.currency}/year</p>
          </div>

          {/* Apply Button */}
          {!showApplyForm ? (
            <button
              onClick={() => {
                if (!user) {
                  navigate('/login');
                } else {
                  setShowApplyForm(true);
                }
              }}
              className="w-full py-4 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-smooth font-bold text-lg mb-6"
            >
              Apply for this Job
            </button>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md islamic-border mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Submit Application</h3>

              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Resume (PDF/DOC)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-700 focus:outline-none"
                  />
                </div>

                <FormTextarea
                  label="Cover Letter"
                  placeholder="Tell us why you're a great fit for this role..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={4}
                />

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-smooth font-semibold"
                  >
                    {submitting ? 'Submitting...' : 'Submit'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowApplyForm(false)}
                    className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-smooth font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Job Info Card */}
          <div className="bg-white p-6 rounded-lg shadow-md islamic-border space-y-4">
            <div>
              <p className="text-gray-600 text-sm mb-1">Applicants</p>
              <p className="text-2xl font-bold text-gray-900">{job.applicantCount || 0}</p>
            </div>

            <div className="border-t pt-4">
              <p className="text-gray-600 text-sm mb-1">Closing Date</p>
              <p className="font-semibold text-gray-900">
                {new Date(job.closingDate).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div className="border-t pt-4">
              <p className="text-gray-600 text-sm mb-1">Posted</p>
              <p className="font-semibold text-gray-900">
                {new Date(job.createdAt).toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
