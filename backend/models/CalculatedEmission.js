const mongoose = require('mongoose');

const CalculatedEmissionSchema = new mongoose.Schema({
  source_id: { type: String, required: true },
  factory_id: { type: String, default: 'SAKTHI_COIMBATORE_PLANT_1' },
  department: { type: String, required: true },
  scope: { type: String, required: true },
  co2e_kg: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CalculatedEmission', CalculatedEmissionSchema);