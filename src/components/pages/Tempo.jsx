import React, { useState, useEffect } from 'react';
import { Volume2, Play, Square } from 'lucide-react';
import { TEMPO_DATA } from '../../data/tempoData';
import { startMetronome, stopMetronome, getMetronomeState } from '../../utils/metronome';

export const Tempo = () => {
  const [activeTempoName, setActiveTempoName] = useState(null);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    return () => {
      stopMetronome();
    };
  }, []);

  const handleToggle = async (item) => {
    if (activeTempoName === item.name) {
      stopMetronome();
      setActiveTempoName(null);
    } else {
      setActiveTempoName(item.name);
      await startMetronome(item.bpm, () => {
        setFlash(true);
        setTimeout(() => setFlash(false), 100);
      });
    }
  };

  const currentActiveItem = TEMPO_DATA.find(i => i.name === activeTempoName);

  return (
    <div className="page-content anim-fade-in max-w-6xl mx-auto space-y-8 py-6">
      <div className="text-center">
        <div className="inline-block mb-2">
          <span className="brutal-badge bg-purple-400 text-black">AUDIO CADENCE // METRONOME ENGINE</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white uppercase flex items-center justify-center gap-3">
          <Volume2 className="h-9 w-9 text-purple-400" /> TEMPO GERAKAN PBB
        </h1>
        <p className="mt-2 text-zinc-300 text-sm font-mono max-w-xl mx-auto">
          {currentActiveItem ? (
            <span className="bg-purple-400 text-black font-extrabold px-3 py-1 border-2 border-black inline-block shadow-[2px_2px_0px_#000]">
              METRONOM BERJALAN: {currentActiveItem.name.toUpperCase()} ({currentActiveItem.bpm} BPM) [AKTIF]
            </span>
          ) : (
            'PILIH SALAH SATU TEMPO KETUKAN UNTUK MEMULAI KETUKAN AUDIO TAKTIS.'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {TEMPO_DATA.map((item) => {
          const isCurrentActive = activeTempoName === item.name;
          return (
            <div
              key={item.name}
              className={`glass-card p-5 border-2 border-black flex flex-col justify-between transition-transform ${
                isCurrentActive
                  ? 'bg-purple-950/60 border-purple-400 shadow-[6px_6px_0px_#c084fc] -translate-y-1'
                  : 'shadow-[4px_4px_0px_#000000]'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h3 className="font-black text-white text-base uppercase leading-snug">{item.name}</h3>
                  <span className="brutal-badge bg-purple-400 text-black shrink-0">
                    {item.bpm} BPM
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mb-5 font-mono">{item.description}</p>
              </div>

              <button
                onClick={() => handleToggle(item)}
                className={`btn w-full py-2.5 text-xs font-black flex items-center justify-center gap-2 border-2 border-black ${
                  isCurrentActive
                    ? 'bg-red-500 hover:bg-red-400 text-black shadow-[3px_3px_0px_#000]'
                    : 'bg-purple-400 hover:bg-purple-300 text-black shadow-[3px_3px_0px_#000]'
                }`}
              >
                {isCurrentActive ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" /> HENTIKAN
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" /> MAINKAN
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
