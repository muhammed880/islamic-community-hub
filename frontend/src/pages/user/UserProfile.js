import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { User, Mail, Phone, MapPin, Calendar, Upload, Loader } from 'lucide-react';
import FormInput from '../../components/FormInput';
import axiosInstance from '../../utils/axiosInstance';
import { useAuthStore } from '../../store/authStore';

function UserProfile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setValue('firstName', user.firstName);
      setValue('lastName', user.lastName);
      setValue('email', user.email);
      setValue('phone', user.phone);
      setValue('dateOfBirth', user.dateOfBirth?.slice(0, 10) || '');
      if (user.address) {
        setValue('street', user.address.street);
        setValue('city', user.address.city);
        setValue('state', user.address.state);
        setValue('zipCode', user.address.zipCode);
      }
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      await axiosInstance.put('/users/profile', {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode
        }
      });

      // Upload photo if selected
      if (data.profilePicture && data.profilePicture.length > 0) {
        const formData = new FormData();
        formData.append('profilePicture', data.profilePicture[0]);

        await axiosInstance.post('/users/profile/picture', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      updateUser({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone
      });

      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-green-900 mb-8">My Profile</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-8">
        {/* Profile Photo */}
        <div className="mb-8 pb-8 border-b">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Photo</h2>

          <div className="flex items-start space-x-6">
            {photoPreview || user?.profilePicture ? (
              <div className="relative">
                <img
                  src={photoPreview || user.profilePicture}
                  alt="Profile"
                  className="w-32 h-32 rounded-lg object-cover"
                />
              </div>
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                <User size={48} className="text-gray-400" />
              </div>
            )}

            <div>
              <label className="cursor-pointer">
                <div className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-smooth font-semibold flex items-center space-x-2">
                  <Upload size={20} />
                  <span>Change Photo</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                  {...register('profilePicture')}
                />
              </label>
              <p className="text-gray-500 text-sm mt-2">JPG, PNG or WebP • Max 5MB</p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="mb-8 pb-8 border-b">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="First Name"
              required
              error={errors.firstName?.message}
              {...register('firstName', { required: 'First name is required' })}
            />
            <FormInput
              label="Last Name"
              required
              error={errors.lastName?.message}
              {...register('lastName', { required: 'Last name is required' })}
            />

            <FormInput
              label="Email"
              type="email"
              disabled
              icon={Mail}
              {...register('email')}
            />

            <FormInput
              label="Phone Number"
              type="tel"
              icon={Phone}
              {...register('phone')}
            />

            <FormInput
              label="Date of Birth"
              type="date"
              icon={Calendar}
              {...register('dateOfBirth')}
            />
          </div>
        </div>

        {/* Address */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Address</h2>

          <FormInput
            label="Street Address"
            placeholder="123 Main Street"
            icon={MapPin}
            {...register('street')}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormInput
              label="City"
              placeholder="Bangalore"
              {...register('city')}
            />
            <FormInput
              label="State"
              placeholder="Karnataka"
              {...register('state')}
            />
            <FormInput
              label="Zip Code"
              placeholder="560001"
              {...register('zipCode')}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50 transition-smooth font-bold text-lg flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader className="animate-spin" size={20} />
              <span>Saving...</span>
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </form>
    </div>
  );
}

export default UserProfile;
