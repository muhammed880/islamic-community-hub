import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// Transaction-safe Masjid ID generator
export const generateMasjidId = functions.firestore
  .document('masjids/{masjidId}')
  .onCreate(async (snap, context) => {
    const masjidRef = snap.ref;
    // Simple counter approach using a counters document (create if not exists)
    const counterRef = db.collection('counters').doc('masjid');
    await db.runTransaction(async (tx) => {
      const counterDoc = await tx.get(counterRef);
      let seq = 1;
      if (counterDoc.exists) {
        seq = (counterDoc.data()?.seq || 0) + 1;
      }
      tx.set(counterRef, { seq }, { merge: true });
      const year = new Date().getFullYear();
      const code = `MN-${year}-${String(seq).padStart(6,'0')}`;
      tx.update(masjidRef, { masjidCode: code });
    });
    return null;
  });

// Transaction-safe Nikah ID generator + PDF job trigger
export const onNikahCreate = functions.firestore
  .document('nikah_regs/{nikahId}')
  .onCreate(async (snap, context) => {
    const nikahRef = snap.ref;
    const counterRef = db.collection('counters').doc('nikah');
    await db.runTransaction(async (tx) => {
      const counterDoc = await tx.get(counterRef);
      let seq = 1;
      if (counterDoc.exists) {
        seq = (counterDoc.data()?.seq || 0) + 1;
      }
      tx.set(counterRef, { seq }, { merge: true });
      const year = new Date().getFullYear();
      const code = `NK-${year}-${String(seq).padStart(6,'0')}`;
      tx.update(nikahRef, { nikahCode: code, status: 'SUBMITTED' });
    });

    // Queue PDF generation (implement generateNikahPdf below)
    await db.collection('pdf_jobs').add({ nikahRef: nikahRef.path, createdAt: admin.firestore.FieldValue.serverTimestamp() });
    return null;
  });

// PDF job processor (skeleton)
export const processPdfJobs = functions.firestore
  .document('pdf_jobs/{jobId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    if (!data?.nikahRef) return null;
    const nikahDoc = await db.doc(data.nikahRef).get();
    if (!nikahDoc.exists) return null;
    const nikah = nikahDoc.data();

    // TODO: Build HTML from nikah data, render to PDF (Puppeteer), upload to Storage and set pdfUrl
    // This is a skeleton; implement template and Puppeteer rendering in production

    console.log('PDF job queued for', data.nikahRef);
    return null;
  });

