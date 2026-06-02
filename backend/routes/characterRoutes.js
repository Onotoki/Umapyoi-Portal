const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Character = require('../models/Character');
const { fetchGtSkillsMap } = require('../gametoraSkills');

// Load local skill definitions from uma_data.js v array
let _skillsCache = null;
function getLocalSkills() {
  if (_skillsCache) return _skillsCache;
  const p = path.join(__dirname, '..', 'uma_data.js');
  let code = fs.readFileSync(p, 'utf8');
  const exportIdx = code.indexOf('export{');
  if (exportIdx > -1) code = code.substring(0, exportIdx);
  const wrapper = new Function(code + '\n return v;');
  _skillsCache = wrapper();
  return _skillsCache;
}

// Skill definitions for IDs not in the local v array
const missingSkillOverrides = {};

const buildExtra = (match) => {
  if (!match) return null;

  return {
    voiceActor: match.voiceActor,
    cardTitle: match.cardTitle,
    birthYear: match.birthYear,
    birthMonth: match.birthMonth,
    birthDay: match.birthDay,
    height: match.height,
    bust: match.bust,
    baseSpeed: match.baseSpeed,
    baseStamina: match.baseStamina,
    basePower: match.basePower,
    baseGuts: match.baseGuts,
    baseWisdom: match.baseWisdom,
    talentSpeed: match.talentSpeed,
    talentStamina: match.talentStamina,
    talentPower: match.talentPower,
    talentGuts: match.talentGuts,
    talentWisdom: match.talentWisdom,
    aptitudeTurf: match.aptitudeTurf,
    aptitudeDirt: match.aptitudeDirt,
    aptitudeShort: match.aptitudeShort,
    aptitudeMile: match.aptitudeMile,
    aptitudeMiddle: match.aptitudeMiddle,
    aptitudeLong: match.aptitudeLong,
    aptitudeRunner: match.aptitudeRunner,
    aptitudeLeader: match.aptitudeLeader,
    aptitudeBetweener: match.aptitudeBetweener,
    aptitudeChaser: match.aptitudeChaser,
  };
};

const getCardIdFromImage = (imageUrl) => {
  const match = imageUrl?.match(/_(\d{6})\.png$/);
  return match ? Number(match[1]) : null;
};

const characterDataOverrides = {
  // Fine Motion Wedding — base stats/aptitudes same as base, talent bonuses differ
  102202: {
    talentSpeed: 0,
    talentStamina: 0,
    talentPower: 0,
    talentGuts: 10,
    talentWisdom: 20,
  },
  // Inari One — not in uma_data.js
  103401: {
    voiceActor: 'Haruno Inoue',
    cardTitle: '[Edomurasaki]',
    birthYear: 1984,
    birthMonth: 5,
    birthDay: 7,
    height: 139,
    bust: 2,
    baseSpeed: 88,
    baseStamina: 100,
    basePower: 109,
    baseGuts: 74,
    baseWisdom: 79,
    talentSpeed: 0,
    talentStamina: 10,
    talentPower: 20,
    talentGuts: 0,
    talentWisdom: 0,
    aptitudeTurf: 'A',
    aptitudeDirt: 'A',
    aptitudeShort: 'F',
    aptitudeMile: 'B',
    aptitudeMiddle: 'A',
    aptitudeLong: 'A',
    aptitudeRunner: 'G',
    aptitudeLeader: 'B',
    aptitudeBetweener: 'B',
    aptitudeChaser: 'A',
  },
  // Curren Chan Wedding — not yet in uma_data.js
  103802: {
    voiceActor: 'Yuu Sasahara',
    cardTitle: '[Ma Cherie of the New Moon]',
    baseSpeed: 100,
    baseStamina: 54,
    basePower: 109,
    baseGuts: 85,
    baseWisdom: 102,
    talentSpeed: 10,
    talentStamina: 0,
    talentPower: 10,
    talentGuts: 0,
    talentWisdom: 10,
    aptitudeTurf: 'A',
    aptitudeDirt: 'F',
    aptitudeShort: 'A',
    aptitudeMile: 'D',
    aptitudeMiddle: 'G',
    aptitudeLong: 'G',
    aptitudeRunner: 'B',
    aptitudeLeader: 'A',
    aptitudeBetweener: 'E',
    aptitudeChaser: 'G',
  },
};

router.get('/', async (req, res) => {
  try {
    // Sort by stars descending (3 -> 2 -> 1) and then release_date descending (newest first)
    const characters = await Character.find().sort({ stars: -1, release_date: -1 });
    res.json(characters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single character detail with all variants
router.get('/:name', async (req, res) => {
  try {
    const name = req.params.name;
    // Find all variants of this character
    const allVariants = await Character.find({
      name_en: { $regex: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
    }).sort({ release_date: 1 });

    if (allVariants.length === 0) {
      return res.status(404).json({ message: 'Character not found' });
    }

    // Enrich each version with card-specific data from uma_data.js if available.
    let enrichedVariants = allVariants.map(v => v.toObject());
    try {
      const umaDataPath = path.join(__dirname, '..', 'uma_data.js');
      const content = fs.readFileSync(umaDataPath, 'utf8');
      const start = content.indexOf('JSON.parse(`') + 12;
      const end = content.indexOf('`)', start);
      const jsonStr = content.slice(start, end);
      const umaData = JSON.parse(jsonStr);
      const fallback = umaData.find(d => d.charaName && d.charaName.toLowerCase() === name.toLowerCase());
      enrichedVariants = enrichedVariants.map((variant) => {
        const cardId = getCardIdFromImage(variant.image_url);
        const baseMatch = umaData.find(d => d.cardId === cardId) || fallback;
        const match = characterDataOverrides[cardId] ? { ...baseMatch, ...characterDataOverrides[cardId] } : baseMatch;
        return { ...variant, extra: buildExtra(match) };
      });
    } catch (e) {
      // uma_data.js enrichment is optional
    }

    // Separate base and variants
    const base = enrichedVariants.find(v => !v.alt_name) || enrichedVariants[0];
    const variants = enrichedVariants.filter(v => v._id.toString() !== base._id.toString());

    res.json({
      base,
      variants,
      extra: base.extra,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Proxy GameTora data for a character variant
const gametoraCache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

const slugify = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const fetchGametoraData = async (urlName) => {
  const cached = gametoraCache.get(urlName);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`https://gametora.com/umamusume/characters/${urlName}`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return null;
  const html = await res.text();
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s);
  if (!match) return null;

  const nextData = JSON.parse(match[1]);
  const pp = nextData.props?.pageProps;
  if (!pp) return null;

  const item = pp.itemData || {};
  const objectives = Array.isArray(pp.objectiveData) ? pp.objectiveData : [];
  const events = Array.isArray(pp.eventData?.en) ? pp.eventData.en : [];
  const profile = pp.profileData?.en || {};

  const toArray = (v) => Array.isArray(v) ? v : [];
  const skills_unique = toArray(item.skills_unique);
  const skills_innate = toArray(item.skills_innate);
  const skills_awakening = toArray(item.skills_awakening);
  const skills_event = toArray(item.skills_event);
  const skills_evo = toArray(item.skills_evo);

  // Build skill definitions from GameTora data API (with local fallback)
  const localSkills = getLocalSkills();
  const localSkillMap = {};
  localSkills.forEach(s => { localSkillMap[s.skillId] = s; });

  const gtSkillsMap = await fetchGtSkillsMap();

  const allSkillIds = [...skills_unique, ...skills_innate, ...skills_awakening, ...skills_event];
  skills_evo.forEach(evo => { if (evo && evo.old) allSkillIds.push(evo.old); if (evo && evo.new) allSkillIds.push(evo.new); });

  const skillDefinitions = {};
  allSkillIds.forEach(id => {
    const gt = gtSkillsMap[id];
    const local = localSkillMap[id];
    if (gt && local) {
      skillDefinitions[id] = {
        ...local,
        ...gt,
        skillCategory: gt.skillCategory === 'Unique' ? 'Unique' : (local.skillCategory || 'Passive'),
        skillName: gt.skillName || local.skillName,
        skillDesc: gt.skillDesc || local.skillDesc,
      };
    } else if (gt) {
      skillDefinitions[id] = gt;
    } else if (local) {
      skillDefinitions[id] = local;
    } else if (missingSkillOverrides[id]) {
      skillDefinitions[id] = missingSkillOverrides[id];
    }
  });

  const result = {
    skills_unique,
    skills_innate,
    skills_awakening,
    skills_event,
    skills_evo,
    skillDefinitions,
    stat_bonus: item.stat_bonus || [],
    rarity: item.rarity,
    title: item.title_en_gl || item.title || '',
    version: item.version || '',
    objectives,
    events,
    profile,
  };

  gametoraCache.set(urlName, { data: result, ts: Date.now() });
  return result;
  } catch (e) {
    clearTimeout(timeout);
    return null;
  }
};

router.get('/:name/gametora-data', async (req, res) => {
  try {
    const name = req.params.name;
    const cardId = req.query.cardId ? Number(req.query.cardId) : null;

    let urlName;
    if (cardId) {
      urlName = `${cardId}-${slugify(name)}`;
    } else {
      urlName = slugify(name);
    }

    const data = await fetchGametoraData(urlName);
    if (!data) return res.status(404).json({ message: 'GameTora data not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
