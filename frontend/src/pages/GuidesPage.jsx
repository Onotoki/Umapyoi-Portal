import React, { useState } from "react";

const GuidesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex-1">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-text-main font-inter">
            Guides
          </h1>
          <p className="text-text-muted mt-1.5 font-medium tracking-wide text-sm">
            Collection of detailed guides and tutorials for Uma Musume.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search guides..."
            className="w-full bg-card text-text-main px-5 py-3 rounded-xl border border-border outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-muted text-sm shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute right-4 top-3 text-text-muted">🔍</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="uma-card p-6 flex flex-col items-center justify-center min-h-[200px] border-dashed border-2 bg-transparent">
          <span className="text-4xl mb-4 text-text-muted">🚧</span>
          <p className="text-text-muted font-semibold">Trang này đang được xây dựng</p>
        </div>
      </div>
    </div>
  );
};

export default GuidesPage;
