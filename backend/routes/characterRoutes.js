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
  // Air Shakur — not yet in uma_data.js
  103601: {
    voiceActor: 'Minami Tsuda',
    cardTitle: '[unsigned]',
    birthYear: 1997,
    birthMonth: 2,
    birthDay: 26,
    height: 168,
    baseSpeed: 99,
    baseStamina: 85,
    basePower: 95,
    baseGuts: 69,
    baseWisdom: 102,
    talentSpeed: 0,
    talentStamina: 0,
    talentPower: 0,
    talentGuts: 0,
    talentWisdom: 30,
    aptitudeTurf: 'A',
    aptitudeDirt: 'G',
    aptitudeShort: 'G',
    aptitudeMile: 'E',
    aptitudeMiddle: 'A',
    aptitudeLong: 'A',
    aptitudeRunner: 'G',
    aptitudeLeader: 'C',
    aptitudeBetweener: 'A',
    aptitudeChaser: 'A',
  },
  // Sweep Tosho — not yet in uma_data.js
  104401: {
    voiceActor: 'Shiori Sugiura',
    cardTitle: '[Platanus Witch]',
    birthYear: 2001,
    birthMonth: 5,
    birthDay: 9,
    height: 139,
    baseSpeed: 101,
    baseStamina: 85,
    basePower: 110,
    baseGuts: 65,
    baseWisdom: 89,
    talentSpeed: 10,
    talentStamina: 0,
    talentPower: 20,
    talentGuts: 0,
    talentWisdom: 0,
    aptitudeTurf: 'A',
    aptitudeDirt: 'G',
    aptitudeShort: 'E',
    aptitudeMile: 'A',
    aptitudeMiddle: 'A',
    aptitudeLong: 'D',
    aptitudeRunner: 'G',
    aptitudeLeader: 'G',
    aptitudeBetweener: 'A',
    aptitudeChaser: 'A',
  },
  // Taiki Shuttle Camping — not yet in uma_data.js
  101002: {
    voiceActor: 'Yuka Ootsubo',
    cardTitle: '[Bubblegum☆Memories]',
    birthYear: 1994,
    birthMonth: 3,
    birthDay: 23,
    height: 172,
    baseSpeed: 102,
    baseStamina: 71,
    basePower: 107,
    baseGuts: 92,
    baseWisdom: 78,
    talentSpeed: 0,
    talentStamina: 0,
    talentPower: 30,
    talentGuts: 0,
    talentWisdom: 0,
    aptitudeTurf: 'A',
    aptitudeDirt: 'B',
    aptitudeShort: 'A',
    aptitudeMile: 'A',
    aptitudeMiddle: 'E',
    aptitudeLong: 'G',
    aptitudeRunner: 'C',
    aptitudeLeader: 'A',
    aptitudeBetweener: 'E',
    aptitudeChaser: 'G',
  },
  // Mejiro Dober Camping — not yet in uma_data.js
  105902: {
    voiceActor: 'Hikari Kubota',
    cardTitle: '[Sapphire Sojourn]',
    birthYear: 1994,
    birthMonth: 5,
    birthDay: 6,
    height: 157,
    baseSpeed: 94,
    baseStamina: 78,
    basePower: 92,
    baseGuts: 86,
    baseWisdom: 100,
    talentSpeed: 20,
    talentStamina: 0,
    talentPower: 0,
    talentGuts: 0,
    talentWisdom: 10,
    aptitudeTurf: 'A',
    aptitudeDirt: 'G',
    aptitudeShort: 'E',
    aptitudeMile: 'A',
    aptitudeMiddle: 'A',
    aptitudeLong: 'F',
    aptitudeRunner: 'C',
    aptitudeLeader: 'B',
    aptitudeBetweener: 'A',
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

let _talentUpgradeCache = null;
let _talentUpgradeTs = 0;
const TALENT_UPGRADE_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

async function fetchTalentUpgrades() {
  if (_talentUpgradeCache && Date.now() - _talentUpgradeTs < TALENT_UPGRADE_CACHE_TTL) {
    return _talentUpgradeCache;
  }
  try {
    const manifestRes = await fetch('https://gametora.com/data/manifests/umamusume.json', { cache: 'no-cache' });
    if (!manifestRes.ok) throw new Error('Failed to fetch GT manifest');
    const manifest = await manifestRes.json();
    const hash = manifest['db-files/card_talent_upgrade'];
    if (!hash) throw new Error('No card_talent_upgrade hash in manifest');
    const res = await fetch(`https://gametora.com/data/umamusume/db-files/card_talent_upgrade.${hash}.json`, { cache: 'no-cache' });
    if (!res.ok) throw new Error('Failed to fetch card_talent_upgrade');
    const upgrades = await res.json();
    _talentUpgradeCache = upgrades;
    _talentUpgradeTs = Date.now();
    return upgrades;
  } catch (e) {
    console.error('[fetchTalentUpgrades]', e.message);
    return _talentUpgradeCache || [];
  }
}

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

  // Stat effect labels
  const statLabelMap = {
    sp: 'Speed', st: 'Stamina', po: 'Power', gu: 'Guts', in: 'Wisdom',
    en: 'Energy', mo: 'Mood', pt: 'Skill points', sk: 'Skill', '5s': 'All Stats',
    se: 'Status', no: 'Nothing', di: 'Random',
  };

  const statusMap = {
    4: {
      name: 'Slow Metabolism',
      description: 'Ate too much and put on some weight. Speed cannot be raised through training.',
    },
    10: {
      name: 'Hot Topic',
      description: 'Events with the reporter are more likely to occur.',
    },
  };

  const formatEffect = (r, skillMap) => {
    if (!Array.isArray(r)) return [];
    const result = [];
    for (const e of r) {
      if (e.t === 'di') {
        const label = e.d ? e.d.replace('~', '') + '%' : null;
        result.push({ type: 'divider', label });
        continue;
      }
      if (e.t === 'se') {
        const status = statusMap[e.d] || { name: `Status #${e.d}`, description: '' };
        result.push({
          type: 'status',
          text: `Get ${status.name} status`,
          statusId: e.d,
          statusName: status.name,
          statusDesc: status.description,
          random: Boolean(e.r),
          value: e.v,
        });
        continue;
      }
      const label = statLabelMap[e.t] || e.t;
      let val = '';
      if (e.v != null && e.v !== '') {
        const n = Number(e.v);
        if (!isNaN(n)) val = n > 0 ? `+${n}` : `${n}`;
        else val = `${e.v}`;
      }
      let skillRef = '';
      if (e.d && (e.t === 'sk')) {
        const skillId = Number(e.d);
        const skillDef = skillMap?.[skillId];
        const skillName = skillDef?.skillName || `Skill #${e.d}`;
        result.push({
          type: 'skillHint',
          text: `${skillName} hint ${val}`,
          skillId,
          skillName,
          value: e.v,
        });
        continue;
      } else if (e.d) {
        skillRef = ` #${e.d}`;
      }
      const separator = val ? ' ' : '';
      result.push({ type: 'stat', text: `${label}${separator}${val}${skillRef}`, value: e.v });
    }
    return result;
  };
  // Parse event data from both English (for names) and Japanese (for choice text)
  const parseEvents = (raw) => {
    if (!raw) return null;
    if (typeof raw === 'string') {
      try { return JSON.parse(raw); } catch { return null; }
    }
    return raw;
  };
  const eventsEn = parseEvents(pp.eventData?.en);
  const eventsJa = parseEvents(pp.eventData?.ja);
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

  // Merge GT + local into a combined map for event skill name lookup
  const mergedSkillMap = {};
  allSkillIds.forEach(id => {
    const gt = gtSkillsMap[id];
    const local = localSkillMap[id];
    if (gt || local) {
      mergedSkillMap[id] = { ...local, ...gt, ...(gt?.skillName ? { skillName: gt.skillName } : {}) };
    }
  });

  // Build events with skill name resolution
  const buildChoices = (rawChoices) => {
    if (!Array.isArray(rawChoices)) return [];
    return rawChoices.map(ch => ({
      text: '',
      effects: formatEffect(ch.r, mergedSkillMap),
    }));
  };
  const buildEvents = (rawArr) => {
    if (!Array.isArray(rawArr)) return [];
    return rawArr.map(evt => ({
      name: evt.n || '',
      id: evt.i || null,
      choices: buildChoices(evt.c),
      hasChoice: evt.c ? evt.c.length > 1 : false,
    }));
  };
  const events = {
    wchoice: buildEvents(eventsEn?.wchoice),
    nochoice: buildEvents(eventsEn?.nochoice),
    version: buildEvents(eventsEn?.version),
    outings: buildEvents(eventsEn?.outings),
  };

  // Build final skillDefinitions
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

  // Flatten events with GameTora-matching category names
  const addGroup = (arr, group) => (Array.isArray(arr) ? arr : []).map(e => ({ ...e, group }));
  const flatEvents = [
    ...addGroup(events.wchoice, 'Events With Choices'),
    ...addGroup(events.nochoice, 'Events Without Choices'),
    ...addGroup(events.version, 'Costume Events'),
    ...addGroup(events.outings, 'Date Events'),
  ];

  const talentUpgrades = await fetchTalentUpgrades();
  const talentGroupId = item.talent_group;
  const rawCosts = talentUpgrades.filter(x => x.talent_group_id === talentGroupId);
  const awakeningCosts = {};
  rawCosts.forEach(m => {
    const items = [];
    for (let i = 1; i <= 8; i++) {
      const id = m[`item_id_${i}`];
      const num = m[`item_num_${i}`];
      if (id && num) {
        items.push({ id, num });
      }
    }
    awakeningCosts[m.talent_level] = items;
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
    events: flatEvents,
    profile,
    awakeningCosts,
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
