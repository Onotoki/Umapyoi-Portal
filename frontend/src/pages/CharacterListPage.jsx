import React, { useState, useEffect } from "react";

const CharacterListPage = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const response = await fetch(`${apiBase}/api/characters`);
        const data = await response.json();

        setCharacters(data);
        setLoading(false);
      } catch (e) {
        console.error("Backend chưa chạy hoặc có lỗi:", e);
        setLoading(false);
      }
    };
    fetchCharacters();
  }, []);

  const filtered = characters.filter((c) => {
    const searchTarget = (c.name_en + " " + c.alt_name).toLowerCase();
    return searchTarget.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex-1">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-text-main font-inter">
            Characters
          </h1>
          <p className="text-text-muted mt-1.5 font-medium tracking-wide text-sm">
            Explore and filter the complete roster of trainable Umamusume.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full bg-card text-text-main px-5 py-3 rounded-xl border border-border outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-muted text-sm shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute right-4 top-3 text-text-muted">🔍</span>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40">
          <div className="w-10 h-10 border-4 border-border border-t-primary rounded-full animate-spin"></div>
          <p className="mt-6 text-text-muted font-bold tracking-widest uppercase text-[10px]">
            Loading Database...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10">
          {filtered.map((chara) => (
            <div
              key={chara._id || chara.name_en}
              className="uma-card bg-card p-6 flex flex-col items-center text-center border-border shadow-sm group"
            >
              <div className="relative mb-4 inline-block">
                <img
                  src={chara.image_url}
                  alt={chara.name_en}
                  className="w-24 h-24 rounded-xl border-4 border-card shadow-md group-hover:scale-105 transition-transform duration-500 object-cover"
                />
              </div>
              <div className="flex flex-col flex-1 w-full justify-start space-y-1">
                <div className="font-bold text-text-main text-sm md:text-base group-hover:text-primary transition-colors font-inter tracking-tight leading-tight">
                  {chara.name_en}
                </div>
                {chara.alt_name && (
                  <div className="text-xs text-[#b8860b] font-medium tracking-wide">
                    {chara.alt_name}
                  </div>
                )}
                <div className="text-xs text-yellow-400 mt-auto pt-2">
                  {"⭐".repeat(chara.stars || 3)}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-40 bg-card rounded-2xl border border-dashed border-border">
              <p className="text-text-muted font-medium">
                Không có dữ liệu phù hợp.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CharacterListPage;
