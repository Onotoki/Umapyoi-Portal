const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Cache skills sau lần đọc đầu tiên để tránh load lại mỗi request
let _skillsCache = null;

function getSkills() {
  if (_skillsCache) return _skillsCache;

  const umaDataPath = path.join(__dirname, '..', 'uma_data.js');
  let code = fs.readFileSync(umaDataPath, 'utf8');

  // Cắt bỏ phần export{...} ở cuối file (ES module syntax)
  const exportIndex = code.indexOf('export{');
  if (exportIndex > -1) {
    code = code.substring(0, exportIndex);
  }

  // uma_data.js dùng biến 'v' cho mảng skills
  // Dùng Function constructor để chạy code và lấy ra biến v
  const wrapper = new Function(`${code}\n return v;`);
  _skillsCache = wrapper();

  return _skillsCache;
}

// GET /api/skills
router.get('/', (req, res) => {
  try {
    let skills = getSkills();
    const { category, q } = req.query;

    if (category && category !== 'All') {
      skills = skills.filter(s => s.skillCategory === category);
    }

    if (q) {
      const lower = q.toLowerCase();
      skills = skills.filter(s =>
        (s.skillName || '').toLowerCase().includes(lower) ||
        (s.skillDesc || '').toLowerCase().includes(lower)
      );
    }

    res.json(skills);
  } catch (err) {
    console.error('Error loading skills:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/skills/categories
router.get('/categories', (req, res) => {
  try {
    const skills = getSkills();
    const categories = [...new Set(skills.map(s => s.skillCategory))].filter(Boolean);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
