import React, { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";

const statTypes = [
  { key: "Speed", icon: "https://uma.guide/icon/type/speed.svg", color: "#47a8ff" },
  { key: "Stamina", icon: "https://uma.guide/icon/type/stamina.svg", color: "#ff6048" },
  { key: "Power", icon: "https://uma.guide/icon/type/power.svg", color: "#ffad2f" },
  { key: "Guts", icon: "https://uma.guide/icon/type/guts.svg", color: "#ff5aa2" },
  { key: "Wisdom", icon: "https://uma.guide/icon/type/wit.svg", color: "#35d39b" },
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
  const isGold = s.rarity === 2;

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
          whiteSpace: "nowrap",
          alignSelf: "flex-start",
          minWidth: 300,
          padding: "4px 10px",
          borderRadius: 6,
          fontWeight: 800,
          fontSize: 16,
          lineHeight: 1.4,
          ...(isUnique
            ? { background: "linear-gradient(90deg, #deffd6 0%, #b5d7ff 50%, #ffaff0 100%)", color: "#794016" }
            : isGold
            ? {
                background: "linear-gradient(135deg, #f6e3a1 0%, #efc86a 55%, #e8b95b 100%)",
                border: "1px solid #c89634",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45), 0 0 0 1px rgba(255,206,120,0.45), 0 3px 10px rgba(154,106,27,0.22)",
                color: "#5a3900"
              }
            : { background: "linear-gradient(90deg, #fefffe, #bdbecd)", color: "#333" }
          ),
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

const ItemIcon = ({ itemId, count }) => {
  const paddedId = String(itemId).padStart(5, '0');
  const imgUrl = `https://gametora.com/images/umamusume/items/item_icon_${paddedId}.png`;
  return (
    <div style={{
      position: "relative",
      display: "inline-block",
      width: 44,
      height: 44,
      borderRadius: 6,
      background: "#fffde6",
      border: "1px solid #dcd7a0",
      padding: 2,
    }}>
      <img
        src={imgUrl}
        alt={`Item ${itemId}`}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
        onError={(e) => { e.target.style.display = "none"; }}
      />
      {count && (
        <div style={{
          position: "absolute",
          bottom: -2,
          right: 2,
          background: "rgba(0, 0, 0, 0.8)",
          color: "#fff",
          fontSize: 10,
          fontWeight: 700,
          padding: "1px 4px",
          borderRadius: 4,
          lineHeight: 1,
        }}>
          {count}
        </div>
      )}
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
  const [activePopover, setActivePopover] = useState(null);
  const [activeSkillTooltip, setActiveSkillTooltip] = useState(null);
  const [closingSkillTooltip, setClosingSkillTooltip] = useState(null);
  const [activeStatusTooltip, setActiveStatusTooltip] = useState(null);

  const closeSkillTooltip = () => {
    if (!activeSkillTooltip) return;
    const key = activeSkillTooltip;
    setActiveSkillTooltip(null);
    setClosingSkillTooltip(key);
    setTimeout(() => setClosingSkillTooltip((current) => current === key ? null : current), 140);
  };

  useEffect(() => {
    const handleDocClick = () => {
      setActivePopover(null);
      setActiveSkillTooltip(null);
      setClosingSkillTooltip(null);
      setActiveStatusTooltip(null);
    };
    document.addEventListener('click', handleDocClick);
    return () => document.removeEventListener('click', handleDocClick);
  }, []);

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
          <h1 style={{ fontSize: 34, fontWeight: 900, color: "var(--theme-text-main)", marginBottom: 0, lineHeight: 1.1 }}>
            {activeChar.name_en}
          </h1>
          {activeChar.alt_name && (
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--theme-text-muted)", marginBottom: 8 }}>
              {activeChar.alt_name}
            </div>
          )}
          <div style={{ fontSize: 20, color: "var(--theme-text-muted)", marginBottom: 20, fontWeight: 600 }}>
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
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {aw.map((id, index) => {
                      const level = index + 2; // Level 2, 3, 4, 5
                      const levelCosts = gtData.awakeningCosts?.[level] || [];
                      return (
                        <div key={id} style={{
                          background: "#1e1e1e",
                          border: "1px solid #333",
                          borderRadius: 8,
                          overflow: "hidden"
                        }}>
                          <div style={{
                            background: "#2b4e4e",
                            color: "#fff",
                            padding: "6px 12px",
                            fontWeight: 800,
                            fontSize: 16,
                            textAlign: "center"
                          }}>
                            Level {level}
                          </div>
                          <div style={{ padding: 12 }}>
                            <SkillItem skillId={id} skillMap={skillMap} style={{ border: "none", background: "transparent", padding: 0 }} />
                            
                            {levelCosts.length > 0 && (
                              <div style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 8,
                                marginTop: 12,
                                paddingLeft: 56
                              }}>
                                {levelCosts.map((item, idx) => (
                                  <ItemIcon key={idx} itemId={item.id} count={item.num} />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
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



              {Array.isArray(gtData.events) && gtData.events.length > 0 && (
                <div>
                  <SectionTitle>Training Events</SectionTitle>
                  {(() => {
                    const groupOrder = ['Costume Events', 'Events With Choices', 'Date Events', 'Special Events', 'After a Race', 'Events Without Choices'];
                    const grouped = {};
                    gtData.events.forEach(evt => {
                      if (!grouped[evt.group]) grouped[evt.group] = [];
                      grouped[evt.group].push(evt);
                    });
                    return groupOrder.filter(g => grouped[g]).map(group => (
                      <div key={group} style={{ marginBottom: 24 }}>
                        <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--theme-text-main)', marginBottom: 12 }}>
                          {group}
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                          {grouped[group].map((evt, i) => {
                            const key = `${group}-${i}`;
                            const isOpen = activePopover === key;
                            return (
                              <div key={key} style={{ position: 'relative' }}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActivePopover(isOpen ? null : key);
                                  }}
                                  style={{
                                    padding: '8px 14px',
                                    background: '#1a1a1a',
                                    border: '1px solid #2a2a2a',
                                    borderRadius: 8,
                                    color: '#e5e5e5',
                                    fontSize: 16,
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.1s',
                                  }}
                                  onMouseOver={(e) => { e.target.style.background = '#2a2a2a'; }}
                                  onMouseOut={(e) => { e.target.style.background = '#1a1a1a'; }}
                                >
                                  {evt.name || `Event ${i + 1}`}
                                </button>
                                
                                {isOpen && (
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      closeSkillTooltip();
                                    }}
                                    style={{
                                      position: 'absolute',
                                      top: 'calc(100% + 6px)',
                                      left: 0,
                                      minWidth: 260,
                                      background: '#222',
                                      border: '1px solid #444',
                                      borderRadius: 6,
                                      boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                                      zIndex: 100,
                                      overflow: 'visible',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      animation: 'popoverFadeScaleIn 0.14s ease-out',
                                    }}
                                  >
                                    <div style={{ padding: '10px 14px', background: '#2a2a2a', borderBottom: '1px solid #1a1a1a', fontSize: 16, fontWeight: 800, color: '#fff' }}>
                                      {evt.name}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                      {evt.choices.length === 0 ? (
                                        <div style={{ padding: '10px 14px', fontSize: 13, color: '#888' }}>No effects</div>
                                      ) : (
                                        evt.choices.map((ch, ci) => {
                                          const hasRandomDivider = ch.effects.some((eff) => eff.type === 'divider');
                                          let dividerCount = 0;
                                          return (
                                          <div
                                            key={ci}
                                            style={{
                                              display: 'flex', alignItems: 'center', gap: 12,
                                              padding: '12px 14px',
                                              borderBottom: ci < evt.choices.length - 1 ? '1px solid #1a1a1a' : 'none',
                                              background: ci % 2 === 0 ? '#1e1e1e' : '#283737',
                                              cursor: 'default',
                                            }}>
                                            {evt.hasChoice && (
                                              <div style={{
                                                  background: '#333', color: '#e5e5e5', fontSize: 13, padding: '4px 10px', borderRadius: 6, fontWeight: 400, flexShrink: 0
                                              }}>
                                                {evt.choices.length === 3 && ci === 1 ? 'Mid' : (ci === 0 ? 'Top' : (ci === 1 ? 'Bot' : `Opt ${ci + 1}`))}
                                              </div>
                                            )}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                              {hasRandomDivider && (
                                                <span style={{ color: '#ff7a3d', fontSize: 16, fontWeight: 400 }}>Randomly either</span>
                                              )}
                                              {ch.effects.map((eff, ei) => {
                                                if (eff.type === 'divider') {
                                                  dividerCount += 1;
                                                  return <span key={ei} style={{ color: '#ff7a3d', fontSize: 16, fontWeight: 400 }}>{dividerCount === 1 ? 'or' : (eff.label || 'or')}</span>;
                                                }
                                                if (eff.type === 'status') {
                                                  const tooltipKey = `${key}-${ci}-${ei}-status-${eff.statusId}`;
                                                  const isStatusOpen = activeStatusTooltip === tooltipKey;
                                                  return (
                                                    <span
                                                      key={ei}
                                                      onMouseEnter={() => setActiveStatusTooltip(tooltipKey)}
                                                      onMouseLeave={() => setActiveStatusTooltip(null)}
                                                      style={{ position: 'relative', fontSize: 16, color: '#fff', fontWeight: 400 }}
                                                    >
                                                      <span>Get </span>
                                                      <span style={{ background: '#b3442e', color: '#fff', padding: '1px 8px', borderRadius: 4, fontWeight: 700, cursor: 'help' }}>{eff.statusName}</span>
                                                      <span> status</span>
                                                      {isStatusOpen && (
                                                        <div
                                                          style={{
                                                            position: 'absolute',
                                                            bottom: 'calc(100% + 8px)',
                                                            left: 0,
                                                            width: 360,
                                                            background: '#315553',
                                                            borderRadius: 5,
                                                            boxShadow: '0 8px 24px rgba(0,0,0,0.55)',
                                                            padding: '10px 14px',
                                                            zIndex: 320,
                                                            animation: 'tooltipFadeUpIn 0.16s ease-out',
                                                          }}
                                                        >
                                                          <div style={{ color: '#e5e5e5', fontSize: 16, fontWeight: 800, marginBottom: 6 }}>{eff.statusName}</div>
                                                          {eff.statusDesc && (
                                                            <div style={{ color: '#e5e5e5', fontSize: 15, lineHeight: 1.45 }}>{eff.statusDesc}</div>
                                                          )}
                                                        </div>
                                                      )}
                                                    </span>
                                                  );
                                                }
                                                if (eff.type === 'skillHint') {
                                                  const tooltipKey = `${key}-${ci}-${ei}-${eff.skillId}`;
                                                  const isSkillOpen = activeSkillTooltip === tooltipKey;
                                                  const isSkillClosing = closingSkillTooltip === tooltipKey;
                                                  const skill = skillMap[eff.skillId] || {};
                                                  const skillName = skill.skillName || eff.skillName;
                                                  return (
                                                    <span key={ei} style={{ position: 'relative', fontSize: 16, color: '#fff', fontWeight: 400 }}>
                                                      <button
                                                        type="button"
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          if (isSkillOpen) {
                                                            closeSkillTooltip();
                                                          } else {
                                                            setClosingSkillTooltip(null);
                                                            setActiveSkillTooltip(tooltipKey);
                                                          }
                                                        }}
                                                        style={{
                                                          padding: 0,
                                                          border: 'none',
                                                          background: 'transparent',
                                                          color: '#e879f9',
                                                          fontSize: 16,
                                                          fontWeight: 500,
                                                          cursor: 'pointer',
                                                        }}
                                                      >
                                                        {skillName}
                                                      </button>
                                                      <span> hint {eff.value}</span>

                                                      {(isSkillOpen || isSkillClosing) && (
                                                        <div
                                                          onClick={(e) => e.stopPropagation()}
                                                          style={{
                                                            position: 'absolute',
                                                            bottom: 'calc(100% + 12px)',
                                                            left: -90,
                                                            width: 360,
                                                            background: '#1f1f1f',
                                                            border: '1px solid #444',
                                                            borderRadius: 8,
                                                            boxShadow: '0 10px 28px rgba(0,0,0,0.65)',
                                                            padding: 12,
                                                            zIndex: 300,
                                                            animation: isSkillClosing ? 'tooltipFadeUpOut 0.14s ease-in forwards' : 'tooltipFadeUpIn 0.16s ease-out',
                                                          }}
                                                        >
                                                          <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: 10, alignItems: 'start' }}>
                                                            {skill.iconId ? (
                                                              <img
                                                                src={`https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_${skill.iconId}.png`}
                                                                alt=""
                                                                style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }}
                                                              />
                                                            ) : <div style={{ width: 40, height: 40, borderRadius: 6, background: '#333' }} />}
                                                            <div>
                                                              <div style={{ color: '#fff', fontSize: 15, fontWeight: 800, marginBottom: 5 }}>{skillName}</div>
                                                              {(skill.skillDesc || skill.description) && (
                                                                <div style={{ color: '#cfcfcf', fontSize: 13, lineHeight: 1.45 }}>{skill.skillDesc || skill.description}</div>
                                                              )}
                                                            </div>
                                                          </div>
                                                          {skill.effectSummary && (
                                                            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #333', color: '#a7f3d0', fontSize: 13, lineHeight: 1.45 }}>
                                                              {skill.effectSummary}
                                                            </div>
                                                          )}
                                                        </div>
                                                      )}
                                                    </span>
                                                  );
                                                }
                                                return (
                                                  <span key={ei} style={{ fontSize: 16, color: '#fff', fontWeight: 400 }}>
                                                    {eff.text}
                                                  </span>
                                                );
                                              })}
                                            </div>
                                          </div>
                                          );
                                        })
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ));
                  })()}
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
