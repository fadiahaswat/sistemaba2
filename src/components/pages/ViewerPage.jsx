import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Edit3, Clock, Maximize2, ShieldCheck, HelpCircle, Play, Pause, RotateCcw, Timer, ArrowUp, ArrowDown, CheckCircle2, Flag, Volume2, VolumeX, AlertTriangle } from 'lucide-react';
import { usePlan, ALL_COMMANDS_FLAT } from '../../context/PlanContext';
import { MovementPerpangModal, hasPerpangDoc } from '../Modal/MovementPerpangModal';
import { playAlertSound, triggerHapticVibrate } from '../../utils/metronome';

export const ViewerPage = () => {
  const { plan, setCurrentPage } = usePlan();
  const [selectedMovementForPerpang, setSelectedMovementForPerpang] = useState(null);
  const [activeTabPostId, setActiveTabPostId] = useState(plan.posts[0]?.id || null);

  const activePost = plan.posts.find(p => p.id === activeTabPostId) || plan.posts[0];
  const postIndex = plan.posts.findIndex(p => p.id === (activePost?.id || ''));

  // Stopwatch state
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [stickyPosition, setStickyPosition] = useState('bottom'); // 'top' or 'bottom'
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [activeAlertMsg, setActiveAlertMsg] = useState(null);
  const timerRef = useRef(null);

  // Target waktu pos dalam detik (jika ada)
  const targetMinutes = parseFloat(activePost?.time) || 0;
  const targetSeconds = targetMinutes * 60;
  const remainingSeconds = targetSeconds > 0 ? targetSeconds - seconds : null;
  const isOverTime = targetSeconds > 0 && seconds > targetSeconds;
  const isNearTime = targetSeconds > 0 && !isOverTime && remainingSeconds <= 30;

  // Sound triggers tracker agar bunyi tidak terulang dua kali di detik yang sama
  const playedTriggersRef = useRef(new Set());

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  // Pantau hitungan waktu untuk memicu peringatan suara & UI
  useEffect(() => {
    if (!isRunning || targetSeconds <= 0) return;

    const remaining = targetSeconds - seconds;

    if (remaining === 60 && !playedTriggersRef.current.has(60)) {
      playedTriggersRef.current.add(60);
      setActiveAlertMsg('⚠️ WAKTU TERSISA 1 MENIT!');
      if (isAudioEnabled) playAlertSound('beep');
      setTimeout(() => setActiveAlertMsg(null), 3500);
    } else if (remaining === 30 && !playedTriggersRef.current.has(30)) {
      playedTriggersRef.current.add(30);
      setActiveAlertMsg('⚠️ WAKTU TERSISA 30 DETIK!');
      if (isAudioEnabled) playAlertSound('beep');
      setTimeout(() => setActiveAlertMsg(null), 3500);
    } else if (remaining === 15 && !playedTriggersRef.current.has(15)) {
      playedTriggersRef.current.add(15);
      setActiveAlertMsg('⚠️ WAKTU TERSISA 15 DETIK!');
      if (isAudioEnabled) playAlertSound('beep');
      setTimeout(() => setActiveAlertMsg(null), 3500);
    } else if (remaining === 3 && !playedTriggersRef.current.has(3)) {
      playedTriggersRef.current.add(3);
      setActiveAlertMsg('🚨 3 DETIK LAGI!');
      if (isAudioEnabled) playAlertSound('countdown');
    } else if (remaining === 2 && !playedTriggersRef.current.has(2)) {
      playedTriggersRef.current.add(2);
      setActiveAlertMsg('🚨 2 DETIK LAGI!');
      if (isAudioEnabled) playAlertSound('countdown');
    } else if (remaining === 1 && !playedTriggersRef.current.has(1)) {
      playedTriggersRef.current.add(1);
      setActiveAlertMsg('🚨 1 DETIK LAGI!');
      if (isAudioEnabled) playAlertSound('countdown');
    } else if (remaining === 0 && !playedTriggersRef.current.has(0)) {
      playedTriggersRef.current.add(0);
      setActiveAlertMsg('⛔ WAKTU HABIS!');
      if (isAudioEnabled) playAlertSound('timesup');
      setTimeout(() => setActiveAlertMsg(null), 4500);
    }
  }, [seconds, isRunning, targetSeconds, isAudioEnabled]);

  const toggleStopwatch = () => {
    triggerHapticVibrate(80);
    setIsRunning(!isRunning);
  };

  const startStopwatch = () => {
    triggerHapticVibrate(100);
    setIsRunning(true);
  };

  const stopStopwatch = () => {
    triggerHapticVibrate([120, 80, 120]);
    setIsRunning(false);
  };

  const resetStopwatch = () => {
    triggerHapticVibrate(50);
    setIsRunning(false);
    setSeconds(0);
    setActiveAlertMsg(null);
    playedTriggersRef.current.clear();
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className={`page-content anim-fade-in max-w-5xl mx-auto space-y-6 py-4 ${
      stickyPosition === 'top' ? 'pt-24 sm:pt-28' : 'pb-28 sm:pb-32'
    }`}>
      {/* Header Banner Mode Baca */}
      <div className="text-center py-6 space-y-3">
        <div className="inline-block">
          <span className="brutal-badge bg-cyan-400 text-black">
            <ShieldCheck className="w-3.5 h-3.5 inline mr-1" /> MODE WOCO & HAFALNO [AMAN]
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white uppercase flex items-center justify-center gap-3">
          <BookOpen className="h-8 w-8 sm:h-9 sm:w-9 text-cyan-400" />
          <span>{plan.title || 'RACIKAN ABA-ABA'}</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-300 font-mono max-w-2xl mx-auto">
          {plan.description || 'Pencet aba-aba gawe ndelok katentuan Perpang lan ketukan temponya. Aman, ora bakal keubah rek!'}
        </p>
        <div className="pt-2">
          <button
            onClick={() => setCurrentPage('editor')}
            className="btn btn-secondary px-4 py-2 text-xs inline-flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4 text-amber-400" /> Balik Nyang Racik Aba-aba
          </button>
        </div>
      </div>

      {/* STICKY TACTICAL STOPWATCH BAR (PIN ATAS ATAU BAWAH) */}
      <div className={`fixed left-0 right-0 z-40 px-3 sm:px-6 transition-all duration-300 pointer-events-none ${
        stickyPosition === 'top' ? 'top-16 sm:top-20' : 'bottom-20 md:bottom-6'
      }`}>
        <div className={`pointer-events-auto max-w-3xl mx-auto p-2.5 sm:p-3.5 border-2 border-black glass-card transition-all ${
          isOverTime 
            ? 'bg-red-950/95 border-red-500 shadow-[4px_4px_0px_#ef4444]' 
            : isRunning 
              ? 'bg-zinc-950/95 border-amber-400 shadow-[4px_4px_0px_#fbbf24]' 
              : 'bg-zinc-950/95 border-zinc-700 shadow-[4px_4px_0px_#000]'
        }`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Info Waktu & Target Pos */}
            <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
              <span className={`brutal-badge font-black text-xs ${
                isOverTime 
                  ? 'bg-red-500 text-black animate-pulse' 
                  : isRunning 
                    ? 'bg-amber-400 text-black' 
                    : 'bg-zinc-800 text-zinc-300'
              }`}>
                <Timer className={`w-3.5 h-3.5 inline mr-1 ${isRunning ? 'animate-spin' : ''}`} />
                {isOverTime ? 'LEWAT TARGET REK!' : isRunning ? 'WEKTU MLAKU' : 'STOPWATCH'}
              </span>

              {targetMinutes > 0 && (
                <span className="text-xs font-mono font-bold text-zinc-300 bg-black px-2 py-1 border border-zinc-800">
                  Target: <b className="text-amber-400">{targetMinutes}m</b>
                </span>
              )}

              {/* Toggle Posisi Sticky (Atas / Bawah) */}
              <button
                onClick={() => setStickyPosition(stickyPosition === 'top' ? 'bottom' : 'top')}
                className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-black text-[11px] font-mono flex items-center gap-1 shadow-[2px_2px_0px_#000]"
                title={stickyPosition === 'top' ? 'Pindah Nyang Ngisor' : 'Pindah Nyang Ndhuwur'}
              >
                {stickyPosition === 'top' ? (
                  <>
                    <ArrowDown className="w-3 h-3 text-amber-400" /> Ngisor
                  </>
                ) : (
                  <>
                    <ArrowUp className="w-3 h-3 text-amber-400" /> Ndhuwur
                  </>
                )}
              </button>
            </div>

            {/* Display Digit + Tombol Utama */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Box Angka Digital */}
              <div className="px-4 py-1.5 bg-black border-2 border-black shadow-[2px_2px_0px_#000] min-w-[140px] text-center">
                <span className={`text-3xl sm:text-4xl font-black font-mono tracking-widest tabular-nums select-none ${
                  isOverTime 
                    ? 'text-red-500 animate-pulse' 
                    : isNearTime 
                      ? 'text-amber-400' 
                      : isRunning 
                        ? 'text-emerald-400' 
                        : 'text-zinc-100'
                }`}>
                  {formatTime(seconds)}
                </span>
              </div>

              {/* Tombol Mulai / Jeda */}
              <button
                onClick={toggleStopwatch}
                className={`h-10 sm:h-11 px-4 border-2 border-black font-black uppercase text-xs flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#000] active:translate-y-0.5 transition-all ${
                  isRunning
                    ? 'bg-amber-400 hover:bg-amber-300 text-black'
                    : 'bg-emerald-400 hover:bg-emerald-300 text-black'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" /> MANDHEG
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" /> {seconds > 0 ? 'TERUSNO' : 'GASKE'}
                  </>
                )}
              </button>

              {/* Tombol Mute / Unmute Audio Bunyi */}
              <button
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                title={isAudioEnabled ? 'Matikan Suara Peringatan' : 'Aktifkan Suara Peringatan'}
                className={`h-10 sm:h-11 px-2.5 border-2 border-black transition-all shadow-[2px_2px_0px_#000] active:translate-y-0.5 ${
                  isAudioEnabled 
                    ? 'bg-amber-400 text-black hover:bg-amber-300' 
                    : 'bg-zinc-800 text-zinc-500 hover:text-white'
                }`}
              >
                {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Tombol Reset */}
              <button
                onClick={resetStopwatch}
                title="Reset Waktu"
                className="h-10 sm:h-11 px-3 border-2 border-black bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold uppercase text-xs flex items-center justify-center shadow-[2px_2px_0px_#000] active:translate-y-0.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* BANNER NOTIFIKASI PERINGATAN WAKTU UI (1 Menit, 30s, 15s, 3, 2, 1, WAKTU HABIS) */}
          {activeAlertMsg && (
            <div className="mt-2 pt-2 border-t-2 border-black flex items-center justify-center gap-2">
              <span className={`px-3 py-1 font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_#000] animate-bounce ${
                activeAlertMsg.includes('HABIS') 
                  ? 'bg-red-500 text-black' 
                  : activeAlertMsg.includes('DETIK LAGI') 
                    ? 'bg-rose-500 text-black' 
                    : 'bg-amber-400 text-black'
              }`}>
                {activeAlertMsg}
              </span>
            </div>
          )}
        </div>
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
                    ? 'bg-cyan-400 text-black shadow-[3px_3px_0px_#000000] -translate-y-0.5'
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
                const totalMaterials = activePost.materials.length;

                return activePost.materials.map((material, matIdx) => {
                  if (material.isNumbered) numCounter++;
                  const rowNumber = material.isNumbered ? `${numCounter}.` : '-';
                  const isFirstRow = matIdx === 0;
                  const isLastRow = matIdx === totalMaterials - 1;

                  return (
                    <div
                      key={material.id}
                      className="p-3.5 sm:p-4 bg-zinc-900 border-2 border-black shadow-[3px_3px_0px_#000000] flex flex-col gap-2 hover:border-zinc-500 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-grow">
                          <div className="w-8 h-8 border-2 border-black bg-zinc-950 flex items-center justify-center text-xs font-mono font-black text-cyan-400 shrink-0 shadow-[2px_2px_0px_#000]">
                            {rowNumber}
                          </div>

                          <div className="flex-grow flex flex-wrap items-center gap-2">
                            {material.commanderExecutes && (
                              <span className="brutal-badge bg-rose-500 text-black">
                                DANPAS IKUT
                              </span>
                            )}

                            {/* Badge Penanda dari Editor */}
                            {material.timerMarker === 'start' && (
                              <span className="brutal-badge bg-emerald-400 text-black font-black flex items-center gap-1">
                                <Play className="w-3 h-3 fill-current" /> PENANDA MULAI WAKTU
                              </span>
                            )}
                            {material.timerMarker === 'stop' && (
                              <span className="brutal-badge bg-red-500 text-black font-black flex items-center gap-1">
                                <Flag className="w-3 h-3 text-black" /> PENANDA SELESAI WAKTU
                              </span>
                            )}

                            {material.movements && material.movements.length > 0 ? (
                              material.movements.map((mov, movIdx) => {
                                const cmd = ALL_COMMANDS_FLAT.find(c => c.id === mov.id) || { id: mov.id, text: mov.id };
                                const countDisplay = mov.count ? `${mov.count} ` : '';
                                const isAvailableInPerpang = hasPerpangDoc(cmd.id, cmd.text);
                                const isStartMarker = mov.timerMarker === 'start';
                                const isStopMarker = mov.timerMarker === 'stop';

                                return (
                                  <div
                                    key={movIdx}
                                    className={`inline-flex items-center border-2 border-black transition-all ${
                                      isStartMarker
                                        ? 'bg-emerald-950/80 border-emerald-400 shadow-[3px_3px_0px_#34d399]'
                                        : isStopMarker
                                          ? 'bg-red-950/80 border-red-500 shadow-[3px_3px_0px_#ef4444]'
                                          : 'bg-zinc-900 shadow-[2px_2px_0px_#000]'
                                    }`}
                                  >
                                    {/* Tombol Khusus Penanda Waktu pada Gerakan (Jika Disetel) */}
                                    {isStartMarker && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          startStopwatch();
                                        }}
                                        title="Gerakan Penanda Mulai Waktu! Klik untuk nyalakan Stopwatch"
                                        className={`px-2 py-1 text-[10px] font-black uppercase flex items-center gap-1 border-r-2 border-black transition-colors ${
                                          isRunning
                                            ? 'bg-emerald-500 text-black'
                                            : 'bg-emerald-400 hover:bg-emerald-300 text-black animate-pulse'
                                        }`}
                                      >
                                        <Play className="w-2.5 h-2.5 fill-current" />
                                        <span>MULAI</span>
                                      </button>
                                    )}

                                    {isStopMarker && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          stopStopwatch();
                                        }}
                                        title="Gerakan Penanda Selesai Waktu! Klik untuk hentikan Stopwatch"
                                        className={`px-2 py-1 text-[10px] font-black uppercase flex items-center gap-1 border-r-2 border-black transition-colors ${
                                          isRunning
                                            ? 'bg-red-500 hover:bg-red-400 text-black animate-pulse'
                                            : 'bg-zinc-800 text-red-400'
                                        }`}
                                      >
                                        <Flag className="w-2.5 h-2.5 text-black" />
                                        <span>SELESAI</span>
                                      </button>
                                    )}

                                    {/* Isi Teks Gerakan (Perpang clickable / Plain) */}
                                    {isAvailableInPerpang ? (
                                      <button
                                        onClick={() => setSelectedMovementForPerpang({ id: cmd.id, text: cmd.text })}
                                        className="px-2.5 py-1.5 text-xs sm:text-sm font-bold text-white hover:bg-amber-400 hover:text-black transition-colors flex items-center gap-1.5 text-left"
                                        title="Buka Ketentuan Perpang"
                                      >
                                        <span>
                                          {countDisplay}{cmd.text}
                                        </span>
                                        <BookOpen className="w-3.5 h-3.5 text-zinc-400 group-hover:text-black shrink-0" />
                                      </button>
                                    ) : (
                                      <span className="px-2.5 py-1.5 text-xs sm:text-sm font-bold text-zinc-300 text-left select-none">
                                        {countDisplay}{cmd.text}
                                      </span>
                                    )}
                                  </div>
                                );
                              })
                            ) : (
                              <span className="text-xs font-mono text-zinc-500 italic">
                                (Baris materi kosong)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* TOMBOL AKSI HANYA MUNCUL DI BARIS MULAI ATAU BARIS SELESAI (JIKA DITANDAI DI BARIS) */}
                        <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-center">
                          {/* Hanya jika baris ini ditandai START dan timer belum jalan */}
                          {!isRunning && material.timerMarker === 'start' && (
                            <button
                              onClick={startStopwatch}
                              title="Mulai stopwatch dari materi ini"
                              className="px-3 py-1.5 border-2 border-black text-xs font-black uppercase flex items-center gap-1 shadow-[2px_2px_0px_#000] active:translate-y-0.5 transition-all bg-emerald-400 hover:bg-emerald-300 text-black animate-pulse"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>MULAI DI SINI</span>
                            </button>
                          )}

                          {/* Hanya jika baris ini ditandai STOP dan timer sedang jalan */}
                          {isRunning && material.timerMarker === 'stop' && (
                            <button
                              onClick={stopStopwatch}
                              title="Selesaikan stopwatch di materi ini"
                              className="px-3 py-1.5 border-2 border-black text-xs font-black uppercase flex items-center gap-1 shadow-[2px_2px_0px_#000] active:translate-y-0.5 transition-all bg-red-500 hover:bg-red-400 text-black animate-pulse"
                            >
                              <Flag className="w-3.5 h-3.5 text-black" />
                              <span>SELESAI DI SINI</span>
                            </button>
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
