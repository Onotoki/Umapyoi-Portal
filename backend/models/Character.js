const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name_en: { type: String, required: true },
  alt_name: { type: String, default: "" },
  stars: { type: Number, default: 3 },
  image_url: { type: String, required: true },
  release_date: { type: Date, required: true },
  color_main: { type: String, default: "#d9463e" }
});

module.exports = mongoose.model('Character', characterSchema);
