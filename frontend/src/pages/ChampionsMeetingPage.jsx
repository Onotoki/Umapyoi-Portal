import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CHAMPIONS_MEETINGS from "../data/championsMeetings";

const getCharacterImage = (name, characters, preferVariant = false) => {
  const matches = characters.filter(
    (c) =>
      c.name_en?.toLowerCase() === name.toLowerCase() ||
      c.alt_name?.toLowerCase() === name.toLowerCase(),
  );
  if (matches.length === 0) return null;
  if (matches.length === 1) return matches[0];
  const base = matches.find((c) => c.image_url?.endsWith("01.png"));
  const variant = matches.find((c) => c.image_url?.endsWith("02.png"));
  if (preferVariant && variant) return variant;
  if (base) return base;
  return matches[0];
};

const strategyPriority = [
  {
    field: "aptitudeRunner",
    label: "front",
    short: "F",
    color: "#2F80ED",
    svg: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 19c2-2 4-3 7-3s5 1 7 3" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><path d="M12 12c-2 0-3.5-1.5-3.5-3.5S10 5 12 5s3.5 1.5 3.5 3.5S14 12 12 12z" fill="#fff"/></svg>',
  },
  {
    field: "aptitudeLeader",
    label: "pace",
    short: "P",
    color: "#4CAF50",
    svg: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 19c2-2 4-3 7-3s5 1 7 3" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><path d="M13 11c-2 0-3.5-1.5-3.5-3.5S11 4 13 4s3.5 1.5 3.5 3.5S15 11 13 11z" fill="#fff"/></svg>',
  },
  {
    field: "aptitudeBetweener",
    label: "late",
    short: "L",
    color: "#F6C043",
    svg: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 19c3-2 5-3 8-3s5 1 7 3" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><path d="M12 10c-1.5 0-2.5-1-2.5-2.5S10.5 5 12 5s2.5 1 2.5 2.5S13.5 10 12 10z" fill="#fff"/></svg>',
  },
  {
    field: "aptitudeChaser",
    label: "end",
    short: "E",
    color: "#EF6C00",
    svg: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 19c3-2 5-3 8-3s5 1 7 3" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><path d="M11 9c-1.5 0-2.5-1-2.5-2.5S9.5 4 11 4s2.5 1 2.5 2.5S12.5 9 11 9z" fill="#fff"/></svg>',
  },
  {
    field: null,
    label: "runnaway",
    short: "R",
    color: "#F6D86B",
    svg: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" fill="#e8f5e9"/></svg>',
  },
];

import "./ChampionsMeetingPage.css";

const badgeIconMap = {};

function getBestStrategyFromName(name, umaMap) {
  if (!umaMap || !name) return null;
  const entry = umaMap[name.toLowerCase()];
  if (!entry) return null;
  for (const s of strategyPriority) {
    if (entry[s.field] === "A") return s;
  }
  for (const s of strategyPriority) {
    if (entry[s.field] === "B") return { ...s, isB: true };
  }
  return null;
}

const TierSection = ({ tier, characters, umaMap }) => {
  const tierColors = {
    S: { bg: "#fefce8", border: "#eab308", text: "#ca8a04", gradient: "135deg, #facc15 0%, #eab308 100%" },
    A: { bg: "#fff7ed", border: "#f97316", text: "#ea580c", gradient: "135deg, #fb923c 0%, #ea580c 100%" },
    B: { bg: "#fdf2f8", border: "#ec4899", text: "#db2777", gradient: "135deg, #f472b6 0%, #ec4899 100%" },
  };
  const c = tierColors[tier.label] || tierColors.B;

  return (
    <div className="mb-5">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          marginBottom: 14,
        }}
      >
        <span
          style={{
            minWidth: 56,
            minHeight: 56,
            maxWidth: 56,
            maxHeight: 56,
            background: `linear-gradient(${c.gradient})`,
            border: `2px solid ${c.border}`,
            color: '#fff',
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 30,
            flexShrink: 0,
            textShadow: `0 1px 4px ${c.border}88`,
            boxShadow: `0 4px 20px -4px ${c.border}66, inset 0 1px 0 rgba(255,255,255,0.3)`,
          }}
        >
          {tier.label}
        </span>
        <div className="cm-avatar-row">
          {tier.characters.map((entry, idx) => {
            const name = typeof entry === "string" ? entry : entry.name;
            const variant =
              typeof entry === "string" ? "" : entry.variant || "";
            const charObj = getCharacterImage(name, characters, !!variant);
            let strategies = [];
            if (entry.strategy) {
              const labels = Array.isArray(entry.strategy)
                ? entry.strategy
                : [entry.strategy];
              strategies = labels
                .map((l) => strategyPriority.find((s) => s.label === l))
                .filter(Boolean);
            }
            if (strategies.length === 0) {
              const s = getBestStrategyFromName(name, umaMap);
              if (s) strategies = [s];
            }
            const roleIcon =
              entry.role && CM_TIER_LEGEND.find((r) => r.label === entry.role);
            return (
              <div className="cm-avatar-cell" key={`${name}-${variant}-${idx}`}>
                <div className="cm-avatar-imgbox">
                  <img
                    className="avatar-main"
                    src={
                      charObj?.image_url ||
                      "https://placehold.co/60x60/1a1a2e/666?text=?"
                    }
                    alt={name}
                    onError={(e) => {
                      e.target.src =
                        "https://placehold.co/60x60/1a1a2e/666?text=?";
                    }}
                  />
                  {strategies.map((strat, si) => (
                    <span
                      key={strat.label}
                      className="cm-avatar-strategy"
                      style={{
                        background: "transparent",
                        top: -6 + si * 28,
                        right: -6,
                        zIndex: 10 - si,
                      }}
                      title={strat.label}
                    >
                      <img
                        src={`/icons/strategy/${strat.label.toLowerCase()}.png`}
                        alt={strat.label}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `data:image/svg+xml,${encodeURIComponent(strat.svg)}`;
                        }}
                      />
                    </span>
                  ))}
                  {roleIcon && (
                    <img
                      src={roleIcon.icon}
                      alt={entry.role}
                      title={entry.role}
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: 26,
                        height: 26,
                        borderRadius: 4,
                        objectFit: "cover",
                      }}
                    />
                  )}
                  {charObj?.badge && (
                    <img
                      className="cm-avatar-badge"
                      src={badgeIconMap?.[charObj.badge] || ""}
                      alt={charObj.badge}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Legend row giống chú thích bên dưới bảng như ảnh
const CM_TIER_LEGEND = [
  {
    color: "#C8CFE5",
    icon: "https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_20064.png",
    label: "Hard Training",
  },
  {
    color: "#FFD98B",
    icon: "https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_30051.png",
    label: "Stam Debuffer",
  },
  {
    color: "#EDA3B5",
    icon: "https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_30011.png",
    label: "Spd Debuffer",
  },
  {
    color: "#CDE7C1",
    icon: "https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_10062.png",
    label: "Gambling",
  },
  {
    color: "#D6B1F3",
    icon: "https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_20044.png",
    label: "Sacrificial Horse",
  },
];

const SkillCard = ({ skillData, reason }) => {
  if (!skillData) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        background: "var(--theme-card)",
        border: "1px solid var(--theme-border)",
        borderRadius: 10,
      }}
    >
      <img
        src={`https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_${skillData.iconId}.png`}
        alt=""
        style={{
          width: 34,
          height: 34,
          borderRadius: 6,
          flexShrink: 0,
          background: "var(--theme-surface)",
          objectFit: "cover",
        }}
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: 13,
            color: "var(--theme-text-main)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {skillData.skillName}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "var(--theme-text-muted)",
            marginTop: 1,
          }}
        >
          {reason}
        </div>
      </div>
      {skillData.needSkillPoint > 0 && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: "#eab308",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {skillData.needSkillPoint} SP
        </span>
      )}
    </div>
  );
};

const ChampionsMeetingPage = () => {
  const { cmId } = useParams();
  const navigate = useNavigate();
  const [characters, setCharacters] = useState([]);
  const [skills, setSkills] = useState([]);
  const [umaMap, setUmaMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const selectedCM = cmId ? CHAMPIONS_MEETINGS.find(cm => cm.id === cmId) : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const [charRes, skillRes, umaRes] = await Promise.all([
          fetch(`${apiBase}/api/characters`),
          fetch(`${apiBase}/api/skills`),
          fetch(`${apiBase}/api/uma-characters`),
        ]);
        setCharacters(await charRes.json());
        setSkills(await skillRes.json());
        const umaData = await umaRes.json();
        const map = {};
        umaData.forEach((u) => {
          map[u.charaName.toLowerCase()] = {
            aptitudeRunner: u.aptitudeRunner,
            aptitudeLeader: u.aptitudeLeader,
            aptitudeBetweener: u.aptitudeBetweener,
            aptitudeChaser: u.aptitudeChaser,
          };
        });
        setUmaMap(map);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const skillMap = {};
  skills.forEach((s) => {
    skillMap[s.skillId] = s;
  });

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-40">
        <div className="w-10 h-10 border-4 border-border border-t-primary rounded-full animate-spin" />
        <p className="mt-6 text-text-muted font-bold tracking-widest uppercase text-[10px]">
          Loading...
        </p>
      </div>
    );
  }

  // List view — show all CM articles
  if (!selectedCM) {
    return (
      <div className="flex-1 max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-text-main font-inter">
            Champions Meeting
          </h1>
          <p className="text-text-muted mt-2 text-sm leading-relaxed">
            Browse meta guides for past and current Champions Meetings.
          </p>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {CHAMPIONS_MEETINGS.map((cm) => (
            <div
              key={cm.id}
              onClick={() => navigate(cm.id)}
              style={{
                background: "var(--theme-card)",
                border: "1px solid var(--theme-border)",
                borderRadius: 14,
                padding: "20px 24px",
                cursor: "pointer",
                transition: "box-shadow 0.2s, border-color 0.2s",
                display: "flex",
                alignItems: "center",
                gap: 20,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
                e.currentTarget.style.borderColor = "var(--theme-text-main)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "var(--theme-border)";
              }}
            >
              <span style={{ fontSize: 40 }}>{cm.track.icon || "🏟️"}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--theme-text-main)", marginBottom: 4 }}>
                  {cm.title}
                </h2>
                <p style={{ fontSize: 13, color: "var(--theme-text-muted)", lineHeight: 1.5, margin: 0 }}>
                  {cm.description}
                </p>
                <div style={{ display: "flex", gap: 12, marginTop: 8, fontSize: 12, color: "var(--theme-text-muted)" }}>
                  <span>{cm.track.distance}</span>
                  <span>•</span>
                  <span>{cm.track.ground}</span>
                  <span>•</span>
                  <span>{cm.track.surface}</span>
                </div>
              </div>
              <span style={{ fontSize: 20, color: "var(--theme-text-muted)" }}>→</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Detail view — full CM article
  const data = selectedCM;
  return (
    <div className="flex-1 max-w-5xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/champions-meeting')}
        style={{
          background: "none",
          border: "none",
          color: "var(--theme-text-muted)",
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 600,
          padding: "8px 0",
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        ← Back to CM list
      </button>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-text-main font-inter">
          {data.title}
        </h1>
        <p className="text-text-muted mt-2 text-sm leading-relaxed">
          {data.description}
        </p>
      </header>

      {/* Track Info Banner */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          padding: "16px 20px",
          background: "var(--theme-card)",
          border: "1px solid var(--theme-border)",
          borderRadius: 14,
          marginBottom: 32,
        }}
      >
        {[
          { label: "Distance", value: data.track.distance },
          { label: "Ground", value: data.track.ground },
          { label: "Surface", value: data.track.surface },
          { label: "Best Strategy", value: data.track.strategy },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              paddingRight: 16,
              borderRight: "1px solid var(--theme-border)",
            }}
          >
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
              {item.label}
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--theme-text-main)",
              }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Tierlist */}
      <section className="mb-10">
        <h2
          className="text-xl font-bold text-text-main mb-4 flex items-center gap-3"
          style={{
            letterSpacing: '-0.02em',
            textShadow: '0 1px 4px rgba(0,0,0,0.06)',
            borderLeft: '4px solid var(--theme-text-main)',
            paddingLeft: 14,
          }}
        >
          <span>Tierlist</span>
        </h2>
        {data.tiers.map((tier) => (
          <TierSection
            key={tier.label}
            tier={tier}
            characters={characters}
            umaMap={umaMap}
          />
        ))}
        {/* Legend dưới bảng */}
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 5 }}
        >
          {CM_TIER_LEGEND.map((lg, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "5px 12px",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              {lg.icon.startsWith("http") ? (
                <img
                  src={lg.icon}
                  alt=""
                  style={{
                    width: 20,
                    height: 20,
                    marginRight: 7,
                    borderRadius: 4,
                    objectFit: "cover",
                  }}
                />
              ) : (
                <span style={{ marginRight: 7 }}>{lg.icon}</span>
              )}
              <span>{lg.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Skills */}
      <section className="mb-10">
        <h2
          className="text-xl font-bold text-text-main mb-4 flex items-center gap-3"
          style={{
            letterSpacing: '-0.02em',
            textShadow: '0 1px 4px rgba(0,0,0,0.06)',
            borderLeft: '4px solid var(--theme-text-main)',
            paddingLeft: 14,
          }}
        >
          <span>Recommended Skills</span>
        </h2>

        <div className="space-y-5">
          {[
            {
              label: "Essential",
              icon: "⭐",
              color: "#f59e0b",
              items: data.skills.essential,
            },
            {
              label: "Recommended",
              icon: "👍",
              color: "#3b82f6",
              items: data.skills.recommended,
            },
            {
              label: "Situational",
              icon: "📌",
              color: "#64748b",
              items: data.skills.situational,
            },
          ].map((group) => (
            <div key={group.label}>
              <div className="flex items-center gap-2 mb-2">
                <span>{group.icon}</span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: group.color,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {group.label}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {group.items.map((item) => (
                  <SkillCard
                    key={item.skillId}
                    skillData={skillMap[item.skillId]}
                    reason={item.reason}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stat Targets */}
      <section className="mb-10">
        <h2
          className="text-xl font-bold text-text-main mb-4 flex items-center gap-3"
          style={{
            letterSpacing: '-0.02em',
            textShadow: '0 1px 4px rgba(0,0,0,0.06)',
            borderLeft: '4px solid var(--theme-text-main)',
            paddingLeft: 14,
          }}
        >
          <span>Stat Targets</span>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 8,
            background: "var(--theme-card)",
            border: "1px solid var(--theme-border)",
            borderRadius: 12,
            padding: "16px 12px",
          }}
        >
          {/* Row 1: Icons */}
          {Object.values(data.stats).map((stat) => (
            <div key={stat.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <img src={stat.icon} alt={stat.label} style={{ width: 28, height: 28, objectFit: "contain" }} />
            </div>
          ))}
          {/* Row 2: Values */}
          {Object.values(data.stats).map((stat) => (
            <div key={stat.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: stat.color }}>
                {stat.min}{stat.target > stat.min ? "+" : ""}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Tips */}
      <section className="mb-10">
        <h2
          className="text-xl font-bold text-text-main mb-4 flex items-center gap-3"
          style={{
            letterSpacing: '-0.02em',
            textShadow: '0 1px 4px rgba(0,0,0,0.06)',
            borderLeft: '4px solid var(--theme-text-main)',
            paddingLeft: 14,
          }}
        >
          <span>Tips & Notes</span>
        </h2>
        <div
          style={{
            background: "var(--theme-card)",
            border: "1px solid var(--theme-border)",
            borderRadius: 12,
            padding: "16px 20px",
          }}
        >
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {data.tips.map((tip, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  padding: "10px 0",
                  borderBottom:
                    i < data.tips.length - 1
                      ? "1px solid var(--theme-border)"
                      : "none",
                  fontSize: 13,
                  color: "var(--theme-text-main)",
                  lineHeight: 1.5,
                }}
              >
                <span style={{ flexShrink: 0, marginTop: 1 }}>💡</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default ChampionsMeetingPage;
