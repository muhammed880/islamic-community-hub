const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const {Storage} = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json({ limit: '5mb' }));

const storage = new Storage();
const BUCKET = process.env.PDF_BUCKET || '';

app.post('/render', async (req, res) => {
  try {
    const data = req.body; // expect { html: '<html>..</html>', nikahCode: 'NK-...' }
    if (!data?.html || !data?.nikahCode) return res.status(400).send('html and nikahCode required');

    const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(data.html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    if (BUCKET) {
      const filename = `nikah_pdfs/${data.nikahCode}.pdf`;
      const file = storage.bucket(BUCKET).file(filename);
      await file.save(pdfBuffer, { contentType: 'application/pdf' });
      const publicUrl = `gs://${process.env.PDF_BUCKET}/${filename}`;
      return res.json({ success: true, url: publicUrl });
    }

    res.set('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.toString());
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('PDF renderer listening on', PORT));
