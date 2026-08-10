const mongoose = require('mongoose');
require('dotenv').config();

const Character = require('./models/Character');
const SupportCard = require('./models/SupportCard');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/umapyoi';

const characters = [
  {
    name_en: 'Air Shakur',
    alt_name: '',
    stars: 3,
    image_url: 'https://gametora.com/images/umamusume/characters/chara_stand_1036_103601.png',
    release_date: new Date('2026-06-18T15:00:00.000Z'),
    color_main: '#d9463e',
  },
  {
    name_en: 'Sweep Tosho',
    alt_name: '',
    stars: 3,
    image_url: 'https://gametora.com/images/umamusume/characters/chara_stand_1044_104401.png',
    release_date: new Date('2026-06-04T15:00:00.000Z'),
    color_main: '#d9463e',
  },
  {
    name_en: 'Taiki Shuttle',
    alt_name: 'Camping',
    stars: 3,
    image_url: 'https://gametora.com/images/umamusume/characters/chara_stand_1010_101002.png',
    release_date: new Date('2026-06-11T15:00:00.000Z'),
    color_main: '#d9463e',
  },
  {
    name_en: 'Mejiro Dober',
    alt_name: 'Camping',
    stars: 3,
    image_url: 'https://gametora.com/images/umamusume/characters/chara_stand_1059_105902.png',
    release_date: new Date('2026-06-11T15:00:00.000Z'),
    color_main: '#d9463e',
  },
];

const TYPE_MAP = {
  speed: 'Speed',
  stamina: 'Stamina',
  power: 'Power',
  guts: 'Guts',
  intelligence: 'Wit',
};

const supportCards = [
  {
    name: 'Air Groove',
    title: '[Tailwind to My Goals]',
    supportCardId: 30106,
    rarity: 'SSR',
    type: 'Power',
    image_url: 'https://uma.guide/img/card/composite/tex_support_card_30106.webp',
    release_date: new Date('2026-06-18T15:00:00.000Z'),
  },
  {
    name: 'El Condor Pasa',
    title: '[Twinkle in Your Eyes ∞]',
    supportCardId: 30102,
    rarity: 'SSR',
    type: 'Guts',
    image_url: 'https://uma.guide/img/card/composite/tex_support_card_30102.webp',
    release_date: new Date('2026-06-11T15:00:00.000Z'),
  },
  {
    name: 'Matikanetannhauser',
    title: '[Machitan☆Adventure]',
    supportCardId: 30103,
    rarity: 'SSR',
    type: 'Wit',
    image_url: 'https://uma.guide/img/card/composite/tex_support_card_30103.webp',
    release_date: new Date('2026-06-11T15:00:00.000Z'),
  },
  {
    name: 'Zenno Rob Roy',
    title: '["Rhodonite and the Dreamstone"]',
    supportCardId: 30104,
    rarity: 'SSR',
    type: 'Stamina',
    image_url: 'https://uma.guide/img/card/composite/tex_support_card_30104.webp',
    release_date: new Date('2026-06-11T15:00:00.000Z'),
  },
  {
    name: 'Taiki Shuttle',
    title: '[Hands Up, Crook!]',
    supportCardId: 30053,
    rarity: 'SSR',
    type: 'Speed',
    image_url: 'https://uma.guide/img/card/composite/tex_support_card_30053.webp',
    release_date: new Date('2026-06-04T15:00:00.000Z'),
  },
];

async function upsert(Model, query, data, label) {
  const existing = await Model.findOne(query);
  if (existing) {
    await Model.updateOne({ _id: existing._id }, { $set: data });
    console.log(`  ↻ Updated ${label}`);
    return 'updated';
  }
  await Model.create(data);
  console.log(`  ✓ Added ${label}`);
  return 'added';
}

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB\n');

  console.log('Characters:');
  for (const c of characters) {
    const label = c.alt_name ? `${c.name_en} (${c.alt_name})` : c.name_en;
    await upsert(Character, { image_url: c.image_url }, c, label);
  }

  console.log('\nSupport Cards:');
  for (const card of supportCards) {
    await upsert(SupportCard, { supportCardId: card.supportCardId }, card, `${card.name} ${card.title}`);
  }

  await mongoose.disconnect();
  console.log('\nDone!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
