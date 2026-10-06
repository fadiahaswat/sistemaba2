import React from 'react';
import { usePlan } from '../context/PlanContext';

export const Toast = () => {
  const { toastMessage } = usePlan();
  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 right-6 z-50 bg-zinc-900 text-white px-5 py-3 border-2 border-black shadow-[4px_4px_0px_#000000] anim-pop-in flex items-center gap-3 font-mono text-xs">
      <div className="w-3 h-3 border border-black" style={{ backgroundColor: 'var(--theme-color-focus)' }}></div>
      <span className="font-bold uppercase tracking-wider">{toastMessage}</span>
    </div>
  );
};
