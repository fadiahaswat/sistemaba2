import React, { useState } from 'react';
import { BookOpen, FileText } from 'lucide-react';
import { PdfViewerModal } from '../Modal/PdfViewerModal';

export const BacaPerpang = () => {
  const [selectedPdf, setSelectedPdf] = useState(null);

  const docs = [
    {
      title: 'Perpang TNI No. 58 Th 2018',
      desc: 'Tentang Peraturan Baris Berbaris (PBB) Tentara Nasional Indonesia.',
      url: '/perpang/PERPANG TNI NO. 58 TAHUN 2018.pdf',
      txtUrl: '/perpang/PERPANG TNI NO. 58 TAHUN 2018.txt'
    },
    {
      title: 'Perpang TNI No. 57 Th 2018',
      desc: 'Tentang Peraturan Penghormatan Militer (PPM) Tentara Nasional Indonesia.',
      url: '/perpang/PERPANG TNI NO 57 TAHUN 2018 Tentang Penghormatan.pdf',
      txtUrl: '/perpang/PERPANG TNI NO 57 TAHUN 2018 Tentang Penghormatan.txt'
    },
    {
      title: 'Perpang TNI No. 45 Th 2014',
      desc: 'Tentang Peraturan Baris Berbaris (PBB) TNI (Regulasi Pendukung / Referensi 2014).',
      url: '/perpang/PERPANG TNI NO. 45 TAHUN 2014.pdf',
      txtUrl: '/perpang/PERPANG TNI NO. 45 TAHUN 2014.txt'
    }
  ];

  return (
    <div className="page-content anim-fade-in max-w-4xl mx-auto space-y-8 py-6">
      <div className="text-center">
        <div className="inline-block mb-2">
          <span className="brutal-badge bg-emerald-400 text-black">MILITARY ARCHIVE // OFFICIAL REGULATIONS</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white uppercase flex items-center justify-center gap-3">
          <BookOpen className="h-9 w-9 text-emerald-400" /> BACA DOKUMEN PERPANG
        </h1>
        <p className="mt-2 text-zinc-300 text-sm max-w-xl mx-auto font-mono">
          Dokumen resmi Peraturan Panglima Tentara Nasional Indonesia (PBB & PPM).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {docs.map((doc) => (
          <div
            key={doc.title}
            className="glass-card p-6 text-left flex flex-col justify-between hover:-translate-y-1 transition-transform border-2 border-black shadow-[4px_4px_0px_#000000]"
          >
            <div>
              <div className="w-12 h-12 border-2 border-black bg-emerald-400 text-black flex items-center justify-center mb-4 shadow-[2px_2px_0px_#000]">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">{doc.title}</h3>
              <p className="text-xs text-zinc-300 mt-2 font-mono">{doc.desc}</p>
            </div>
            <button
              onClick={() => setSelectedPdf(doc)}
              className="btn mt-6 self-start px-4 py-2 text-xs font-black bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black shadow-[3px_3px_0px_#000]"
            >
              Buka Dokumen
            </button>
          </div>
        ))}
      </div>

      <PdfViewerModal
        isOpen={!!selectedPdf}
        onClose={() => setSelectedPdf(null)}
        pdfUrl={selectedPdf?.url || ''}
        pdfTitle={selectedPdf?.title || ''}
      />
    </div>
  );
};
