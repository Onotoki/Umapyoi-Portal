const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { fetchGtSkillsMap, getCharacterNameMap, EFFECT_TYPE_LABEL } = require('../gametoraSkills');

// Cache skills từ uma_data.js
let _skillsCache = null;

function getLocalSkills() {
  if (_skillsCache) return _skillsCache;

  const umaDataPath = path.join(__dirname, '..', 'uma_data.js');
  let code = fs.readFileSync(umaDataPath, 'utf8');

  const exportIndex = code.indexOf('export{');
  if (exportIndex > -1) {
    code = code.substring(0, exportIndex);
  }

  const wrapper = new Function(`${code}\n return v;`);
  _skillsCache = wrapper();

  return _skillsCache;
}

// GET /api/skills — merges GT data with local fallback
router.get('/', async (req, res) => {
  try {
    const localSkills = getLocalSkills();
    const localMap = {};
    localSkills.forEach(s => { localMap[s.skillId] = s; });

    const gtMap = await fetchGtSkillsMap();

    // Merge: GT data for effects/desc, local for category fallback
    const merged = {};
    const allIds = new Set([...Object.keys(localMap), ...Object.keys(gtMap)]);
    allIds.forEach(id => {
      const numId = Number(id);
      const gt = gtMap[numId];
      const local = localMap[numId];
      if (gt && local) {
        merged[numId] = {
          ...local,
          ...gt,
          skillCategory: gt.skillCategory === 'Unique' ? 'Unique' : (local.skillCategory || 'Passive'),
          skillName: gt.skillName || local.skillName,
          skillDesc: gt.skillDesc || local.skillDesc,
        };
      } else {
        merged[numId] = gt || local;
      }
    });

    let skills = Object.values(merged);

    // Fix mis-categorized skills (local data errors)
    skills.forEach(s => {
      if (s.skillId === 200431 || s.skillId === 200432) {
        s.skillCategory = 'Focus';
      }
      if (s.skillId === 202141) {
        s.skillCategory = 'Debuff';
      }
    });

    // Rename effects for Debuff skills
    skills.forEach(s => {
      if (s.skillCategory === 'Debuff' && s.effects && s.effects.length > 0) {
        // Deep clone effects to avoid mutating GT/local cache
        s.effects = JSON.parse(JSON.stringify(s.effects));
        s.effects.forEach(e => {
          const baseType = e.type;
          if (baseType === 'Stamina Recovery') {
            e.type = 'Stamina Drain';
            e.displayText = `Stamina Drain -${Math.abs(e.value)}`;
          } else if (e.value < 0 && baseType) {
            e.type = `Decrease ${baseType}`;
            e.displayText = `Decrease ${baseType} -${Math.abs(e.value)}`;
          }
        });
        if (s.effectSummary) {
          const e = s.effects[0];
          if (e.value < 0) {
            s.effectSummary = e.displayText;
          }
        }
      }
    });

    // Add effectTypeLabel for Unique skills (replace "Unique" badge with actual effect type)
    skills.forEach(s => {
      if (s.skillCategory !== 'Unique') return;
      if (s.effects && s.effects.length > 0) {
        const eff = s.effects[0];
        if (eff.rawType) {
          s.effectTypeLabel = EFFECT_TYPE_LABEL[eff.rawType] || null;
        } else if (s.skillId >= 900000) {
          const original = gtMap[s.skillId - 800000];
          if (original && original.effects && original.effects[0] && original.effects[0].rawType) {
            s.effectTypeLabel = EFFECT_TYPE_LABEL[original.effects[0].rawType] || null;
          }
        }
      }
    });

    // Build character labels for Unique skills
    const charNameMap = await getCharacterNameMap();
    skills.forEach(s => {
      if (s.skillCategory !== 'Unique' || s.characterLabel) return;

      const resolveCardId = (skillId) => {
        const entry = gtMap[skillId];
        if (!entry || !entry.char) return null;
        if (Array.isArray(entry.char)) return Number(entry.char[0]);
        return Number(entry.char);
      };

      let cardId = null;
      if (s.skillId >= 900000) {
        const originalId = s.skillId - 800000;
        cardId = resolveCardId(originalId);
      } else {
        cardId = resolveCardId(s.skillId);
      }

      if (cardId && charNameMap[cardId]) {
        const cardData = charNameMap[cardId];
        s.characterLabel = `${cardData.name} (${cardData.title})'s Unique`;
      }
    });

    const { category, q } = req.query;

    if (category && category !== 'All') {
      skills = skills.filter(s => s.skillCategory === category);
    }

    // Filter out nameless skills (internal/evolution IDs only in GT)
    skills = skills.filter(s => s.skillName);

    if (q) {
      const lower = q.toLowerCase();
      skills = skills.filter(s =>
        s.skillName.toLowerCase().includes(lower) ||
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
