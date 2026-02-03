const mongoose = require('mongoose');

const DrugSchema = new mongoose.Schema({
  // We use strings for keys with spaces
  "Alias name": { type: String },
  "Drug Name": { type: String, required: true },
  "Category": { type: String },
  "Dosage Form": { type: String },
  "Effect Description": { type: String }
});

// Create an index to make the search fast
DrugSchema.index({ "Drug Name": "text", "Category": "text" });

module.exports = mongoose.model('Drug', DrugSchema, 'drugs');