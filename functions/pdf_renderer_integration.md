# How to connect Cloud Function PDF job to Cloud Run

This file explains how to call the Cloud Run renderer from the existing Cloud Function pdf_jobs processor.

1. Deploy the Cloud Run service (see cloud-run/pdf-renderer/README.md).
2. In your Cloud Function (processPdfJobs), instead of using Puppeteer directly, build the filled HTML using the template in functions/templates/nikah_pdf_template.html and POST it to the Cloud Run endpoint `/render` as JSON: { html: '<html>...'</html>, nikahCode: 'NK-...' }.
3. Cloud Run will return a gs:// or http URL for the uploaded PDF. Update the nikah document with pdfUrl and pdfGeneratedAt.

Example Node fetch call (pseudo):

const fetch = require('node-fetch');
const rendererUrl = process.env.CLOUD_RUN_RENDERER_URL; // set in functions env
const resp = await fetch(`${rendererUrl}/render`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ html, nikahCode }) });
const result = await resp.json();
if (result.url) { await nikahRef.update({ pdfUrl: result.url, pdfGeneratedAt: admin.firestore.FieldValue.serverTimestamp() }); }
