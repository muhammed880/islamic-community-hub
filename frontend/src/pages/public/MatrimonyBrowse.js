import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, MapPin, BookOpen, Briefcase } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuthStore } from '../../store/authStore';

function MatrimonyBrowse() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gender, setGender] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchProfiles();
  }, [gender, searchTerm, page]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 12,
        ...(gender && { gender }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await axiosInstance.get(`/matrimony?${params}`);
      setProfiles(response.data.data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && profiles.length === 0) {
    return <LoadingSpinner message="Loading Profiles..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-green-900 mb-2">Islamic Matrimony</h1>
      <p className="text-gray-600 mb-8">Find your perfect match in our Muslim community</p>

      {/* Search & Filter */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or city..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-700 focus:outline-none"
            />
          </div>

          <select
            value={gender}
            onChange={(e) => {
              setGender(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-700 focus:outline-none"
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          {!user && (
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-smooth font-semibold"
            >
              Create Profile
            </button>
          )}
        </div>
      </div>

      {/* Profiles Grid */}
      {profiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {profiles.map((profile) => (
            <Link
              key={profile._id}
              to={`/matrimony/${profile._id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-smooth overflow-hidden group islamic-border"
            >
              {/* Profile Image */}
              <div className="relative bg-gradient-to-br from-green-200 to-green-300 h-48 flex items-center justify-center">
                {profile.profilePhoto ? (
                  <img
                    src={profile.profilePhoto}
                    alt={profile.fullName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                  />
                ) : (
                  <Heart size={40} className="text-green-700 opacity-50" />
                )}
              </div>

              {/* Profile Info */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{profile.fullName}</h3>
                <p className="text-gray-600 text-sm mb-3">{profile.age} years old</p>

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  {profile.education && (
                    <div className="flex items-center space-x-2">
                      <BookOpen size={16} className="text-green-600" />
                      <span>{profile.education}</span>
                    </div>
                  )}
                  {profile.occupation && (
                    <div className="flex items-center space-x-2">
                      <Briefcase size={16} className="text-green-600" />
                      <span>{profile.occupation}</span>
                    </div>
                  )}
                </div>

                <button className="w-full py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-smooth font-semibold text-sm flex items-center justify-center space-x-2">
                  <Heart size={16} />
                  <span>View Profile</span>
                </button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 text-lg">No profiles found</p>
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

export default MatrimonyBrowse;
