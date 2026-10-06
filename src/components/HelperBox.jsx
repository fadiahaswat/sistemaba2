import React, { useState } from 'react';
import { Save, PlusSquare, Copy, FileText, Download, Share2, Trash2 } from 'lucide-react';
import { usePlan } from '../context/PlanContext';
import { exportPlanToPDF, exportPlanToDocx, formatPlanAsText } from '../utils/exporter';

export const HelperBox = () => {
  const { plan, savePlanToHistory, newPlan, duplicatePlan, showToast } = usePlan();
  const [manualCopyText, setManualCopyText] = useState(null);

  const handleCopyText = async () => {
    const text = formatPlanAsText(plan);
    try {
      await navigator.clipboard.writeText(text);
      showToast('Teks skenario wis kasil disalin rek!');
    } catch {
      setManualCopyText(text);
      showToast('Salin manual seko kothak ngisor iki ya.');
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}${window.location.pathname}?plan=${btoa(JSON.stringify(plan))}`;
      if (navigator.share) {
        await navigator.share({
          title: `Rancangan: ${plan.title || 'Aba-aba mangan perpunk!'}`,
          text: `Delok racikan "${plan.title || 'Aba-aba'}" nang mangan perpunk! Ojo lali disimak rek!`,
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        showToast('Tautan wis disalin nang clipboard rek!');
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        showToast('Gagal mbagikake tautan.');
      }
    }
  };

  return (
    <div className="glass-card p-6 mt-8 border-2 border-black shadow-[6px_6px_0px_#000]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-5 flex items-center gap-4">
          <div className="flex-shrink-0 w-16 h-16 bg-amber-400 text-black border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_#000]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="flex-grow">
            <span className="brutal-badge bg-amber-400 text-black mb-1">DAPUR KOMANDO</span>
            <p className="font-black text-lg text-white uppercase tracking-tight">Kothak Piranti mangan perpunk!</p>
            <p className="text-xs text-zinc-300 font-mono">Pencet tombol gawe nyimpen, ngekspor, utawa mbagikake racikan skenario.</p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="flex flex-wrap gap-2.5 justify-center">
            <button
              onClick={savePlanToHistory}
              className="btn btn-primary text-xs flex-1 flex flex-col items-center justify-center gap-1 p-2 h-16 min-w-[70px]"
              title="Simpen Skenario"
            >
              <Save className="h-5 w-5" />
              <span>Simpen</span>
            </button>
            <button
              onClick={newPlan}
              className="btn bg-zinc-800 hover:bg-zinc-700 text-white text-xs flex-1 flex flex-col items-center justify-center gap-1 p-2 h-16 min-w-[70px]"
              title="Gawe Anyar"
            >
              <PlusSquare className="h-5 w-5" />
              <span>Anyar</span>
            </button>
            <button
              onClick={duplicatePlan}
              className="btn bg-zinc-800 hover:bg-zinc-700 text-white text-xs flex-1 flex flex-col items-center justify-center gap-1 p-2 h-16 min-w-[70px]"
              title="Gandakno"
            >
              <Copy className="h-5 w-5" />
              <span>Gandakno</span>
            </button>
            <button
              onClick={handleCopyText}
              className="btn bg-zinc-800 hover:bg-zinc-700 text-white text-xs flex-1 flex flex-col items-center justify-center gap-1 p-2 h-16 min-w-[70px]"
              title="Salin Teks"
            >
              <FileText className="h-5 w-5" />
              <span>Salin</span>
            </button>
            <button
              onClick={() => exportPlanToPDF(plan)}
              className="btn bg-zinc-800 hover:bg-zinc-700 text-white text-xs flex-1 flex flex-col items-center justify-center gap-1 p-2 h-16 min-w-[70px]"
              title="Ekspor PDF"
            >
              <Download className="h-5 w-5" />
              <span>PDF</span>
            </button>
            <button
              onClick={() => exportPlanToDocx(plan)}
              className="btn bg-zinc-800 hover:bg-zinc-700 text-white text-xs flex-1 flex flex-col items-center justify-center gap-1 p-2 h-16 min-w-[70px]"
              title="Ekspor Word"
            >
              <Download className="h-5 w-5" />
              <span>Word</span>
            </button>
            <button
              onClick={handleShare}
              className="btn bg-zinc-800 hover:bg-zinc-700 text-white text-xs flex-1 flex flex-col items-center justify-center gap-1 p-2 h-16 min-w-[70px]"
              title="Bagi Tautan"
            >
              <Share2 className="h-5 w-5" />
              <span>Bagi</span>
            </button>
          </div>

          {manualCopyText && (
            <div className="mt-4">
              <textarea
                readOnly
                value={manualCopyText}
                className="form-input w-full p-2 border rounded-lg text-sm bg-zinc-800 text-zinc-200"
                rows={4}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
