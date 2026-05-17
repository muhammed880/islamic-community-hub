const MasjidRegistrationForm = require('../models/MasjidRegistrationForm');
const Masjid = require('../models/Masjid');
const User = require('../models/User');
const { generateId, generateReceiptNumber, formatSuccessResponse, formatErrorResponse, paginate } = require('../utils/helpers');
const { isValidUpiId } = require('../utils/validators');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const logger = require('../utils/logger');

// STEP 1: CREATE/START REGISTRATION FORM
exports.startRegistration = async (req, res) => {
  try {
    const formNumber = `FORM-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const newForm = new MasjidRegistrationForm({
      formNumber,
      status: 'draft'
    });

    await newForm.save();

    res.status(201).json(
      formatSuccessResponse('Registration form created. Please fill in the details.', {
        formId: newForm._id,
        formNumber: newForm.formNumber,
        status: newForm.status
      })
    );
  } catch (error) {
    logger.error('Error starting registration:', error);
    res.status(500).json(formatErrorResponse('Failed to start registration', [{ message: error.message }]));
  }
};

// STEP 2: UPDATE FORM - BASIC INFORMATION
exports.updateBasicInfo = async (req, res) => {
  try {
    const { formId } = req.params;
    const { masjidName, address, mobileNumber, upiId } = req.body;

    // Validate required fields
    if (!masjidName || !address || !mobileNumber || !upiId) {
      return res.status(400).json(formatErrorResponse('Missing required fields', [
        { field: 'masjidName', message: 'Masjid name is required' },
        { field: 'address', message: 'Complete address is required' },
        { field: 'mobileNumber', message: 'Mobile number is required' },
        { field: 'upiId', message: 'UPI ID is required' }
      ]));
    }

    // Validate UPI ID format
    if (!isValidUpiId(upiId)) {
      return res.status(400).json(formatErrorResponse('Invalid UPI ID format', [
        { field: 'upiId', message: 'UPI ID format should be like: username@bank' }
      ]));
    }

    // Check if UPI ID already exists
    const existingUpiId = await MasjidRegistrationForm.findOne({ 
      upiId: upiId.toLowerCase(),
      _id: { $ne: formId }
    });

    if (existingUpiId) {
      return res.status(409).json(formatErrorResponse('UPI ID already registered', [
        { field: 'upiId', message: 'This UPI ID is already in use' }
      ]));
    }

    // Validate geolocation
    if (!address.latitude || !address.longitude) {
      return res.status(400).json(formatErrorResponse('Geo-tagging is required', [
        { message: 'Please pin your location on the map' }
      ]));
    }

    const updatedForm = await MasjidRegistrationForm.findByIdAndUpdate(
      formId,
      {
        masjidName: masjidName.trim(),
        address: {
          street: address.street,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          country: address.country || 'India',
          latitude: address.latitude,
          longitude: address.longitude,
          landmark: address.landmark,
          googleMapsLink: address.googleMapsLink
        },
        mobileNumber,
        upiId: upiId.toLowerCase()
      },
      { new: true, runValidators: true }
    );

    res.json(formatSuccessResponse('Basic information updated successfully', {
      formId: updatedForm._id,
      masjidName: updatedForm.masjidName,
      address: updatedForm.address,
      upiId: updatedForm.upiId
    }));
  } catch (error) {
    logger.error('Error updating basic info:', error);
    res.status(500).json(formatErrorResponse('Failed to update information', [{ message: error.message }]));
  }
};

// STEP 3: UPDATE FORM - ORGANIZATION MEMBERS
exports.updateMembers = async (req, res) => {
  try {
    const { formId } = req.params;
    const { president, secretary, treasurer, additionalMembers } = req.body;

    // Validate required members
    if (!president || !secretary || !treasurer) {
      return res.status(400).json(formatErrorResponse('All three main members are required', [
        { field: 'president', message: 'President details required' },
        { field: 'secretary', message: 'Secretary details required' },
        { field: 'treasurer', message: 'Treasurer details required' }
      ]));
    }

    // Validate additional members
    if (additionalMembers && additionalMembers.length > 3) {
      return res.status(400).json(formatErrorResponse('Maximum 3 additional members allowed'));
    }

    const updatedForm = await MasjidRegistrationForm.findByIdAndUpdate(
      formId,
      {
        president,
        secretary,
        treasurer,
        additionalMembers: additionalMembers || []
      },
      { new: true }
    );

    res.json(formatSuccessResponse('Members information updated successfully', {
      formId: updatedForm._id,
      president: updatedForm.president,
      secretary: updatedForm.secretary,
      treasurer: updatedForm.treasurer,
      additionalMembers: updatedForm.additionalMembers
    }));
  } catch (error) {
    logger.error('Error updating members:', error);
    res.status(500).json(formatErrorResponse('Failed to update members', [{ message: error.message }]));
  }
};

// STEP 4: UPLOAD DOCUMENTS
exports.uploadDocuments = async (req, res) => {
  try {
    const { formId } = req.params;
    const { documentType } = req.body;

    if (!req.files || !req.files.document) {
      return res.status(400).json(formatErrorResponse('No file uploaded'));
    }

    const file = req.files.document;
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];

    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json(formatErrorResponse('Invalid file type. Only PDF and images allowed'));
    }

    // Generate file name and path
    const fileName = `${formId}-${documentType}-${Date.now()}`;
    const uploadPath = `uploads/masjid-docs/${fileName}`;

    // Move file (in production, use cloud storage like AWS S3)
    await file.mv(uploadPath);

    // Update form with document info
    const docKey = documentType.toLowerCase();
    const updateData = {
      [`documents.${docKey}`]: {
        fileName: file.name,
        fileUrl: uploadPath,
        uploadDate: new Date(),
        fileSize: file.size
      }
    };

    const updatedForm = await MasjidRegistrationForm.findByIdAndUpdate(
      formId,
      updateData,
      { new: true }
    );

    res.json(formatSuccessResponse('Document uploaded successfully', {
      formId: updatedForm._id,
      documentType,
      uploadedFile: fileName
    }));
  } catch (error) {
    logger.error('Error uploading document:', error);
    res.status(500).json(formatErrorResponse('Failed to upload document', [{ message: error.message }]));
  }
};

// STEP 5: GET REGISTRATION FEE DETAILS (PRESET BY SUPER ADMIN)
exports.getRegistrationFeeDetails = async (req, res) => {
  try {
    const { formId } = req.params;

    const form = await MasjidRegistrationForm.findById(formId).select('registrationFee upiId masjidName');

    if (!form) {
      return res.status(404).json(formatErrorResponse('Form not found'));
    }

    // Get super admin UPI ID from environment or database
    const superAdminUpiId = process.env.SUPER_ADMIN_UPI_ID || 'superadmin@upi';

    res.json(formatSuccessResponse('Registration fee details retrieved', {
      registrationFee: form.registrationFee.amount,
      currency: form.registrationFee.currency,
      description: form.registrationFee.description,
      payTo: superAdminUpiId,
      masjidName: form.masjidName,
      // UPI deep link for direct payment
      upiPaymentLink: `upi://pay?pa=${superAdminUpiId}&pn=Islamic%20Community%20Hub&am=${form.registrationFee.amount}&tr=${form._id}&tn=Masjid%20Registration%20Fee`
    }));
  } catch (error) {
    logger.error('Error getting fee details:', error);
    res.status(500).json(formatErrorResponse('Failed to retrieve fee details', [{ message: error.message }]));
  }
};

// STEP 6: RECORD PAYMENT & UTR NUMBER
exports.recordPayment = async (req, res) => {
  try {
    const { formId } = req.params;
    const { utrNumber, upiTransactionId, paymentProofScreenshot } = req.body;

    // Validate UTR number
    if (!utrNumber || utrNumber.trim().length === 0) {
      return res.status(400).json(formatErrorResponse('UTR number is mandatory', [
        { field: 'utrNumber', message: 'UTR/Reference number must be provided' }
      ]));
    }

    // Check if UTR already used
    const existingPayment = await MasjidRegistrationForm.findOne({
      'payment.utrNumber': utrNumber,
      _id: { $ne: formId }
    });

    if (existingPayment) {
      return res.status(409).json(formatErrorResponse('UTR number already used', [
        { field: 'utrNumber', message: 'This UTR has already been registered' }
      ]));
    }

    const updatedForm = await MasjidRegistrationForm.findByIdAndUpdate(
      formId,
      {
        'payment.status': 'initiated',
        'payment.utrNumber': utrNumber.toUpperCase(),
        'payment.upiTransactionId': upiTransactionId || null,
        'payment.paymentDate': new Date(),
        'payment.paymentProofScreenshot': paymentProofScreenshot
      },
      { new: true }
    );

    res.json(formatSuccessResponse('Payment recorded. Awaiting Super Admin verification.', {
      formId: updatedForm._id,
      paymentStatus: updatedForm.payment.status,
      utrNumber: updatedForm.payment.utrNumber,
      message: 'Your payment has been recorded. Super Admin will verify and approve your registration.'
    }));
  } catch (error) {
    logger.error('Error recording payment:', error);
    res.status(500).json(formatErrorResponse('Failed to record payment', [{ message: error.message }]));
  }
};

// STEP 7: SUBMIT FORM (MASJID AUTHORITY)
exports.submitForm = async (req, res) => {
  try {
    const { formId } = req.params;
    const userId = req.userId;

    // Check if form is complete
    const form = await MasjidRegistrationForm.findById(formId);

    if (!form) {
      return res.status(404).json(formatErrorResponse('Form not found'));
    }

    // Validate all required fields are filled
    const requiredFields = [
      'masjidName',
      'address.latitude',
      'address.longitude',
      'mobileNumber',
      'upiId',
      'president',
      'secretary',
      'treasurer',
      'payment.utrNumber'
    ];

    const missingFields = [];
    requiredFields.forEach(field => {
      const fieldPath = field.split('.');
      let value = form;
      fieldPath.forEach(key => {
        value = value[key];
      });
      if (!value) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json(formatErrorResponse('Please complete all required fields', [
        { message: `Missing fields: ${missingFields.join(', ')}` }
      ]));
    }

    // Update form status
    const updatedForm = await MasjidRegistrationForm.findByIdAndUpdate(
      formId,
      {
        status: 'submitted',
        submittedDate: new Date(),
        submittedBy: userId
      },
      { new: true }
    );

    // Send notification to Super Admin
    logger.info(`New masjid registration submitted: ${updatedForm.masjidName} (${updatedForm.formNumber})`);

    res.json(formatSuccessResponse('Form submitted successfully. Awaiting Super Admin verification.', {
      formId: updatedForm._id,
      formNumber: updatedForm.formNumber,
      status: updatedForm.status,
      message: 'Your registration has been submitted. You will receive login credentials after verification and approval by Super Admin.'
    }));
  } catch (error) {
    logger.error('Error submitting form:', error);
    res.status(500).json(formatErrorResponse('Failed to submit form', [{ message: error.message }]));
  }
};

// SUPER ADMIN: VERIFY PAYMENT & APPROVE REGISTRATION
exports.verifyAndApprove = async (req, res) => {
  try {
    const { formId } = req.params;
    const { verificationNotes } = req.body;
    const superAdminId = req.userId;

    // Check if user is Super Admin
    const user = await User.findById(superAdminId);
    if (user.role !== 'super_admin') {
      return res.status(403).json(formatErrorResponse('Only Super Admin can approve registrations'));
    }

    const form = await MasjidRegistrationForm.findById(formId);
    if (!form) {
      return res.status(404).json(formatErrorResponse('Form not found'));
    }

    // Generate Unique ID (system-generated)
    const uniqueId = `MASJID-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Generate login credentials
    const loginUsername = form.upiId.split('@')[0].toUpperCase();
    const tempPassword = crypto.randomBytes(8).toString('hex').toUpperCase();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Update form with approval details
    const updatedForm = await MasjidRegistrationForm.findByIdAndUpdate(
      formId,
      {
        status: 'approved',
        'payment.status': 'completed',
        'verification.verifiedBy': superAdminId,
        'verification.verificationDate': new Date(),
        'verification.verificationNotes': verificationNotes,
        'approval.approvalDate': new Date(),
        'approval.approvedBy': superAdminId,
        'approval.uniqueId': uniqueId,
        'approval.loginUsername': loginUsername,
        'approval.loginPassword': hashedPassword,
        'renewal.renewalDueDate': new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        'renewal.nextRenewalDate': new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      },
      { new: true }
    );

    // Create Masjid record in main collection
    const newMasjid = new Masjid({
      masjidName: updatedForm.masjidName,
      adminId: updatedForm.submittedBy,
      phone: updatedForm.mobileNumber,
      email: updatedForm.president.email || 'contact@masjid.local',
      address: updatedForm.address,
      upiId: updatedForm.upiId,
      registrationCertificate: updatedForm.documents.registrationCertificate?.fileUrl || '',
      trustDeed: updatedForm.documents.trustDeed?.fileUrl || '',
      status: 'approved',
      registrationFeeStatus: 'paid',
      registrationFeeDate: updatedForm.payment.paymentDate,
      renewalDueDate: updatedForm.renewal.renewalDueDate
    });

    await newMasjid.save();

    // TODO: Send email to Masjid Authority with credentials
    // TODO: Send SMS to President with login details

    res.json(formatSuccessResponse('Registration approved successfully', {
      formId: updatedForm._id,
      uniqueId: updatedForm.approval.uniqueId,
      loginUsername: updatedForm.approval.loginUsername,
      tempPassword: tempPassword, // Show only once
      message: 'Credentials have been generated. Please send these to the Masjid Authority.',
      credentialsToShare: {
        uniqueId,
        username: loginUsername,
        tempPassword,
        instruction: 'User must change password on first login'
      }
    }));
  } catch (error) {
    logger.error('Error approving registration:', error);
    res.status(500).json(formatErrorResponse('Failed to approve registration', [{ message: error.message }]));
  }
};

// SUPER ADMIN: REJECT REGISTRATION
exports.rejectRegistration = async (req, res) => {
  try {
    const { formId } = req.params;
    const { rejectionReason, rejectionDetails } = req.body;
    const superAdminId = req.userId;

    const form = await MasjidRegistrationForm.findByIdAndUpdate(
      formId,
      {
        status: 'rejected',
        'rejection.rejectionReason': rejectionReason,
        'rejection.rejectionDetails': rejectionDetails,
        'rejection.rejectionDate': new Date(),
        'rejection.rejectedBy': superAdminId
      },
      { new: true }
    );

    res.json(formatSuccessResponse('Registration rejected', {
      formId: form._id,
      status: form.status,
      rejectionReason: form.rejection.rejectionReason,
      message: 'Masjid Authority has been notified of the rejection.'
    }));
  } catch (error) {
    logger.error('Error rejecting registration:', error);
    res.status(500).json(formatErrorResponse('Failed to reject registration', [{ message: error.message }]));
  }
};

// GET REGISTRATION FORM DETAILS
exports.getFormDetails = async (req, res) => {
  try {
    const { formId } = req.params;

    const form = await MasjidRegistrationForm.findById(formId)
      .select('-approval.loginPassword');

    if (!form) {
      return res.status(404).json(formatErrorResponse('Form not found'));
    }

    res.json(formatSuccessResponse('Form details retrieved', form));
  } catch (error) {
    logger.error('Error getting form details:', error);
    res.status(500).json(formatErrorResponse('Failed to retrieve form details', [{ message: error.message }]));
  }
};

// LIST ALL REGISTRATION FORMS (SUPER ADMIN)
exports.listForms = async (req, res) => {
  try {
    const { page, limit, status } = req.query;
    const { skip, limit: pageLimit } = paginate(page, limit);

    const query = {};
    if (status) {
      query.status = status;
    }

    const forms = await MasjidRegistrationForm.find(query)
      .skip(skip)
      .limit(pageLimit)
      .select('formNumber masjidName status submittedDate payment.status')
      .sort({ createdAt: -1 });

    const total = await MasjidRegistrationForm.countDocuments(query);

    res.json(formatSuccessResponse('Registration forms retrieved', forms, {
      total,
      page: parseInt(page) || 1,
      limit: pageLimit,
      totalPages: Math.ceil(total / pageLimit)
    }));
  } catch (error) {
    logger.error('Error listing forms:', error);
    res.status(500).json(formatErrorResponse('Failed to retrieve forms', [{ message: error.message }]));
  }
};
