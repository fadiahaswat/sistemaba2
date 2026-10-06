import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { usePlan } from '../../../context/PlanContext';
import { MaterialRow } from './MaterialRow';
import { PostSizeModal } from '../../Modal/PostSizeModal';

export const Workspace = () => {
  const { plan, activePostId, updatePost, deletePost, addMaterialRow } = usePlan();
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);

  const activePostIndex = plan.posts.findIndex(p => p.id === activePostId);
  const currentPost = activePostIndex !== -1 ? plan.posts[activePostIndex] : plan.posts[0];

  if (!currentPost) {
    return (
      <div className="glass-card rounded-xl shadow-lg flex flex-col items-center justify-center h-full min-h-[400px] text-center p-6 anim-fade-in">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-zinc-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-xl font-bold text-slate-200">Tidak Ada Pos</h3>
        <p className="mt-2 text-slate-400 max-w-xs">Pilih atau buat pos baru.</p>
      </div>
    );
  }

  const sizeParts = [currentPost.size_p, currentPost.size_l, currentPost.turn_width].filter(Boolean);
  const sizeString = sizeParts.length > 0 ? `${sizeParts.join(' x ')} Meter` : '-';

  let numberedCounter = 0;

  return (
    <div className="glass-card relative p-4 sm:p-6 border-2 border-black shadow-[6px_6px_0px_#000] anim-pop-in">
      <div className="flex justify-between items-start mb-4 border-b-2 border-black pb-3">
        <div className="flex-grow">
          <input
            type="text"
            value={currentPost.name || ''}
            onChange={(e) => updatePost(currentPost.id, 'name', e.target.value)}
            placeholder={`NAMA POS ${activePostIndex + 1}`}
            className="text-2xl font-black text-white bg-transparent focus:bg-zinc-800 rounded p-1 w-full uppercase outline-none font-mono"
          />
        </div>
        <button
          onClick={() => deletePost(currentPost.id)}
          className="delete-post-btn p-1.5 border-2 border-black bg-zinc-900 text-zinc-400 hover:bg-red-500 hover:text-black shadow-[2px_2px_0px_#000] transition-colors"
          aria-label="Hapus Pos"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between bg-zinc-900 border-2 border-black shadow-[3px_3px_0px_#000] p-3 mb-5">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-mono">
          <span className="text-zinc-300">
            UKURAN: <b className="font-black text-amber-400">{sizeString}</b>
          </span>
          <span className="text-zinc-300">
            WAKTU: <b className="font-black text-amber-400">{currentPost.time || '-'}</b> MENIT
          </span>
        </div>
        <button
          onClick={() => setIsSizeModalOpen(true)}
          className="edit-size-btn btn btn-primary text-xs font-black py-1 px-3"
        >
          ATUR
        </button>
      </div>

      <div className="materials-container space-y-2.5">
        {(!currentPost.materials || currentPost.materials.length === 0) ? (
          <p className="text-center text-zinc-500 py-6 font-mono text-sm">BELUM ADA BARIS MATERI DI POS INI.</p>
        ) : (
          currentPost.materials.map((material, idx) => {
            if (material.isNumbered) numberedCounter++;
            return (
              <MaterialRow
                key={material.id || idx}
                postId={currentPost.id}
                material={material}
                index={idx}
                total={currentPost.materials.length}
                numCounter={numberedCounter}
              />
            );
          })
        )}
      </div>

      <div className="mt-5">
        <button
          onClick={() => addMaterialRow(currentPost.id)}
          className="add-material-btn btn btn-primary w-full py-2.5 px-4 text-xs font-black"
        >
          + TAMBAH BARIS MATERI
        </button>
      </div>

      <PostSizeModal
        isOpen={isSizeModalOpen}
        onClose={() => setIsSizeModalOpen(false)}
        post={currentPost}
        onSave={(data) => {
          updatePost(currentPost.id, 'size_p', data.size_p);
          updatePost(currentPost.id, 'size_l', data.size_l);
          updatePost(currentPost.id, 'turn_width', data.turn_width);
          updatePost(currentPost.id, 'time', data.time);
        }}
      />
    </div>
  );
};
