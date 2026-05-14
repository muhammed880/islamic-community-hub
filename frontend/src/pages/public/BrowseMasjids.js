import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Phone, Clock, Loader } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import LoadingSpinner from '../../components/LoadingSpinner';

function BrowseMasjids() {
  const [masjids, setMasjids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchMasjids();
  }, [searchTerm, filterCity, page]);

  const fetchMasjids = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 12,
        ...(searchTerm && { search: searchTerm }),
        ...(filterCity && { city: filterCity })
      });

      const response = await axiosInstance.get(`/masjids?${params}`);
      setMasjids(response.data.data);
    } catch (error) {
      console.error('Error fetching masjids:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && masjids.length === 0) {
    return <LoadingSpinner message="Loading Masjids..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-green-900 mb-8">Browse Masjids</h1>

      {/* Search & Filter */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search masjid name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-700 focus:outline-none"
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Filter by city..."
              value={filterCity}
              onChange={(e) => {
                setFilterCity(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-700 focus:outline-none"
            />
          </div>

          <button
            onClick={() => {
              setSearchTerm('');
              setFilterCity('');
              setPage(1);
            }}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-smooth"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Masjids Grid */}
      {masjids.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {masjids.map((masjid) => (
            <Link
              key={masjid._id}
              to={`/masjids/${masjid._id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-smooth islamic-border overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-green-900 mb-3">{masjid.masjidName}</h3>

                <div className="space-y-3 text-gray-600 text-sm mb-6">
                  <div className="flex items-center space-x-2">
                    <MapPin size={18} className="text-green-600" />
                    <span>{masjid.address.city}, {masjid.address.state}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Phone size={18} className="text-green-600" />
                    <span>{masjid.phone}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock size={18} className="text-green-600" />
                    <span>Prayer times available</span>
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg mb-4">
                  <p className="text-green-700 font-semibold text-sm">
                    Members: {masjid.totalMembers || 0}
                  </p>
                </div>

                <button className="w-full py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-smooth font-semibold">
                  View Details
                </button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No masjids found</p>
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

export default BrowseMasjids;
