const CM15_DATA = {
  id: "cm15",
  title: "Champions Meeting 15: Cancer Cup 2",
  description: "Hanshin - Turf, 2200m, Good, Summer, Cloudy, Right-Handed",
  track: {
    distance: "2200m",
    ground: "Turf",
    surface: "Right-Handed",
    strategy: "Medium",
    icon: "https://media.gametora.com/umamusume/races/banners/en/1012.png",
  },

  tiers: [
    {
      label: "S",
      color: "#f59e0b",
      description: "Top-tier meta choices",
      characters: [
        { name: "Oguri Cap", variant: "Christmas", strategy: ["pace", "late", "end"] },
        {
          name: "Nice Nature",
          variant: "",
          strategy: ["late", "end"],
          role: "Spd Debuffer",
          glow: "red",
        },
      ],
    },
    {
      label: "A",
      color: "#a855f7",
      description: "Strong and versatile",
      characters: [
        {
          name: "Silence Suzuka",
          variant: "",
          strategy: "runnaway",
          role: "Sacrificial Horse",
          glow: "green",
        },
        { name: "Seiun Sky", variant: "", strategy: "front" },
        { name: "Mihono Bourbon", variant: "Valentine", strategy: "front" },
        { name: "Maruzensky", variant: "Summer", strategy: "front" },
        { name: "Daiwa Scarlet", variant: "", strategy: "front" },
        { name: "Fine Motion", variant: "", strategy: "late" },
        { name: "Mejiro Ryan", variant: "", strategy: "late" },
        { name: "Mejiro Dober", variant: "", strategy: "late" },
        { name: "TM Opera O", variant: "New Year", strategy: "late", role: "Hard Training" },
        { name: "Satono Diamond", variant: "", strategy: "late" },
        { name: "Gold Ship", variant: "", strategy: ["late", "end"] },
        { name: "Tamamo Cross", variant: "", strategy: ["late", "end"], role: "Hard Training" },
        {
          name: "Nice Nature",
          variant: "",
          strategy: ["late", "end"],
          role: "Stam Debuffer",
          glow: "red",
        },
      ],
    },
    {
      label: "B",
      color: "#3b82f6",
      description: "Viable with good RNG",
      characters: [
        { name: "Agnes Digital", variant: "", strategy: ["late", "end"] },
        { name: "Special Week", variant: "", strategy: ["late", "end"] },
        { name: "Fuji Kiseki", variant: "", strategy: ["front", "late"] },
        { name: "Nice Nature", variant: "Cheer Leader", strategy: "late" },
        { name: "Mayano Top Gun", variant: "", strategy: ["front", "late", "end"] },
        { name: "Oguri Cap", variant: "", strategy: ["late", "end"] },
        { name: "Kawakami Princess", variant: "", strategy: ["late", "end"] },
        { name: "Narita Brian", variant: "", strategy: ["late", "end"] },
      ],
    },
  ],

  skills: {
    front: {
      sections: [
        {
          title: "Core + Accels",
          items: [
            { skillId: 201601, reason: "Groundwork" },
            { skillId: 200251, reason: "2-3 Greens" },
            { skillId: 200532, reason: "Early Lead" },
            { skillId: 900201, reason: "Angling & Scheming" },
          ],
        },
        {
          title: "Good Movement Skills (get Danger + another)",
          items: [
            { skillId: 201262, reason: "Dodging Danger" },
            { skillId: 200452, reason: "Prudent Positioning" },
            { skillId: 210052, reason: "Ignited Spirit WIT" },
          ],
        },
        {
          title: "Good to Fight for 1st",
          items: [
            { skillId: 201252, reason: "Front Runner Corners ○" },
            { skillId: 201112, reason: "Medium Corners ○" },
            { skillId: 200332, reason: "Corner Adept" },
            { skillId: 201651, reason: "Slipstream" },
            { skillId: 200462, reason: "Ramp Up" },
            { skillId: 201272, reason: "Leader's Pride" },
          ],
        },
        {
          title: "Good Speed Skills",
          items: [
            { skillId: 201661, reason: "Playtime's Over!" },
            { skillId: 200542, reason: "Fast-Paced" },
            { skillId: 201611, reason: "Tail Held High" },
            { skillId: 200722, reason: "Up-Tempo" },
          ],
        },
        {
          title: "Good but has RNG or expensive",
          items: [
            { skillId: 200362, reason: "Straightaway Adept" },
            { skillId: 201102, reason: "Medium Straightaways ○" },
            { skillId: 201242, reason: "Front Runner Straights ○" },
            { skillId: 210012, reason: "Ignited Spirit SPD" },
            { skillId: 910151, reason: "Barcarole of Blessings" },
            { skillId: 900051, reason: "Lights of Vaudeville" },
            { skillId: 910261, reason: "Operation Cacao" },
          ],
        },
      ],
    },
    pace: {
      sections: [
        {
          title: "Core + Accels",
          items: [
            { skillId: 201902, reason: "Head On" },
            { skillId: 200492, reason: "Nimble Navigator" },
            { skillId: 201591, reason: "Uma Stan" },
            { skillId: 210032, reason: "Ignited Spirit PWR" },
          ],
        },
        {
          title: "Good Speeds Skills",
          items: [
            { skillId: 201661, reason: "Playtime's Over!" },
            { skillId: 201611, reason: "Tail Held High" },
            { skillId: 201322, reason: "Pace Chaser Corners ○" },
            { skillId: 201112, reason: "Medium Corners ○" },
            { skillId: 200332, reason: "Corner Adept" },
            { skillId: 201651, reason: "Slipstream" },
            { skillId: 200462, reason: "Ramp Up" },
            { skillId: 200722, reason: "Up-Tempo" },
            { skillId: 202092, reason: "Fighting Spirit" },
          ],
        },
        {
          title: "Good but has RNG or expensive",
          items: [
            { skillId: 200362, reason: "Straightaway Adept" },
            { skillId: 201102, reason: "Medium Straightaways ○" },
            { skillId: 201312, reason: "Pace Chaser Straightaways ○" },
            { skillId: 210012, reason: "Ignited Spirit SPD" },
            { skillId: 200582, reason: "Prepared to Pass" },
            { skillId: 900051, reason: "Lights of Vaudeville" },
            { skillId: 910151, reason: "Barcarole of Blessings" },
            { skillId: 900061, reason: "Triumphant Pulse" },
            { skillId: 900671, reason: "Eternal Encompassing Shine" },
          ],
        },
      ],
    },
    late: {
      sections: [
        {
          title: "Core + Accels",
          items: [
            { skillId: 200602, reason: "Slick Surge" },
            { skillId: 200492, reason: "Nimble Navigator" },
            { skillId: 202082, reason: "Take the Chance" },
            { skillId: 210032, reason: "Ignited Spirit PWR" },
            { skillId: 201591, reason: "Uma Stan" },
            { skillId: 900271, reason: "Let's Pump Some Iron!" },
            { skillId: 900591, reason: "Moving Past, and Beyond" },
          ],
        },
        {
          title: "Good Speeds Skills",
          items: [
            { skillId: 201661, reason: "Playtime's Over!" },
            { skillId: 201611, reason: "Tail Held High" },
            { skillId: 201392, reason: "Late Surger Corners ○" },
            { skillId: 201112, reason: "Medium Corners ○" },
            { skillId: 200332, reason: "Corner Adept" },
            { skillId: 201651, reason: "Slipstream" },
            { skillId: 200462, reason: "Ramp Up" },
            { skillId: 202092, reason: "Fighting Spirit" },
            { skillId: 202102, reason: "Eager" },
          ],
        },
        {
          title: "Good but has RNG or expensive",
          items: [
            { skillId: 200362, reason: "Straightaway Adept" },
            { skillId: 201102, reason: "Medium Straightaways ○" },
            { skillId: 201382, reason: "Late Surger Straightaways ○" },
            { skillId: 201412, reason: "1,500,000 CC" },
            { skillId: 200592, reason: "Position Pilfer" },
            { skillId: 200612, reason: "Outer Swell" },
            { skillId: 210012, reason: "Ignited Spirit SPD" },
            { skillId: 900061, reason: "Triumphant Pulse" },
            { skillId: 910151, reason: "Barcarole of Blessings" },
          ],
        },
      ],
    },
    end: {
      sections: [
        {
          title: "Core + Accels",
          items: [
            { skillId: 210032, reason: "Ignited Spirit PWR" },
            { skillId: 200492, reason: "Nimble Navigator" },
            { skillId: 202082, reason: "Take the Chance" },
            { skillId: 201591, reason: "Uma Stan" },
            { skillId: 202021, reason: "Daring Strike", gold: true },
            { skillId: 900271, reason: "Let's Pump Some Iron!" },
            { skillId: 900591, reason: "Moving Past, and Beyond" },
          ],
        },
        {
          title: "Good Speeds Skills",
          items: [
            { skillId: 201661, reason: "Playtime's Over!" },
            { skillId: 201611, reason: "Tail Held High" },
            { skillId: 201462, reason: "End Closer Corners ○" },
            { skillId: 201112, reason: "Medium Corners ○" },
            { skillId: 200332, reason: "Corner Adept" },
            { skillId: 201651, reason: "Slipstream" },
            { skillId: 200462, reason: "Ramp Up" },
            { skillId: 202092, reason: "Fighting Spirit" },
            { skillId: 202102, reason: "Eager" },
          ],
        },
        {
          title: "Good but has RNG or expensive",
          items: [
            { skillId: 200362, reason: "Straightaway Adept" },
            { skillId: 201102, reason: "Medium Straightaways ○" },
            { skillId: 201452, reason: "End Closer Straightaways ○" },
            { skillId: 202022, reason: "Early Start" },
            { skillId: 210012, reason: "Ignited Spirit SPD" },
            { skillId: 900061, reason: "Triumphant Pulse" },
            { skillId: 910151, reason: "Barcarole of Blessings" },
          ],
        },
      ],
    },
  },

  greenSkills: [
    { skillId: 200011, name: "Right-Handed ○" },
    { skillId: 200181, name: "Summer Runner ○" },
    { skillId: 200161, name: "Wet Conditions ○" },
    { skillId: 200141, name: "Non-Standard Distance ○" },
    { skillId: 200051, name: "Hanshin Racecourse ○" },
    { skillId: 200221, name: "Cloudy Days ○" },
  ],

  oguriOnly: {
    title: "Xmas Oguri",
    character: { name: "Oguri Cap", variant: "Xmas" },
    stats: [
      {
        key: "pace",
        icon: "/icons/strategy/pace.png",
        values: ["1200", "600-650", "1100+", "400+", "1100+"],
      },
      {
        key: "late",
        icon: "/icons/strategy/late.png",
        values: ["1200", "550-600", "1100+", "400+", "1100+"],
      },
    ],
    sections: [
      {
        title: "Core + Accels (Pace)",
        items: [
          { skillId: 201571, reason: "Triple 7s + 2 recoveries" },
          { skillId: 201902, reason: "Head On" },
          { skillId: 200492, reason: "Nimble Navigator" },
          { skillId: 210032, reason: "Ignited Spirit PWR" },
          { skillId: 201591, reason: "Uma Stan" },
        ],
      },
      {
        title: "Core + Accels (Late)",
        items: [
          { skillId: 201571, reason: "Triple 7s + 2 recoveries" },
          { skillId: 200602, reason: "Slick Surge" },
          { skillId: 210032, reason: "Ignited Spirit PWR" },
          { skillId: 200492, reason: "Nimble Navigator" },
          { skillId: 201591, reason: "Uma Stan" },
          { skillId: 900271, reason: "Let's Pump Some Iron!" },
          { skillId: 900591, reason: "Moving Past, and Beyond" },
        ],
      },
      {
        title: "Good Recovery Skills (Non-Activators)",
        items: [
          { skillId: 200352, reason: "Corner Recovery" },
          { skillId: 201352, reason: "Hydrate" },
          { skillId: 200572, reason: "Preferred Position" },
          { skillId: 200562, reason: "Stamina to Spare" },
          { skillId: 201142, reason: "Soft Step" },
          { skillId: 210022, reason: "Ignited Spirit STA" },
          { skillId: 900451, reason: "Pure Heart" },
        ],
      },
      {
        title: "Good Recovery Skills (Activators)",
        items: [{ skillId: 201571, reason: "Triple 7s" }],
      },
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
      min: "750-800",
      target: "750-800",
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
};

export default CM15_DATA;
