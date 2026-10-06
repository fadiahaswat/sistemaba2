import React, { useState } from 'react';
import { Plus, Trash2, ListOrdered, GripVertical, X, BookOpen } from 'lucide-react';
import { usePlan } from '../../../context/PlanContext';
import { CommandSelectorModal } from '../../Modal/CommandSelectorModal';
import { MovementPerpangModal, hasPerpangDoc } from '../../Modal/MovementPerpangModal';

export const MaterialCard = ({ postId, material }) => {
  const {
    deleteMaterial,
    updateMaterialTitle,
    toggleMaterialNumbering,
    addMovement,
    deleteMovement,
    reorderMovements,
    setCurrentPage
  } = usePlan();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [selectedMovementForPerpang, setSelectedMovementForPerpang] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIdx) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) return;
    const items = [...material.movements];
    const [draggedItem] = items.splice(draggedIdx, 1);
    items.splice(targetIdx, 0, draggedItem);
    reorderMovements(postId, material.id, items);
    setDraggedIdx(null);
  };

  return (
    <div className="glass-card p-4 rounded-xl border border-zinc-700/50 mb-4 bg-zinc-900/60">
      <div className="flex items-center justify-between mb-3 gap-2">
        <input
          type="text"
          value={material.title}
          onChange={(e) => updateMaterialTitle(postId, material.id, e.target.value)}
          className="form-input font-semibold text-zinc-100 bg-transparent border-0 px-2 py-1 text-sm rounded focus:bg-zinc-800 flex-grow"
          placeholder="Judul Materi..."
        />
        <div className="flex items-center gap-1">
          <button
            onClick={() => toggleMaterialNumbering(postId, material.id)}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              material.numbered !== false
                ? 'bg-zinc-800 text-white font-bold'
                : 'text-zinc-400 hover:bg-zinc-800'
            }`}
            title="Ubah format penomoran (Angka / Titik)"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteMaterial(postId, material.id)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800"
            title="Hapus Materi"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-1.5 min-h-[30px]">
        {(!material.movements || material.movements.length === 0) ? (
          <p className="text-xs text-zinc-500 italic py-2">Belum ada aba-aba dalam materi ini.</p>
          material.movements.map((mov, idx) => {
            const isAvailableInPerpang = hasPerpangDoc(mov.id, mov.text);
            return (
              <div
                key={mov.id || idx}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={(e) => handleDrop(e, idx)}
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-850/80 hover:bg-zinc-800 border border-zinc-800/80 text-xs text-zinc-200 group cursor-move"
              >
                <div
                  onClick={() => {
                    if (isAvailableInPerpang) {
                      setSelectedMovementForPerpang({ id: mov.id, text: mov.text });
                    }
                  }}
                  className={`flex items-center gap-2 flex-grow ${isAvailableInPerpang ? 'cursor-pointer' : ''}`}
                  title={isAvailableInPerpang ? 'Klik untuk melihat penjelasan Perpang' : undefined}
                >
                  <GripVertical className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 flex-shrink-0" />
                  <span className="font-semibold text-zinc-400 select-none flex-shrink-0">
                    {material.numbered !== false ? `${idx + 1}.` : '•'}
                  </span>
                  <span className={`font-medium ${isAvailableInPerpang ? 'text-zinc-100 hover:text-theme-focus' : 'text-zinc-300'} transition-colors`}>
                    {mov.text}
                  </span>
                  {isAvailableInPerpang && (
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-1.5 px-1.5 py-0.5 rounded bg-zinc-700/60 text-[10px] text-zinc-300 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-emerald-400" /> Perpang
                    </span>
                  )}
                </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteMovement(postId, material.id, mov.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-zinc-500 transition-opacity"
                title="Hapus aba-aba"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-zinc-800 flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary text-xs py-1.5 px-3 rounded-lg flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Tambah Gerakan
        </button>
      </div>

      <CommandSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectCommand={(cmd) => addMovement(postId, material.id, cmd)}
      />

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
