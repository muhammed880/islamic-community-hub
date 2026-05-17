const NikahRegistrationForm = require('../models/NikahRegistrationForm');
const { generateId, generateCertificateNumber, formatSuccessResponse, formatErrorResponse, paginate } = require('../utils/helpers');
const logger = require('../utils/logger');
const certificateGenerator = require('../utils/certificateGenerator');
const QRCode = require('qrcode');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// STEP 1: START NIKAH REGISTRATION FORM
exports.startNikahForm = async (req, res) => {
  try {
    const { masjidId } = req.body;

    if (!masjidId) {
      return res.status(400).json(formatErrorResponse('Masjid ID is required'));
    }

    const formNumber = `NIKAH-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const newForm = new NikahRegistrationForm({
      formNumber,
      masjidId,
      status: 'draft',
      formProgress: {
        step1_ceremony: false,
        step2_imam: false,
        step3_groom: false,
        step4_bride: false,
        step5_witnesses: false,
        step6_mahr: false,
        step7_terms: false,
        step8_fee: false,
        allStepsCompleted: false
      }
    });

    await newForm.save();

    res.status(201).json(
      formatSuccessResponse('Nikah registration form created', {
        formId: newForm._id,
        formNumber: newForm.formNumber,
        status: newForm.status,
        totalSteps: 8
      })
    );
  } catch (error) {
    logger.error('Error starting nikah form:', error);
    res.status(500).json(formatErrorResponse('Failed to start registration', [{ message: error.message }]));
  }
};

// STEP 1: UPDATE CEREMONY DETAILS
exports.updateCeremonyDetails = async (req, res) => {
  try {
    const { formId } = req.params;
    const { marriageDate, marriageVenue, ceremonyTime, ceremonyAddress } = req.body;

    if (!marriageDate || !marriageVenue) {
      return res.status(400).json(formatErrorResponse('Marriage date and venue are required'));
    }

    // Validate date is not in past
    if (new Date(marriageDate) < new Date()) {
      return res.status(400).json(formatErrorResponse('Marriage date cannot be in the past'));
    }

    const updatedForm = await NikahRegistrationForm.findByIdAndUpdate(
      formId,
      {
        'ceremonyDetails.marriageDate': new Date(marriageDate),
        'ceremonyDetails.marriageVenue': marriageVenue,
        'ceremonyDetails.ceremonyTime': ceremonyTime,
        'ceremonyDetails.ceremonyAddress': ceremonyAddress,
        'formProgress.step1_ceremony': true
      },
      { new: true }
    );

    res.json(formatSuccessResponse('Ceremony details updated', {
      formId: updatedForm._id,
      ceremonyDetails: updatedForm.ceremonyDetails,
      progress: updatedForm.formProgress
    }));
  } catch (error) {
    logger.error('Error updating ceremony details:', error);
    res.status(500).json(formatErrorResponse('Failed to update ceremony details', [{ message: error.message }]));
  }
};

// STEP 2: UPDATE IMAM/QAZI DETAILS
exports.updateImamDetails = async (req, res) => {
  try {
    const { formId } = req.params;
    const { name, phone, email, qualifications, registrationNumber } = req.body;

    if (!name || !phone) {
      return res.status(400).json(formatErrorResponse('Imam name and contact are required'));
    }

    const updatedForm = await NikahRegistrationForm.findByIdAndUpdate(
      formId,
      {
        'imam.name': name,
        'imam.contact.phone': phone,
        'imam.contact.email': email,
        'imam.qualifications': qualifications,
        'imam.registrationNumber': registrationNumber,
        'imam.certificateName': name, // Auto-fill for certificate
        'formProgress.step2_imam': true
      },
      { new: true }
    );

    res.json(formatSuccessResponse('Imam details updated', {
      formId: updatedForm._id,
      imamDetails: updatedForm.imam,
      progress: updatedForm.formProgress
    }));
  } catch (error) {
    logger.error('Error updating imam details:', error);
    res.status(500).json(formatErrorResponse('Failed to update imam details', [{ message: error.message }]));
  }
};

// CHECK FOR DUPLICATE AADHAAR
exports.checkDuplicateAadhaar = async (req, res) => {
  try {
    const { aadharNumber, personType } = req.body; // personType: 'groom' or 'bride'

    if (!aadharNumber || !personType) {
      return res.status(400).json(formatErrorResponse('Aadhaar number and person type required'));
    }

    // Search for existing marriages with this Aadhaar
    const existingMarriage = await NikahRegistrationForm.findOne({
      $or: [
        { 'groom.personalDetails.aadharNumber': aadharNumber },
        { 'bride.personalDetails.aadharNumber': aadharNumber }
      ],
      status: { $in: ['verified', 'certificate_issued'] }
    }).select('formNumber ceremonyDetails.marriageDate groom bride');

    if (existingMarriage) {
      // Return previous marriage details
      const marriageInfo = existingMarriage.groom.personalDetails.aadharNumber === aadharNumber
        ? existingMarriage.groom
        : existingMarriage.bride;

      return res.json(formatSuccessResponse('Previous marriage record found', {
        foundDuplicate: true,
        message: 'This Aadhaar number is already registered in our system',
        previousMarriage: {
          marriageDate: existingMarriage.ceremonyDetails.marriageDate,
          spouseName: existingMarriage.groom.personalDetails.aadharNumber === aadharNumber
            ? existingMarriage.bride.personalDetails.fullName
            : existingMarriage.groom.personalDetails.fullName,
          certificateNumber: existingMarriage.certificate.certificateNumber
        },
        requiresDocumentation: true,
        message: 'Please provide divorce certificate or death certificate'
      }));
    }

    res.json(formatSuccessResponse('Aadhaar number is unique', {
      foundDuplicate: false,
      message: 'No previous marriage record found'
    }));
  } catch (error) {
    logger.error('Error checking duplicate aadhaar:', error);
    res.status(500).json(formatErrorResponse('Failed to check aadhaar', [{ message: error.message }]));
  }
};

// STEP 3: UPDATE GROOM DETAILS
exports.updateGroomDetails = async (req, res) => {
  try {
    const { formId } = req.params;
    const { groom } = req.body;

    if (!groom || !groom.personalDetails || !groom.personalDetails.fullName || !groom.personalDetails.aadharNumber) {
      return res.status(400).json(formatErrorResponse('Groom details incomplete', [
        { message: 'Full name and Aadhaar number are mandatory' }
      ]));
    }

    // Check Aadhaar format
    if (!/^\d{12}$/.test(groom.personalDetails.aadharNumber)) {
      return res.status(400).json(formatErrorResponse('Invalid Aadhaar format. Must be 12 digits'));
    }

    const updatedForm = await NikahRegistrationForm.findByIdAndUpdate(
      formId,
      {
        groom,
        'formProgress.step3_groom': true
      },
      { new: true, runValidators: true }
    );

    res.json(formatSuccessResponse('Groom details updated', {
      formId: updatedForm._id,
      groomName: updatedForm.groom.personalDetails.fullName,
      progress: updatedForm.formProgress
    }));
  } catch (error) {
    logger.error('Error updating groom details:', error);
    res.status(500).json(formatErrorResponse('Failed to update groom details', [{ message: error.message }]));
  }
};

// STEP 4: UPDATE BRIDE DETAILS
exports.updateBrideDetails = async (req, res) => {
  try {
    const { formId } = req.params;
    const { bride } = req.body;

    if (!bride || !bride.personalDetails || !bride.personalDetails.fullName || !bride.personalDetails.aadharNumber) {
      return res.status(400).json(formatErrorResponse('Bride details incomplete', [
        { message: 'Full name and Aadhaar number are mandatory' }
      ]));
    }

    // Check Aadhaar format
    if (!/^\d{12}$/.test(bride.personalDetails.aadharNumber)) {
      return res.status(400).json(formatErrorResponse('Invalid Aadhaar format. Must be 12 digits'));
    }

    const updatedForm = await NikahRegistrationForm.findByIdAndUpdate(
      formId,
      {
        bride,
        'formProgress.step4_bride': true
      },
      { new: true, runValidators: true }
    );

    res.json(formatSuccessResponse('Bride details updated', {
      formId: updatedForm._id,
      brideName: updatedForm.bride.personalDetails.fullName,
      progress: updatedForm.formProgress
    }));
  } catch (error) {
    logger.error('Error updating bride details:', error);
    res.status(500).json(formatErrorResponse('Failed to update bride details', [{ message: error.message }]));
  }
};

// STEP 5: UPDATE WITNESSES DETAILS
exports.updateWitnessesDetails = async (req, res) => {
  try {
    const { formId } = req.params;
    const { witness1, witness2 } = req.body;

    if (!witness1 || !witness1.name || !witness1.contactNumber) {
      return res.status(400).json(formatErrorResponse('Witness 1 details incomplete'));
    }

    if (!witness2 || !witness2.name || !witness2.contactNumber) {
      return res.status(400).json(formatErrorResponse('Witness 2 details incomplete'));
    }

    // Auto-fill certificate names
    witness1.certificateName = witness1.name;
    witness2.certificateName = witness2.name;

    const updatedForm = await NikahRegistrationForm.findByIdAndUpdate(
      formId,
      {
        witness1,
        witness2,
        'formProgress.step5_witnesses': true
      },
      { new: true }
    );

    res.json(formatSuccessResponse('Witnesses details updated', {
      formId: updatedForm._id,
      witness1Name: updatedForm.witness1.name,
      witness2Name: updatedForm.witness2.name,
      progress: updatedForm.formProgress
    }));
  } catch (error) {
    logger.error('Error updating witnesses details:', error);
    res.status(500).json(formatErrorResponse('Failed to update witnesses details', [{ message: error.message }]));
  }
};

// OPTIONAL: UPDATE WAKEEL DETAILS
exports.updateWakeelDetails = async (req, res) => {
  try {
    const { formId } = req.params;
    const { wakeel } = req.body;

    if (wakeel && wakeel.isApplicable && (!wakeel.name || !wakeel.contactNumber)) {
      return res.status(400).json(formatErrorResponse('Wakeel details incomplete if applicable'));
    }

    const updatedForm = await NikahRegistrationForm.findByIdAndUpdate(
      formId,
      { wakeel },
      { new: true }
    );

    res.json(formatSuccessResponse('Wakeel details updated', {
      formId: updatedForm._id,
      wakeelApplicable: updatedForm.wakeel.isApplicable
    }));
  } catch (error) {
    logger.error('Error updating wakeel details:', error);
    res.status(500).json(formatErrorResponse('Failed to update wakeel details', [{ message: error.message }]));
  }
};

// STEP 6: UPDATE MAHR DETAILS
exports.updateMaharDetails = async (req, res) => {
  try {
    const { formId } = req.params;
    const { amount, currency, maharType, description, paymentDueDate, paymentMethod } = req.body;

    if (!amount || !maharType) {
      return res.status(400).json(formatErrorResponse('Mahr amount and type are required'));
    }

    // Convert amount to words
    const amountInWords = numberToWords(amount);

    const updatedForm = await NikahRegistrationForm.findByIdAndUpdate(
      formId,
      {
        'mahr.amount': amount,
        'mahr.currency': currency || 'INR',
        'mahr.amountInWords': amountInWords,
        'mahr.maharType': maharType,
        'mahr.description': description,
        'mahr.paymentDueDate': paymentDueDate,
        'mahr.paymentMethod': paymentMethod,
        'formProgress.step6_mahr': true
      },
      { new: true }
    );

    res.json(formatSuccessResponse('Mahr details updated', {
      formId: updatedForm._id,
      maharAmount: updatedForm.mahr.amount,
      maharInWords: updatedForm.mahr.amountInWords,
      progress: updatedForm.formProgress
    }));
  } catch (error) {
    logger.error('Error updating mahr details:', error);
    res.status(500).json(formatErrorResponse('Failed to update mahr details', [{ message: error.message }]));
  }
};

// STEP 7: UPDATE TERMS & CONDITIONS
exports.updateTermsAndConditions = async (req, res) => {
  try {
    const { formId } = req.params;
    const { termsAndConditions } = req.body;

    if (!termsAndConditions.mutualConsent) {
      return res.status(400).json(formatErrorResponse('Mutual consent is mandatory'));
    }

    if (!termsAndConditions.groomConsent || !termsAndConditions.brideConsent) {
      return res.status(400).json(formatErrorResponse('Both groom and bride must consent'));
    }

    const updatedForm = await NikahRegistrationForm.findByIdAndUpdate(
      formId,
      {
        termsAndConditions,
        'formProgress.step7_terms': true
      },
      { new: true }
    );

    res.json(formatSuccessResponse('Terms and conditions updated', {
      formId: updatedForm._id,
      mutualConsent: updatedForm.termsAndConditions.mutualConsent,
      progress: updatedForm.formProgress
    }));
  } catch (error) {
    logger.error('Error updating terms:', error);
    res.status(500).json(formatErrorResponse('Failed to update terms and conditions', [{ message: error.message }]));
  }
};

// STEP 8: UPDATE REGISTRATION FEE DETAILS
exports.updateRegistrationFee = async (req, res) => {
  try {
    const { formId } = req.params;
    const { paymentMethod, utrNumber, upiTransactionId, paymentProofScreenshot } = req.body;

    if (!paymentMethod) {
      return res.status(400).json(formatErrorResponse('Payment method is required'));
    }

    const updateData = {
      'registrationFee.paymentMethod': paymentMethod,
      'formProgress.step8_fee': true
    };

    if (paymentMethod === 'Online UPI') {
      if (!utrNumber) {
        return res.status(400).json(formatErrorResponse('UTR number is mandatory for online payment'));
      }
      updateData['registrationFee.utrNumber'] = utrNumber;
      updateData['registrationFee.upiTransactionId'] = upiTransactionId;
      updateData['registrationFee.paymentProofScreenshot'] = paymentProofScreenshot;
      updateData['registrationFee.paymentStatus'] = 'paid';
    }

    const updatedForm = await NikahRegistrationForm.findByIdAndUpdate(
      formId,
      updateData,
      { new: true }
    );

    res.json(formatSuccessResponse('Registration fee updated', {
      formId: updatedForm._id,
      paymentMethod: updatedForm.registrationFee.paymentMethod,
      feeAmount: updatedForm.registrationFee.amount,
      progress: updatedForm.formProgress
    }));
  } catch (error) {
    logger.error('Error updating registration fee:', error);
    res.status(500).json(formatErrorResponse('Failed to update registration fee', [{ message: error.message }]));
  }
};

// SUBMIT NIKAH REGISTRATION FORM
exports.submitNikahForm = async (req, res) => {
  try {
    const { formId } = req.params;
    const userId = req.userId;

    const form = await NikahRegistrationForm.findById(formId);

    if (!form) {
      return res.status(404).json(formatErrorResponse('Form not found'));
    }

    // Check all steps are completed
    if (!form.formProgress.allStepsCompleted) {
      // Mark all completed steps
      const allStepsCompleted = Object.values(form.formProgress).every(v => v === true || typeof v !== 'boolean');
      if (!allStepsCompleted) {
        return res.status(400).json(formatErrorResponse('Please complete all steps before submitting'));
      }
    }

    // Update form status
    const updatedForm = await NikahRegistrationForm.findByIdAndUpdate(
      formId,
      {
        status: 'submitted',
        submittedDate: new Date(),
        submittedBy: userId,
        'formProgress.allStepsCompleted': true
      },
      { new: true }
    );

    logger.info(`Nikah registration submitted: ${updatedForm.formNumber}`);

    res.json(formatSuccessResponse('Nikah registration submitted successfully', {
      formId: updatedForm._id,
      formNumber: updatedForm.formNumber,
      status: updatedForm.status,
      message: 'Your form has been submitted. Awaiting Masjid Authority verification.'
    }));
  } catch (error) {
    logger.error('Error submitting nikah form:', error);
    res.status(500).json(formatErrorResponse('Failed to submit form', [{ message: error.message }]));
  }
};

// GENERATE CERTIFICATE WITH UNIQUE ID
exports.generateCertificate = async (req, res) => {
  try {
    const { formId } = req.params;
    const { designStyle } = req.body;

    const form = await NikahRegistrationForm.findById(formId);

    if (!form) {
      return res.status(404).json(formatErrorResponse('Form not found'));
    }

    if (form.status !== 'verified') {
      return res.status(400).json(formatErrorResponse('Form must be verified before generating certificate'));
    }

    // Generate Unique ID and Certificate Number
    const uniqueId = `NIKAH-${form.masjidId.toString().slice(-6)}-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const certificateNumber = `CERT-${new Date().getFullYear()}-${String(Math.random() * 10000).split('.')[0].padStart(6, '0')}`;

    // Generate QR Code
    const qrCodeData = `${uniqueId}|${certificateNumber}|${form.ceremonyDetails.marriageDate}`;
    const qrCodeUrl = await QRCode.toDataURL(qrCodeData);

    // Generate PDF Certificate
    const pdfFileName = `nikah-certificate-${uniqueId}.pdf`;
    const pdfPath = path.join(__dirname, '../../uploads/certificates', pdfFileName);

    await certificateGenerator.generateNikahCertificate(
      {
        ...form.toObject(),
        uniqueId,
        certificateNumber,
        qrCode: qrCodeUrl,
        designStyle: designStyle || 'Islamic Pattern 1'
      },
      pdfPath
    );

    // Update form with certificate details
    const updatedForm = await NikahRegistrationForm.findByIdAndUpdate(
      formId,
      {
        'certificate.uniqueId': uniqueId,
        'certificate.certificateNumber': certificateNumber,
        'certificate.certificateGenerated': true,
        'certificate.certificateGeneratedDate': new Date(),
        'certificate.certificatePdfUrl': `/uploads/certificates/${pdfFileName}`,
        'certificate.certificateQrCode': qrCodeUrl,
        'certificate.designStyle': designStyle || 'Islamic Pattern 1',
        'certificate.certificateStatus': 'generated'
      },
      { new: true }
    );

    res.json(formatSuccessResponse('Certificate generated successfully', {
      formId: updatedForm._id,
      uniqueId: updatedForm.certificate.uniqueId,
      certificateNumber: updatedForm.certificate.certificateNumber,
      certificatePdfUrl: updatedForm.certificate.certificatePdfUrl,
      certificateQrCode: updatedForm.certificate.certificateQrCode,
      actions: {
        preview: `/api/nikah-registration/${formId}/preview`,
        download: `/api/nikah-registration/${formId}/download`,
        print: `/api/nikah-registration/${formId}/print`,
        share: `/api/nikah-registration/${formId}/share`
      }
    }));
  } catch (error) {
    logger.error('Error generating certificate:', error);
    res.status(500).json(formatErrorResponse('Failed to generate certificate', [{ message: error.message }]));
  }
};

// PREVIEW CERTIFICATE
exports.previewCertificate = async (req, res) => {
  try {
    const { formId } = req.params;

    const form = await NikahRegistrationForm.findById(formId);

    if (!form || !form.certificate.certificatePdfUrl) {
      return res.status(404).json(formatErrorResponse('Certificate not found'));
    }

    const pdfPath = path.join(__dirname, '../../', form.certificate.certificatePdfUrl);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=nikah-${form.certificate.certificateNumber}.pdf`);
    res.sendFile(pdfPath);
  } catch (error) {
    logger.error('Error previewing certificate:', error);
    res.status(500).json(formatErrorResponse('Failed to preview certificate'));
  }
};

// DOWNLOAD CERTIFICATE
exports.downloadCertificate = async (req, res) => {
  try {
    const { formId } = req.params;

    const form = await NikahRegistrationForm.findById(formId);

    if (!form || !form.certificate.certificatePdfUrl) {
      return res.status(404).json(formatErrorResponse('Certificate not found'));
    }

    // Update download count
    await NikahRegistrationForm.findByIdAndUpdate(
      formId,
      {
        'sharing.downloadCount': (form.sharing.downloadCount || 0) + 1,
        'sharing.lastDownloadDate': new Date()
      }
    );

    const pdfPath = path.join(__dirname, '../../', form.certificate.certificatePdfUrl);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=nikah-${form.certificate.certificateNumber}.pdf`);
    res.sendFile(pdfPath);
  } catch (error) {
    logger.error('Error downloading certificate:', error);
    res.status(500).json(formatErrorResponse('Failed to download certificate'));
  }
};

// SHARE CERTIFICATE
exports.shareCertificate = async (req, res) => {
  try {
    const { formId } = req.params;
    const { shareWith, expiryDays } = req.body;

    const form = await NikahRegistrationForm.findById(formId);

    if (!form) {
      return res.status(404).json(formatErrorResponse('Form not found'));
    }

    const shareToken = crypto.randomBytes(16).toString('hex');
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + (expiryDays || 7));

    const shareLink = `${process.env.FRONTEND_URL}/nikah-certificate/${shareToken}`;

    const updatedForm = await NikahRegistrationForm.findByIdAndUpdate(
      formId,
      {
        $push: {
          'sharing.shareLinks': {
            shareToken,
            sharedWith: shareWith,
            sharedDate: new Date(),
            expiryDate
          }
        }
      },
      { new: true }
    );

    res.json(formatSuccessResponse('Certificate shared successfully', {
      shareLink,
      expiryDate,
      message: 'Link will expire in ' + expiryDays + ' days'
    }));
  } catch (error) {
    logger.error('Error sharing certificate:', error);
    res.status(500).json(formatErrorResponse('Failed to share certificate'));
  }
};

// GET FORM DETAILS
exports.getNikahFormDetails = async (req, res) => {
  try {
    const { formId } = req.params;

    const form = await NikahRegistrationForm.findById(formId);

    if (!form) {
      return res.status(404).json(formatErrorResponse('Form not found'));
    }

    res.json(formatSuccessResponse('Form details retrieved', form));
  } catch (error) {
    logger.error('Error getting form details:', error);
    res.status(500).json(formatErrorResponse('Failed to retrieve form details'));
  }
};

// UTILITY: Convert number to words
function numberToWords(num) {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const scales = ['', 'Thousand', 'Million', 'Billion'];

  if (num === 0) return 'Zero';

  let words = '';
  let scaleIndex = 0;

  while (num > 0) {
    if (num % 1000 !== 0) {
      words = convertHundreds(num % 1000, ones, teens, tens) + (scales[scaleIndex] ? ' ' + scales[scaleIndex] : '') + (words ? ' ' + words : '');
    }
    num = Math.floor(num / 1000);
    scaleIndex++;
  }

  return words.trim();
}

function convertHundreds(num, ones, teens, tens) {
  let result = '';

  const hundreds = Math.floor(num / 100);
  if (hundreds > 0) {
    result += ones[hundreds] + ' Hundred';
  }

  const remainder = num % 100;
  if (remainder >= 20) {
    result += (result ? ' ' : '') + tens[Math.floor(remainder / 10)];
    if (remainder % 10 > 0) {
      result += ' ' + ones[remainder % 10];
    }
  } else if (remainder > 0) {
    result += (result ? ' ' : '') + teens[remainder - 10];
  }

  return result;
}

module.exports = {
  startNikahForm,
  updateCeremonyDetails,
  updateImamDetails,
  checkDuplicateAadhaar,
  updateGroomDetails,
  updateBrideDetails,
  updateWitnessesDetails,
  updateWakeelDetails,
  updateMaharDetails,
  updateTermsAndConditions,
  updateRegistrationFee,
  submitNikahForm,
  generateCertificate,
  previewCertificate,
  downloadCertificate,
  shareCertificate,
  getNikahFormDetails
};
