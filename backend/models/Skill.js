// backend/models/Skill.js
const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  iconUrl: { type: String },
  skillCategory: { type: String },
  rarity: { type: String },
  // Additional fields can be added as needed
}, { timestamps: true });

module.exports = mongoose.model('Skill', SkillSchema);
