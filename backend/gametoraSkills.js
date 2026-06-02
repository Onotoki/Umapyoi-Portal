const fs = require('fs');
const path = require('path');
const Character = require('./models/Character');

const EFFECT_TYPE_MAP = {
  27: 'Target Speed',
  31: 'Acceleration',
  9: 'Stamina Recovery',
  21: 'Current Speed',
  10: 'Improve Start Reaction Time',
  28: 'Increase Lane Movement Speed',
  1: 'Speed Stat',
  2: 'Stamina Stat',
  3: 'Power Stat',
  4: 'Guts Stat',
  5: 'Wisdom Stat',
  6: 'Breakaway',
  8: 'Field of Vision',
  13: 'Disrupt Leading',
  14: 'Worsen Start Reaction',
  22: 'Target Speed',
  29: 'Post',
  32: 'Luck',
  501: 'Carnival Bonus',
  502: 'Carnival Bonus',
};

const STAT_TYPES = [1, 2, 3, 4, 5];

const EFFECT_TYPE_LABEL = {
  27: 'Velocity',
  31: 'Accel',
  9: 'Recover',
  22: 'Velocity',
  21: 'Velocity',
};

let _gtSkillsCache = null;
let _gtSkillsTs = 0;
const GT_SKILLS_CACHE_TTL = 24 * 60 * 60 * 1000;

let _charNameMapCache = null;

async function getCharacterNameMap() {
  if (_charNameMapCache) return _charNameMapCache;

  const mongoose = require('mongoose');
  if (mongoose.connection.readyState !== 1) {
    await new Promise(resolve => mongoose.connection.once('connected', resolve));
  }

  const allChars = await Character.find({}, { name_en: 1, alt_name: 1, image_url: 1 }).lean();
  const map = {};
  allChars.forEach(c => {
    const match = c.image_url && c.image_url.match(/(\d+)\.png$/);
    const cardId = match ? Number(match[1]) : null;
    if (cardId) {
      map[cardId] = {
        name: c.name_en,
        title: c.alt_name || 'Original',
      };
    }
  });

  _charNameMapCache = map;
  return map;
}

async function fetchGtSkillsMap() {
  if (_gtSkillsCache && Date.now() - _gtSkillsTs < GT_SKILLS_CACHE_TTL) return _gtSkillsCache;

  try {
    const manifestRes = await fetch('https://gametora.com/data/manifests/umamusume.json', { cache: 'no-cache' });
    if (!manifestRes.ok) throw new Error('Failed to fetch GT manifest');
    const manifest = await manifestRes.json();
    const hash = manifest.skills;
    if (!hash) throw new Error('No skills hash in manifest');

    const skillsRes = await fetch(`https://gametora.com/data/umamusume/skills.${hash}.json`, { cache: 'no-cache' });
    if (!skillsRes.ok) throw new Error('Failed to fetch GT skills');
    const skills = await skillsRes.json();

    const map = {};
    skills.forEach(s => {
      const cg = s.condition_groups && s.condition_groups[0];
      const rawEffects = cg && cg.effects || [];

      const isUnique = s.rarity === 5;

      const effects = [];
      let effectSummary = '';
      rawEffects.forEach((eff, idx) => {
        const effValue = Math.round((eff.value / 10000) * 1000) / 1000;
        if (effValue == null) return;

        const effLabel = EFFECT_TYPE_MAP[eff.type] || null;
        let displayLabel = effLabel || `Type ${eff.type}`;
        if (STAT_TYPES.includes(eff.type)) {
          displayLabel = effValue < 0 ? `${effLabel} Down` : `${effLabel} Up`;
        }
        const displayText = effValue < 0
          ? `${displayLabel} -${Math.abs(effValue)}`
          : `${displayLabel} +${effValue}`;
        effects.push({ type: displayLabel, value: effValue, rawType: eff.type, displayText });
        effectSummary = idx === 0 ? displayText : `${effectSummary} | ${displayText}`;
      });

      map[s.id] = {
        skillId: s.id,
        skillName: s.name_en || '',
        iconId: s.iconid || 20011,
        skillDesc: s.desc_en || '',
        rarity: s.rarity || 1,
        skillCategory: isUnique ? 'Unique' : 'Passive',
        effects,
        effectSummary,
        baseDuration: cg && cg.base_time > 0 ? Math.round(cg.base_time / 10000 * 10) / 10 : null,
        characterLabel: '',
        char: s.char,
      };
    });

    _gtSkillsCache = map;
    _gtSkillsTs = Date.now();
    return map;
  } catch (e) {
    console.error('[fetchGtSkillsMap]', e.message);
    return _gtSkillsCache || {};
  }
}

module.exports = { fetchGtSkillsMap, getCharacterNameMap, EFFECT_TYPE_MAP, EFFECT_TYPE_LABEL };
