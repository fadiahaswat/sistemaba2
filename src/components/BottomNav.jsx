import React from 'react';
import { Home, Edit3, History, Volume2, BookOpen } from 'lucide-react';
import { usePlan } from '../context/PlanContext';

export const BottomNav = () => {
  const { currentPage, setCurrentPage } = usePlan();

  const navs = [
    { id: 'beranda', label: 'Omah', icon: Home },
    { id: 'viewer', label: 'Woco', icon: BookOpen },
    { id: 'editor', label: 'Racik', icon: Edit3 },
    { id: 'riwayat', label: 'Lawas', icon: History },
    { id: 'tempo', label: 'Tempo', icon: Volume2 }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950 border-t-2 border-black z-40 shadow-[0_-4px_0px_#000000]">
      <div className="flex justify-around items-center h-16">
        {navs.map(({ id, label, icon: Icon }) => {
          const isActive = currentPage === id;

          const activeMobileColorMap = {
            beranda: 'text-rose-500 border-rose-500',
            viewer: 'text-cyan-400 border-cyan-400',
            editor: 'text-amber-400 border-amber-400',
            riwayat: 'text-blue-500 border-blue-500',
            tempo: 'text-purple-400 border-purple-400'
          };

          return (
            <button
              key={id}
              onClick={() => setCurrentPage(id)}
              className={`flex flex-col items-center justify-center w-full h-full transition-all ${
                isActive
                  ? `bg-zinc-900 ${activeMobileColorMap[id] || 'text-amber-400 border-amber-400'} border-t-2 font-bold`
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
