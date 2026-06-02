import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";

const statTypes = [
  { key: "Speed", icon: "https://uma.guide/icon/type/speed.svg", color: "#1da1f2" },
  { key: "Stamina", icon: "https://uma.guide/icon/type/stamina.svg", color: "#ef5548" },
  { key: "Power", icon: "https://uma.guide/icon/type/power.svg", color: "#f59e0b" },
  { key: "Guts", icon: "https://uma.guide/icon/type/guts.svg", color: "#ec4899" },
  { key: "Wisdom", icon: "https://uma.guide/icon/type/wit.svg", color: "#10b981" },
];

const GradeText = ({ grade }) => {
  const rankIconMap = { G: "00", F: "02", E: "04", D: "06", C: "08", B: "10", A: "12" };
  const rankIcon = rankIconMap[grade];
  if (rankIcon) {
    return <img src={`https://media.gametora.com/umamusume/ui/rank/simple/${rankIcon}.png`} alt={grade} style={{ width: 42, height: 42, objectFit: "contain" }} />;
  }
  return <span style={{ fontSize: 32, fontWeight: 900, color: "#f8fafc", lineHeight: 1 }}>{grade || "-"}</span>;
};

const AptitudeBlock = ({ title, items }) => (
  <div style={{ overflow: "hidden", borderRadius: 6, background: "#171717" }}>
    <div style={{ background: "#315353", color: "#f4f4f5", fontSize: 22, fontWeight: 850, textAlign: "center", padding: "10px 12px" }}>{title}</div>
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`, gap: 0, padding: "16px 12px 12px" }}>
      {items.map((item) => (
        <div key={item.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 19, color: "#f8fafc", lineHeight: 1 }}>{item.label}</span>
          <GradeText grade={item.grade} />
        </div>
      ))}
    </div>
  </div>
);

const SkillItem = ({ skillId, skillMap, style }) => {
  const s = skillMap[skillId];
  if (!s) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "56px 1fr", gap: 0, padding: "6px 8px", borderRadius: 6, background: "#232323", border: "1px solid #333", ...style }}>
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 5 }}>
          <div style={{ width: 44, height: 44, borderRadius: 6, background: "#333" }} />
        </div>
        <div style={{ padding: "5px 10px" }}>
          <span style={{ fontSize: 13, color: "#888" }}>Skill #{skillId}</span>
        </div>
      </div>
    );
  }
  const isUnique = s.skillCategory === "Unique" || s.skillId >= 900000;
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "56px 1fr", gap: 0,
      padding: "6px 8px", borderRadius: 6,
      background: "#232323", border: "1px solid #333",
      ...style,
    }}>
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 5 }}>
        <img
          src={`https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_${s.iconId}.png`}
          alt=""
          style={{ width: 44, height: 44, borderRadius: 6, objectFit: "cover", flexShrink: 0 }}
          onError={(e) => { e.target.style.display = "none"; }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "4px 10px" }}>
        <div style={{
          display: "inline-block",
          padding: "2px 8px",
          borderRadius: 5,
          fontWeight: 800,
          fontSize: 13,
          lineHeight: 1.4,
          ...(isUnique
            ? { background: "linear-gradient(90deg, #deffd6 0%, #b5d7ff 50%, #ffaff0 100%)", color: "#794016" }
            : { background: "linear-gradient(90deg, #fefffe, #bdbecd)", color: "#333" }
          ),
          alignSelf: "flex-start",
        }}>
          {s.skillName}
        </div>
        {(s.skillDesc || s.description) && (
          <span style={{ fontSize: 15, color: "#bbb", lineHeight: 1.5 }}>{s.skillDesc || s.description}</span>
        )}
      </div>
    </div>
  );
};

const SectionTitle = ({ children }) => (
  <h2 style={{ fontSize: 28, fontWeight: 900, color: "var(--theme-text-main)", textAlign: "center", marginBottom: 12 }}>
    {children}
  </h2>
);

const RaceIcon = ({ iconId }) => {
  const iconMap = {
    9002: "🏟️", 9003: "🏇", 9004: "🌍", 9005: "🏆", 9006: "👑",
    9007: "⭐", 9008: "🔥", 9009: "💎", 9010: "🎯", 9011: "🌈",
    9012: "🏅", 9013: "🌻", 9014: "🎪", 9015: "🌸",
  };
  return <span style={{ fontSize: 16 }}>{iconMap[iconId] || "🏁"}</span>;
};

const TerrainIcon = ({ terrain }) => {
  const map = { 1: "Turf", 2: "Dirt" };
  return <span style={{ fontSize: 11, color: "var(--theme-text-muted)", textTransform: "uppercase" }}>{map[terrain] || "?"}</span>;
};

const DistanceLabel = ({ distance }) => {
  if (!distance) return null;
  return <span style={{ fontSize: 11, color: "var(--theme-text-muted)" }}>{distance}m</span>;
};

function CharacterDetailPage() {
  const { name } = useParams();
  const [searchParams] = useSearchParams();
  const variantParam = searchParams.get("variant") || "";
  const [data, setData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [gtData, setGtData] = useState(null);
  const [gtLoading, setGtLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const [charRes, skillRes] = await Promise.all([
          fetch(`${apiBase}/api/characters/${encodeURIComponent(name)}`),
          fetch(`${apiBase}/api/skills`),
        ]);
        if (!charRes.ok) throw new Error("Character not found");
        const charData = await charRes.json();
        const skillData = await skillRes.json();
        setData(charData);
        setSkills(skillData);
        setLoading(false);

        const { base, variants } = charData;
        const all = [base, ...variants];
        const active = variantParam
          ? all.find(v => v.alt_name?.toLowerCase() === variantParam.toLowerCase()) || base
          : base;
        const cardMatch = active.image_url?.match(/_(\d{6})\.png$/);
        const cardId = cardMatch ? cardMatch[1] : null;

        if (cardId) {
          setGtLoading(true);
          fetch(`${apiBase}/api/characters/${encodeURIComponent(name)}/gametora-data?cardId=${cardId}`)
            .then(r => r.ok ? r.json() : null)
            .then(d => { if (d) setGtData(d); setGtLoading(false); })
            .catch(() => { setGtLoading(false); });
        }
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    };
    fetchDetail();
  }, [name, variantParam]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <div className="w-10 h-10 border-4 border-border border-t-primary rounded-full animate-spin" />
        <p className="mt-6 text-text-muted font-bold tracking-widest uppercase text-[10px]">Loading...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-text-main mb-4">Character not found</h2>
        <Link to="/characters" className="text-primary hover:underline font-medium">&larr; Back to characters</Link>
      </div>
    );
  }

  const { base, variants: rawVariants, extra } = data;
  const variants = Array.isArray(rawVariants) ? rawVariants : [];
  const allVersions = [base, ...variants];
  const activeChar = variantParam
    ? allVersions.find(v => v.alt_name?.toLowerCase() === variantParam.toLowerCase()) || base
    : base;
  const activeExtra = activeChar.extra || extra;

  const skillMap = {};
  if (Array.isArray(skills)) skills.forEach(s => { skillMap[s.skillId] = s; });
  if (gtData && gtData.skillDefinitions) {
    Object.entries(gtData.skillDefinitions).forEach(([id, def]) => { skillMap[Number(id)] = def; });
  }

  return (
    <div className="character-detail">
      <Link to="/characters" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-main transition-colors mb-6 font-medium">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
        Back to characters
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 32, alignItems: "start" }}>
        <div>
          <img
            src={activeChar.image_url}
            alt={activeChar.name_en}
            style={{ width: "100%", borderRadius: 16, border: "3px solid var(--theme-border)", boxShadow: "0 4px 20px rgba(0,0,0,0.12)", display: "block" }}
          />
        </div>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "var(--theme-text-main)", marginBottom: 0, lineHeight: 1.1 }}>
            {activeChar.name_en}
          </h1>
          {activeChar.alt_name && (
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--theme-text-muted)", marginBottom: 6 }}>
              {activeChar.alt_name}
            </div>
          )}
          <div style={{ fontSize: 13, color: "var(--theme-text-muted)", marginBottom: 20, fontWeight: 600 }}>
            {"⭐".repeat(activeChar.stars || 3)}
          </div>

          {variants.length > 0 && (
            <div style={{ marginBottom: 22 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--theme-text-main)", marginBottom: 10 }}>Character Versions</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {allVersions.map((v) => (
                  <Link
                    key={v._id}
                    to={`/characters/${encodeURIComponent(v.name_en)}${v.alt_name ? `?variant=${encodeURIComponent(v.alt_name)}` : ""}`}
                    style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 8,
                      border: v._id === activeChar._id ? "2px solid var(--primary-color, #d9463e)" : "1px solid var(--theme-border)",
                      background: v._id === activeChar._id ? "var(--theme-surface)" : "var(--theme-card)",
                      textDecoration: "none", cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    <img src={v.image_url} alt={v.name_en} style={{ width: 36, height: 36, borderRadius: 6, objectFit: "contain" }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--theme-text-main)" }}>{v.name_en}</div>
                      {v.alt_name && <div style={{ fontSize: 11, fontWeight: 600, color: "var(--theme-text-muted)" }}>{v.alt_name}</div>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {activeExtra && (
        <div style={{ maxWidth: 920, margin: "34px auto 0" }}>
          <div style={{ marginBottom: 44 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: "var(--theme-text-main)", textAlign: "center", marginBottom: 10 }}>Stat bonuses</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 0, background: "#171717", borderRadius: 6, padding: "12px 16px 10px" }}>
              {statTypes.map((stat) => {
                const value = activeExtra[`talent${stat.key}`] || 0;
                return (
                  <div key={stat.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <img src={stat.icon} alt={stat.key} style={{ width: 44, height: 44, objectFit: "contain" }} />
                    <span style={{ fontSize: 20, color: "#f8fafc", lineHeight: 1 }}>{value ? `${value}%` : "-"}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: 44 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: "var(--theme-text-main)", textAlign: "center", marginBottom: 12 }}>Aptitude</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <AptitudeBlock title="Surface" items={[
                { label: "Turf", grade: activeExtra.aptitudeTurf },
                { label: "Dirt", grade: activeExtra.aptitudeDirt },
              ]} />
              <AptitudeBlock title="Distance" items={[
                { label: "Short", grade: activeExtra.aptitudeShort },
                { label: "Mile", grade: activeExtra.aptitudeMile },
                { label: "Medium", grade: activeExtra.aptitudeMiddle },
                { label: "Long", grade: activeExtra.aptitudeLong },
              ]} />
              <AptitudeBlock title="Strategy" items={[
                { label: "Front", grade: activeExtra.aptitudeRunner },
                { label: "Pace", grade: activeExtra.aptitudeLeader },
                { label: "Late", grade: activeExtra.aptitudeBetweener },
                { label: "End", grade: activeExtra.aptitudeChaser },
              ]} />
            </div>
          </div>

          {gtLoading && (
            <div style={{ textAlign: "center", padding: 24 }}>
              <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin mx-auto" />
              <p style={{ fontSize: 12, color: "var(--theme-text-muted)", marginTop: 10 }}>Loading GameTora data...</p>
            </div>
          )}
          {gtData && !gtLoading && (() => {
            const seen = new Set();
            const dedup = (arr) => (Array.isArray(arr) ? arr : []).filter(id => { if (seen.has(id)) return false; seen.add(id); return true; });
            const uq = dedup(gtData.skills_unique);
            const inn = dedup(gtData.skills_innate);
            const aw = dedup(gtData.skills_awakening);
            const ev = dedup(gtData.skills_event);
            return (
            <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
              {uq.length > 0 && (
                <div>
                  <SectionTitle>Unique skills</SectionTitle>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {uq.map(id => <SkillItem key={id} skillId={id} skillMap={skillMap} />)}
                  </div>
                </div>
              )}

              {inn.length > 0 && (
                <div>
                  <SectionTitle>Innate skills</SectionTitle>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {inn.map(id => <SkillItem key={id} skillId={id} skillMap={skillMap} />)}
                  </div>
                </div>
              )}

              {aw.length > 0 && (
                <div>
                  <SectionTitle>Awakening Skills</SectionTitle>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {aw.map(id => <SkillItem key={id} skillId={id} skillMap={skillMap} />)}
                  </div>
                </div>
              )}

              {ev.length > 0 && (
                <div>
                  <SectionTitle>Skills from Events</SectionTitle>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {ev.map(id => <SkillItem key={id} skillId={id} skillMap={skillMap} />)}
                  </div>
                </div>
              )}

              {Array.isArray(gtData.objectives) && gtData.objectives.length > 0 && (
                <div>
                  <SectionTitle>Objectives</SectionTitle>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {gtData.objectives.map((obj, i) => {
                      const race = obj.races?.[0];
                      return (
                        <div key={i} style={{
                          display: "grid", gridTemplateColumns: "32px 52px 1fr auto",
                          alignItems: "center", gap: 10,
                          padding: "8px 12px", background: "var(--theme-card)", border: "1px solid var(--theme-border)", borderRadius: 6,
                          fontSize: 13,
                        }}>
                          <span style={{ fontWeight: 900, color: "var(--theme-text-muted)", textAlign: "center" }}>{obj.order}</span>
                          <span style={{ fontWeight: 700, color: "var(--theme-text-main)" }}>Turn {obj.turn}</span>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <RaceIcon iconId={race?.icon_id} />
                            <span style={{ fontWeight: 700, color: "var(--theme-text-main)" }}>{race?.name_en || obj.cond_type}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <TerrainIcon terrain={race?.terrain} />
                            <DistanceLabel distance={race?.distance} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {Array.isArray(gtData.events) && gtData.events.length > 0 && (
                <div>
                  <SectionTitle>Training Events ({gtData.events.length})</SectionTitle>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 8 }}>
                    {gtData.events.slice(0, 30).map((evt, i) => (
                      <div key={i} style={{
                        padding: "10px 12px", background: "var(--theme-card)", border: "1px solid var(--theme-border)", borderRadius: 6,
                      }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--theme-text-main)", marginBottom: 4 }}>{evt.name_en || `Event ${i + 1}`}</div>
                        {evt.condition_en && <div style={{ fontSize: 11, color: "var(--theme-text-muted)" }}>{evt.condition_en}</div>}
                        {evt.choice_1_text_en && (
                          <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 2 }}>
                            {evt.choice_1_text_en && <span style={{ fontSize: 11, color: "#22c55e" }}>▸ {evt.choice_1_text_en}</span>}
                            {evt.choice_2_text_en && <span style={{ fontSize: 11, color: "#ef4444" }}>▸ {evt.choice_2_text_en}</span>}
                          </div>
                        )}
                      </div>
                    ))}
                    {gtData.events.length > 30 && (
                      <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 12, fontSize: 13, color: "var(--theme-text-muted)" }}>
                        ...and {gtData.events.length - 30} more events
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
        </div>
      )}
    </div>
  );
}

export default CharacterDetailPage;
