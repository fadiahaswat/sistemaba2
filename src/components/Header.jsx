import React from 'react';
import { usePlan } from '../context/PlanContext';

export const Header = () => {
  const { currentPage, setCurrentPage } = usePlan();

  const navItems = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'viewer', label: 'Mode Baca' },
    { id: 'editor', label: 'Editor' },
    { id: 'riwayat', label: 'Riwayat' },
    { id: 'tempo', label: 'Tempo' },
    { id: 'visualisasi', label: 'Dokumen Perpang' }
  ];

  return (
    <header className="bg-zinc-950 border-b-2 border-black sticky top-0 z-30 shadow-[0_4px_0px_#000000]">
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentPage('beranda')} className="hidden md:flex items-center gap-3 focus:outline-none group text-left">
            <img src="./logo-tonti-muallimin.png" alt="Logo Tonti Mu'allimin" className="w-10 h-10 object-contain drop-shadow" />
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight uppercase group-hover:text-theme-focus transition-colors">mangan perpunk!</h1>
              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400 block -mt-1 font-bold">BRUTALIST EDITION</span>
            </div>
          </button>
          <div className="flex items-center gap-2 md:hidden">
            <img src="./logo-tonti-muallimin.png" alt="Logo" className="w-8 h-8 object-contain drop-shadow" />
            <h2 className="text-base font-black text-white uppercase tracking-wider">{currentPage === 'visualisasi' ? 'Baca Perpang' : currentPage}</h2>
          </div>
        </div>

        <div className="flex items-center">
          <nav className="hidden md:flex items-center gap-2 text-xs font-black uppercase tracking-wider">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`px-3.5 py-1.5 border-2 border-black transition-transform ${
                    isActive
                      ? 'bg-theme text-black font-extrabold shadow-[2px_2px_0px_#000000] -translate-y-0.5'
                      : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white hover:-translate-y-0.5 shadow-[2px_2px_0px_#000000]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
          <button onClick={() => setCurrentPage('beranda')} className="flex items-center gap-2 md:hidden focus:outline-none font-black text-xs uppercase px-2 py-1 bg-zinc-900 border-2 border-black shadow-[2px_2px_0px_#000000]">
            <span>mangan perpunk!</span>
          </button>
        </div>
      </div>
    </header>
  );
};
