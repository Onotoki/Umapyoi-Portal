const express = require('express');
const router = express.Router();
const SupportCard = require('../models/SupportCard');

router.get('/', async (req, res) => {
  try {
    // Sắp xếp theo supportCardId giảm dần (thứ tự ra mắt chính xác của game)
    const cards = await SupportCard.find().sort({ supportCardId: -1 });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
