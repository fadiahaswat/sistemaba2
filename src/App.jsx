import React, { useState, useEffect } from 'react';
import { PlanProvider, usePlan } from './context/PlanContext';
import { PasswordModal } from './components/PasswordModal';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';
import { Beranda } from './components/pages/Beranda';
import { EditorPage } from './components/pages/Editor/EditorPage';
import { Riwayat } from './components/pages/Riwayat';
import { Tempo } from './components/pages/Tempo';
import { BacaPerpang } from './components/pages/BacaPerpang';
import { ViewerPage } from './components/pages/ViewerPage';

const MainLayout = () => {
  const { currentPage } = usePlan();

  const getThemeClass = () => {
    switch (currentPage) {
      case 'beranda': return 'theme-beranda';
      case 'viewer': return 'theme-editor';
      case 'editor': return 'theme-editor';
      case 'riwayat': return 'theme-riwayat';
      case 'tempo': return 'theme-tempo';
      case 'visualisasi': return 'theme-visualisasi';
      default: return 'theme-beranda';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col relative ${getThemeClass()}`}>
      <Header />
      <main className="container mx-auto p-4 md:px-8 flex-grow pb-24 md:pb-12">
        {currentPage === 'beranda' && <Beranda />}
        {currentPage === 'viewer' && <ViewerPage />}
        {currentPage === 'editor' && <EditorPage />}
        {currentPage === 'riwayat' && <Riwayat />}
        {currentPage === 'tempo' && <Tempo />}
        {currentPage === 'visualisasi' && <BacaPerpang />}
      </main>

      <footer className="bg-zinc-950 border-t-2 border-black mt-auto p-4 text-xs text-zinc-400 font-mono">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="font-semibold">&copy; 2025 MANGAN PERPUNK! - 1nspektur Tonti Mu'allimin</p>
          <div className="flex items-center gap-4 font-bold uppercase">
            <a href="https://wa.me/6285339213109" target="_blank" rel="noreferrer" className="text-zinc-300 hover:text-green-400 hover:underline">
              WhatsApp
            </a>
            <a href="https://www.instagram.com/tontimuallimin/" target="_blank" rel="noreferrer" className="text-zinc-300 hover:text-pink-400 hover:underline">
              Instagram
            </a>
            <a href="https://www.tiktok.com/@tontimuallimin" target="_blank" rel="noreferrer" className="text-zinc-300 hover:text-cyan-400 hover:underline">
              TikTok
            </a>
          </div>
        </div>
      </footer>

      <BottomNav />
      <Toast />
    </div>
  );
};

export default function App() {
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verified = sessionStorage.getItem('isVerified') === 'true';
    if (verified) {
      setIsVerified(true);
    }
  }, []);

  return (
    <>
      {!isVerified && <PasswordModal onVerify={() => setIsVerified(true)} />}
      {isVerified && (
        <PlanProvider>
          <MainLayout />
        </PlanProvider>
      )}
    </>
  );
}
