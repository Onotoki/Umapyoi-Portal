const mongoose = require('mongoose');

const supportCardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: false
  },
  supportCardId: {
    type: Number,
    required: false
  },
  rarity: {
    type: String,
    enum: ['SSR', 'SR', 'R'],
    required: true
  },
  type: {
    type: String,
    enum: ['Speed', 'Stamina', 'Power', 'Guts', 'Wit', 'Friend', 'Group'],
    required: true
  },
  image_url: {
    type: String,
    required: true
  },
  release_date: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('SupportCard', supportCardSchema);
