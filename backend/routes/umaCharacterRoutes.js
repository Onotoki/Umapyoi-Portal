const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/', async (req, res) => {
  try {
    const umaDataPath = path.join(__dirname, '..', 'uma_data.js');
    const content = fs.readFileSync(umaDataPath, 'utf8');
    const start = content.indexOf('JSON.parse(`') + 12;
    const end = content.indexOf('`)', start);
    const jsonStr = content.slice(start, end);
    const data = JSON.parse(jsonStr);
    const chars = data.filter(d => d.charaName);
    const seen = {};
    const unique = chars.filter(c => {
      if (seen[c.charaName]) return false;
      seen[c.charaName] = true;
      return true;
    });
    res.json(unique.map(c => ({
      charaName: c.charaName,
      aptitudeRunner: c.aptitudeRunner,
      aptitudeLeader: c.aptitudeLeader,
      aptitudeBetweener: c.aptitudeBetweener,
      aptitudeChaser: c.aptitudeChaser,
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
