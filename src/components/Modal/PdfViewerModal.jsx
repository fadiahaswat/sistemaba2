import React from 'react';
import { X, ExternalLink } from 'lucide-react';

export const PdfViewerModal = ({ isOpen, onClose, pdfUrl, pdfTitle }) => {
  if (!isOpen) return null;

  const embedUrl = pdfUrl.includes('drive.google.com')
    ? pdfUrl.replace('/view?usp=sharing', '/preview')
    : pdfUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 modal-backdrop">
      <div className="glass-card w-full max-w-5xl h-[90vh] flex flex-col anim-pop-in bg-zinc-950 border-2 border-black overflow-hidden shadow-[8px_8px_0px_#000000]">
        <div className="p-3 sm:p-4 border-b-2 border-black flex items-center justify-between bg-zinc-900">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-emerald-400 border border-black"></span>
            <h3 className="font-black text-sm sm:text-base text-white uppercase tracking-tight truncate">{pdfTitle}</h3>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:text-white hidden sm:flex items-center gap-1 text-xs font-mono font-bold uppercase underline"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Buka Tab Baru
            </a>
          </div>
          <button onClick={onClose} className="p-1 border border-black bg-zinc-800 hover:bg-red-500 hover:text-black text-zinc-300">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-grow w-full h-full bg-zinc-900">
          <iframe
            src={embedUrl}
            title={pdfTitle}
            className="w-full h-full border-0"
            allow="autoplay"
          />
        </div>
      </div>
    </div>
  );
};
