import React, { useState, useEffect } from "react";

// SVG icons inline cho từng type (giống game icons)
const TypeIcon = ({ type, size = 20 }) => {
  const urls = {
    Speed: "https://uma.guide/icon/type/speed.svg",
    Stamina: "https://uma.guide/icon/type/stamina.svg",
    Power: "https://uma.guide/icon/type/power.svg",
    Guts: "https://uma.guide/icon/type/guts.svg",
    Wit: "https://uma.guide/icon/type/wit.svg",
    Friend: "https://uma.guide/icon/type/pal.svg",
    Group: "https://uma.guide/icon/type/group.svg",
  };

  const src = urls[type];

  if (!src) {
    return (
      <span
        style={{ color: "#fff", fontSize: `${size * 0.6}px`, fontWeight: 900 }}
      >
        {type?.[0]}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={type}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: "block",
        objectFit: "contain",
      }}
    />
  );
};

const TYPE_COLOR = {
  Speed: "#2e6bb1",
  Stamina: "#bc523c",
  Power: "#c78326",
  Guts: "#c1507d",
  Wit: "#318b57",
  Friend: "#a98d2b",
  Group: "#6b9d38",
};

const SupportCardsPage = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedRarity, setSelectedRarity] = useState("All");

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiBase}/api/support-cards`);
        const data = await response.json();
        setCards(data);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };
    fetchCards();
  }, []);

  const filtered = cards.filter((c) => {
    const matchesSearch = c.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "All" || c.type === selectedType;
    const matchesRarity =
      selectedRarity === "All" || c.rarity === selectedRarity;
    return matchesSearch && matchesType && matchesRarity;
  });

  return (
    <>
      <style>{`
        .support-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px 14px;
        }
        @media(min-width:640px)  { .support-grid { grid-template-columns: repeat(5, 1fr); } }
        @media(min-width:768px)  { .support-grid { grid-template-columns: repeat(6, 1fr); } }
        @media(min-width:1024px) { .support-grid { grid-template-columns: repeat(7, 1fr); } }
        @media(min-width:1280px) { .support-grid { grid-template-columns: repeat(8, 1fr); } }

        .card-hover { transition: transform 0.25s ease, filter 0.25s ease; }
        .card-hover:hover { transform: translateY(-5px); filter: brightness(1.08); }
      `}</style>

      <div className="flex-1">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-text-main font-inter">
              Support Cards
            </h1>
            <p className="text-text-muted mt-1.5 font-medium tracking-wide text-sm">
              Explore and filter support cards to optimize your training runs.
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search cards..."
              className="w-full bg-card text-text-main px-5 py-3 rounded-xl border border-border outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-muted text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute right-4 top-3 text-text-muted">🔍</span>
          </div>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-6 mb-8 p-5 bg-card border border-border rounded-2xl">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">
              Rarity
            </span>
            <div className="flex gap-2">
              {["SSR", "SR", "R"].map((r) => {
                const active = selectedRarity === r;
                const isDimmed = selectedRarity !== "All" && !active;

                let btnStyle = {
                  cursor: "pointer",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: "800",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  border: "1.5px solid transparent",
                };

                if (active) {
                  if (r === "SSR") {
                    btnStyle = {
                      ...btnStyle,
                      background:
                        "linear-gradient(135deg, #ff007f 0%, #7f00ff 40%, #00f0ff 80%, #ff007f 100%)",
                      color: "#fff",
                      border: "1.5px solid rgba(255, 255, 255, 0.95)",
                      boxShadow: "0 0 14px rgba(255, 0, 127, 0.65)",
                      transform: "scale(1.06)",
                    };
                  } else if (r === "SR") {
                    btnStyle = {
                      ...btnStyle,
                      background:
                        "linear-gradient(135deg, #ffe066 0%, #f5b041 50%, #e67e22 100%)",
                      color: "#fff",
                      border: "1.5px solid rgba(255, 255, 255, 0.95)",
                      boxShadow: "0 0 14px rgba(243, 156, 18, 0.65)",
                      transform: "scale(1.06)",
                    };
                  } else if (r === "R") {
                    btnStyle = {
                      ...btnStyle,
                      background:
                        "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 50%, #94a3b8 100%)",
                      color: "#0f172a",
                      border: "1.5px solid rgba(255, 255, 255, 0.95)",
                      boxShadow: "0 0 14px rgba(148, 163, 184, 0.65)",
                      transform: "scale(1.06)",
                    };
                  }
                } else if (isDimmed) {
                  btnStyle = {
                    ...btnStyle,
                    background: "rgba(255, 255, 255, 0.02)",
                    color: "rgba(255, 255, 255, 0.15)",
                    border: "1.5px solid rgba(255, 255, 255, 0.03)",
                    opacity: 0.25,
                  };
                } else {
                  // Default elegant dormant states when nothing is selected ("All")
                  if (r === "SSR") {
                    btnStyle = {
                      ...btnStyle,
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1.5px solid rgba(219, 70, 239, 0.25)",
                      color: "#db46ef",
                    };
                  } else if (r === "SR") {
                    btnStyle = {
                      ...btnStyle,
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1.5px solid rgba(243, 156, 18, 0.25)",
                      color: "#f39c12",
                    };
                  } else if (r === "R") {
                    btnStyle = {
                      ...btnStyle,
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1.5px solid rgba(148, 163, 184, 0.25)",
                      color: "#94a3b8",
                    };
                  }
                }

                return (
                  <button
                    key={r}
                    onClick={() =>
                      setSelectedRarity((prev) => (prev === r ? "All" : r))
                    }
                    style={btnStyle}
                    className="hover:brightness-110 hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">
              Type
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                "Speed",
                "Stamina",
                "Power",
                "Guts",
                "Wit",
                "Friend",
                "Group",
              ].map((t) => {
                const active = selectedType === t;
                const isDimmed = selectedType !== "All" && !active;
                const color = TYPE_COLOR[t];

                return (
                  <button
                    key={t}
                    onClick={() =>
                      setSelectedType((prev) => (prev === t ? "All" : t))
                    }
                    title={t}
                    style={{
                      backgroundColor: "transparent",
                      border: active
                        ? "2.5px solid rgba(255, 255, 255, 0.95)"
                        : "1.5px solid transparent",
                      boxShadow: active ? `0 0 12px ${color}bf` : "none",
                      opacity: active ? 1 : isDimmed ? 0.2 : 0.55,
                      transform: active ? "scale(1.1)" : "scale(1)",
                      cursor: "pointer",
                      width: "38px",
                      height: "38px",
                      borderRadius: "9px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                      overflow: "hidden",
                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    className="hover:opacity-85 hover:scale-105 active:scale-95"
                  >
                    <TypeIcon type={t} size={38} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-10 h-10 border-4 border-border border-t-primary rounded-full animate-spin" />
            <p className="mt-6 text-text-muted font-bold tracking-widest uppercase text-[10px]">
              Loading...
            </p>
          </div>
        ) : (
          <div className="support-grid">
            {filtered.map((card) => {
              return (
                <div
                  key={card._id || card.name}
                  className="flex flex-col card-hover cursor-pointer"
                >
                  {/* Card inner */}
                  <div
                    style={{
                      borderRadius: "12px",
                      overflow: "hidden",
                      position: "relative",
                      aspectRatio: "3/4", // Tỉ lệ 3:4 chuẩn của ảnh gốc
                      background: "transparent",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                      border: "none",
                    }}
                  >
                    {/* Art */}
                    <img
                      src={card.image_url}
                      alt={card.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/200x280/1a1a2e/ffffff?text=No+Image";
                      }}
                    />
                  </div>

                  {/* Name */}
                  <div
                    style={{
                      marginTop: "8px",
                      textAlign: "center",
                      padding: "0 2px",
                    }}
                  >
                    <h3
                      className="text-text-main font-bold text-xs leading-snug hover:text-primary transition-colors"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {card.name}
                    </h3>
                    {card.title && (
                      <p
                        className="text-[10px] text-text-muted mt-0.5 leading-tight font-medium"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {card.title}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-32 text-text-muted">
                Không có dữ liệu phù hợp.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SupportCardsPage;
