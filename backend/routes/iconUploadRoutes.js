const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const router = express.Router();

// Save uploads to frontend/public/icons/strategy
const iconsDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'icons', 'strategy');

// Ensure directory exists
fs.mkdirSync(iconsDir, { recursive: true });

// Use multer with memory storage and validate filenames
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Expected filenames - enforce these names when saving
// User-provided names: front, pace, late, end, runnaway
const expected = ['front.png', 'pace.png', 'late.png', 'end.png', 'runnaway.png'];

// POST /api/icons/upload - multipart form with files under field 'icons'
router.post('/upload', upload.array('icons'), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded. Attach files in field "icons".' });
  }

  // Write each file to the iconsDir using its originalname, but only if it's one of the expected names
  const written = [];
  const skipped = [];

  for (const f of req.files) {
    const name = f.originalname;
    if (!expected.includes(name)) {
      skipped.push(name);
      continue;
    }

    const dest = path.join(iconsDir, name);
    try {
      fs.writeFileSync(dest, f.buffer);
      written.push(name);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to write files', detail: err.message });
    }
  }

  return res.json({ written, skipped, expected });
});

module.exports = router;
