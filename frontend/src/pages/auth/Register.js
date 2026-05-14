import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { User, Mail, Phone, Lock, Loader } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { useAuthStore } from '../../store/authStore';

function Register() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      // Remove confirm password before sending
      const { confirmPassword, ...submitData } = data;

      const response = await axiosInstance.post('/auth/register', submitData);

      const { userId, email, role, token, refreshToken } = response.data.data;

      login(
        { userId, email, role },
        token,
        refreshToken
      );

      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold text-green-900 text-center mb-2">
        Join Us
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Create your account today
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* First Name & Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              {...register('firstName', { required: 'First name is required' })}
              placeholder="John"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-700"
            />
            {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              {...register('lastName', { required: 'Last name is required' })}
              placeholder="Doe"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-700"
            />
            {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }
            })}
            placeholder="you@example.com"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-700"
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            {...register('phone', {
              required: 'Phone is required',
              pattern: { value: /^\d{10,}$/, message: 'Invalid phone number' }
            })}
            placeholder="+91..."
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-700"
          />
          {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <select
            {...register('gender', { required: 'Gender is required' })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-700"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <p className="text-red-600 text-sm mt-1">{errors.gender.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Minimum 6 characters' }
            })}
            placeholder="••••••••"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-700"
          />
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            {...register('confirmPassword', {
              required: 'Please confirm password',
              validate: (value) => value === password || 'Passwords do not match'
            })}
            placeholder="••••••••"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-700"
          />
          {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>}
        </div>

        {/* Terms */}
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('terms', { required: 'You must accept terms' })}
            className="w-4 h-4"
          />
          <label className="ml-2 text-sm text-gray-700">
            I agree to the{' '}
            <a href="#" className="text-green-700 hover:underline">
              Terms & Conditions
            </a>
          </label>
        </div>
        {errors.terms && <p className="text-red-600 text-sm">{errors.terms.message}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition-smooth flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      {/* Login Link */}
      <p className="text-center text-gray-600 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-green-700 font-semibold hover:underline">
          Sign in here
        </Link>
      </p>
    </div>
  );
}

export default Register;
