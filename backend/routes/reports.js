const express = require('express');
const Report = require('../models/Report');
const { protect, isAdmin } = require('../middleware/auth');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Ensure the reports directory exists
const reportsDir = path.join(__dirname, '../public/reports');
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

// @route   POST /api/reports/generate
router.post('/generate', [protect, isAdmin], async (req, res) => {
  const { reportType, format } = req.body;
  const fileName = `${reportType}_${Date.now()}.${format}`;
  const filePath = path.join(reportsDir, fileName);
  // This URL will be used by the frontend to download the file
  const fileUrl = `/reports/${fileName}`;

  // --- DUMMY DATA FOR REPORT ---
  const data = [
      { dept: 'Melting', emissions: 1200, target: 1100 },
      { dept: 'Machining', emissions: 850, target: 900 },
      { dept: 'Dispatch', emissions: 150, target: 150 },
  ];

  if (format === 'pdf') {
      const doc = new PDFDocument();
      doc.pipe(fs.createWriteStream(filePath));
      doc.fontSize(20).text(`Sakthi Auto - ${reportType} Report`, { align: 'center' });
      doc.moveDown();
      data.forEach(d => {
          doc.fontSize(12).text(`Department: ${d.dept}, Emissions: ${d.emissions} kg CO2e, Target: ${d.target} kg CO2e`);
      });
      doc.end();
  } else { // excel
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Emissions Report');
      worksheet.columns = [
          { header: 'Department', key: 'dept', width: 20 },
          { header: 'Emissions (kg CO2e)', key: 'emissions', width: 25 },
          { header: 'Target (kg CO2e)', key: 'target', width: 25 },
      ];
      worksheet.addRows(data);
      await workbook.xlsx.writeFile(filePath);
  }

  const newReport = new Report({
      fileName,
      fileUrl,
      reportType,
      generatedBy: req.user.username,
  });
  await newReport.save();
  res.status(201).json(newReport);
});

// @route   GET /api/reports
router.get('/', protect, async (req, res) => {
  const reports = await Report.find().sort({ createdAt: -1 });
  res.json(reports);
});

module.exports = router;