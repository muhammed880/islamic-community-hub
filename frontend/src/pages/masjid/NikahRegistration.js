import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Upload, Loader, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import StepProgress from '../../components/StepProgress';
import FormInput from '../../components/FormInput';
import FormSelect from '../../components/FormSelect';
import FormTextarea from '../../components/FormTextarea';
import axiosInstance from '../../utils/axiosInstance';

function NikahRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formId, setFormId] = useState(null);
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const { register, handleSubmit, formState: { errors }, watch, getValues } = useForm();

  const steps = [
    'Ceremony',
    'Imam',
    'Groom',
    'Bride',
    'Witnesses',
    'Mahr',
    'Terms',
    'Payment'
  ];

  useEffect(() => {
    startRegistration();
  }, []);

  const startRegistration = async () => {
    try {
      const response = await axiosInstance.post('/nikah-registration/start', {
        masjidId: localStorage.getItem('masjidId') || 'default'
      });
      setFormId(response.data.data.formId);
    } catch (error) {
      toast.error('Failed to start registration');
    }
  };

  const checkDuplicateAadhaar = async (aadhaar, personType) => {
    try {
      const response = await axiosInstance.post('/nikah-registration/check-aadhaar', {
        aadharNumber: aadhaar,
        personType
      });

      if (response.data.data.foundDuplicate) {
        setDuplicateWarning(response.data.data.previousMarriage);
        return false;
      }
      setDuplicateWarning(null);
      return true;
    } catch (error) {
      console.error('Error checking aadhaar:', error);
      return true;
    }
  };

  const handleNext = async (data) => {
    try {
      setLoading(true);

      switch (currentStep) {
        case 1:
          // Ceremony Details
          await axiosInstance.put(`/nikah-registration/${formId}/ceremony`, {
            marriageDate: data.marriageDate,
            marriageVenue: data.marriageVenue,
            ceremonyTime: data.ceremonyTime,
            ceremonyAddress: {
              street: data.ceremonyStreet,
              city: data.ceremonyCity,
              state: data.ceremonyState
            }
          });
          break;

        case 2:
          // Imam Details
          await axiosInstance.put(`/nikah-registration/${formId}/imam`, {
            name: data.imamName,
            phone: data.imamPhone,
            email: data.imamEmail,
            qualifications: data.imamQualifications
          });
          break;

        case 3:
          // Groom Details + Aadhaar Check
          const groomAadhaarValid = await checkDuplicateAadhaar(data.groomAadhaar, 'groom');
          
          await axiosInstance.put(`/nikah-registration/${formId}/groom`, {
            personalDetails: {
              fullName: data.groomName,
              fatherName: data.groomFather,
              aadharNumber: data.groomAadhaar,
              dateOfBirth: data.groomDOB,
              gender: 'Male'
            },
            address: {
              street: data.groomStreet,
              city: data.groomCity,
              state: data.groomState,
              zipCode: data.groomZip,
              country: 'India'
            },
            contactDetails: {
              mobileNumber: data.groomPhone,
              email: data.groomEmail
            },
            photoDetails: {
              photoUrl: data.groomPhoto ? URL.createObjectURL(data.groomPhoto[0]) : ''
            }
          });
          break;

        case 4:
          // Bride Details + Aadhaar Check
          const brideAadhaarValid = await checkDuplicateAadhaar(data.brideAadhaar, 'bride');
          
          await axiosInstance.put(`/nikah-registration/${formId}/bride`, {
            personalDetails: {
              fullName: data.brideName,
              fatherName: data.brideFather,
              aadharNumber: data.brideAadhaar,
              dateOfBirth: data.brideDOB,
              gender: 'Female'
            },
            address: {
              street: data.brideStreet,
              city: data.brideCity,
              state: data.brideState,
              zipCode: data.brideZip,
              country: 'India'
            },
            contactDetails: {
              mobileNumber: data.bridePhone,
              email: data.brideEmail
            },
            photoDetails: {
              photoUrl: data.bridePhoto ? URL.createObjectURL(data.bridePhoto[0]) : ''
            }
          });
          break;

        case 5:
          // Witnesses
          await axiosInstance.put(`/nikah-registration/${formId}/witnesses`, {
            witness1: {
              name: data.witness1Name,
              address: {
                street: data.witness1Street,
                city: data.witness1City,
                state: data.witness1State
              },
              contactNumber: data.witness1Phone
            },
            witness2: {
              name: data.witness2Name,
              address: {
                street: data.witness2Street,
                city: data.witness2City,
                state: data.witness2State
              },
              contactNumber: data.witness2Phone
            }
          });
          break;

        case 6:
          // Mahr
          await axiosInstance.put(`/nikah-registration/${formId}/mahr`, {
            amount: parseInt(data.maharAmount),
            currency: 'INR',
            maharType: data.maharType,
            description: data.maharDescription,
            paymentMethod: data.maharPaymentMethod
          });
          break;

        case 7:
          // Terms & Conditions
          await axiosInstance.put(`/nikah-registration/${formId}/terms`, {
            termsAndConditions: {
              mutualConsent: true,
              groomConsent: { accepted: data.groomConsent },
              brideConsent: { accepted: data.brideConsent },
              parentalConsent: {
                groomParentConsent: { accepted: data.groomParentConsent },
                brideParentConsent: { accepted: data.brideParentConsent }
              }
            }
          });
          break;

        case 8:
          // Payment
          if (data.paymentMethod === 'Online UPI') {
            await axiosInstance.put(`/nikah-registration/${formId}/fee`, {
              paymentMethod: 'Online UPI',
              utrNumber: data.utrNumber,
              upiTransactionId: data.upiTxnId
            });
          } else {
            await axiosInstance.put(`/nikah-registration/${formId}/fee`, {
              paymentMethod: 'Cash'
            });
          }

          // Submit form
          await axiosInstance.post(`/nikah-registration/${formId}/submit`);
          toast.success('Nikah registration submitted successfully!');
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
      <h1 className="text-3xl font-bold text-green-900 mb-2">Nikah Nama Registration</h1>
      <p className="text-gray-600 mb-8">Marriage Certificate Registration</p>

      <StepProgress currentStep={currentStep} steps={steps} />

      {/* Duplicate Warning */}
      {duplicateWarning && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-yellow-600 mt-1" size={20} />
            <div>
              <p className="font-semibold text-yellow-800">Previous Marriage Record Found</p>
              <p className="text-yellow-700 text-sm mt-1">
                This Aadhaar number has a previous marriage record. Please provide divorce/death certificate if applicable.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(handleNext)} className="bg-white p-8 rounded-lg shadow-md">
        {/* Step 1: Ceremony Details */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Marriage Ceremony Details</h2>

            <FormInput
              label="Marriage Date"
              type="date"
              required
              {...register('marriageDate', { required: 'Marriage date is required' })}
            />

            <FormInput
              label="Marriage Venue"
              placeholder="Masjid name or venue"
              required
              {...register('marriageVenue', { required: 'Venue is required' })}
            />

            <FormInput
              label="Ceremony Time"
              type="time"
              {...register('ceremonyTime')}
            />

            <FormInput
              label="Street Address"
              placeholder="123 Mosque Lane"
              {...register('ceremonyStreet')}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormInput label="City" {...register('ceremonyCity')} />
              <FormInput label="State" {...register('ceremonyState')} />
            </div>
          </div>
        )}

        {/* Step 2: Imam Details */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Solemnizing Imam/Qazi</h2>

            <FormInput
              label="Imam Name"
              placeholder="Full name"
              required
              {...register('imamName', { required: 'Imam name is required' })}
            />

            <FormInput
              label="Contact Number"
              type="tel"
              placeholder="+919876543210"
              required
              {...register('imamPhone', { required: 'Phone is required' })}
            />

            <FormInput
              label="Email"
              type="email"
              placeholder="imam@masjid.com"
              {...register('imamEmail')}
            />

            <FormTextarea
              label="Qualifications"
              placeholder="Islamic qualifications..."
              {...register('imamQualifications')}
            />
          </div>
        )}

        {/* Step 3: Groom Details */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Groom Details</h2>

            <FormInput
              label="Full Name"
              placeholder="Full name"
              required
              {...register('groomName', { required: 'Name is required' })}
            />

            <FormInput
              label="Aadhaar Number (Mandatory)"
              placeholder="12-digit Aadhaar"
              required
              {...register('groomAadhaar', {
                required: 'Aadhaar is required',
                pattern: { value: /^\d{12}$/, message: '12 digits required' }
              })}
            />

            <FormInput
              label="Father Name"
              placeholder="Father's name"
              required
              {...register('groomFather', { required: 'Father name is required' })}
            />

            <FormInput
              label="Date of Birth"
              type="date"
              required
              {...register('groomDOB', { required: 'DOB is required' })}
            />

            <FormInput
              label="Mobile Number"
              type="tel"
              required
              {...register('groomPhone', { required: 'Phone is required' })}
            />

            <FormInput
              label="Email"
              type="email"
              {...register('groomEmail')}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photo Upload
              </label>
              <input
                type="file"
                accept="image/*"
                {...register('groomPhoto')}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
              />
            </div>

            <FormInput
              label="Street Address"
              placeholder="Street"
              {...register('groomStreet')}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormInput label="City" {...register('groomCity')} />
              <FormInput label="State" {...register('groomState')} />
              <FormInput label="Zip Code" {...register('groomZip')} />
            </div>
          </div>
        )}

        {/* Step 4: Bride Details (Similar to Groom) */}
        {currentStep === 4 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Bride Details</h2>

            <FormInput
              label="Full Name"
              placeholder="Full name"
              required
              {...register('brideName', { required: 'Name is required' })}
            />

            <FormInput
              label="Aadhaar Number (Mandatory)"
              placeholder="12-digit Aadhaar"
              required
              {...register('brideAadhaar', {
                required: 'Aadhaar is required',
                pattern: { value: /^\d{12}$/, message: '12 digits required' }
              })}
            />

            <FormInput
              label="Father Name"
              placeholder="Father's name"
              required
              {...register('brideFather', { required: 'Father name is required' })}
            />

            <FormInput
              label="Date of Birth"
              type="date"
              required
              {...register('brideDOB', { required: 'DOB is required' })}
            />

            <FormInput
              label="Mobile Number"
              type="tel"
              required
              {...register('bridePhone', { required: 'Phone is required' })}
            />

            <FormInput
              label="Email"
              type="email"
              {...register('brideEmail')}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photo Upload
              </label>
              <input
                type="file"
                accept="image/*"
                {...register('bridePhoto')}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
              />
            </div>

            <FormInput label="Street Address" placeholder="Street" {...register('brideStreet')} />
            <div className="grid grid-cols-3 gap-4">
              <FormInput label="City" {...register('brideCity')} />
              <FormInput label="State" {...register('brideState')} />
              <FormInput label="Zip Code" {...register('brideZip')} />
            </div>
          </div>
        )}

        {/* Step 5: Witnesses */}
        {currentStep === 5 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Witnesses (Only Names Required)</h2>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">Witness 1</h3>
            <FormInput label="Name" required {...register('witness1Name', { required: 'Required' })} />
            <FormInput label="Street Address" {...register('witness1Street')} />
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="City" {...register('witness1City')} />
              <FormInput label="State" {...register('witness1State')} />
            </div>
            <FormInput label="Contact Number" type="tel" required {...register('witness1Phone', { required: 'Required' })} />

            <hr className="my-6" />

            <h3 className="text-lg font-semibold text-gray-800 mb-4">Witness 2</h3>
            <FormInput label="Name" required {...register('witness2Name', { required: 'Required' })} />
            <FormInput label="Street Address" {...register('witness2Street')} />
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="City" {...register('witness2City')} />
              <FormInput label="State" {...register('witness2State')} />
            </div>
            <FormInput label="Contact Number" type="tel" required {...register('witness2Phone', { required: 'Required' })} />
          </div>
        )}

        {/* Step 6: Mahr */}
        {currentStep === 6 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Mahr (Dower)</h2>

            <FormInput
              label="Mahr Amount (in ₹)"
              type="number"
              placeholder="50000"
              required
              {...register('maharAmount', { required: 'Amount is required' })}
            />

            <FormSelect
              label="Mahr Type"
              required
              options={[
                { value: 'Cash', label: 'Cash' },
                { value: 'Gold/Jewelry', label: 'Gold/Jewelry' },
                { value: 'Property', label: 'Property' },
                { value: 'Mixed', label: 'Mixed' }
              ]}
              {...register('maharType', { required: 'Type is required' })}
            />

            <FormTextarea
              label="Mahr Description"
              placeholder="Details of the mahr..."
              {...register('maharDescription')}
            />

            <FormSelect
              label="Payment Method"
              options={[
                { value: 'Immediate', label: 'Immediate' },
                { value: 'Deferred', label: 'Deferred' }
              ]}
              {...register('maharPaymentMethod')}
            />
          </div>
        )}

        {/* Step 7: Terms & Conditions */}
        {currentStep === 7 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Consent & Terms</h2>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-blue-800 text-sm">
                Both groom and bride must accept the terms of this marriage contract in accordance with Islamic law.
              </p>
            </div>

            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('groomConsent')}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">Groom confirms his free consent</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('brideConsent')}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">Bride confirms her free consent</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('groomParentConsent')}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">Groom's parents consent</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('brideParentConsent')}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">Bride's parents consent</span>
              </label>
            </div>
          </div>
        )}

        {/* Step 8: Payment */}
        {currentStep === 8 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Nikah Registration Fee</h2>

            <div className="bg-green-50 p-6 rounded-lg mb-6">
              <p className="text-green-800 font-semibold">Registration Fee: ₹500</p>
            </div>

            <FormSelect
              label="Payment Method"
              required
              options={[
                { value: 'Cash', label: 'Cash' },
                { value: 'Online UPI', label: 'Online UPI' }
              ]}
              {...register('paymentMethod', { required: 'Payment method is required' })}
            />

            {watch('paymentMethod') === 'Online UPI' && (
              <>
                <FormInput
                  label="UTR / Transaction ID"
                  placeholder="Enter UTR"
                  required
                  {...register('utrNumber', { required: 'UTR is required' })}
                />
                <FormInput
                  label="UPI Transaction ID (Optional)"
                  placeholder="Auto-detected"
                  {...register('upiTxnId')}
                />
              </>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-smooth"
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
                <span>{currentStep === 8 ? 'Submit' : 'Next'}</span>
                {currentStep < 8 && <ChevronRight size={20} />}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NikahRegistration;
