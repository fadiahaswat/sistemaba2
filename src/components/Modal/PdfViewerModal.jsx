import React, { useState, useEffect } from 'react';
import { X, ExternalLink, FileText, Download } from 'lucide-react';

export const PdfViewerModal = ({ isOpen, onClose, pdfUrl, txtUrl, pdfTitle }) => {
  const [activeTab, setActiveTab] = useState('pdf');
  const [textContent, setTextContent] = useState('');
  const [loadingText, setLoadingText] = useState(false);

  useEffect(() => {
    setActiveTab('pdf');
    setTextContent('');
  }, [pdfUrl, isOpen]);

  useEffect(() => {
    if (activeTab === 'text' && txtUrl && !textContent) {
      setLoadingText(true);
      fetch(txtUrl)
        .then((res) => {
          if (!res.ok) throw new Error('Gagal memuat teks');
          return res.text();
        })
        .then((txt) => {
          setTextContent(txt);
          setLoadingText(false);
        })
        .catch(() => {
          setTextContent('Gagal memuat transkrip teks regulasi.');
          setLoadingText(false);
        });
    }
  }, [activeTab, txtUrl, textContent]);

  if (!isOpen) return null;

  const embedUrl = pdfUrl.includes('drive.google.com')
    ? pdfUrl.replace('/view?usp=sharing', '/preview')
    : pdfUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 modal-backdrop bg-black/80 backdrop-blur-sm">
      <div className="glass-card w-full max-w-5xl h-[90vh] flex flex-col anim-pop-in bg-zinc-950 border-2 border-black overflow-hidden shadow-[8px_8px_0px_#000000]">
        <div className="p-3 sm:p-4 border-b-2 border-black flex items-center justify-between bg-zinc-900 gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-2.5 h-2.5 bg-emerald-400 border border-black shrink-0"></span>
            <h3 className="font-black text-sm sm:text-base text-white uppercase tracking-tight truncate">{pdfTitle}</h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {txtUrl && (
              <div className="flex border-2 border-black bg-zinc-800 p-0.5 shadow-[2px_2px_0px_#000]">
                <button
                  onClick={() => setActiveTab('pdf')}
                  className={`px-2.5 py-1 text-xs font-black transition-colors ${
                    activeTab === 'pdf'
                      ? 'bg-emerald-400 text-black'
                      : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  PDF
                </button>
                <button
                  onClick={() => setActiveTab('text')}
                  className={`px-2.5 py-1 text-xs font-black flex items-center gap-1 transition-colors ${
                    activeTab === 'text'
                      ? 'bg-emerald-400 text-black'
                      : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  <FileText className="w-3 h-3" /> TEKS
                </button>
              </div>
            )}

            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:text-white hidden md:flex items-center gap-1 text-xs font-mono font-bold uppercase underline px-2"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Tab Baru
            </a>

            <button onClick={onClose} className="p-1 border border-black bg-zinc-800 hover:bg-red-500 hover:text-black text-zinc-300">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-grow w-full h-full bg-zinc-900 overflow-hidden relative">
          {activeTab === 'pdf' ? (
            <iframe
              src={embedUrl}
              title={pdfTitle}
              className="w-full h-full border-0"
              allow="autoplay"
            />
          ) : (
            <div className="w-full h-full p-4 sm:p-6 overflow-y-auto bg-zinc-950 text-zinc-200 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap select-text">
              {loadingText ? (
                <div className="flex items-center justify-center h-full text-zinc-400">
                  Memuat teks dokumen...
                </div>
              ) : (
                textContent
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
