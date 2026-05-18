const express = require('express');
const router = express.Router();
const Character = require('../models/Character');

router.get('/', async (req, res) => {
  try {
    // Sort by stars descending (3 -> 2 -> 1) and then release_date descending (newest first)
    const characters = await Character.find().sort({ stars: -1, release_date: -1 });
    res.json(characters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
