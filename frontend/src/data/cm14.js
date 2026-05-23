const CM14_DATA = {
  id: "cm14",
  title: "Champions Meeting 14",
  description:
    "The 14th Champions Meeting features a medium-distance turf race at Tokyo Racecourse. Build your team around strong late-closers and stamina-efficient strategies.",
  track: {
    distance: "1600m",
    ground: "Turf",
    surface: "Left-Handed",
    strategy: "Standard Distance",
    icon: "🏟️",
  },

  tiers: [
    {
      label: "S",
      color: "#f59e0b",
      description: "Top-tier meta choices",
      characters: [
        { name: "Seiun Sky", variant: "" },
        { name: "Taiki Shuttle", variant: "" },
        { name: "Nishino Flower", variant: "" },
        { name: "Mejiro Ryan", variant: "", strategy: "late" },
        { name: "Narita Taishin", variant: "" },
        {
          name: "King Halo",
          variant: "Cheer Leader",
          strategy: ["end", "late"],
        },
      ],
    },
    {
      label: "A",
      color: "#a855f7",
      description: "Strong and versatile",
      characters: [
        { name: "Mihono Bourbon", variant: "Valentine" },
        { name: "Maruzensky", variant: "Summer" },
        { name: "Daiwa Scarlet", variant: "" },
        { name: "El Condor Pasa", variant: "" },
        {
          name: "El Condor Pasa",
          variant: "",
          strategy: "front",
          role: "Hard Training",
        },
        { name: "Fine Motion", variant: "Wedding" },
        { name: "Sakura Chiyono O", variant: "" },
        { name: "Air Groove", variant: "Wedding", strategy: "late" },
        { name: "Gold Ship", variant: "" },
        { name: "Agnes Digital", variant: "", strategy: "end" },
        { name: "Fuji Kiseki", variant: "", strategy: ["front", "late"] },
        { name: "Fuji Kiseki", variant: "Ballroom", strategy: "late" },
        { name: "Special Week", variant: "", strategy: ["end", "late"] },
        { name: "Oguri Cap", variant: "", strategy: ["end", "late"] },
      ],
    },
    {
      label: "B",
      color: "#3b82f6",
      description: "Viable with good RNG",
      characters: [
        { name: "Ines Fujin", variant: "" },
        { name: "Fine Motion", variant: "" },
        {
          name: "TM Opera O",
          variant: "",
          strategy: "pace",
          role: "Hard Training",
        },
        {
          name: "Narita Brian",
          variant: "",
          strategy: ["pace", "late", "end"],
        },
        { name: "Gold City", variant: "", strategy: "late" },
        { name: "Gold City", variant: "Festival", strategy: "late" },
        { name: "Vodka", variant: "" },
        { name: "Tosen Jordan", variant: "", strategy: "late" },
        { name: "Air Groove", variant: "", strategy: "late" },
        {
          name: "El Condor Pasa",
          variant: "Fantasy",
          strategy: ["end", "late"],
        },
      ],
    },
  ],

  skills: {
    essential: [
      {
        skillId: 200251,
        reason: "Inner Post — boost when drawn to inner post",
      },
      {
        skillId: 200261,
        reason: "Outer Post — boost when drawn to outer post",
      },
      { skillId: 200031, reason: "Tokyo Racecourse — stat boost at Tokyo" },
      { skillId: 200151, reason: "Firm Conditions — boost on firm track" },
      { skillId: 200211, reason: "Sunny Days — boost in sunny weather" },
    ],
    recommended: [
      { skillId: 200171, reason: "Spring Runner — boost during spring season" },
      {
        skillId: 200301,
        reason: "Long Shot — boost when odds are against you",
      },
      { skillId: 200271, reason: "Maverick — boost when alone" },
      { skillId: 200281, reason: "Competitive Spirit — boost in close races" },
      {
        skillId: 200291,
        reason: "Target in Sight — boost when chasing leader",
      },
      { skillId: 201561, reason: "Lucky Seven — random boost when lucky" },
    ],
    situational: [
      { skillId: 201631, reason: "Sympathy — boost when crowd-favorite" },
      { skillId: 201641, reason: "Lone Wolf — boost without a team" },
    ],
  },

  stats: {
    speed: {
      min: 1200,
      target: 1200,
      label: "Speed",
      color: "#2e6bb1",
      icon: "https://uma.guide/icon/type/speed.svg",
    },
    stamina: {
      min: 600,
      target: 600,
      label: "Stamina",
      color: "#bc523c",
      icon: "https://uma.guide/icon/type/stamina.svg",
    },
    power: {
      min: 1100,
      target: 1200,
      label: "Power",
      color: "#c78326",
      icon: "https://uma.guide/icon/type/power.svg",
    },
    guts: {
      min: 600,
      target: 1200,
      label: "Guts",
      color: "#c1507d",
      icon: "https://uma.guide/icon/type/guts.svg",
    },
    wisdom: {
      min: 1100,
      target: 1200,
      label: "Wisdom",
      color: "#318b57",
      icon: "https://uma.guide/icon/type/wit.svg",
    },
  },

  tips: [
    "Prioritize stamina to at least 900 to survive the 2000m distance in high-tempo rooms.",
    'A "late focus" strategy works best — aim for acceleration skills that trigger in the final 200m.',
    "Avoid overcrowding your team with too many debuff skills; one dedicated debuffer is enough.",
    "Wisdom above 1200 significantly improves skill activation RNG.",
  ],
};

export default CM14_DATA;
