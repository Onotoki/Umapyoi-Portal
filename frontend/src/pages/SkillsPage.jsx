import React, { useState, useEffect } from "react";

const GAMETORA_FILTERS = [
  { id: 1001, iconId: 10011, label: "Handed", color: { bg: "#64748b", text: "#fff" } },
  { id: 1002, iconId: 10021, label: "Course", color: { bg: "#64748b", text: "#fff" } },
  { id: 1003, iconId: 10031, label: "Track", color: { bg: "#64748b", text: "#fff" } },
  { id: 1004, iconId: 10041, label: "Weather", color: { bg: "#64748b", text: "#fff" } },
  { id: 1005, iconId: 10051, label: "Post", color: { bg: "#64748b", text: "#fff" } },
  { id: 1006, iconId: 10061, label: "Luck", color: { bg: "#64748b", text: "#fff" } },
  { id: 2001, iconId: 20011, label: "Speed", color: { bg: "#2563eb", text: "#fff" } },
  { id: 2002, iconId: 20021, label: "Recovery", color: { bg: "#16a34a", text: "#fff" } },
  { id: 2004, iconId: 20041, label: "Accel", color: { bg: "#d97706", text: "#fff" } },
  { id: 2005, iconId: 20051, label: "Lane", color: { bg: "#0891b2", text: "#fff" } },
  { id: 2006, iconId: 20061, label: "Focus", color: { bg: "#dc2626", text: "#fff" } },
  { id: 2009, iconId: 20091, label: "Vision", color: { bg: "#9333ea", text: "#fff" } },
  { id: 3001, iconId: 30011, label: "Hesitate", color: { bg: "#dc2626", text: "#fff" } },
  { id: 3002, iconId: 30021, label: "Gambit", color: { bg: "#dc2626", text: "#fff" } },
  { id: 3004, iconId: 30041, label: "Frenzy", color: { bg: "#dc2626", text: "#fff" } },
  { id: 3005, iconId: 30051, label: "Jam", color: { bg: "#dc2626", text: "#fff" } },
  { id: 3007, iconId: 30071, label: "Smoke", color: { bg: "#dc2626", text: "#fff" } },
];

const EXTRA_FILTERS = [
  { id: "unique", iconId: 20013, label: "Unique", color: { bg: "#7c3aed", text: "#fff" } },
  { id: "special", iconId: 1010011, label: "Special", color: { bg: "#b45309", text: "#fff" } },
];

const ALL_FILTERS = [...GAMETORA_FILTERS, ...EXTRA_FILTERS];

const FILTER_COLOR_MAP = Object.fromEntries(
  ALL_FILTERS.map((f) => [f.id, f.color])
);

const getIconUrl = (iconId) =>
  `https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_${iconId}.png`;

const getFilterId = (skill) => {
  const fid = Math.floor(skill.iconId / 10);
  if (GAMETORA_FILTERS.some((f) => f.id === fid)) return fid;
  return null;
};

const SkillTooltip = ({ skill, visible }) => {
  if (!visible) return null;
  const filterId = getFilterId(skill) || (skill.skillCategory === "Unique" ? "unique" : skill.skillCategory === "Special" ? "special" : null);
  const cat = FILTER_COLOR_MAP[filterId] || { bg: "#334155", text: "#fff" };

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
        width: "380px",
        background: "var(--theme-surface)",
        border: "1px solid var(--theme-border)",
        borderRadius: "16px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
        padding: "24px",
        pointerEvents: "none",
      }}
    >
      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
        <img
          src={getIconUrl(skill.iconId)}
          alt=""
          style={{ width: 56, height: 56, borderRadius: 10, flexShrink: 0, background: "var(--theme-card)" }}
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: "var(--theme-text-main)", fontSize: 16, lineHeight: 1.3 }}>
            {skill.skillName}
          </div>
          <div style={{ marginTop: 6, display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 20, background: cat.bg, color: cat.text }}>
              {skill.skillCategory}
            </span>
            {skill.needSkillPoint > 0 && (
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 20, background: "rgba(234,179,8,0.15)", color: "#eab308" }}>
                {skill.needSkillPoint} SP
              </span>
            )}
          </div>
        </div>
      </div>

      {skill.skillDesc && (
        <p style={{ marginTop: 14, fontSize: 13, color: "var(--theme-text-muted)", lineHeight: 1.6, borderTop: "1px solid var(--theme-border)", paddingTop: 14 }}>
          {skill.skillDesc}
        </p>
      )}

      {skill.effectSummary && (
        <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: "rgba(217,70,62,0.08)", border: "1px solid rgba(217,70,62,0.2)" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#d9463e" }}>Effect: </span>
          <span style={{ fontSize: 12, color: "var(--theme-text-main)" }}>{skill.effectSummary}</span>
        </div>
      )}
    </div>
  );
};

const SkillRow = ({ skill }) => {
  const [hovered, setHovered] = useState(false);
  const filterId = getFilterId(skill) || (skill.skillCategory === "Unique" ? "unique" : skill.skillCategory === "Special" ? "special" : null);
  const cat = FILTER_COLOR_MAP[filterId] || { bg: "#334155", text: "#fff" };

  return (
    <>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "10px 14px",
          borderRadius: 10,
          cursor: "pointer",
          background: hovered ? "var(--theme-card)" : "transparent",
          transition: "all 0.15s ease",
        }}
      >
        <img
          src={getIconUrl(skill.iconId)}
          alt=""
          style={{ width: 36, height: 36, borderRadius: 6, flexShrink: 0, background: "var(--theme-card)" }}
          onError={(e) => { e.target.style.display = "none"; }}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontWeight: 600,
            fontSize: 14,
            color: "var(--theme-text-main)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {skill.skillName}
          </div>
          {skill.skillDesc && (
            <div style={{
              fontSize: 12,
              color: "var(--theme-text-muted)",
              marginTop: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              opacity: 0.7,
            }}>
              {skill.skillDesc}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: 20,
            background: cat.bg + "22",
            color: cat.bg,
          }}>
            {skill.skillCategory}
          </span>

          {skill.needSkillPoint > 0 && (
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--theme-text-muted)",
              minWidth: 48,
              textAlign: "right",
            }}>
              {skill.needSkillPoint} SP
            </span>
          )}
        </div>
      </div>

      {hovered && <SkillTooltip skill={skill} visible={hovered} />}
    </>
  );
};

const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

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
    const matchCat =
      selectedFilter === "All" ||
      (typeof selectedFilter === "number" && Math.floor(s.iconId / 10) === selectedFilter) ||
      (selectedFilter === "unique" && s.skillCategory === "Unique") ||
      (selectedFilter === "special" && s.skillCategory === "Special");
    return matchSearch && matchCat;
  });

  return (
    <div className="flex-1">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-text-main font-inter">
            Skills
          </h1>
          <p className="text-text-muted mt-1.5 font-medium tracking-wide text-sm">
            Browse and filter all available skills in the game.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search skills..."
            className="w-full bg-card text-text-main px-5 py-3 rounded-xl border border-border outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-muted text-sm shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute right-4 top-3 text-text-muted">🔍</span>
        </div>
      </header>

      {/* Filter icons - matches GameTora's 17 + Unique & Special */}
      <div className="flex flex-wrap items-center gap-2 mb-6 p-5 bg-card border border-border rounded-2xl">
        {ALL_FILTERS.map((f) => {
          const active = selectedFilter === f.id;
          const color = f.color;
          return (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(active ? "All" : f.id)}
              title={f.label}
              style={{
                width: 42,
                height: 42,
                borderRadius: 6,
                cursor: "pointer",
                border: `2px solid ${active ? color.bg : "transparent"}`,
                background: active ? color.bg + "15" : "rgba(255,255,255,0.03)",
                boxShadow: active ? `0 0 10px ${color.bg}66` : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                opacity: active ? 1 : 0.55,
              }}
              className="hover:opacity-85 hover:scale-105 active:scale-95"
            >
              <img
                src={getIconUrl(f.iconId)}
                alt={f.label}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </button>
          );
        })}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40">
          <div className="w-8 h-8 border-3 border-border border-t-primary rounded-full animate-spin" />
          <p className="mt-4 text-text-muted font-bold tracking-widest uppercase text-[10px]">Loading...</p>
        </div>
      ) : (
        <div style={{ border: "1px solid var(--theme-border)", borderRadius: 12, overflow: "hidden" }}>
          {filtered.map((skill, i) => (
            <React.Fragment key={skill.skillId}>
              {i > 0 && <div style={{ height: 1, background: "var(--theme-border)", marginInline: 14 }} />}
              <SkillRow skill={skill} />
            </React.Fragment>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0" }} className="text-text-muted">
              Không có kỹ năng nào phù hợp.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillsPage;
