import React, { useState } from 'react';
import { BookOpen, Edit3, Clock, Maximize2, ShieldCheck, HelpCircle } from 'lucide-react';
import { usePlan, ALL_COMMANDS_FLAT } from '../../context/PlanContext';
import { MovementPerpangModal, hasPerpangDoc } from '../Modal/MovementPerpangModal';

export const ViewerPage = () => {
  const { plan, setCurrentPage } = usePlan();
  const [selectedMovementForPerpang, setSelectedMovementForPerpang] = useState(null);
  const [activeTabPostId, setActiveTabPostId] = useState(plan.posts[0]?.id || null);

  const activePost = plan.posts.find(p => p.id === activeTabPostId) || plan.posts[0];
  const postIndex = plan.posts.findIndex(p => p.id === (activePost?.id || ''));

  return (
    <div className="page-content anim-fade-in max-w-5xl mx-auto space-y-6 py-4">
      {/* Header Banner Mode Baca */}
      <div className="glass-card p-4 sm:p-6 border-2 border-black bg-zinc-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="brutal-badge bg-emerald-400 text-black">
              <ShieldCheck className="w-3.5 h-3.5" /> MODE BACA & HAFALAN [AMAN]
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            {plan.title || 'Rencana Latihan Aba-aba'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 font-medium">
            {plan.description || 'Klik aba-aba untuk melihat ketentuan resmi Perpang dan ketukan metronomnya tanpa resiko teredit.'}
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('editor')}
          className="btn btn-secondary px-4 py-2.5 text-xs flex items-center gap-2"
        >
          <Edit3 className="w-4 h-4 text-amber-400" /> Beralih ke Mode Editor
        </button>
      </div>

      {/* Navigasi Tab Pos */}
      {plan.posts.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {plan.posts.map((post, idx) => {
            const isActive = post.id === (activePost?.id || '');
            return (
              <button
                key={post.id}
                onClick={() => setActiveTabPostId(post.id)}
                className={`px-4 py-2 text-xs font-black uppercase whitespace-nowrap transition-transform border-2 border-black ${
                  isActive
                    ? 'bg-amber-400 text-black shadow-[3px_3px_0px_#000000] -translate-y-0.5'
                    : 'bg-zinc-900 text-zinc-300 hover:text-white shadow-[2px_2px_0px_#000000]'
                }`}
              >
                {post.name || `Pos ${idx + 1}`} ({post.materials?.length || 0} Materi)
              </button>
            );
          })}
        </div>
      )}

      {/* Konten Pos Aktif */}
      {activePost ? (
        <div className="glass-card p-5 sm:p-7 space-y-5">
          {/* Header Pos: Ukuran & Waktu */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-black gap-3">
            <div>
              <h2 className="text-xl font-black uppercase text-white flex items-center gap-2 tracking-wide">
                <span>{activePost.name || `Pos ${postIndex + 1}`}</span>
              </h2>
              <p className="text-xs font-mono text-zinc-400 uppercase">
                {plan.location ? `LOKASI: ${plan.location}` : 'AREA LAPANGAN'}
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-zinc-300">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-black border-2 border-black shadow-[2px_2px_0px_#000]">
                <Maximize2 className="w-3.5 h-3.5 text-zinc-400" />
                <span className="font-mono">
                  Ukuran: <b className="text-amber-400">{[activePost.size_p, activePost.size_l, activePost.turn_width].filter(Boolean).join(' x ') || '-'} Meter</b>
                </span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-black border-2 border-black shadow-[2px_2px_0px_#000]">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span className="font-mono">
                  Waktu: <b className="text-amber-400">{activePost.time || '-'}</b> Menit
                </span>
              </span>
            </div>
          </div>

          {/* Daftar Baris Materi */}
          <div className="space-y-3">
            {activePost.materials && activePost.materials.length > 0 ? (
              (() => {
                let numCounter = 0;
                return activePost.materials.map((material) => {
                  if (material.isNumbered) numCounter++;
                  const rowNumber = material.isNumbered ? `${numCounter}.` : '-';

                  return (
                    <div
                      key={material.id}
                      className="p-3.5 sm:p-4 bg-zinc-900 border-2 border-black shadow-[3px_3px_0px_#000000] flex flex-col gap-2"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 border-2 border-black bg-zinc-950 flex items-center justify-center text-xs font-mono font-black text-amber-400 shrink-0 shadow-[2px_2px_0px_#000]">
                          {rowNumber}
                        </div>

                        <div className="flex-grow flex flex-wrap items-center gap-2">
                          {material.commanderExecutes && (
                            <span className="brutal-badge bg-rose-500 text-black">
                              DANPAS IKUT
                            </span>
                          )}

                          {material.movements && material.movements.length > 0 ? (
                            material.movements.map((mov, movIdx) => {
                              const cmd = ALL_COMMANDS_FLAT.find(c => c.id === mov.id) || { id: mov.id, text: mov.id };
                              const countDisplay = mov.count ? `${mov.count} ` : '';
                              const isAvailableInPerpang = hasPerpangDoc(cmd.id, cmd.text);

                              if (isAvailableInPerpang) {
                                return (
                                  <button
                                    key={movIdx}
                                    onClick={() => setSelectedMovementForPerpang({ id: cmd.id, text: cmd.text })}
                                    className="group/chip inline-flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-bold bg-zinc-800 text-white border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-amber-400 hover:text-black hover:-translate-y-0.5 active:translate-y-0.5 transition-all text-left"
                                    title="Buka Ketentuan Perpang"
                                  >
                                    <span>
                                      {countDisplay}{cmd.text}
                                    </span>
                                    <BookOpen className="w-3.5 h-3.5 text-zinc-400 group-hover/chip:text-black shrink-0" />
                                  </button>
                                );
                              }

                              return (
                                <span
                                  key={movIdx}
                                  className="inline-flex items-center px-3 py-1.5 text-xs sm:text-sm font-bold bg-zinc-900 text-zinc-300 border-2 border-black shadow-[2px_2px_0px_#000] text-left select-none"
                                >
                                  <span>
                                    {countDisplay}{cmd.text}
                                  </span>
                                </span>
                              );
                            })
                          ) : (
                            <span className="text-xs font-mono text-zinc-500 italic">
                              (Baris materi kosong)
                            </span>
                          )}
                        </div>
                      </div>

                      {material.note && (
                        <div className="pl-11 text-xs text-amber-300 font-mono flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>CATATAN: {material.note}</span>
                        </div>
                      )}
                    </div>
                  );
                });
              })()
            ) : (
              <div className="text-center py-10 text-zinc-500 text-sm font-mono">
                Belum ada materi aba-aba di pos ini.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-zinc-500">
          Belum ada pos yang dibuat.
        </div>
      )}

      {/* Modal Perpang + Metronom */}
      <MovementPerpangModal
        isOpen={!!selectedMovementForPerpang}
        movementId={selectedMovementForPerpang?.id}
        movementText={selectedMovementForPerpang?.text || selectedMovementForPerpang}
        onClose={() => setSelectedMovementForPerpang(null)}
        onOpenFullPdf={() => setCurrentPage('visualisasi')}
      />
    </div>
  );
};
