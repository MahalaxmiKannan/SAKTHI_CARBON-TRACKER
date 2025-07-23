const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  // In a real app, this would be an S3 or GCS URL
  fileUrl: { type: String, required: true },
  generatedBy: { type: String, required: true },
  reportType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Report', ReportSchema);