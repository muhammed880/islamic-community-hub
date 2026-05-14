import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Heart, Zap, Users, Gift } from 'lucide-react';

function HomePage() {
  const features = [
    {
      icon: MapPin,
      title: 'Find Masjids',
      description: 'Discover masjids in your area with complete details and prayer times.'
    },
    {
      icon: Briefcase,
      title: 'Islamic Jobs',
      description: 'Find meaningful work opportunities in Islamic organizations.'
    },
    {
      icon: Heart,
      title: 'Matrimony',
      description: 'Connect with like-minded Muslims for marriage.'
    },
    {
      icon: Gift,
      title: 'Zakat Distribution',
      description: 'Distribute Zakat securely to verified needy families.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Join Islamic classes, Q&A sessions, and community events.'
    },
    {
      icon: Zap,
      title: 'Certificate Services',
      description: 'Get Nikah Nama and other Islamic certificates.'
    }
  ];

  const stats = [
    { number: '5000+', label: 'Masjids' },
    { number: '50K+', label: 'Users' },
    { number: '₹10Cr+', label: 'Zakat Distributed' },
    { number: '100+', label: 'Cities' }
  ];

  return (
    <div className="bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="islamic-pattern p-12 rounded-lg mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-green-900 mb-6">
            Islamic Community Hub
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Connect • Serve • Grow
            <br />
            Your Complete Platform for Islamic Community Services
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              to="/masjids"
              className="px-8 py-4 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-smooth font-semibold"
            >
              Explore Masjids
            </Link>
            <Link
              to="/register"
              className="px-8 py-4 border-2 border-green-700 text-green-700 rounded-lg hover:bg-green-50 transition-smooth font-semibold"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-green-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <p className="text-4xl font-bold text-gold mb-2">{stat.number}</p>
                <p className="text-green-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center text-green-900 mb-12">
          Our Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-smooth border-l-4 border-green-700"
              >
                <Icon size={40} className="text-green-700 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-700 text-white py-16 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join?</h2>
          <p className="text-lg mb-8">
            Be part of a thriving Islamic community platform
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-gold text-green-900 rounded-lg hover:bg-yellow-500 transition-smooth font-semibold"
          >
            Register Now
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
