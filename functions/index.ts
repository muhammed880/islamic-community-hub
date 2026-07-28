import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
const fetch = require('node-fetch');

admin.initializeApp();
const db = admin.firestore();

// Transaction-safe Masjid ID generator
export const generateMasjidId = functions.firestore
  .document('masjids/{masjidId}')
  .onCreate(async (snap, context) => {
    const masjidRef = snap.ref;
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

    // Queue PDF generation
    await db.collection('pdf_jobs').add({ nikahRef: nikahRef.path, createdAt: admin.firestore.FieldValue.serverTimestamp() });
    return null;
  });

// PDF job processor - builds HTML from template and calls Cloud Run renderer
export const processPdfJobs = functions.firestore
  .document('pdf_jobs/{jobId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    if (!data?.nikahRef) return null;
    const nikahDocRef = db.doc(data.nikahRef);
    const nikahDoc = await nikahDocRef.get();
    if (!nikahDoc.exists) return null;
    const nikah = nikahDoc.data() || {};

    // Load HTML template
    const templatePath = path.join(__dirname, 'templates', 'nikah_pdf_template.html');
    let htmlTemplate = '';
    try {
      htmlTemplate = fs.readFileSync(templatePath, 'utf8');
    } catch (err) {
      console.error('Template load error', err);
      return null;
    }

    // Helper to safely replace placeholders
    function setPlaceholder(key: string, value: any) {
      const re = new RegExp(`{{${key}}}`, 'g');
      htmlTemplate = htmlTemplate.replace(re, value !== undefined && value !== null ? String(value) : '');
    }

    // Map basic fields
    setPlaceholder('MASJID_NAME', nikah.masjidName || '');
    setPlaceholder('MASJID_ADDRESS', nikah.masjidAddress || '');
    setPlaceholder('QAZI_NAME', nikah.qaziName || '');
    setPlaceholder('DATE_TIME', nikah.dateTime || '');
    setPlaceholder('VENUE', nikah.venue || '');
    setPlaceholder('BRIDE_NAME', nikah.bride?.name || '');
    setPlaceholder('BRIDE_FATHER', nikah.bride?.fatherName || '');
    setPlaceholder('GROOM_NAME', nikah.groom?.name || '');
    setPlaceholder('GROOM_FATHER', nikah.groom?.fatherName || '');
    setPlaceholder('WITNESS1_NAME', nikah.witness1?.name || '');
    setPlaceholder('WITNESS2_NAME', nikah.witness2?.name || '');
    setPlaceholder('MAHAR', nikah.mahar || '');
    setPlaceholder('DOWRY', nikah.dowry || '');
    setPlaceholder('TERMS', nikah.terms || 'Standard Islamic Nikah');
    setPlaceholder('NIKAH_CODE', nikah.nikahCode || context.params.jobId);
    setPlaceholder('GENERATED_AT', new Date().toLocaleString());

    // For signatures, embed images if URLs present, otherwise leave placeholder box
    const makeImgTag = (url: string | undefined) => url ? `<img src="${url}" style="max-height:60px; max-width:100%;"/>` : '<div class="sig-placeholder"></div>';
    setPlaceholder('BRIDE_SIG', makeImgTag(nikah.bride?.signatureUrl));
    setPlaceholder('GROOM_SIG', makeImgTag(nikah.groom?.signatureUrl));
    setPlaceholder('QAZI_SIG', makeImgTag(nikah.qaziSignatureUrl || nikah.qazi?.signatureUrl));
    setPlaceholder('W1_SIG', makeImgTag(nikah.witness1?.signatureUrl));
    setPlaceholder('W2_SIG', makeImgTag(nikah.witness2?.signatureUrl));
    setPlaceholder('MASJID_SIG', makeImgTag(nikah.masjidSignatureUrl));

    // Call Cloud Run renderer
    const rendererUrl = (functions.config() && functions.config().renderer && functions.config().renderer.url) || process.env.CLOUD_RUN_RENDERER_URL;
    if (!rendererUrl) {
      console.error('Renderer URL not configured. Set functions config renderer.url or CLOUD_RUN_RENDERER_URL env var.');
      return null;
    }

    try {
      const resp = await fetch(`${rendererUrl.replace(/\/$/, '')}/render`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: htmlTemplate, nikahCode: nikah.nikahCode || context.params.jobId })
      });
      if (!resp.ok) {
        const text = await resp.text();
        console.error('Renderer error', resp.status, text);
        return null;
      }
      const result = await resp.json();
      const pdfUrl = result.url || result.publicUrl || result.gsUrl || null;
      if (pdfUrl) {
        await nikahDocRef.update({ pdfUrl, pdfGeneratedAt: admin.firestore.FieldValue.serverTimestamp() });
      }

      // Optionally remove the job document
      await snap.ref.delete();

      return null;
    } catch (err) {
      console.error('PDF render call failed', err);
      return null;
    }
  });

