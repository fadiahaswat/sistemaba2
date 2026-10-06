import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { usePlan } from '../context/PlanContext';

export const Header = () => {
  const { currentPage, setCurrentPage } = usePlan();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };

  const navItems = [
    { id: 'beranda', label: 'Omah' },
    { id: 'viewer', label: 'Woco & Hafalno' },
    { id: 'editor', label: 'Racik Aba-aba' },
    { id: 'riwayat', label: 'Sajian Lawas' },
    { id: 'tempo', label: 'Ketukan Tempo' },
    { id: 'visualisasi', label: 'Pangan Perpang' }
  ];

  return (
    <header className="bg-zinc-950 border-b-2 border-black sticky top-0 z-30 shadow-[0_4px_0px_#000000]">
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentPage('beranda')} className="hidden md:flex items-center gap-3 focus:outline-none group text-left">
            <img src="./logo-tonti-muallimin.png" alt="Logo Tonti Mu'allimin" className="w-10 h-10 object-contain drop-shadow" />
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight uppercase group-hover:text-theme-focus transition-colors">mangan perpunk!</h1>
              <span className="text-[10px] font-mono tracking-wider text-amber-400 block -mt-1 font-bold">BEN DADI SI PALING PERPUNK!</span>
            </div>
          </button>
          <div className="flex items-center gap-2 md:hidden">
            <img src="./logo-tonti-muallimin.png" alt="Logo" className="w-8 h-8 object-contain drop-shadow" />
            <h2 className="text-base font-black text-white uppercase tracking-wider">
              {currentPage === 'visualisasi' ? 'Pangan Perpang' : currentPage === 'viewer' ? 'Woco & Hafalno' : currentPage === 'editor' ? 'Racik Aba-aba' : currentPage === 'riwayat' ? 'Sajian Lawas' : currentPage === 'tempo' ? 'Ketukan Tempo' : 'Omah'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isInstallable && (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_#000] -translate-y-0.5 transition-all"
              title="Pasang aplikasi di perangkat"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
          )}

          <nav className="hidden md:flex items-center gap-2 text-xs font-black uppercase tracking-wider">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;

              // Warna unik khas untuk tiap halaman saat aktif
              const activeColorMap = {
                beranda: 'bg-rose-500 text-white shadow-[2px_2px_0px_#000]',
                viewer: 'bg-cyan-400 text-black shadow-[2px_2px_0px_#000]',
                editor: 'bg-amber-400 text-black shadow-[2px_2px_0px_#000]',
                riwayat: 'bg-blue-500 text-black shadow-[2px_2px_0px_#000]',
                tempo: 'bg-purple-400 text-black shadow-[2px_2px_0px_#000]',
                visualisasi: 'bg-emerald-400 text-black shadow-[2px_2px_0px_#000]'
              };

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`px-3.5 py-1.5 border-2 border-black transition-transform ${
                    isActive
                      ? `${activeColorMap[item.id] || 'bg-amber-400 text-black'} font-extrabold -translate-y-0.5`
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
