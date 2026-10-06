import React, { useState } from 'react';
import { Lock } from 'lucide-react';

export const PasswordModal = ({ onVerify }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const correctPassword = 'sparman68';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      sessionStorage.setItem('isVerified', 'true');
      onVerify();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-backdrop">
      <div className="glass-card max-w-sm w-full p-8 text-center anim-pop-in theme-beranda border-2 border-black shadow-[8px_8px_0px_#000000]">
        <div className="w-16 h-16 mx-auto text-black border-2 border-black flex items-center justify-center text-4xl mb-6 shadow-[3px_3px_0px_#000000]" style={{ backgroundColor: 'var(--theme-color-focus)' }}>
          <Lock className="w-8 h-8" />
        </div>
        <span className="brutal-badge bg-rose-500 text-black mb-2">SECURITY CLEARANCE</span>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-1">Akses Terbatas</h2>
        <p className="text-zinc-400 text-xs mb-6 font-mono">Masukkan kode otentikasi komando untuk melanjutkan.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            className="form-input w-full p-3 text-center border-2 border-black font-mono tracking-widest text-lg text-white"
            placeholder="KATA SANDI"
            required
            autoFocus
          />
          <button type="submit" className="btn btn-primary w-full py-3 font-black text-sm uppercase">
            Buka Sistem Aba-aba
          </button>
        </form>
        {error && (
          <div className="mt-4 p-2 bg-red-950 border-2 border-red-500 text-red-200 text-xs font-mono">
            SANDI SALAH! Coba lagi atau{' '}
            <a href="https://www.instagram.com/tontimuallimin/" target="_blank" rel="noreferrer" className="font-bold underline hover:text-white">
              kontak admin
            </a>.
          </div>
        )}
      </div>
    </div>
  );
};
