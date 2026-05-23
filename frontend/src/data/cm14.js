const CM14_DATA = {
  id: "cm14",
  title: "Champions Meeting 14: Gemini Cup 2",
  description: "Tokyo - Turf, 1600m, Mile, Firm, Spring, Sunny, Left-Handed",
  track: {
    distance: "1600m",
    ground: "Turf",
    surface: "Left-Handed",
    strategy: "Mile",
    icon: "https://media.gametora.com/umamusume/races/banners/en/1011.png",
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
    front: {
      sections: [
        {
          title: "Core + Accels",
          items: [
            { skillId: 201601, reason: "Groundwork" },
            { skillId: 200251, reason: "2-3 Greens" },
            { skillId: 200532, reason: "Early Lead" },
            { skillId: 900201, reason: "Angling & Scheming" },
            { skillId: 200552, reason: "Final Push" },
            { skillId: 900141, reason: "Victoria por Plancha" },
          ],
        },
        {
          title: "Good Movement Skills",
          items: [
            { skillId: 201262, reason: "Dodging Danger" },
            { skillId: 200452, reason: "Prudent Positioning" },
            { skillId: 210052, reason: "Ignited Spirit WIT" },
          ],
        },
        {
          title: "Good to Fight for 1st",
          items: [
            { skillId: 201252, reason: "Front Runner Corners" },
            { skillId: 201042, reason: "Mile Corners" },
            { skillId: 200332, reason: "Corner Adept" },
            { skillId: 201651, reason: "Slipstream" },
            { skillId: 200462, reason: "Ramp Up" },
            { skillId: 201272, reason: "Leader's Pride" },
            { skillId: 201072, reason: "Unyielding Spirit" },
            { skillId: 201082, reason: "Speed Eater" },
          ],
        },
        {
          title: "Good Speed Skills",
          items: [
            { skillId: 201661, reason: "Playtime's Over!" },
            { skillId: 200542, reason: "Fast-Paced" },
            { skillId: 201611, reason: "Tail Held High" },
          ],
        },
        {
          title: "Good but has RNG or expensive",
          items: [
            { skillId: 200362, reason: "Straightaway Adept" },
            { skillId: 201032, reason: "Mile Straightaways" },
            { skillId: 201242, reason: "Front Runner Straightaways" },
            { skillId: 210012, reason: "Ignited Spirit SPD" },
            { skillId: 900311, reason: "All Charged! It's Go Time!" },
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
            { skillId: 900511, reason: "Budding Blossom" },
            { skillId: 201902, reason: "Head On" },
            { skillId: 210032, reason: "Ignited Spirit PWR" },
            { skillId: 200492, reason: "Nimble Navigator" },
          ],
        },
        {
          title: "Good Speeds Skills",
          items: [
            { skillId: 201661, reason: "Playtime's Over!" },
            { skillId: 201611, reason: "Tail Held High" },
            { skillId: 201322, reason: "Pace Chaser Corners" },
            { skillId: 201042, reason: "Mile Corners" },
            { skillId: 200332, reason: "Corner Adept" },
            { skillId: 201651, reason: "Slipstream" },
            { skillId: 200462, reason: "Ramp Up" },
            { skillId: 202112, reason: "Pumped" },
            { skillId: 201072, reason: "Unyielding Spirit" },
            { skillId: 200581, reason: "Speed Star" },
          ],
        },
        {
          title: "Good but has RNG or expensive",
          items: [
            { skillId: 200362, reason: "Straightaway Adept" },
            { skillId: 201032, reason: "Mile Straightaways" },
            { skillId: 201312, reason: "Pace Chaser Straightaways" },
            { skillId: 210012, reason: "Ignited Spirit SPD" },
            { skillId: 900061, reason: "Triumphant Pulse" },
            { skillId: 900051, reason: "Lights of Vaudeville" },
            { skillId: 900161, reason: "Shadow Break" },
          ],
        },
      ],
    },
    late: {
      sections: [
        {
          title: "Core + Accels",
          items: [
            { skillId: 900271, reason: "Let's Pump Some Iron!" },
            { skillId: 910611, reason: "Louder! Tracen Cheer!" },
            { skillId: 200602, reason: "Slick Surge" },
            { skillId: 200702, reason: "Updrafters" },
            { skillId: 200492, reason: "Nimble Navigator" },
            { skillId: 210032, reason: "Ignited Spirit PWR" },
          ],
        },
        {
          title: "Good Speeds Skills",
          items: [
            { skillId: 201661, reason: "Playtime's Over!" },
            { skillId: 201611, reason: "Tail Held High" },
            { skillId: 201392, reason: "Late Surger Corners" },
            { skillId: 201042, reason: "Mile Corners" },
            { skillId: 200332, reason: "Corner Adept" },
            { skillId: 201651, reason: "Slipstream" },
            { skillId: 200462, reason: "Ramp Up" },
            { skillId: 202112, reason: "Pumped" },
            { skillId: 201072, reason: "Unyielding Spirit" },
          ],
        },
        {
          title: "Good but has RNG or expensive",
          items: [
            { skillId: 200362, reason: "Straightaway Adept" },
            { skillId: 201032, reason: "Mile Straightaways" },
            { skillId: 201382, reason: "Late Surger Straightaways" },
            { skillId: 201412, reason: "1,500,000 CC" },
            { skillId: 200592, reason: "Position Pilfer" },
            { skillId: 200612, reason: "Outer Swell" },
            { skillId: 210012, reason: "Ignited Spirit SPD" },
            { skillId: 900061, reason: "Triumphant Pulse" },
            { skillId: 900161, reason: "Shadow Break" },
          ],
        },
      ],
    },
    end: {
      sections: [
        {
          title: "Core + Accels",
          items: [
            { skillId: 900271, reason: "Let's Pump Some Iron!" },
            { skillId: 202021, reason: "Daring Strike" },
            { skillId: 910611, reason: "Louder! Tracen Cheer!" },
            { skillId: 200492, reason: "Nimble Navigator" },
            { skillId: 210032, reason: "Ignited Spirit PWR" },
            { skillId: 200702, reason: "Updrafters" },
            { skillId: 200642, reason: "Straightaway Spurt" },
          ],
        },
        {
          title: "Good Speeds Skills",
          items: [
            { skillId: 201661, reason: "Playtime's Over!" },
            { skillId: 201611, reason: "Tail Held High" },
            { skillId: 201462, reason: "End Closer Corners" },
            { skillId: 201042, reason: "Mile Corners" },
            { skillId: 200332, reason: "Corner Adept" },
            { skillId: 201651, reason: "Slipstream" },
            { skillId: 200462, reason: "Ramp Up" },
            { skillId: 202112, reason: "Pumped" },
            { skillId: 201072, reason: "Unyielding Spirit" },
          ],
        },
        {
          title: "Good but has RNG or expensive",
          items: [
            { skillId: 200362, reason: "Straightaway Adept" },
            { skillId: 201032, reason: "Mile Straightaways" },
            { skillId: 201452, reason: "End Closer Straightaways" },
            { skillId: 202022, reason: "Early Start" },
            { skillId: 210012, reason: "Ignited Spirit SPD" },
            { skillId: 900061, reason: "Triumphant Pulse" },
            { skillId: 900161, reason: "Shadow Break" },
          ],
        },
      ],
    },
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
};

export default CM14_DATA;
