import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { MapPin, Upload, Loader, ChevronRight, ChevronLeft } from 'lucide-react';
import StepProgress from '../../components/StepProgress';
import FormInput from '../../components/FormInput';
import FormSelect from '../../components/FormSelect';
import FormTextarea from '../../components/FormTextarea';
import axiosInstance from '../../utils/axiosInstance';

function MasjidRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formId, setFormId] = useState(null);
  const [mapLocation, setMapLocation] = useState(null);
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm();

  const steps = [
    'Basic Info',
    'Address',
    'Members',
    'Documents',
    'Payment',
    'Review'
  ];

  useEffect(() => {
    startRegistration();
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setMapLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  }, []);

  const startRegistration = async () => {
    try {
      const response = await axiosInstance.post('/masjid-registration/start');
      setFormId(response.data.data.formId);
    } catch (error) {
      toast.error('Failed to start registration');
    }
  };

  const handleNext = async (data) => {
    try {
      setLoading(true);

      switch (currentStep) {
        case 1:
          // Basic Info
          await axiosInstance.put(`/masjid-registration/${formId}/basic-info`, {
            masjidName: data.masjidName,
            address: {
              street: data.street,
              city: data.city,
              state: data.state,
              zipCode: data.zipCode,
              country: 'India',
              latitude: mapLocation?.lat || 0,
              longitude: mapLocation?.lng || 0,
              landmark: data.landmark
            },
            mobileNumber: data.mobileNumber,
            upiId: data.upiId
          });
          break;

        case 2:
          // Members
          await axiosInstance.put(`/masjid-registration/${formId}/members`, {
            president: {
              name: data.presidentName,
              mobileNumber: data.presidentPhone
            },
            secretary: {
              name: data.secretaryName,
              mobileNumber: data.secretaryPhone
            },
            treasurer: {
              name: data.treasurerName,
              mobileNumber: data.treasurerPhone
            },
            additionalMembers: [
              { name: data.member1Name },
              { name: data.member2Name },
              { name: data.member3Name }
            ].filter(m => m.name)
          });
          break;

        case 3:
          // Documents
          if (currentStep === 3) {
            // Handle file uploads
            const formData = new FormData();
            if (data.registrationCert) {
              formData.append('document', data.registrationCert[0]);
              await axiosInstance.post(
                `/masjid-registration/${formId}/upload-document?documentType=registrationCertificate`,
                formData
              );
            }
          }
          break;

        case 4:
          // Payment
          const feeResponse = await axiosInstance.get(`/masjid-registration/${formId}/fee-details`);
          toast.info(`Please pay ₹${feeResponse.data.data.registrationFee} via UPI`);
          
          // Record payment
          await axiosInstance.put(`/masjid-registration/${formId}/record-payment`, {
            utrNumber: data.utrNumber,
            upiTransactionId: data.upiTxnId,
            paymentProofScreenshot: data.paymentProof
          });
          break;

        case 5:
          // Submit
          await axiosInstance.post(`/masjid-registration/${formId}/submit`);
          toast.success('Registration submitted successfully!');
          return;
      }

      setCurrentStep(currentStep + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error in registration');
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-green-900 mb-8">Masjid Registration</h1>

      <StepProgress currentStep={currentStep} steps={steps} />

      <form onSubmit={handleSubmit(handleNext)} className="bg-white p-8 rounded-lg shadow-md">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>

            <FormInput
              label="Masjid Name"
              placeholder="Enter masjid name"
              required
              error={errors.masjidName?.message}
              {...register('masjidName', { required: 'Masjid name is required' })}
            />

            <FormInput
              label="Street Address"
              placeholder="123 Mosque Lane"
              required
              error={errors.street?.message}
              {...register('street', { required: 'Street is required' })}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="City"
                placeholder="Bangalore"
                required
                error={errors.city?.message}
                {...register('city', { required: 'City is required' })}
              />
              <FormInput
                label="State"
                placeholder="Karnataka"
                required
                error={errors.state?.message}
                {...register('state', { required: 'State is required' })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Zip Code"
                placeholder="560001"
                required
                error={errors.zipCode?.message}
                {...register('zipCode', { required: 'Zip code is required' })}
              />
              <FormInput
                label="Landmark"
                placeholder="Near XYZ..."
                error={errors.landmark?.message}
                {...register('landmark')}
              />
            </div>

            <FormInput
              label="Mobile Number"
              type="tel"
              placeholder="+919876543210"
              required
              error={errors.mobileNumber?.message}
              {...register('mobileNumber', { required: 'Mobile number is required' })}
            />

            <FormInput
              label="UPI ID"
              placeholder="masjidname@upi"
              required
              error={errors.upiId?.message}
              {...register('upiId', { required: 'UPI ID is required' })}
            />

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-blue-800 text-sm">
                📍 Location detected: {mapLocation ? `${mapLocation.lat.toFixed(4)}, ${mapLocation.lng.toFixed(4)}` : 'Detecting...'}
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Members */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Organization Members</h2>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">President</h3>
            <FormInput
              label="Name"
              placeholder="Full name"
              required
              {...register('presidentName', { required: 'President name is required' })}
            />
            <FormInput
              label="Mobile Number"
              type="tel"
              placeholder="+919876543210"
              required
              {...register('presidentPhone', { required: 'President phone is required' })}
            />

            <hr className="my-6" />

            <h3 className="text-lg font-semibold text-gray-800 mb-4">Secretary</h3>
            <FormInput
              label="Name"
              placeholder="Full name"
              required
              {...register('secretaryName', { required: 'Secretary name is required' })}
            />
            <FormInput
              label="Mobile Number"
              type="tel"
              placeholder="+919876543210"
              required
              {...register('secretaryPhone', { required: 'Secretary phone is required' })}
            />

            <hr className="my-6" />

            <h3 className="text-lg font-semibold text-gray-800 mb-4">Treasurer</h3>
            <FormInput
              label="Name"
              placeholder="Full name"
              required
              {...register('treasurerName', { required: 'Treasurer name is required' })}
            />
            <FormInput
              label="Mobile Number"
              type="tel"
              placeholder="+919876543210"
              required
              {...register('treasurerPhone', { required: 'Treasurer phone is required' })}
            />

            <hr className="my-6" />

            <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Members (Optional)</h3>
            {[1, 2, 3].map((i) => (
              <FormInput
                key={i}
                label={`Member ${i} Name`}
                placeholder="Full name"
                {...register(`member${i}Name`)}
              />
            ))}
          </div>
        )}

        {/* Step 3: Documents */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Documents</h2>

            <div className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center mb-6">
              <Upload className="mx-auto text-green-600 mb-4" size={40} />
              <label className="cursor-pointer">
                <p className="font-semibold text-gray-900">Registration Certificate</p>
                <p className="text-gray-600 text-sm">Click to upload or drag and drop</p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  {...register('registrationCert')}
                />
              </label>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-800 text-sm">
                📄 Required documents: Registration Certificate, Trust Deed, Aadhaar of President
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Payment */}
        {currentStep === 4 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Registration Fee</h2>

            <div className="bg-green-50 p-6 rounded-lg mb-6">
              <p className="text-green-800 font-semibold">Registration Fee: ₹5,000</p>
              <p className="text-green-700 text-sm mt-2">Pay via UPI and enter transaction details</p>
            </div>

            <FormInput
              label="UTR / Transaction ID"
              placeholder="Enter transaction reference"
              required
              {...register('utrNumber', { required: 'UTR is required' })}
            />

            <FormInput
              label="UPI Transaction ID (Optional)"
              placeholder="Auto-detected from phone"
              {...register('upiTxnId')}
            />
          </div>
        )}

        {/* Step 5: Review */}
        {currentStep === 5 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Submit</h2>

            <div className="bg-green-50 p-6 rounded-lg">
              <p className="text-green-800 font-semibold mb-4">✓ All information filled correctly?</p>
              <p className="text-green-700 text-sm">
                Please review all details before final submission. After submission, your registration will be sent to Super Admin for verification.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
          >
            <ChevronLeft size={20} />
            <span>Previous</span>
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50 transition-smooth"
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={20} />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{currentStep === 5 ? 'Submit' : 'Next'}</span>
                {currentStep < 5 && <ChevronRight size={20} />}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MasjidRegistration;
