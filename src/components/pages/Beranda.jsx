import React from 'react';
import { Edit3, BookOpen, FileText, Clock, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { usePlan } from '../../context/PlanContext';

export const Beranda = () => {
  const { setCurrentPage, history, loadPlan } = usePlan();

  return (
    <div className="page-content anim-fade-in space-y-12">
      <section className="text-center py-8 md:py-12 flex flex-col items-center">
        <div className="relative mb-5 group cursor-default">
          <img
            src="./manganperpunk.svg"
            alt="Mangan Perpunk Mascot"
            className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mx-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="mb-4">
          <span className="brutal-badge bg-yellow-400 text-black text-xs md:text-sm px-3.5 py-1">
            TONTI MU'ALLIMIN // PANGANEN PERPUNKMU!
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white uppercase max-w-4xl leading-tight">
          OJO LALI <span className="text-theme-focus underline decoration-4 decoration-black">MANGAN PERPUNK</span> REK!
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-base md:text-lg text-zinc-300 font-medium">
          Kudu siap sakdurunge mudhun lapangan, rek! Racik urutan aba-aba, pangan aturan Perpang nganti khatam, ben ora grogi lan presisi pol!
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto text-left">
          <button
            onClick={() => setCurrentPage('editor')}
            className="glass-card p-5 text-left theme-editor-cta relative group hover:-translate-y-1 transition-transform border-2 border-black shadow-[4px_4px_0px_#000]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-amber-400 text-black border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center font-black shrink-0">
                <Edit3 className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider">WORKSPACE</span>
                <h3 className="text-lg font-black text-white uppercase leading-tight">Racik Aba-aba</h3>
                <p className="text-xs text-zinc-300 mt-0.5">Tata pos, materi & formasi lapangan.</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setCurrentPage('viewer')}
            className="glass-card p-5 text-left relative group hover:-translate-y-1 transition-transform border-2 border-black shadow-[4px_4px_0px_#000]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-cyan-400 text-black border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center font-black shrink-0">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 tracking-wider">HAFALAN</span>
                <h3 className="text-lg font-black text-white uppercase leading-tight">Woco & Hafalno</h3>
                <p className="text-xs text-zinc-300 mt-0.5">Latihan ngapalke aba-aba saben pos.</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setCurrentPage('visualisasi')}
            className="glass-card p-5 text-left theme-visualisasi-cta relative group hover:-translate-y-1 transition-transform border-2 border-black shadow-[4px_4px_0px_#000]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-emerald-400 text-black border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center font-black shrink-0">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 tracking-wider">REGULASI</span>
                <h3 className="text-lg font-black text-white uppercase leading-tight">Pangan Perpang</h3>
                <p className="text-xs text-zinc-300 mt-0.5">Buka dokumen asli PBB & PPM TNI.</p>
              </div>
            </div>
          </button>
        </div>
      </section>

      {history.length > 0 && (
        <section className="py-6 border-t-2 border-black max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-theme-focus border border-black inline-block"></span>
              <h2 className="text-xl font-black uppercase tracking-wider text-white">Sajian Terakhir</h2>
            </div>
            <button
              onClick={() => setCurrentPage('riwayat')}
              className="btn btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5"
            >
              Delok Kabeh ({history.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {history.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => loadPlan(item)}
                className="glass-card p-5 cursor-pointer hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-extrabold text-base text-white uppercase tracking-tight line-clamp-1">{item.title || 'Tanpa Judul'}</h3>
                    <span className="brutal-badge bg-zinc-800 text-zinc-300">{item.posts?.length || 0} POS</span>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-2 mb-4 font-mono">{item.description || 'Tidak ada deskripsi.'}</p>
                </div>
                <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-3 border-t-2 border-black pt-3">
                  <span className="flex items-center gap-1 font-bold text-zinc-300"><Calendar className="w-3.5 h-3.5" /> {item.date || '-'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
