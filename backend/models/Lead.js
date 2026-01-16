const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    email: { type: String, required: true, index: true },
    phone: { type: String, required: true },

    company: { type: String, index: true },
    source: { type: String, index: true },
    stage: { type: String, index: true },
    owner: { type: String, index: true },

    score: { type: Number, default: 50 },
    lastContactedAt: { type: Date, default: null },
    createdAtISO: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", LeadSchema);
