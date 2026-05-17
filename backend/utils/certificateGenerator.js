const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

class CertificateGenerator {
  constructor() {
    this.pageWidth = 297; // A4 in mm converted to points
    this.pageHeight = 210;
  }

  async generateNikahCertificate(nikahData, outputPath) {
    try {
      const doc = new PDFDocument({
        size: [841.89, 595.28], // A4 Landscape
        margin: 40
      });

      // Pipe to file
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // Add Islamic Border Design
      this.addBorder(doc);

      // Header Section
      this.addHeader(doc, nikahData);

      // Title
      doc.fontSize(32)
        .font('Helvetica-Bold')
        .text('نكاح / NIKAH NAMA', { align: 'center' })
        .moveDown(0.5);

      doc.fontSize(14)
        .font('Helvetica')
        .text('Marriage Certificate / विवाह प्रमाण पत्र', { align: 'center' })
        .moveDown(1);

      // Main Certificate Text
      this.addCertificateText(doc, nikahData);

      // Groom Section
      doc.moveDown(1);
      this.addPersonDetails(doc, 'GROOM (दूल्हा)', nikahData.groom);

      // Bride Section
      this.addPersonDetails(doc, 'BRIDE (दुल्हन)', nikahData.bride);

      // Marriage Details
      doc.moveDown(1);
      this.addMarriageDetails(doc, nikahData.marriage);

      // Witnesses Section
      this.addWitnessSection(doc, nikahData.witnesses);

      // Quranic Reference
      this.addQuranReference(doc, nikahData.quranReference);

      // Signature Section
      doc.moveDown(2);
      this.addSignatureSection(doc, nikahData);

      // Footer with Certificate Number and QR Code
      this.addFooter(doc, nikahData);

      doc.end();

      return new Promise((resolve, reject) => {
        stream.on('finish', () => resolve(outputPath));
        stream.on('error', reject);
      });
    } catch (error) {
      throw new Error(`Failed to generate certificate: ${error.message}`);
    }
  }

  addBorder(doc) {
    // Outer decorative border
    const margin = 20;
    const pageWidth = 841.89;
    const pageHeight = 595.28;

    // Main border
    doc.strokeColor('#2D5016')
      .lineWidth(3)
      .rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin)
      .stroke();

    // Inner decorative border
    doc.strokeColor('#DAA520')
      .lineWidth(1)
      .rect(margin + 8, margin + 8, pageWidth - 2 * (margin + 8), pageHeight - 2 * (margin + 8))
      .stroke();

    // Islamic pattern in corners (simplified)
    const cornerSize = 30;
    const corners = [
      { x: margin + 15, y: margin + 15 },
      { x: pageWidth - margin - 15 - cornerSize, y: margin + 15 },
      { x: margin + 15, y: pageHeight - margin - 15 - cornerSize },
      { x: pageWidth - margin - 15 - cornerSize, y: pageHeight - margin - 15 - cornerSize }
    ];

    corners.forEach(corner => {
      doc.fillColor('#2D5016')
        .fontSize(20)
        .text('✦', corner.x, corner.y);
    });
  }

  addHeader(doc, nikahData) {
    const margin = 40;
    const pageWidth = 841.89;

    // Masjid Name and Details (Right aligned)
    doc.fontSize(16)
      .font('Helvetica-Bold')
      .text(nikahData.masjidDetails.masjidName, margin, margin + 10, {
        width: pageWidth - 2 * margin - 200,
        align: 'left'
      });

    // Masjid Address
    doc.fontSize(10)
      .font('Helvetica')
      .text(nikahData.masjidDetails.address || '', {
        width: pageWidth - 2 * margin - 200,
        align: 'left'
      });

    // Certificate and Masjid ID (Right side)
    doc.fontSize(10)
      .font('Helvetica-Bold')
      .text(`Nikah ID: ${nikahData.certificateNumber}`, pageWidth - margin - 180, margin + 10, {
        width: 170,
        align: 'right'
      })
      .text(`Reg ID: ${nikahData.masjidDetails.registrationNumber || 'N/A'}`, {
        align: 'right'
      });

    // Line separator
    doc.moveTo(margin, margin + 60)
      .lineTo(pageWidth - margin, margin + 60)
      .strokeColor('#DAA520')
      .lineWidth(0.5)
      .stroke();
  }

  addCertificateText(doc, nikahData) {
    const margin = 40;
    const pageWidth = 841.89;
    const contentWidth = pageWidth - 2 * margin;

    const text = `This is to Certify that the marriage (Nikah) has been solemnized by the Grace of Allah with the free consent and willingness of both parties. This marriage has been duly registered under Islamic law and the Civil Marriage Law.`;

    doc.fontSize(12)
      .font('Helvetica')
      .text(text, margin, doc.y, {
        width: contentWidth,
        align: 'justify'
      })
      .moveDown(0.5);

    // Officiating Details
    doc.fontSize(11)
      .font('Helvetica-Bold')
      .text(`Officiated by Imam: ${nikahData.imam.name}`, {
        width: contentWidth,
        align: 'left'
      })
      .moveDown(0.3);

    doc.fontSize(11)
      .text(`Marriage Date: ${new Date(nikahData.marriage.date).toLocaleDateString('en-IN')}`, {
        width: contentWidth
      })
      .text(`Marriage Venue: ${nikahData.marriage.venue}`, {
        width: contentWidth
      })
      .moveDown(0.5);
  }

  addPersonDetails(doc, title, person) {
    const margin = 40;
    const pageWidth = 841.89;
    const contentWidth = (pageWidth - 3 * margin) / 2;

    doc.fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('#2D5016')
      .text(title, { width: contentWidth });

    doc.fontSize(10)
      .font('Helvetica')
      .fillColor('black')
      .text(`Name: ${person.fullName}`)
      .text(`Father: ${person.fatherName}`)
      .text(`DOB: ${new Date(person.dateOfBirth).toLocaleDateString('en-IN')}`)
      .text(`Email: ${person.email}`)
      .text(`Phone: ${person.phone}`)
      .text(`Address: ${person.address.street}, ${person.address.city}, ${person.address.state} ${person.address.zipCode}`)
      .moveDown(0.5);
  }

  addMarriageDetails(doc, marriage) {
    const margin = 40;

    doc.fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('#2D5016')
      .text('MARRIAGE DETAILS', { underline: true })
      .moveDown(0.3);

    doc.fontSize(10)
      .font('Helvetica')
      .fillColor('black')
      .text(`Mahr (Dower): ${marriage.maharInWords} (${marriage.mahr} ${marriage.maharCurrency})`)
      .text(`Currency: ${marriage.maharCurrency}`)
      .text(`Marriage Conditions: ${marriage.conditions || 'As per Islamic law'}`)
      .moveDown(0.5);
  }

  addWitnessSection(doc, witnesses) {
    const margin = 40;
    const pageWidth = 841.89;

    doc.fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('#2D5016')
      .text('WITNESSES', { underline: true })
      .moveDown(0.3);

    witnesses.forEach((witness, index) => {
      doc.fontSize(10)
        .font('Helvetica')
        .fillColor('black')
        .text(`Witness ${index + 1}: ${witness.name}`)
        .text(`  Father: ${witness.fatherName || 'N/A'}`)
        .text(`  Address: ${witness.address.city || 'N/A'}, ${witness.address.state || 'N/A'}`)
        .text(`  Phone: ${witness.phone || 'N/A'}`)
        .moveDown(0.2);
    });

    doc.moveDown(0.5);
  }

  addQuranReference(doc, quranRef) {
    const margin = 40;
    const pageWidth = 841.89;
    const contentWidth = pageWidth - 2 * margin;

    doc.fontSize(11)
      .font('Helvetica-Oblique')
      .fillColor('#2D5016')
      .text(`"${quranRef.ayat}"`, {
        width: contentWidth,
        align: 'center'
      });

    doc.fontSize(9)
      .font('Helvetica')
      .fillColor('black')
      .text(quranRef.translation, {
        width: contentWidth,
        align: 'center'
      })
      .moveDown(0.5);
  }

  addSignatureSection(doc, nikahData) {
    const margin = 40;
    const pageWidth = 841.89;
    const colWidth = (pageWidth - 3 * margin) / 3;

    const signatureY = doc.y;
    const lineY = signatureY + 40;

    // Groom Signature
    doc.fontSize(10)
      .font('Helvetica-Bold')
      .text('Groom Signature', margin, signatureY, { width: colWidth, align: 'center' });

    doc.moveTo(margin, lineY)
      .lineTo(margin + colWidth - 10, lineY)
      .strokeColor('#000')
      .lineWidth(1)
      .stroke();

    // Imam Signature
    const imamX = margin + colWidth + margin / 2;
    doc.fontSize(10)
      .font('Helvetica-Bold')
      .text('Imam Signature', imamX, signatureY, { width: colWidth, align: 'center' });

    doc.moveTo(imamX, lineY)
      .lineTo(imamX + colWidth - 10, lineY)
      .stroke();

    // Bride Signature
    const brideX = imamX + colWidth + margin / 2;
    doc.fontSize(10)
      .font('Helvetica-Bold')
      .text('Bride Signature', brideX, signatureY, { width: colWidth, align: 'center' });

    doc.moveTo(brideX, lineY)
      .lineTo(brideX + colWidth - 10, lineY)
      .stroke();

    doc.moveDown(3);
  }

  addFooter(doc, nikahData) {
    const margin = 40;
    const pageWidth = 841.89;
    const pageHeight = 595.28;

    // Certificate Number
    doc.fontSize(9)
      .font('Helvetica')
      .fillColor('#666')
      .text(`Certificate No: ${nikahData.certificateNumber}`, margin, pageHeight - 60, {
        width: pageWidth - 2 * margin,
        align: 'center'
      });

    // Date
    doc.text(`Issued Date: ${new Date().toLocaleDateString('en-IN')}`, {
      align: 'center'
    });

    // Validity Note
    doc.fontSize(8)
      .text('This certificate is digitally signed and valid. For verification, visit our website.', {
        align: 'center'
      });
  }
}

module.exports = new CertificateGenerator();
