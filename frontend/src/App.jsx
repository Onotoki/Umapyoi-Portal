import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CharacterListPage from './pages/CharacterListPage';
import SupportCardsPage from './pages/SupportCardsPage';
import GuidesPage from './pages/GuidesPage';
import DonatePage from './pages/DonatePage';
import SkillsPage from './pages/SkillsPage';
import ChampionsMeetingPage from './pages/ChampionsMeetingPage';
import './index.css';

const Navigation = () => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const isActive = (path) => location.pathname === path 
    ? 'text-text-main font-bold border-b-2 border-text-main' 
    : 'text-text-muted hover:text-text-main transition-colors border-b-2 border-transparent hover:border-text-muted';

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border shadow-sm transition-colors duration-200">
      {/* Top Bar (Logo, Actions) */}
      <div className="border-b border-border">
        <div className="flex items-center justify-between px-6 md:px-8 py-4 max-w-[1400px] w-full mx-auto">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 mr-4 group">
              <div className="w-9 h-9 bg-text-main rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(217,70,62,0.2)] group-hover:shadow-[0_0_20px_rgba(217,70,62,0.5)] transition-all">
                <span className="text-xl">🥕</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-text-main leading-none group-hover:text-primary transition-colors">Umapyoi</span>
                <span className="text-[10px] font-bold text-text-muted tracking-widest uppercase mt-0.5">Portal</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium text-text-muted">
            <Link to="/donate" className="hidden md:flex items-center gap-2 hover:text-text-main transition-colors"><span>☕</span> Donate</Link>
            <button 
              onClick={() => setIsDark(!isDark)}
              className="flex items-center justify-center w-10 h-10 text-text-main border border-border bg-card rounded-md hover:bg-border transition-colors shadow-sm"
              title="Toggle Theme"
            >
              {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="bg-surface transition-colors duration-200">
        <nav className="flex items-center gap-8 px-6 md:px-8 overflow-x-auto whitespace-nowrap max-w-[1400px] w-full mx-auto">
          <Link to="/guides" className={`py-4 text-sm ${isActive('/guides')}`}>Guides</Link>
          <Link to="/characters" className={`py-4 text-sm ${isActive('/characters')}`}>Characters</Link>
          <Link to="/support-cards" className={`py-4 text-sm ${isActive('/support-cards')}`}>Support Cards</Link>
          <Link to="/skills" className={`py-4 text-sm ${isActive('/skills')}`}>Skills</Link>
          <Link to="/champions-meeting" className={`py-4 text-sm ${isActive('/champions-meeting')}`}>Champions Meeting</Link>
        </nav>
      </div>
    </header>
  );
};

const App = () => {
  return (
    <div className="flex flex-col min-h-screen font-inter">
      <Navigation />
      <div className="flex-1 max-w-[1400px] w-full mx-auto p-6 md:p-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/characters" element={<CharacterListPage />} />
          <Route path="/support-cards" element={<SupportCardsPage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/champions-meeting" element={<ChampionsMeetingPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
