import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Users, DollarSign, Heart } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';
import LoadingSpinner from '../../components/LoadingSpinner';

function MasjidDetails() {
  const { masjidId } = useParams();
  const [masjid, setMasjid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [donationAmount, setDonationAmount] = useState('');

  useEffect(() => {
    fetchMasjidDetails();
  }, [masjidId]);

  const fetchMasjidDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/masjids/${masjidId}`);
      setMasjid(response.data.data);
    } catch (error) {
      toast.error('Failed to load masjid details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading Masjid Details..." />;
  }

  if (!masjid) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 text-lg">Masjid not found</p>
      </div>
    );
  }

  const handleDonate = () => {
    if (!donationAmount || parseInt(donationAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    toast.success(`Proceeding with ₹${donationAmount} donation`);
    // TODO: Integrate with donation flow
  };

  const prayerTimes = masjid.prayerTimes || {
    fajr: '05:30 AM',
    dhuhr: '12:30 PM',
    asr: '03:45 PM',
    maghrib: '06:15 PM',
    isha: '07:45 PM'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 text-white rounded-lg p-8 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">{masjid.masjidName}</h1>
            <p className="text-green-100">{masjid.address.city}, {masjid.address.state}</p>
          </div>
          <button className="bg-white text-green-700 px-6 py-3 rounded-lg hover:bg-green-50 transition-smooth font-semibold flex items-center space-x-2">
            <Heart size={20} />
            <span>Follow</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Tabs */}
        <div className="lg:col-span-2">
          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-md mb-6 islamic-border">
            <div className="flex border-b">
              {['overview', 'prayer', 'facilities'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 px-6 font-semibold transition-smooth ${
                    activeTab === tab
                      ? 'text-green-700 border-b-2 border-green-700'
                      : 'text-gray-600 hover:text-green-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                    <p className="text-gray-600">
                      {masjid.description || 'A welcoming community mosque dedicated to serving the Muslim community with excellent facilities and programs.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-gray-600 text-sm mb-1">Total Members</p>
                      <p className="text-2xl font-bold text-green-700">{masjid.totalMembers || 0}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-gray-600 text-sm mb-1">Total Donations</p>
                      <p className="text-2xl font-bold text-blue-700">₹{masjid.totalDonations?.toLocaleString() || 0}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Facilities</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {(masjid.facilities || ['Prayer Hall', 'Ablution Area', 'Library', 'Parking']).map((facility, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-gray-700">
                          <div className="w-2 h-2 bg-green-700 rounded-full"></div>
                          <span>{facility}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Prayer Times Tab */}
              {activeTab === 'prayer' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Prayer Schedule</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Fajr', time: prayerTimes.fajr },
                      { name: 'Dhuhr', time: prayerTimes.dhuhr },
                      { name: 'Asr', time: prayerTimes.asr },
                      { name: 'Maghrib', time: prayerTimes.maghrib },
                      { name: 'Isha', time: prayerTimes.isha }
                    ].map((prayer, idx) => (
                      <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <span className="font-semibold text-gray-900">{prayer.name}</span>
                        <span className="text-green-700 font-semibold">{prayer.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Facilities Tab */}
              {activeTab === 'facilities' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Facilities</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { name: 'Prayer Hall', icon: '🕌' },
                        { name: 'Ablution Area', icon: '💧' },
                        { name: 'Library', icon: '📚' },
                        { name: 'Parking', icon: '🅿️' },
                        { name: 'Cafeteria', icon: '☕' },
                        { name: 'Madrassah', icon: '🎓' }
                      ].map((facility, idx) => (
                        <div key={idx} className="bg-green-50 p-4 rounded-lg text-center">
                          <p className="text-3xl mb-2">{facility.icon}</p>
                          <p className="font-semibold text-gray-900 text-sm">{facility.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Opening Hours</h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      {masjid.openingHours ? (
                        Object.entries(masjid.openingHours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between py-2 border-b">
                            <span className="font-semibold text-gray-900">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                            <span className="text-gray-700">{hours}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600">Open all day</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Info Card */}
        <div className="space-y-6">
          {/* Contact Card */}
          <div className="bg-white p-6 rounded-lg shadow-md islamic-border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="text-green-600" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold text-gray-900">{masjid.phone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="text-green-600" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{masjid.email}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="text-green-600 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-semibold text-gray-900">
                    {masjid.address.street}, {masjid.address.city}, {masjid.address.state} {masjid.address.zipCode}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Donation Card */}
          <div className="bg-green-50 p-6 rounded-lg shadow-md border-l-4 border-green-700">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Support This Masjid</h3>
            <p className="text-gray-600 text-sm mb-4">
              Your donation helps maintain this community mosque and support our programs.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donation Amount (₹)
              </label>
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-700 focus:outline-none"
              />
            </div>

            <div className="flex gap-2 mb-4">
              {[100, 500, 1000, 2000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setDonationAmount(amount.toString())}
                  className="flex-1 py-2 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-100 transition-smooth font-semibold text-sm"
                >
                  ₹{amount}
                </button>
              ))}
            </div>

            <button
              onClick={handleDonate}
              className="w-full py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-smooth font-semibold flex items-center justify-center space-x-2"
            >
              <Heart size={20} />
              <span>Donate Now</span>
            </button>
          </div>

          {/* Rating Card */}
          <div className="bg-white p-6 rounded-lg shadow-md islamic-border">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Rating</h3>
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-4xl font-bold text-yellow-500">{masjid.averageRating?.toFixed(1) || 4.5}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">out of 5</p>
                <p className="text-sm text-gray-500">Based on community reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MasjidDetails;
