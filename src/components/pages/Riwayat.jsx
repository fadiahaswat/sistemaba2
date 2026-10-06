import React from 'react';
import { History, Trash2, Calendar, MapPin, ExternalLink, ArrowRight } from 'lucide-react';
import { usePlan } from '../../context/PlanContext';

export const Riwayat = () => {
  const { history, loadPlan, deleteHistoryItem, setCurrentPage } = usePlan();

  return (
    <div className="page-content anim-fade-in max-w-5xl mx-auto space-y-6 py-6">
      <div className="text-center">
        <div className="inline-block mb-2">
          <span className="brutal-badge bg-blue-500 text-black">MISSION LOGS // SAVED SCENARIOS</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white uppercase flex items-center justify-center gap-3">
          <History className="h-9 w-9 text-blue-400" /> RIWAYAT ABA-ABA
        </h1>
        <p className="mt-2 text-zinc-300 text-sm font-mono">
          Daftar berkas skenario yang telah disimpan di perangkat ini.
        </p>
      </div>

      {history.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-4 max-w-lg mx-auto border-2 border-black shadow-[6px_6px_0px_#000]">
          <p className="text-zinc-400 text-sm font-mono">Belum ada riwayat rencana yang tersimpan.</p>
          <button
            onClick={() => setCurrentPage('editor')}
            className="btn btn-primary px-5 py-2.5 text-xs font-black inline-flex items-center gap-2"
          >
            Mulai Buat Rencana Baru <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {history.map((item) => (
            <div
              key={item.id}
              className="glass-card p-5 border-2 border-black flex flex-col justify-between shadow-[4px_4px_0px_#000000] hover:-translate-y-1 transition-transform"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="text-base font-black text-white uppercase tracking-tight">{item.title || 'Tanpa Judul'}</h3>
                  <button
                    onClick={() => deleteHistoryItem(item.id)}
                    className="p-1.5 border-2 border-black bg-zinc-900 text-zinc-400 hover:bg-red-500 hover:text-black shadow-[2px_2px_0px_#000] transition-colors"
                    title="Hapus dari riwayat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-zinc-400 mb-4 font-mono">{item.description || 'Tidak ada deskripsi.'}</p>
                <div className="flex flex-wrap gap-4 text-xs font-mono text-zinc-400 mb-4">
                  <span className="flex items-center gap-1 font-bold text-zinc-300"><Calendar className="w-3.5 h-3.5" /> {item.date || '-'}</span>
                  {item.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {item.location}</span>}
                  <span className="brutal-badge bg-zinc-800 text-blue-300">{item.posts?.length || 0} POS</span>
                </div>
              </div>

              <div className="pt-3 border-t-2 border-black flex justify-end">
                <button
                  onClick={() => loadPlan(item)}
                  className="btn btn-primary text-xs py-2 px-4 font-black flex items-center gap-1.5"
                >
                  Buka di Editor <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
