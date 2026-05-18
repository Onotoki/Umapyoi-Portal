import React from 'react';

const GuidesPage = () => {
  return (
    <div className="flex-1">
      <header className="mb-12 border-b border-border pb-6">
        <h1 className="text-4xl font-bold tracking-tight text-text-main font-inter">Guides</h1>
        <p className="text-text-muted mt-2 font-medium tracking-wide">Tổng hợp các bài hướng dẫn chi tiết dành cho Uma Musume.</p>
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
