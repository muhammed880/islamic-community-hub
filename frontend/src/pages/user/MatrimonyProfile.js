import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Heart, Upload, Loader } from 'lucide-react';
import FormInput from '../../components/FormInput';
import FormSelect from '../../components/FormSelect';
import FormTextarea from '../../components/FormTextarea';
import axiosInstance from '../../utils/axiosInstance';

function MatrimonyProfile() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // TODO: Replace with actual API call to get user's matrimony profile
      setProfileExists(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const profileData = {
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        height: data.height,
        education: data.education,
        occupation: data.occupation,
        income: data.income,
        hobbies: data.hobbies?.split(',').map(h => h.trim()),
        languages: data.languages?.split(',').map(l => l.trim()),
        lookingFor: data.lookingFor,
        bio: data.bio
      };

      await axiosInstance.post('/matrimony', profileData);
      toast.success('Profile created successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-green-700" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-green-900 mb-2">Matrimony Profile</h1>
      <p className="text-gray-600 mb-8">
        {profileExists ? 'Update your profile' : 'Create your matrimony profile'}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-8 space-y-8">
        {/* Profile Photo */}
        <div className="pb-8 border-b">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Photo</h2>

          <div className="flex items-start space-x-6">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Profile"
                className="w-32 h-32 rounded-lg object-cover"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                <Heart size={48} className="text-gray-400" />
              </div>
            )}

            <div>
              <label className="cursor-pointer">
                <div className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-smooth font-semibold flex items-center space-x-2">
                  <Upload size={20} />
                  <span>Upload Photo</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                  {...register('profilePhoto')}
                />
              </label>
              <p className="text-gray-500 text-sm mt-2">Clear, recent photo recommended</p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="pb-8 border-b">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Full Name"
              required
              {...register('fullName', { required: 'Full name is required' })}
            />

            <FormInput
              label="Date of Birth"
              type="date"
              required
              {...register('dateOfBirth', { required: 'DOB is required' })}
            />

            <FormSelect
              label="Gender"
              required
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' }
              ]}
              {...register('gender', { required: 'Gender is required' })}
            />

            <FormInput
              label="Height"
              placeholder="e.g., 5'10\""
              {...register('height')}
            />
          </div>
        </div>

        {/* Education & Career */}
        <div className="pb-8 border-b">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Education & Career</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Education"
              placeholder="e.g., Bachelor's in Engineering"
              required
              {...register('education', { required: 'Education is required' })}
            />

            <FormInput
              label="Occupation"
              placeholder="e.g., Software Engineer"
              required
              {...register('occupation', { required: 'Occupation is required' })}
            />

            <FormInput
              label="Annual Income (₹)"
              type="number"
              placeholder="e.g., 500000"
              {...register('income')}
            />
          </div>
        </div>

        {/* Interests & Languages */}
        <div className="pb-8 border-b">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Interests & Languages</h2>

          <FormInput
            label="Hobbies (comma-separated)"
            placeholder="Reading, Traveling, Cooking"
            {...register('hobbies')}
          />

          <FormInput
            label="Languages (comma-separated)"
            placeholder="English, Hindi, Urdu"
            {...register('languages')}
          />
        </div>

        {/* About & Looking For */}
        <div className="pb-8 border-b">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">About & Preferences</h2>

          <FormTextarea
            label="About Me"
            placeholder="Tell something about yourself..."
            rows={4}
            {...register('bio')}
          />

          <FormTextarea
            label="Looking For"
            placeholder="Describe your ideal partner..."
            rows={4}
            required
            {...register('lookingFor', { required: 'This field is required' })}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50 transition-smooth font-bold text-lg flex items-center justify-center space-x-2"
        >
          {submitting ? (
            <>
              <Loader className="animate-spin" size={20} />
              <span>Creating Profile...</span>
            </>
          ) : (
            <>
              <Heart size={20} />
              <span>Create Profile</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default MatrimonyProfile;
