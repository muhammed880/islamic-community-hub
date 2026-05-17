# Application Workflow Documentation

## Overview
This document describes the complete workflow for all three user roles in the Islamic Community Hub application with UPI-only payment system.

---

## 1. SUPER ADMIN WORKFLOW

### 1.1 Dashboard Access
**Steps:**
1. Super Admin logs in with credentials
2. Accesses centralized dashboard with all app data
3. Views real-time statistics and analytics

**Dashboard Includes:**
- Total Masjids (Approved/Pending/Rejected)
- Total Users by Role
- Donation Statistics
- Zakat Distribution Reports
- Job Postings & Applications
- Matrimony Profiles
- Nikah Nama Certificates
- Revenue (Registration + Renewal Fees)
- Pending verifications

---

### 1.2 Masjid Registration Approval Process

**Step 1: Masjid Submits Registration**
```
Masjid Authority fills registration form:
- Masjid Name
- Address & Contact Details
- UPI ID (for collecting donations directly)
- Bank Account Details (backup)
- Registration Certificate (PDF/Image)
- Trust Deed (PDF/Image)
```

**Step 2: Super Admin Reviews Documents**
```
Super Admin checks:
✓ All documents are valid
✓ Registration certificate is genuine
✓ UPI ID format is correct (verified by testing)
✓ Bank details are correct
✓ Trust deed is legitimate
✓ Masjid location makes sense
```

**Step 3: Request Registration Fee Payment**
```
Super Admin sends notification to Masjid Authority:
"Please pay registration fee: ₹5,000"

Payment Details:
- Recipient UPI ID: superadmin@upi
- Amount: ₹5,000
- Method: Any UPI app (GooglePay, PhonePe, Paytm, etc.)
```

**Step 4: Masjid Authority Makes Payment**
```
Masjid Authority:
1. Opens their UPI app
2. Scans or enters: superadmin@upi
3. Enters amount: ₹5,000
4. Completes payment
5. Receives payment confirmation
6. Takes screenshot of confirmation
7. Returns to app
8. Uploads screenshot in registration form
9. Submits form with proof
```

**Step 5: Super Admin Verifies Payment**
```
Super Admin receives notification:
"New payment received for Al-Noor Masjid"

Verifies:
✓ Screenshot shows payment confirmation
✓ UPI Transaction ID matches
✓ Amount is ₹5,000
✓ Payment date is recent
✓ Recipient UPI is superadmin@upi

In bank/UPI app:
✓ Confirms ₹5,000 received from Masjid
```

**Step 6: Final Approval**
```
IF all checks pass:
  → Clicks "APPROVE" button
  → Status changes to "approved"
  → Masjid Authority receives approval notification
  → Masjid becomes visible on public platform
  → Registration date recorded
  → Renewal date set to 1 year from today

IF issues found:
  → Clicks "REQUEST CHANGES" button
  → Specifies what needs to be fixed
  → Masjid Authority can resubmit
  
IF payment not received:
  → Clicks "REJECT - PAYMENT NOT RECEIVED"
  → Masjid Authority tries again
```

**Step 7: Set Renewal Schedule**
```
Renewal Details:
- Renewal Date: 1 year from approval date
- Renewal Amount: ₹2,000 (annual fee)
- 30 days before renewal: Auto-send reminder

Example:
- Approved: May 12, 2026
- Renewal Due: May 12, 2027
- Reminder Sent: April 12, 2027
```

---

### 1.3 Needy Person Verification Process

**Step 1: Masjid Authority Creates Profile**
```
Masjid Authority enters:
- Name & Contact Details
- Family Members & Dependents
- Current Income & Expenses
- Reason for assistance (Medical/Education/Livelihood)
- Documents (Medical reports, Income proof, etc.)
- Estimated amount needed (e.g., ₹100,000)
- Photos (if applicable)
```

**Step 2: Super Admin Reviews Documents**
```
Super Admin verifies:
✓ Identity proof is valid
✓ Medical/Education documents are genuine
✓ Income proof shows financial need
✓ Estimated amount is reasonable
✓ No duplicate profiles exist
✓ Masjid Authority is verified
```

**Step 3: Approval Decision**
```
IF verified:
  → Status: "approved"
  → Profile becomes public
  → Users can donate Zakat for this person/family
  
IF issues:
  → Request additional documents
  → Reject with clear reason
  → Masjid Authority can resubmit
```

**Step 4: Monitor Zakat Collection**
```
Super Admin can view:
- Total amount needed: ₹100,000
- Amount collected so far: ₹45,000
- Remaining amount: ₹55,000
- Donor list (with payment proof links)
- Completion date estimate
- Status: collecting/completed
```

---

### 1.4 Nikah Nama Verification Process

**Step 1: Masjid Authority Submits**
```
Masjid Authority enters:
- Groom Details (Name, DOB, Address, Email, Phone)
- Bride Details (Name, DOB, Address, Email, Phone)
- Marriage Date
- Mahr Amount (in INR)
- Witness Information (2+ witnesses with contact details)
- Imam Name who conducted marriage
- Certificate Document (scanned copy)
```

**Step 2: Super Admin Verifies**
```
Super Admin checks:
✓ Both parties' identification valid
✓ Marriage date is within reasonable range
✓ Witnesses are mentioned with contact info
✓ Mahr is reasonable
✓ Certificate format is correct
✓ Imam details are accurate
```

**Step 3: Issue Certificate**
```
IF verified:
  → Generate official certificate number (CERT-YYYY-00001)
  → Create digital PDF certificate
  → Include QR code for verification
  → Send to groom via email
  → Send to bride via email
  → Status: "verified"
  
IF issues:
  → Request corrections from Masjid Authority
  → Reject with specific reason
  → Masjid Authority can resubmit
```

**Step 4: Certificate Management**
```
Super Admin can:
- Search certificates by certificate number
- Search by Groom/Bride name
- View certificate history by Masjid
- Regenerate lost certificates
- Issue duplicates if needed
- Track certificate issuance trends
```

---

### 1.5 Financial Management

**Income Sources:**
- Registration Fees: ₹5,000 per masjid (one-time)
- Renewal Fees: ₹2,000 per masjid (annual)
- Total: Platform revenue only (no commission from donations)

**Super Admin Actions:**
1. View all payment transactions in dashboard
2. Generate financial reports (weekly/monthly/yearly)
3. Export transaction history (CSV/Excel)
4. View pending payments (overdue renewals)
5. Send payment reminders automatically
6. Verify payment receipts (screenshots)
7. Track payment proof uploads

**Dashboard Shows:**
- Total Revenue: ₹XXX,XXX
- Revenue by Month (chart)
- Registration Fees Collected: ₹XXX,XXX
- Renewal Fees Collected: ₹XXX,XXX
- Outstanding Payments: ₹XX,XXX
- Overdue Renewals: X masjids
- Pending Verifications: X payments

---

## 2. MASJID AUTHORITY WORKFLOW

### 2.1 Dashboard Access
**Steps:**
1. Masjid Authority logs in
2. Accesses dashboard with ONLY their masjid's data
3. Cannot see other masjids' data

**Dashboard Shows (Their Masjid Only):**
- Masjid Status (pending/approved/rejected)
- Masjid Details & UPI ID
- Total Donations Received (via their UPI)
- Donation Verification Queue (pending screenshots)
- Job Postings & Applications
- Needy Persons (created by them)
- Quran Classes
- Ask Imam Sessions
- Nikah Nama Certificates
- Financial Summary

---

### 2.2 Masjid Registration & Profile Management

**Step 1: Initial Registration**
```
Masjid Authority submits:
- Masjid Name
- Phone & Email
- Postal Address with GPS coordinates
- UPI ID (for collecting donations directly from users)
- Bank Account Details (optional backup)
- Registration Certificate
- Trust Deed
- Establishment Year
```

**Step 2: Pay Registration Fee**
```
Super Admin sends: "Pay ₹5,000 registration fee"

Masjid Authority:
1. Opens their UPI app
2. Enters: superadmin@upi
3. Amount: ₹5,000
4. Completes payment
5. Takes screenshot of confirmation
6. Returns to app
7. Uploads screenshot proof
8. Clicks "Submit for Approval"
```

**Step 3: Await Approval**
```
Status: "pending"
Super Admin reviews all documents and payment
Once approved → Status: "approved"
Notification sent to Masjid Authority
```

**Step 4: Update Masjid Information**
```
After approval, Masjid Authority can:
- Update contact details
- Update UPI ID (if changed - requires reverification)
- Update bank account
- Add images/photos
- Add detailed description
- Add location on map
- Update opening hours
- Add facilities list (prayer hall, Quranic school, etc.)
- Update Imam names and timings
```

**Step 5: Annual Renewal**
```
Timeline:
- Approved: May 12, 2026
- Renewal Due: May 12, 2027
- Reminder 1: April 12, 2027 (30 days before)
- Reminder 2: May 1, 2027 (11 days before)
- Final Reminder: May 11, 2027 (1 day before)

Renewal Process:
1. Masjid Authority receives renewal notification
2. Clicks "Renew Masjid Registration"
3. Reviews masjid details (can update if needed)
4. Pays renewal fee: ₹2,000 to superadmin@upi
5. Takes screenshot of confirmation
6. Uploads screenshot
7. Clicks "Submit Renewal"

Super Admin:
1. Receives renewal payment
2. Verifies payment screenshot
3. Confirms amount ₹2,000 received
4. Approves renewal
5. Extends registration by 1 more year
6. New renewal due date: May 12, 2028
```

---

### 2.3 Create Job Postings

**Step 1: Job Creation Form**
```
Masjid Authority fills:
- Job Title (Imam, Muezzin, Islamic Teacher, etc.)
- Job Description (detailed requirements)
- Job Type (Full-time, Part-time, Volunteer)
- Salary Range (Min-Max in INR)
- Required Qualifications (Tajweed, Islamic Knowledge, etc.)
- Required Experience (years)
- Required Skills (Leadership, Teaching, etc.)
- Closing Date for applications (e.g., June 12, 2026)
```

**Step 2: Publish Job**
```
Job becomes visible on:
- Platform homepage (featured jobs section)
- Jobs listing page (all jobs)
- Search results (filtered by location, type, etc.)
- Masjid's dedicated public page
- User notifications (if subscribed to job alerts)
```

**Step 3: Manage Applications**
```
Masjid Authority can view in dashboard:
- Total applications received
- New applications (unreviewed)
- Reviewed applications

For each applicant:
- View applicant profile
- Download resume
- Read cover letter
- Rate applicant (1-5 stars)
- Add feedback/comments
- Mark as: "Shortlisted", "Interview Later", or "Rejected"
- Contact applicant via email
```

**Step 4: Close Job**
```
Once position is filled:
- Mark job as "Closed"
- Notification to applicants
- Job archived (visible in history)

Can reopen job if:
- Position opened again
- Need more candidates
```

**Step 5: Job Completion**
```
Masjid Authority:
- Can mark as "Filled" (permanently closed)
- Applicants notified
- Job no longer appears in active listings
```

---

### 2.4 Create Needy Person Profile

**Step 1: Identification**
```
Masjid Authority:
- Identifies needy person/family in their area
- Meets them in person
- Collects necessary information
- Verifies their situation
- Gathers supporting documents
```

**Step 2: Create Profile in System**
```
Fills form with:
- Full Name & Contact Details
- Gender & Age
- Family Members & Dependents (names, ages, relations)
- Current Address
- Monthly Income Sources (specify amounts)
- Monthly Expenses Breakdown (rent, food, medical, etc.)
- Reason for assistance:
  * Medical (surgery, treatment)
  * Education (tuition, books)
  * Livelihood (business capital, tools)
  * Emergency (accident, disaster)
  * Other
- Detailed description of situation
- Amount needed (estimated)
- Supporting Documents:
  * Medical reports (if medical)
  * School certificates (if education)
  * Income proof
  * Identity proof
  * Photos (if applicable)
```

**Step 3: Submit for Verification**
```
Profile submitted to Super Admin
Status: "pending"
Notification sent to Super Admin for review
```

**Step 4: Profile Goes Public**
```
Once Super Admin approves:
- Status: "approved"
- Profile visible on public "Zakat" section
- Users can view profile and donate Zakat
- Progress bar shows collection status
```

**Step 5: Monitor Zakat Collection**
```
Masjid Authority can see in dashboard:
- Total donations received
- Donor details (name, amount, date)
- Payment proof screenshots
- Pending verifications (screenshots uploaded by donors)
- Completed donations (verified by Masjid)
- Collection progress (₹45,000 / ₹100,000)

Responsibilities:
- Verify donation screenshots
- Confirm payments received
- Mark donations as verified
- Track collection progress
- Notify family when target reached
- Arrange final distribution to family
```

---

### 2.5 Verify Donations via UPI

**How Users Donate:**
```
User Process:
1. Browses needy person or masjid
2. Clicks "Donate"
3. System shows:
   - Your UPI ID: alnoor@upi
   - QR code for scanning
   - Amount field
4. User:
   - Scans QR code OR enters UPI ID
   - Enters donation amount (e.g., ₹500)
   - Completes payment in their UPI app
   - Gets payment confirmation
   - Screenshots confirmation
5. Returns to app
6. Uploads screenshot
7. Enters UPI Transaction ID
8. Submits donation record

Status: "pending_verification"
```

**Masjid Authority Verifies:**
```
In Masjid Dashboard:
- Pending Donations section shows:
  * Donor name/ID
  * Amount (e.g., ₹500)
  * UPI Transaction ID (e.g., UPI123456789)
  * Screenshot uploaded
  * Submission date/time

Masjid Authority verification steps:
1. Clicks on pending donation
2. Sees screenshot of payment confirmation
3. Checks their bank/UPI app:
   - Confirms ₹500 received
   - Matches UPI Transaction ID
   - Verifies timestamp
4. If all matches:
   - Clicks "VERIFY DONATION"
   - Status changes to "completed"
   - Donor gets receipt
   - Amount added to collection total

IF payment NOT received:
   - Clicks "REJECT"
   - Provides reason (e.g., "Payment not in our account")
   - Donor notified
   - Donor can try again

IF amount doesn't match:
   - Clicks "AMOUNT MISMATCH"
   - Specifies discrepancy
   - Donor notified to correct
```

**Example Verification:**
```
User donates to "Fatima Begum Medical"
- User uploads screenshot: Shows "Payment to alnoor@upi ₹1,000 successful"
- UPI TxnID: UPI20260512ABC123XYZ456
- Submission time: 2026-05-12 10:30 AM

Masjid Authority verifies:
- Checks their UPI app/bank
- Finds: "Received from User123 ₹1,000 TxnID: UPI20260512ABC123XYZ456"
- Time matches
- Amount matches
- Clicks VERIFY
- Status: COMPLETED
- Receipt generated for donor
- Collection updated: ₹45,000 → ₹46,000
```

---

### 2.6 Record Cash Donations (Offline)

**For Cash Donations:**
```
When users donate cash after prayer:
1. Collect cash
2. Note donor details (optional - for donor list)
3. Record amount
4. Later in dashboard:
   - Click "Record Manual Donation"
   - Select: "Cash Donation"
   - Enter amount
   - Enter date
   - Add notes (e.g., "Received after Jummah prayer")
   - Click "Record"
5. Donation recorded as "verified" immediately
   (because Masjid physically has the cash)

Example:
- Cash collected: ₹2,000
- Time: After Jummah prayer
- Status: Recorded as verified automatically
```

---

### 2.7 Conduct Quran Classes

**Step 1: Create Class**
```
Imam fills:
- Class Name (e.g., "Quran Fundamentals")
- Description (goals, topics)
- Level (Beginner/Intermediate/Advanced)
- Start Date (e.g., June 1, 2026)
- End Date (e.g., August 31, 2026)
- Class Time (e.g., 7:00 PM)
- Days (Monday, Wednesday, Friday)
- Duration (e.g., 60 minutes)
- Maximum Participants (e.g., 30)
- Curriculum:
  * Week 1: Introduction to Quran
  * Week 2: Surah Al-Fatiha
  * Week 3: Tajweed rules
  * etc.
```

**Step 2: Agora Integration**
```
System automatically:
- Creates Agora audio channel
- Generates channel name (e.g., "quran_class_507f1f77bcf")
- Enables audio-only streaming (no video)
- Sets up recording capability
```

**Step 3: Student Enrollment**
```
Students browse and see:
- Class name & description
- Level & schedule
- Current participants vs max capacity
- Imam name

Students click "Enroll"
- Enrollment request sent to Imam
- Status: "pending"

Imam approves/rejects in dashboard:
- Can accept/reject students
- View all enrollment requests
- See enrolled student list
```

**Step 4: Conduct Class Session**
```
On class day/time (e.g., Monday 7 PM):

Before class:
- Imam logs in
- Clicks "Start Class"
- System generates Agora token
- Imam joins audio channel

During class:
- Imam connects to Agora channel
- Students get notification: "Class starting now"
- Students click "Join Class"
- Each student receives unique token
- All connected to same Agora channel
- Audio streaming begins
- Imam teaches for 60 minutes
- Students listen (microphones off for orderly session)
- Session automatically recorded

After class:
- Session ends at scheduled time
- Recording saved
- Marked as "completed"
```

**Step 5: Access Recordings**
```
After class:
- Recording uploaded automatically
- Available within 1-2 hours
- Students can replay anytime
- Can download for offline viewing
- Timestamped for future reference

Imam can:
- View all class recordings
- Delete if needed
- Share with absent students
```

**Step 6: Monitor Attendance**
```
Imam can view:
- Attendance per class session
- Attendance percentage per student
- Students present vs absent
- Completion rate

Students can:
- See their attendance record
- Know which classes they attended
```

---

### 2.8 Organize Ask Imam Sessions

**Step 1: Schedule Session**
```
Imam creates:
- Session Title (e.g., "Islamic Finance Q&A")
- Description (what will be discussed)
- Topic (Islamic Finance, Family Life, Health, etc.)
- Scheduled Date (e.g., May 20, 2026)
- Scheduled Time (e.g., 8 PM)
- Duration (e.g., 90 minutes)
- Maximum Participants (e.g., 100)

Example:
"Ask Imam - Islamic Finance"
- Date: May 20, 2026
- Time: 8:00 PM - 9:30 PM
- Max Participants: 100
- Topic: How to manage business ethically in Islam
```

**Step 2: Agora Channel Setup**
```
System creates:
- Unique audio channel for session
- Generates Agora tokens
- Enables recording
- Audio-only (no video required)
```

**Step 3: User Registration**
```
Users browse "Ask Imam Sessions" section:
- See all scheduled sessions
- Click on session for details
- Click "Register"
- Confirm participation
- Receive confirmation email

Timeline before session:
- 24 hours before: Reminder notification
- 1 hour before: "Session starting soon" alert
- At start time: "Click here to join"

System tracks:
- Total registrations
- Registered user list
- Attendance
```

**Step 4: Pre-Session Question Submission**
```
Before session starts, users can:
- Submit questions in Q&A section
- Questions appear publicly (or anonymous option)
- Other users can like/upvote questions
- Popular questions appear first
- Sorted by: Most liked, Most recent, etc.

Example Questions:
- "How to handle debt in Islam?"
- "Is it permissible to buy insurance?"
- "What about cryptocurrency?"

Visibility:
- Question submitter sees their question
- All registered users can see questions
- Can like/comment
```

**Step 5: Conduct Session**
```
Session Start (8:00 PM):

Imam:
1. Clicks "Start Session"
2. Receives Agora token
3. Joins audio channel
4. System status: "LIVE"
5. Notification sent: "Session is now LIVE"

Users:
1. Receive: "Session is LIVE - Click to join"
2. Click "Join Session"
3. Receive unique Agora token
4. Connect to audio stream
5. Can hear Imam

Session Flow (90 minutes):
1. Imam greets participants (5 min)
2. Gives opening remarks (5 min)
3. Starts Q&A:
   - Reads question from list
   - "Next question: 'Is cryptocurrency Halal?'"
   - Answers in detail (3-5 min per question)
   - Continues through questions (70 min)
4. Final remarks (5 min)
5. Session concludes

Recording:
- Entire session recorded
- Audio only
- Includes Q&A discussion
```

**Step 6: Post-Session**
```
After session ends (9:30 PM):

System:
- Stops recording
- Uploads recording
- Generates transcript (if available)
- Marks session as "completed"
- Status changed from "LIVE" to "COMPLETED"

Within 2-4 hours:
- Recording available
- Users notified: "Recording ready"

Users can now:
- Listen to full recording
- Re-listen to specific Q&A
- Share with others
- Download for offline

Imam can:
- Edit or delete if errors
- See session statistics (attendees, questions asked, etc.)
- Share recording on social media
```

---

### 2.9 Create Nikah Nama Certificates

**Step 1: Collect Information**
```
Masjid Authority gathers:

Groom Details:
- Full Name
- Date of Birth
- Email & Phone
- Address
- Father's Name
- Mother's Name (optional)

Bride Details:
- Full Name
- Date of Birth
- Email & Phone
- Address
- Father's Name
- Mother's Name (optional)

Marriage Details:
- Date of Marriage
- Mahr Amount (in INR)
- Witnesses (minimum 2):
  * Witness 1: Name, Phone, Email
  * Witness 2: Name, Phone, Email
- Imam who conducted marriage: Name
- Location of ceremony
- Any special terms/conditions (optional)
```

**Step 2: Create Certificate in System**
```
Masjid Authority:
1. Clicks "Create Nikah Nama"
2. Fills all details
3. Selects Imam from dropdown
4. Adds witness information
5. Optionally uploads certificate document/photo
6. Reviews all information
7. Clicks "Submit for Verification"
```

**Step 3: Submit for Super Admin Verification**
```
Certificate submitted
Status: "pending"
Notification sent to Super Admin

Super Admin:
- Reviews all details
- Checks documents
- Verifies legitimacy
- Approves or requests changes
```

**Step 4: Issue Official Certificate**
```
Once Super Admin approves:

System generates:
- Official certificate number (CERT-2026-00001)
- Beautiful digital PDF certificate with:
  * Groom name & details
  * Bride name & details
  * Marriage date
  * Mahr amount
  * Witness signatures area
  * Imam name
  * Masjid name & seal
  * Certificate number
  * QR code for verification
  * Digital signature

Emails sent to:
- Groom: Full certificate PDF
- Bride: Full certificate PDF
- Masjid Authority: Copy for records

Certificate Status: "verified"
Now publicly searchable
```

---

## 3. GENERAL USER WORKFLOW

### 3.1 Registration & Login

**Step 1: Registration**
```
New user visits platform
Clicks "Register"
Fills registration form:
- Email (e.g., user@example.com)
- Password (secure)
- Phone Number (e.g., +919876543210)
- First Name
- Last Name
- Gender (Male/Female/Other)
- Date of Birth (optional)
- Address (optional)
- Agree to terms & conditions
```

**Step 2: Email Verification**
```
System sends verification email
User clicks verification link in email
Email confirmed
Account activated
User can now login
```

**Step 3: Login**
```
User enters email & password
System verifies credentials
Generates JWT token
Token stored in browser
User authenticated
Can access all features
```

---

### 3.2 Browse & Apply for Jobs

**Step 1: Browse Jobs**
```
User clicks "Jobs" section
Sees all available job postings:
- Job title
- Masjid name
- Location (city)
- Salary range
- Brief description
- Closing date
- Application count
```

**Step 2: Filter Jobs**
```
User can filter by:
- Location (City/State)
- Job Type (Full-time, Part-time, Volunteer)
- Salary Range (slider)
- Job Title (search)
- Keyword Search
- Posted Date (newest first)
```

**Step 3: View Job Details**
```
User clicks on job
Sees full details:
- Complete job description
- Qualifications required
- Experience needed
- Skills required
- Salary range
- Masjid contact information
- Application deadline
- Masjid location on map
```

**Step 4: Apply for Job**
```
User clicks "Apply"
Form appears:
- Resume field (upload PDF/DOC, max 5MB)
- Cover Letter field (text, max 5000 chars)

User:
- Uploads resume
- Writes cover letter
- Clicks "Submit Application"

Confirmation:
- Application received
- Sent to Masjid Authority
- Status: "pending"
- User gets confirmation email
```

**Step 5: Track Application**
```
User can view in dashboard:
- All applications submitted
- Status of each:
  * pending (awaiting review)
  * shortlisted (selected for interview)
  * rejected (not selected)
  * selected (offered position)
  * applied (initial state)

- Last update date
- Masjid's feedback/comments (if any)
- Can withdraw application if still pending
```

---

### 3.3 Browse & Create Matrimony Profile

**Step 1: Browse Profiles**
```
User clicks "Matrimony" section
Sees profiles of opposite gender
Each profile shows:
- Name (first name only, last name hidden)
- Profile photo
- Age (calculated from DOB)
- Education level
- Occupation
- City/State
- Brief hobbies/interests
- Profile verification badge
```

**Step 2: Filter Profiles**
```
User can filter by:
- Age Range (e.g., 25-35)
- Education Level
- Occupation
- City/State
- Height Range
- Income Range (optional)
- Languages spoken
```

**Step 3: View Full Profile**
```
User clicks on profile
Sees detailed information:
- Full name (only if they express interest)
- Age & Height
- Complexion & Appearance
- Education & Qualification
- Occupation & Income
- Languages known
- Hobbies & Interests
- "Looking for" preferences
- Photos (verified)
- Contact request button

Note: Full name hidden until interest expressed
```

**Step 4: Express Interest**
```
User clicks "Express Interest"
Optional: Write a message
"I am interested in knowing you..."

Interest sent to profile owner
Profile owner receives notification:
"Someone expressed interest in your profile"

Status: "pending"
```

**Step 5: Create Own Profile**
```
User clicks "Create Profile"
Fills detailed matrimony form:
- Full Name
- Date of Birth
- Height
- Complexion
- Education & Qualification
- Occupation
- Monthly Income (optional)
- Languages
- Hobbies & Interests
- "Looking for" in spouse
- Upload profile photo (verified)
- Bio/About (optional)

Submissions:
- Profile submitted
- Status: "pending_verification"

Super Admin verification:
- Checks photo legitimacy
- Verifies information accuracy
- Checks for inappropriate content
- Approves or requests changes

Once verified → Status: "verified"
Profile becomes publicly visible
```

**Step 6: Manage Interests**
```
User can view:
- Interests received (from others)
- Interests sent (by them)
- Status of each interest (pending/accepted/rejected)

For received interest:
- View sender's profile summary
- Accept → Contact details shared
- Reject → Sender notified
- Message sender (if accepted)

For sent interest:
- View recipient's profile
- Cancel if pending
- Wait for recipient's response
```

---

### 3.4 Donate to Masjid (UPI)

**Step 1: Browse Masjids**
```
User visits "Masjids" section
Sees list of approved masjids:
- Masjid name with logo
- Location (city, state)
- Photo
- Total donations received
- Rating
- Quick donate button
```

**Step 2: View Masjid Details**
```
User clicks on masjid
Sees full information:
- Complete masjid details
- Address with map
- Contact number
- Email
- Established year
- Services provided
- Imam names & timings
- Prayer times
- Total donations received
- Recent donors (anonymous)
- "Donate" button
```

**Step 3: Make Donation (UPI)**
```
User clicks "Donate"

System shows:
- Recipient UPI ID: alnoor@upi
- QR code for scanning
- Masjid name: "Al-Noor Masjid"
- Currency: INR

User has 3 options:
1. Scan QR code with phone UPI app
2. Copy UPI ID and paste in UPI app
3. Manual entry of UPI ID

User opens their UPI app (GooglePay/PhonePe/Paytm):
- Scans QR code, OR
- Pastes UPI ID: alnoor@upi, OR
- Manually enters UPI ID

In UPI app:
- Confirms recipient: "Al-Noor Masjid"
- Enters donation amount (e.g., ₹500)
- Clicks "Pay" / "Send"
- Completes payment (PIN/biometric)

Payment confirmation received:
- UPI Transaction ID (e.g., UPI20260512ABC123)
- Timestamp
- Amount confirmed
- "Payment Successful" message

User takes screenshot of confirmation
```

**Step 4: Upload Payment Proof (Back to App)**
```
User returns to app
Clicks "Upload Payment Proof"

Uploads:
- Screenshot of payment confirmation
- System recognizes:
  * UPI Transaction ID: UPI20260512ABC123
  * Amount: ₹500
  * Recipient: alnoor@upi
  * Timestamp

Form fields:
- UPI Transaction ID (auto-filled if detected)
- Amount (auto-filled if detected)
- Donation date (auto-filled)
- Optional notes

Submits form

Status: "pending_verification"
```

**Step 5: Masjid Verifies Donation (Covered in Section 2.5)**
```
Masjid Authority:
- Checks bank/UPI for matching transaction
- Confirms amount & transaction ID
- Clicks "VERIFY"
- Status: "completed"
```

**Step 6: Receive Receipt**
```
Once Masjid verifies:

System generates receipt:
- Receipt Number: RECEIPT-2026-00001
- Amount: ₹500
- Masjid: Al-Noor Masjid
- Date: May 12, 2026
- Purpose: Masjid Donation
- Tax Certificate: Available for download

User receives:
- PDF receipt
- Email with receipt
- Receipt saved in donation history
- Can download anytime
```

---

### 3.5 Donate for Zakat

**Step 1: Browse Needy Persons**
```
User visits "Zakat" section
Sees approved needy persons/families:
- Name (first name only)
- Reason (Medical/Education/Livelihood)
- Family size
- Amount needed (e.g., ₹100,000)
- Amount collected (e.g., ₹45,000)
- Progress bar (45% filled)
- City location
- Quick donate button
```

**Step 2: Filter & Search**
```
User can filter by:
- Reason (Medical, Education, Livelihood)
- City/State
- Amount needed (₹0-50K, ₹50K-100K, ₹100K+)
- Collection progress (0%-50%, 50%-100%)
- Most urgent (least funded first)
```

**Step 3: View Full Details**
```
User clicks on profile
Sees:
- Family name & details (first name only)
- Family size & members
- Current monthly income
- Current monthly expenses
- Income gap (deficit)
- Reason for assistance (detailed)
- Supporting documents (medical reports, etc.)
- Amount needed: ₹100,000
- Amount collected so far: ₹45,000
- Amount remaining: ₹55,000
- Progress bar (45%)
- Donor testimonials (anonymous)
- "Donate" button
```

**Step 4: Make Zakat Donation (UPI)**
```
User clicks "Donate"

System shows:
- Recipient UPI ID: (Masjid Authority's UPI)
- Purpose: "Zakat for [Family Name]"
- Amount field (user enters, e.g., ₹2,000)
- QR code

User opens their UPI app:
- Scans QR code, OR
- Enters UPI ID
- Enters donation amount: ₹2,000
- Completes payment

Receives confirmation with:
- UPI Transaction ID
- Amount
- Timestamp

Takes screenshot
Returns to app
Uploads payment proof
Status: "pending_verification"
```

**Step 5: Masjid Verifies Zakat Donation**
```
Masjid Authority:
- Receives donation notification
- Sees pending verification in dashboard
- Checks bank/UPI for matching transaction
- Verifies amount & transaction ID
- Clicks "VERIFY"
- Status: "completed"
- Collection total updated: ₹45,000 → ₹47,000
```

**Step 6: Track Zakat Completion**
```
User can view in "My Donations":
- Donation amount: ₹2,000
- Family: [Family Name]
- Purpose: Medical treatment
- Status: verified/completed
- Receipt Number
- Impact note: "Your donation helped support..."

When family receives full amount:
- Collection reaches ₹100,000
- Status: "completed"
- Masjid distributes to family
- All donors receive:
  * "Zakat Collection Completed" notification
  * Zakat certificate for tax purposes
  * Family's thank you message (optional)
```

---

### 3.6 Attend Quran Classes

**Step 1: Browse Classes**
```
User visits "Quran Classes" section
Sees available classes:
- Class name (e.g., "Quran Fundamentals")
- Level (Beginner/Intermediate/Advanced)
- Schedule (Mon/Wed/Fri, 7 PM)
- Duration (60 minutes)
- Current students / Max capacity (18/30)
- Imam name
- Masjid name
- Location
```

**Step 2: Filter Classes**
```
User can filter by:
- Level (Beginner, Intermediate, Advanced)
- Days (Monday, Tuesday, etc.)
- Time slot (Morning/Afternoon/Evening)
- Masjid
- Location (City/State)
- Language
```

**Step 3: View Class Details**
```
User clicks on class
Sees:
- Full description
- Complete schedule (start-end date)
- Days & time
- Duration & frequency
- Curriculum topics
- Imam biography
- Masjid details
- Student reviews/ratings
- Enrollment status
- "Enroll Now" button
```

**Step 4: Enroll in Class**
```
User clicks "Enroll Now"
Enrollment request sent to Imam
Status: "pending"

Imam reviews in dashboard:
- Sees enrollment request
- Can approve or reject
- Can see student profile

User notified:
- If approved: "Welcome to Quran Fundamentals"
- If rejected: "Unfortunately, you were not selected"
```

**Step 5: Access Class Session**
```
Once approved:
- Class appears in "My Classes" (enrolled classes)
- Shows next session date/time

On class day:
- Session starts at scheduled time (e.g., 7 PM Monday)
- User gets notification: "Quran class starting in 5 minutes"
- User clicks "Join Class"
- System generates Agora token
- User connected to audio stream
- Hears Imam teaching

During class (60 minutes):
- Listens to Imam's teaching
- May ask questions (if Imam enables chat)
- Session recorded in background

After class:
- Session ends
- User disconnected from audio
- Option to view recording later
```

**Step 6: Access Recordings & Track Progress**
```
User can view in "My Classes":
- Attendance record
  * Classes attended: 8/12
  * Classes missed: 4/12
  * Attendance percentage: 67%
- Recordings:
  * All class recordings available
  * Can replay anytime
  * Can download for offline viewing
- Progress:
  * Topics covered so far
  * Topics upcoming
  * Completion timeline
```

---

### 3.7 Attend Ask Imam Sessions

**Step 1: Browse Sessions**
```
User visits "Ask Imam" section
Sees scheduled sessions:
- Session title (e.g., "Islamic Finance Q&A")
- Topic (Islamic Finance)
- Date (May 20, 2026)
- Time (8 PM - 9:30 PM)
- Total registered: 45 participants
- Imam name
- Masjid name
- "Register" button
```

**Step 2: View Session Details**
```
User clicks on session
Sees:
- Full description
- Scheduled date & time
- Duration (90 minutes)
- Expected topics to be discussed
- Imam biography
- Q&A format explanation
- Past session recordings archive
- Already submitted questions (if any)
```

**Step 3: Register for Session**
```
User clicks "Register"
Confirms participation
Registration confirmed
Receives confirmation email

Timeline:
- 24 hours before: Reminder notification
- 1 hour before: "Session starting soon"
- At start time: "Join session - LIVE NOW"
```

**Step 4: Submit Questions (Pre-Session)**
```
Before session starts:
- User sees "Q&A" section
- Can submit questions in advance
- Questions appear in list
- Other users can like/upvote
- Popular questions sorted first

Example:
- User submits: "Is cryptocurrency Halal?"
- Other users like the question
- Question gets 10 likes
- Appears higher in list
- More likely Imam will address it

Anonymous option:
- Can submit as "Anonymous" if prefer
- Question still answered
- Submitter's name not shown
```

**Step 5: Attend Session (LIVE)**
```
At session time (8 PM):

User:
- Gets notification: "Session is now LIVE"
- Clicks "Join Session"
- Receives Agora token
- Connects to audio stream
- Hears Imam speaking
- Can hear other participants

Imam:
- Addresses submitted questions
- Answers in detail
- "Let's start with the first question..."
- Session recorded

Participant experience:
- Audio-only (no video)
- Conversational tone
- All participants hear answers
- Duration: 90 minutes
```

**Step 6: Access Recording & Archive**
```
After session ends:

Notification: "Recording is being processed..."

Within 2-4 hours:
- Recording ready
- User notified

User can:
- Listen to full recording
- Re-listen to specific Q&As
- Share link with others
- Download for offline viewing

Archive:
- All past sessions searchable
- Q&A transcripts available
- Can find specific topics
- Can revisit any session
```

---

## 4. UPI PAYMENT WORKFLOW (DIRECT ONLY)

### Complete UPI Transaction Flow:

```
┌─────────────────────────────────────────────────┐
│           USER WANTS TO DONATE                   │
├─────────────────────────────────────────────────┤
│ • Browsing masjid or needy person profile       │
│ • Clicks "DONATE" button                        │
└─────────────────────────────────────────────────┘
          ↓
    ┌─────────────────────────────────────────────┐
    │    SYSTEM DISPLAYS UPI DETAILS              │
    ├─────────────────────────────────────────────┤
    │ Recipient UPI: alnoor@upi                   │
    │ QR Code: [SCANNABLE]                        │
    │ Masjid: Al-Noor Masjid                      │
    │ Instructions: Scan or copy UPI ID           │
    │ Amount Field: [INPUT]                       │
    │ Optional: Donation notes                    │
    └─────────────────────────────────────────────┘
          ↓
    ┌─────────────────────────────────────────────┐
    │   USER OPENS THEIR UPI APP                  │
    ├─────────────────────────────────────────────┤
    │ Options:                                    │
    │ 1. Scan QR code                             │
    │ 2. Copy UPI ID → Paste in app               │
    │ 3. Manually type UPI ID                     │
    └─────────────────────────────────────────────┘
          ↓
    ┌─────────────────────────────────────────────┐
    │   USER ENTERS DONATION AMOUNT               │
    ├─────────────────────────────────────────────┤
    │ Amount: ₹500                                │
    │ Recipient: Al-Noor Masjid (alnoor@upi)      │
    └─────────────────────────────────────────────┘
          ↓
    ┌─────────────────────────────────────────────┐
    │   USER COMPLETES PAYMENT                    │
    ├─────────────────────────────────────────────┤
    │ Enters: PIN / Biometric / OTP               │
    │ Payment processing...                       │
    │ ✓ Payment Successful!                       │
    │ TxnID: UPI20260512ABC123XYZ456              │
    │ Amount: ₹500                                │
    │ Timestamp: 2026-05-12 10:30:00              │
    └─────────────────────────────────────────────┘
          ↓
    ┌─────────────────────────────────────────────┐
    │   USER TAKES SCREENSHOT                     │
    ├─────────────────────────────────────────────┤
    │ Screenshot shows:                           │
    │ ✓ Payment confirmation                      │
    │ ✓ Amount ₹500                               │
    │ ✓ UPI TxnID                                 │
    │ ✓ Recipient UPI ID                          │
    │ ✓ Timestamp                                 │
    └─────────────────────────────────────────────┘
          ↓
    ┌─────────────────────────────────────────────┐
    │   USER RETURNS TO APP & UPLOADS PROOF       │
    ├─────────────────────────────────────────────┤
    │ 1. Clicks "Upload Payment Proof"            │
    │ 2. Uploads screenshot                       │
    │ 3. Enters UPI TxnID: UPI20260512ABC123      │
    │ 4. Confirms amount: ₹500                    │
    │ 5. Clicks "Submit Donation"                 │
    │ Status: PENDING_VERIFICATION                │
    └─────────────────────────────────────────────┘
          ↓
    ┌─────────────────────────────────────────────┐
    │   MASJID AUTHORITY RECEIVES PAYMENT          │
    ├─────────────────────────────────────────────┤
    │ • Payment received in their UPI/Bank        │
    │ • Amount: ₹500                              │
    │ • TxnID matches: UPI20260512ABC123XYZ456    │
    │ • Running total updated                     │
    └─────────────────────────────────────────────┘
          ↓
    ┌─────────────────────────────────────────────┐
    │   MASJID VERIFIES DONATION IN APP            │
    ├─────────────────────────────────────────────┤
    │ Dashboard → Pending Donations               │
    │ • Donor: User123                            │
    │ • Amount: ₹500                              │
    │ • UPI TxnID: UPI20260512ABC123              │
    │ • Screenshot: [VIEW]                        │
    │ • Masjid checks bank → ✓ Found              │
    │ • Clicks: "VERIFY DONATION"                 │
    │ Status: COMPLETED                           │
    └─────────────────────────────────────────────┘
          ↓
    ┌─────────────────────────────────────────────┐
    │   DONOR RECEIVES RECEIPT                    │
    ├─────────────────────────────────────────────┤
    │ Receipt Generated:                          │
    │ • Receipt Number: RECEIPT-2026-00001        │
    │ • Amount: ₹500                              │
    │ • Masjid: Al-Noor Masjid                    │
    │ • Date: May 12, 2026                        │
    │ • Purpose: Masjid Donation                  │
    │ • UPI TxnID: UPI20260512ABC123              │
    │ • Status: COMPLETED                         │
    │ • Download PDF / Email receipt              │
    └─────────────────────────────────────────────┘
          ↓
    ┌─────────────────────────────────────────────┐
    │   COMPLETED ✓                                │
    ├─────────────────────────────────────────────┤
    │ User: Donation complete, receipt saved      │
    │ Masjid: ₹500 collected                      │
    │ Platform: Transaction recorded              │
    └─────────────────────────────────────────────┘
```

---

## 5. SYSTEM NOTIFICATIONS

### User Receives Notifications For:
- Class enrollment approved/rejected
- Ask Imam session starting soon
- Quran class session starting
- Donation receipt ready
- Zakat collection completed
- Job application status update
- Matrimony interest received
- Registration fee due/reminder

### Masjid Receives Notifications For:
- New job application
- New donation (pending verification)
- New enrollment request
- Renewal fee due reminder
- Documents need attention
- Ask Imam session time

### Super Admin Receives Notifications For:
- New masjid registration
- Renewal fee payment received
- Payment verification needed
- Document verification needed
- System alerts

---

**Workflow Documentation Version**: 2.0 (UPI Only)
**Last Updated**: 2026-05-12
**Transaction Method**: Direct UPI (No Payment Gateway)
**Maintained By**: Islamic Community Hub Team
