import React, { useState, useEffect, useRef } from "react";

// ===== CONSTANTS =====
const CATEGORIES = [
  "All",
  "Unique",
  "Speed Boost",
  "Acceleration",
  "Recovery",
  "Passive",
  "Debuff",
  "Lane Effect",
  "Vision",
  "Special",
];

const RARITIES = [
  { label: "All", value: "All" },
  { label: "★★★", value: 3 },
  { label: "★★", value: 2 },
  { label: "★", value: 1 },
];

const CATEGORY_COLOR = {
  Unique: { bg: "#7c3aed", text: "#fff" },
  "Speed Boost": { bg: "#2563eb", text: "#fff" },
  Acceleration: { bg: "#d97706", text: "#fff" },
  Recovery: { bg: "#16a34a", text: "#fff" },
  Passive: { bg: "#64748b", text: "#fff" },
  Debuff: { bg: "#dc2626", text: "#fff" },
  "Lane Effect": { bg: "#0891b2", text: "#fff" },
  Vision: { bg: "#9333ea", text: "#fff" },
  Special: { bg: "#b45309", text: "#fff" },
};

const RARITY_STAR_COLOR = {
  3: "#e9d85a",
  2: "#c0c0c0",
  1: "#cd7f32",
};

// Icon URL từ GameTora (dùng iconId trực tiếp)
const getIconUrl = (iconId) =>
  `https://gametora.com/images/umamusume/skills/ut_icon_skill_${iconId}.png`;

// ===== TOOLTIP COMPONENT =====
const SkillTooltip = ({ skill, anchorRef, visible }) => {
  if (!visible) return null;

  const cat = CATEGORY_COLOR[skill.skillCategory] || { bg: "#334155", text: "#fff" };

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
        width: "320px",
        background: "var(--theme-surface)",
        border: "1px solid var(--theme-border)",
        borderRadius: "16px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
        padding: "20px",
        pointerEvents: "none",
      }}
    >
      <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
        <img
          src={getIconUrl(skill.iconId)}
          alt=""
          style={{ width: 48, height: 48, borderRadius: 8, flexShrink: 0 }}
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: "var(--theme-text-main)", fontSize: 15, lineHeight: 1.3 }}>
            {skill.skillName}
          </div>
          <div style={{ marginTop: 4 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: "2px 8px",
              borderRadius: 20, background: cat.bg, color: cat.text
            }}>
              {skill.skillCategory}
            </span>
          </div>
        </div>
      </div>

      {skill.skillDesc && (
        <p style={{
          marginTop: 12, fontSize: 12, color: "var(--theme-text-muted)",
          lineHeight: 1.6, borderTop: "1px solid var(--theme-border)", paddingTop: 12
        }}>
          {skill.skillDesc}
        </p>
      )}

      {skill.effectSummary && (
        <div style={{
          marginTop: 10, padding: "8px 12px", borderRadius: 8,
          background: "rgba(217,70,62,0.08)", border: "1px solid rgba(217,70,62,0.2)"
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#d9463e" }}>Effect: </span>
          <span style={{ fontSize: 11, color: "var(--theme-text-main)" }}>{skill.effectSummary}</span>
        </div>
      )}

      {skill.needSkillPoint > 0 && (
        <div style={{ marginTop: 8, fontSize: 11, color: "var(--theme-text-muted)" }}>
          Cost: <strong style={{ color: "var(--theme-text-main)" }}>{skill.needSkillPoint} SP</strong>
        </div>
      )}
    </div>
  );
};

// ===== SKILL CARD COMPONENT =====
const SkillCard = ({ skill }) => {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);
  const cat = CATEGORY_COLOR[skill.skillCategory] || { bg: "#334155", text: "#fff" };
  const starColor = RARITY_STAR_COLOR[skill.rarity] || "#888";

  return (
    <>
      <div
        ref={cardRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
          transition: "transform 0.22s ease",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
        }}
      >
        {/* Icon Box */}
        <div style={{
          width: "100%",
          aspectRatio: "1 / 1",
          background: "var(--theme-card)",
          border: `1.5px solid ${hovered ? "rgba(217,70,62,0.5)" : "var(--theme-border)"}`,
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          boxShadow: hovered
            ? "0 8px 24px rgba(0,0,0,0.3)"
            : "0 2px 6px rgba(0,0,0,0.1)",
          transition: "all 0.22s ease",
        }}>
          <img
            src={getIconUrl(skill.iconId)}
            alt={skill.skillName}
            style={{ width: "75%", height: "75%", objectFit: "contain" }}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentNode.innerHTML = `<span style="font-size:28px">⚡</span>`;
            }}
          />
        </div>

        {/* Name */}
        <div style={{
          textAlign: "center",
          width: "100%",
          paddingInline: 2,
        }}>
          <div style={{
            fontWeight: 700,
            fontSize: 11,
            color: hovered ? "#d9463e" : "var(--theme-text-main)",
            lineHeight: 1.3,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            transition: "color 0.2s",
            minHeight: "2.6em",
          }}>
            {skill.skillName}
          </div>

          {/* Rarity stars */}
          <div style={{ fontSize: 9, color: starColor, marginTop: 2 }}>
            {"★".repeat(skill.rarity)}{"☆".repeat(Math.max(0, 3 - skill.rarity))}
          </div>

          {/* Category badge */}
          <div style={{
            display: "inline-block",
            fontSize: 9,
            fontWeight: 700,
            padding: "1px 6px",
            borderRadius: 20,
            background: cat.bg,
            color: cat.text,
            marginTop: 4,
            letterSpacing: "0.03em",
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {skill.skillCategory}
          </div>
        </div>
      </div>

      {/* Tooltip overlay */}
      {hovered && <SkillTooltip skill={skill} anchorRef={cardRef} visible={hovered} />}
    </>
  );
};

// ===== MAIN PAGE =====
const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRarity, setSelectedRarity] = useState("All");

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const response = await fetch(`${apiBase}/api/skills`);
        const data = await response.json();
        setSkills(data);
        setLoading(false);
      } catch (e) {
        console.error("Lỗi load skills:", e);
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const filtered = skills.filter((s) => {
    const matchSearch =
      !searchTerm ||
      (s.skillName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.skillDesc || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchCat = selectedCategory === "All" || s.skillCategory === selectedCategory;

    const matchRarity = selectedRarity === "All" || s.rarity === selectedRarity;

    return matchSearch && matchCat && matchRarity;
  });

  return (
    <>
      <style>{`
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px 12px;
        }
        @media (min-width: 480px)  { .skills-grid { grid-template-columns: repeat(5, 1fr); } }
        @media (min-width: 640px)  { .skills-grid { grid-template-columns: repeat(6, 1fr); } }
        @media (min-width: 768px)  { .skills-grid { grid-template-columns: repeat(8, 1fr); } }
        @media (min-width: 1024px) { .skills-grid { grid-template-columns: repeat(10, 1fr); } }
        @media (min-width: 1280px) { .skills-grid { grid-template-columns: repeat(12, 1fr); } }
      `}</style>

      <div className="flex-1">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-text-main font-inter">
              Skills
            </h1>
            <p className="text-text-muted mt-1.5 font-medium tracking-wide text-sm">
              Browse all Uma Musume skills — filter by category and rarity.
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search skills..."
              className="w-full bg-card text-text-main px-5 py-3 rounded-xl border border-border outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-muted text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute right-4 top-3 text-text-muted">🔍</span>
          </div>
        </header>

        {/* Filters */}
        <div className="flex flex-col gap-4 mb-8 p-5 bg-card border border-border rounded-2xl">
          {/* Category filter */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">
              Category
            </span>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat;
                const color = CATEGORY_COLOR[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(active ? "All" : cat)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                      border: active
                        ? `1.5px solid ${color ? color.bg : "#d9463e"}`
                        : "1.5px solid var(--theme-border)",
                      background: active
                        ? (color ? color.bg : "#d9463e")
                        : "transparent",
                      color: active ? (color ? color.text : "#fff") : "var(--theme-text-muted)",
                      transition: "all 0.18s ease",
                      transform: active ? "scale(1.04)" : "scale(1)",
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rarity filter */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">
              Rarity
            </span>
            <div className="flex gap-2">
              {RARITIES.map(({ label, value }) => {
                const active = selectedRarity === value;
                const starColor = RARITY_STAR_COLOR[value] || "#d9463e";
                return (
                  <button
                    key={label}
                    onClick={() => setSelectedRarity(active ? "All" : value)}
                    style={{
                      padding: "5px 14px",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: "pointer",
                      border: active
                        ? `1.5px solid ${starColor}`
                        : "1.5px solid var(--theme-border)",
                      background: active ? starColor + "22" : "transparent",
                      color: active ? starColor : "var(--theme-text-muted)",
                      transition: "all 0.18s ease",
                      transform: active ? "scale(1.06)" : "scale(1)",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Count */}
          <div className="text-[11px] text-text-muted">
            Showing <strong className="text-text-main">{filtered.length}</strong> of{" "}
            <strong className="text-text-main">{skills.length}</strong> skills
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-10 h-10 border-4 border-border border-t-primary rounded-full animate-spin" />
            <p className="mt-6 text-text-muted font-bold tracking-widest uppercase text-[10px]">
              Loading Skills...
            </p>
          </div>
        ) : (
          <div className="skills-grid">
            {filtered.map((skill) => (
              <SkillCard key={skill.skillId} skill={skill} />
            ))}
            {filtered.length === 0 && (
              <div
                style={{ gridColumn: "1 / -1", textAlign: "center", padding: "80px 0" }}
                className="text-text-muted"
              >
                Không có kỹ năng nào phù hợp.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SkillsPage;
