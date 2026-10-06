import React, { useState, useEffect } from 'react';
import { X, BookOpen, ExternalLink, Volume2, Square, Play } from 'lucide-react';
import { PERPANG_VERBATIM } from '../../data/perpangVerbatim';
import { startMetronome, stopMetronome } from '../../utils/metronome';

export const getPerpangDoc = (movementId, movementText) => {
  // 1. Prioritas paling akurat: lookup by direct ID
  let doc = movementId && PERPANG_VERBATIM[movementId] ? PERPANG_VERBATIM[movementId] : null;

  // 2. Jika tidak ada ID atau belum match, fallback ke string matching berurutan dari yang paling spesifik
  if (!doc && movementText) {
    const normalized = movementText.toLowerCase();
    let matchedKey = null;

    if (normalized.includes('balik kanan') && normalized.includes('lari maju')) matchedKey = 'balik_kanan_lari_maju_jalan';
    else if (normalized.includes('balik kanan') && (normalized.includes('lari henti') || normalized.includes('lari') && normalized.includes('henti'))) matchedKey = 'balik_kanan_lari_henti_gerak';
    else if (normalized.includes('hadap kanan') && normalized.includes('lari maju')) matchedKey = 'hadap_kanan_lari_maju_jalan';
    else if (normalized.includes('hadap kiri') && normalized.includes('lari maju')) matchedKey = 'hadap_kiri_lari_maju_jalan';
    else if (normalized.includes('hadap serong kanan') && normalized.includes('lari maju')) matchedKey = 'hadap_serong_kanan_lari_maju_jalan';
    else if (normalized.includes('hadap serong kiri') && normalized.includes('lari maju')) matchedKey = 'hadap_serong_kiri_lari_maju_jalan';
    else if (normalized.includes('hadap kanan') && (normalized.includes('lari henti') || normalized.includes('lari') && normalized.includes('henti'))) matchedKey = 'hadap_kanan_lari_henti_gerak';
    else if (normalized.includes('hadap kiri') && (normalized.includes('lari henti') || normalized.includes('lari') && normalized.includes('henti'))) matchedKey = 'hadap_kiri_lari_henti_gerak';
    else if (normalized.includes('hadap serong kanan') && (normalized.includes('lari henti') || normalized.includes('lari') && normalized.includes('henti'))) matchedKey = 'hadap_serong_kanan_lari_henti_gerak';
    else if (normalized.includes('hadap serong kiri') && (normalized.includes('lari henti') || normalized.includes('lari') && normalized.includes('henti'))) matchedKey = 'hadap_serong_kiri_lari_henti_gerak';
    else if (normalized.includes('lencang depan')) matchedKey = 'lencang_depan_gerak';
    else if (normalized.includes('setengah lengan lencang kanan')) matchedKey = 'setengah_lengan_lencang_kanan_gerak';
    else if (normalized.includes('setengah lengan lencang kiri')) matchedKey = 'setengah_lengan_lencang_kanan_gerak';
    else if (normalized.includes('lencang kanan')) matchedKey = 'lencang_kanan_gerak';
    else if (normalized.includes('lencang kiri')) matchedKey = 'lencang_kiri_gerak';
    else if (normalized.includes('parade') && normalized.includes('periksa kerapian')) matchedKey = 'parade_periksa_kerapian_mulai';
    else if (normalized.includes('periksa kerapian') && normalized.includes('selesai')) matchedKey = 'periksa_kerapian_selesai';
    else if (normalized.includes('periksa kerapian')) matchedKey = 'periksa_kerapian_mulai';
    else if (normalized.includes('hormat kanan')) matchedKey = 'hormat_kanan_gerak';
    else if (normalized.includes('hormat kiri')) matchedKey = 'hormat_kiri_gerak';
    else if (normalized.includes('hormat') && !normalized.includes('dewan juri')) matchedKey = 'hormat_gerak';
    else if (normalized.includes('parade') && normalized.includes('siap')) matchedKey = 'parade_siap_gerak';
    else if (normalized.includes('duduk siap')) matchedKey = 'duduk_siap_gerak';
    else if (normalized.includes('siap')) matchedKey = 'siap_gerak';
    else if (normalized.includes('parade') && normalized.includes('istirahat')) matchedKey = 'parade_istirahat_ditempat_gerak';
    else if (normalized.includes('istirahat')) matchedKey = 'istirahat_ditempat_gerak';
    else if (normalized.includes('tegak')) matchedKey = 'tegak_gerak';
    else if (normalized.includes('hitung')) matchedKey = 'hitung_mulai';
    else if (normalized.includes('buka barisan')) matchedKey = 'buka_barisan_jalan';
    else if (normalized.includes('tutup barisan')) matchedKey = 'tutup_barisan_jalan';
    else if (normalized.includes('berhimpun')) matchedKey = 'berhimpun_mulai';
    else if (normalized.includes('bersaf kumpul')) matchedKey = 'bersaf_kumpul_mulai';
    else if (normalized.includes('berbanjar kumpul')) matchedKey = 'berbanjar_kumpul_mulai';
    else if (normalized.includes('penjuru')) matchedKey = 'custom_penjuru';
    else if (normalized.includes('haluan kanan maju')) matchedKey = 'haluan_kanan_maju_jalan';
    else if (normalized.includes('haluan kiri maju')) matchedKey = 'haluan_kiri_maju_jalan';
    else if (normalized.includes('haluan kanan')) matchedKey = 'haluan_kanan_jalan';
    else if (normalized.includes('haluan kiri')) matchedKey = 'haluan_kiri_jalan';
    else if (normalized.includes('melintang kanan maju')) matchedKey = 'melintang_kanan_maju_jalan';
    else if (normalized.includes('melintang kiri maju')) matchedKey = 'melintang_kiri_maju_jalan';
    else if (normalized.includes('melintang kanan')) matchedKey = 'melintang_kanan_jalan';
    else if (normalized.includes('melintang kiri')) matchedKey = 'melintang_kiri_jalan';
    else if (normalized.includes('ganti langkah')) matchedKey = 'ganti_langkah_jalan';
    else if (normalized.includes('langkah merdeka')) matchedKey = 'langkah_merdeka_jalan';
    else if (normalized.includes('langkah perlahan maju')) matchedKey = 'langkah_perlahan_maju_jalan';
    else if (normalized.includes('langkah perlahan')) matchedKey = 'langkah_perlahan_jalan';
    else if (normalized.includes('langkah biasa')) matchedKey = 'langkah_biasa_jalan';
    else if (normalized.includes('langkah tegap maju')) matchedKey = 'langkah_tegap_maju_jalan';
    else if (normalized.includes('langkah tegap')) matchedKey = 'langkah_tegap_jalan';
    else if (normalized.includes('jalan di tempat') && normalized.includes('balik kanan')) matchedKey = 'balik_kanan_jdt_gerak';
    else if (normalized.includes('jalan di tempat') && normalized.includes('hadap serong kanan')) matchedKey = 'hadap_serong_kanan_jdt_gerak';
    else if (normalized.includes('jalan di tempat') && normalized.includes('hadap serong kiri')) matchedKey = 'hadap_serong_kiri_jdt_gerak';
    else if (normalized.includes('jalan di tempat') && normalized.includes('hadap kanan')) matchedKey = 'hadap_kanan_jdt_gerak';
    else if (normalized.includes('jalan di tempat') && normalized.includes('hadap kiri')) matchedKey = 'hadap_kiri_jdt_gerak';
    else if (normalized.includes('jalan di tempat')) matchedKey = 'jalan_ditempat_gerak';
    else if (normalized.includes('tiap-tiap banjar') && (normalized.includes('belok kanan') || normalized.includes('2x belok kanan'))) matchedKey = 'tiap_tiap_banjar_2x_belok_kanan_jalan';
    else if (normalized.includes('tiap-tiap banjar') && (normalized.includes('belok kiri') || normalized.includes('2x belok kiri'))) matchedKey = 'tiap_tiap_banjar_2x_belok_kiri_jalan';
    else if (normalized.includes('dua kali belok kanan') || normalized.includes('2x belok kanan')) matchedKey = 'dua_kali_belok_kanan_jalan';
    else if (normalized.includes('dua kali belok kiri') || normalized.includes('2x belok kiri')) matchedKey = 'dua_kali_belok_kiri_jalan';
    else if (normalized.includes('belok kanan')) matchedKey = 'belok_kanan_jalan';
    else if (normalized.includes('belok kiri')) matchedKey = 'belok_kiri_jalan';
    else if (normalized.includes('hadap serong kanan') && normalized.includes('maju')) matchedKey = 'hadap_serong_kanan_maju_jalan';
    else if (normalized.includes('hadap serong kiri') && normalized.includes('maju')) matchedKey = 'hadap_serong_kiri_maju_jalan';
    else if (normalized.includes('hadap serong kanan') && normalized.includes('henti')) matchedKey = 'hadap_serong_kanan_henti_gerak';
    else if (normalized.includes('hadap serong kiri') && normalized.includes('henti')) matchedKey = 'hadap_serong_kiri_henti_gerak';
    else if (normalized.includes('hadap serong kanan')) matchedKey = 'hadap_serong_kanan_gerak';
    else if (normalized.includes('hadap serong kiri')) matchedKey = 'hadap_serong_kiri_gerak';
    else if (normalized.includes('hadap kanan') && normalized.includes('maju')) matchedKey = 'hadap_kanan_maju_jalan';
    else if (normalized.includes('hadap kiri') && normalized.includes('maju')) matchedKey = 'hadap_kiri_maju_jalan';
    else if (normalized.includes('hadap kanan') && normalized.includes('henti')) matchedKey = 'hadap_kanan_henti_gerak';
    else if (normalized.includes('hadap kiri') && normalized.includes('henti')) matchedKey = 'hadap_kiri_henti_gerak';
    else if (normalized.includes('hadap kanan')) matchedKey = 'hadap_kanan_gerak';
    else if (normalized.includes('hadap kiri')) matchedKey = 'hadap_kiri_gerak';
    else if (normalized.includes('balik kanan') && normalized.includes('maju')) matchedKey = 'balik_kanan_maju_jalan';
    else if (normalized.includes('balik kanan') && normalized.includes('henti')) matchedKey = 'balik_kanan_henti_gerak';
    else if (normalized.includes('balik kanan')) matchedKey = 'balik_kanan_gerak';
    else if (normalized.includes('lari maju')) matchedKey = 'lari_maju_jalan';
    else if (normalized.includes('lari')) matchedKey = 'lari_jalan';
    else if (normalized.includes('bubar')) matchedKey = 'bubar_jalan';
    else if (normalized.includes('maju')) matchedKey = 'maju_jalan';
    else if (normalized.includes('henti')) matchedKey = 'henti_gerak_berjalan';

    if (matchedKey && PERPANG_VERBATIM[matchedKey]) {
      doc = PERPANG_VERBATIM[matchedKey];
    }
  }

  return doc;
};

export const hasPerpangDoc = (movementId, movementText) => {
  return !!getPerpangDoc(movementId, movementText);
};

export const MovementPerpangModal = ({ isOpen, onClose, movementId, movementText, onOpenFullPdf }) => {
  const [isPlayingMetronome, setIsPlayingMetronome] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(null);

  useEffect(() => {
    return () => {
      stopMetronome();
    };
  }, []);

  // Stop metronome jika modal ditutup
  useEffect(() => {
    if (!isOpen) {
      stopMetronome();
      setIsPlayingMetronome(false);
      setCurrentBeat(null);
    }
  }, [isOpen]);

  const doc = getPerpangDoc(movementId, movementText);

  // Jika modal terbuka tapi tidak ada isi dokumen perpang sama sekali, jangan tampilkan popup
  if (!isOpen || (!movementId && !movementText) || !doc) return null;

  // Tentukan BPM berdasarkan jenis materi/gerakan
  // Perpang Pasal 32:
  // - Langkah biasa/tegap: 96 BPM
  // - Langkah perlahan: 30 BPM
  // - Langkah ke samping / ke belakang / ke depan: 70 BPM
  // - Gerakan lari: 166 BPM
  let movementBpm = null;
  let tempoLabel = null;

  const testKey = (movementId || '') + ' ' + (movementText || '').toLowerCase();
  if (testKey.includes('lari')) {
    movementBpm = 166;
    tempoLabel = '166 BPM (Lari)';
  } else if (testKey.includes('perlahan')) {
    movementBpm = 30;
    tempoLabel = '30 BPM (Langkah Perlahan)';
  } else if (
    testKey.includes('langkah ke kanan') ||
    testKey.includes('langkah ke kiri') ||
    testKey.includes('langkah ke samping') ||
    testKey.includes('langkah ke belakang') ||
    testKey.includes('langkah ke depan')
  ) {
    movementBpm = 70;
    tempoLabel = '70 BPM (Langkah Terbatas)';
  } else if (
    testKey.includes('maju') ||
    testKey.includes('tegap') ||
    testKey.includes('jalan di tempat') ||
    testKey.includes('belok') ||
    testKey.includes('haluan') ||
    testKey.includes('melintang') ||
    testKey.includes('ganti langkah') ||
    testKey.includes('bubar')
  ) {
    movementBpm = 96;
    tempoLabel = '96 BPM (Langkah Biasa / Tegap)';
  }

  const handleToggleMetronome = async () => {
    if (!movementBpm) return;
    if (isPlayingMetronome) {
      stopMetronome();
      setIsPlayingMetronome(false);
      setCurrentBeat(null);
    } else {
      setIsPlayingMetronome(true);
      await startMetronome(movementBpm, (bpm, isFirstBeat, beatNum) => {
        setCurrentBeat(beatNum);
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 modal-backdrop">
      <div className="glass-card w-full max-w-2xl flex flex-col anim-pop-in bg-zinc-900 border-2 border-black overflow-hidden shadow-[8px_8px_0px_#000000]">
        {/* Header bar modal brutalist */}
        <div className="px-5 py-3.5 border-b-2 border-black flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-400 border border-black"></span>
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <h3 className="font-black text-sm text-white uppercase tracking-tight font-mono">{movementText}</h3>
          </div>
          <button onClick={onClose} className="p-1 border border-black bg-zinc-900 hover:bg-red-500 hover:text-black text-zinc-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bar Metronom Tik Tak Tak Tak jika gerakan memiliki tempo */}
        {movementBpm && (
          <div className="px-5 py-3 bg-zinc-950 border-b-2 border-black flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleToggleMetronome}
                className={`btn flex items-center gap-1.5 px-3 py-1.5 text-xs font-black ${
                  isPlayingMetronome
                    ? 'bg-amber-400 text-black shadow-[2px_2px_0px_#000]'
                    : 'bg-emerald-400 text-black shadow-[2px_2px_0px_#000]'
                }`}
              >
                {isPlayingMetronome ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" /> STOP METRONOM
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" /> METRONOM ({movementBpm} BPM)
                  </>
                )}
              </button>
              <span className="text-[10px] text-zinc-400 font-mono font-bold uppercase hidden sm:inline">
                // {tempoLabel}
              </span>
            </div>

            {/* Visual Beat Indicator: Tik - Tak - Tak - Tak */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4].map((beat) => {
                const isActive = isPlayingMetronome && currentBeat === beat;
                const isTik = beat === 1;
                return (
                  <span
                    key={beat}
                    className={`px-2 py-0.5 border-2 border-black text-[10px] font-mono font-black transition-transform ${
                      isActive
                        ? isTik
                          ? 'bg-rose-500 text-black shadow-[2px_2px_0px_#000] -translate-y-0.5'
                          : 'bg-emerald-400 text-black shadow-[2px_2px_0px_#000] -translate-y-0.5'
                        : 'bg-zinc-900 text-zinc-600 shadow-[1px_1px_0px_#000]'
                    }`}
                    title={isTik ? 'Tik (Ketukan 1)' : `Tak (Ketukan ${beat})`}
                  >
                    {isTik ? 'TIK' : 'TAK'}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Isi Dokumen - Dark Theme Selaras dengan Web */}
        <div className="p-6 sm:p-7 overflow-y-auto max-h-[72vh] text-zinc-200 leading-relaxed space-y-4">
          {doc ? (
            <div className="space-y-5">
              {/* Judul Pasal di tengah */}
              <div className="text-center pb-3 border-b border-zinc-800/80">
                <h2 className="text-xl font-bold tracking-wide text-zinc-100">{doc.pasal}</h2>
              </div>

              {/* Sub-judul pasal */}
              <p className="text-sm font-semibold text-zinc-200 border-l-2 border-theme-focus pl-3 py-0.5">
                {doc.heading}
              </p>

              {/* Paragraf dan butir ayat */}
              <div className="space-y-3.5 text-sm">
                {doc.paragraphs.map((p, pIdx) => (
                  <div key={pIdx} className="space-y-2 bg-black/20 p-3.5 rounded-xl border border-zinc-800/50">
                    <p className="text-zinc-200 font-medium text-justify">{p.lead}</p>
                    {p.subitems && p.subitems.length > 0 && (
                      <div className="pl-4 sm:pl-6 space-y-2 border-l border-zinc-700/60 ml-1">
                        {p.subitems.map((sub, sIdx) => (
                          <p key={sIdx} className="text-zinc-300 text-xs sm:text-sm text-justify leading-relaxed">
                            {sub}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 space-y-2">
              <p className="text-zinc-400 text-sm">
                Kutipan pasal lengkap untuk aba-aba ini dapat dilihat langsung pada buku dokumen resmi Perpang.
              </p>
            </div>
          )}
        </div>

        {/* Footer navigasi selaras dengan tema web */}
        <div className="p-3.5 border-t-2 border-black bg-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="text-[11px] font-mono text-zinc-400 italic">
            💡 <span className="text-amber-400 font-bold">Ojo lali:</span> Gerakane kudu persis aturan iki rek, ngko diprotes wong kae!
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={() => {
                onClose();
                if (onOpenFullPdf) onOpenFullPdf();
              }}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1.5 font-bold"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Buka PDF Asli
            </button>
            <button
              onClick={onClose}
              className="btn btn-primary px-4 py-1.5 text-xs font-black"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
