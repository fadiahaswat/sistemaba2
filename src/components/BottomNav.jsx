import React from 'react';
import { Home, Edit3, History, Volume2, BookOpen } from 'lucide-react';
import { usePlan } from '../context/PlanContext';

export const BottomNav = () => {
  const { currentPage, setCurrentPage } = usePlan();

  const navs = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'viewer', label: 'Baca', icon: BookOpen },
    { id: 'editor', label: 'Editor', icon: Edit3 },
    { id: 'riwayat', label: 'Riwayat', icon: History },
    { id: 'tempo', label: 'Tempo', icon: Volume2 }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950 border-t-2 border-black z-40 shadow-[0_-4px_0px_#000000]">
      <div className="flex justify-around items-center h-16">
        {navs.map(({ id, label, icon: Icon }) => {
          const isActive = currentPage === id;
          return (
            <button
              key={id}
              onClick={() => setCurrentPage(id)}
              className={`flex flex-col items-center justify-center w-full h-full transition-all ${
                isActive
                  ? 'bg-zinc-900 text-theme-focus border-t-2 border-theme-focus font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] mt-1 font-mono uppercase font-bold">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
