import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Plus, MoreHorizontal, Trash2, X, HelpCircle } from 'lucide-react';
import { usePlan, ALL_COMMANDS_FLAT } from '../../../context/PlanContext';
import { CommandSelectorModal } from '../../Modal/CommandSelectorModal';
import { MaterialSettingsModal } from '../../Modal/MaterialSettingsModal';

export const MaterialRow = ({ postId, material, index, total, numCounter }) => {
  const {
    deleteMaterialRow,
    toggleMaterialNumbering,
    moveMaterial,
    updateMaterialSettings,
    addMovementToMaterial,
    updateMovementCount,
    deleteMovementFromMaterial,
    setCurrentPage
  } = usePlan();

  const [isCommandModalOpen, setIsCommandModalOpen] = useState(false);
  const [insertIndex, setInsertIndex] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const openInsertModal = (idx) => {
    setInsertIndex(idx);
    setIsCommandModalOpen(true);
  };

  const handleCommandSelected = (cmdId) => {
    addMovementToMaterial(postId, material.id, cmdId, insertIndex);
    setInsertIndex(null);
  };

  return (
    <div className="material-row group/row relative bg-zinc-900 p-2.5 border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-2 sm:gap-3 transition-transform">
      {/* Tombol Naik / Turun */}
      <div className="flex flex-col items-center text-zinc-400 group-hover/row:text-white transition-colors">
        {index > 0 ? (
          <button
            onClick={() => moveMaterial(postId, index, 'up')}
            className="p-0.5 hover:text-amber-400"
            title="Naik"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        ) : (
          <div className="w-4 h-4" />
        )}
        {index < total - 1 ? (
          <button
            onClick={() => moveMaterial(postId, index, 'down')}
            className="p-0.5 hover:text-amber-400"
            title="Turun"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        ) : (
          <div className="w-4 h-4" />
        )}
      </div>

      {/* Tombol Penomoran */}
      <button
        onClick={() => toggleMaterialNumbering(postId, material.id)}
        className="toggle-numbering-btn font-mono font-black text-amber-400 w-7 h-7 border-2 border-black bg-zinc-950 flex items-center justify-center text-xs shadow-[1px_1px_0px_#000]"
        title="Ganti Penomoran"
      >
        {material.isNumbered ? `${numCounter}` : '•'}
      </button>

      {/* Chip Aba-aba Horizontal dengan Tombol Sisip (+) */}
      <div className="movements-display flex-grow flex flex-wrap items-center gap-2">
        {material.movements.length === 0 ? (
          <button
            onClick={() => openInsertModal(0)}
            className="add-movement-btn text-amber-400 hover:underline text-xs font-mono font-bold uppercase"
          >
            + Tambah gerakan...
          </button>
        ) : (
          material.movements.map((mov, movIndex) => {
            const cmd = ALL_COMMANDS_FLAT.find(i => i.id === mov.id);
            if (!cmd) return null;

            return (
              <React.Fragment key={movIndex}>
                <div className="movement-chip-wrapper relative group/chip flex items-center">
                  <span className="bg-zinc-800 border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_#000] flex items-center gap-2 text-xs font-bold text-zinc-100">
                    {cmd.isCustomText ? (
                      <span className="flex items-center gap-1">
                        {cmd.text.split('(...)')[0]}
                        <input
                          type="text"
                          value={mov.count || ''}
                          onChange={(e) => updateMovementCount(postId, material.id, movIndex, e.target.value)}
                          placeholder="..."
                          className="movement-count-input w-16 text-center bg-black font-black text-amber-400 border border-black outline-none px-1 text-xs"
                        />
                        {cmd.text.split('(...)')[1]}
                      </span>
                    ) : cmd.needsInput ? (
                      <span className="flex items-center gap-1">
                        <input
                          type="number"
                          value={mov.count || ''}
                          onChange={(e) => updateMovementCount(postId, material.id, movIndex, e.target.value)}
                          placeholder="..."
                          className="movement-count-input w-10 text-center bg-black font-black text-amber-400 border border-black outline-none px-1 text-xs"
                          min="1"
                        />
                        {cmd.text}
                      </span>
                    ) : (
                      <span>{cmd.text}</span>
                    )}

                    <button
                      onClick={() => deleteMovementFromMaterial(postId, material.id, movIndex)}
                      className="text-zinc-400 hover:text-red-400 p-0.5 ml-1"
                      title="Hapus"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                </div>

                {/* Tombol Sisipkan (+) di antara chip gerakan */}
                <button
                  onClick={() => openInsertModal(movIndex + 1)}
                  className="insert-movement-btn border border-black bg-zinc-800 text-zinc-300 hover:bg-amber-400 hover:text-black opacity-0 group-hover/row:opacity-100 transition-opacity p-0.5 shadow-[1px_1px_0px_#000]"
                  title="Sisipkan Gerakan di sini"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </React.Fragment>
            );
          })
        )}
      </div>

      {/* Kontrol Kanan (Catatan, Pengaturan Titik Tiga, Hapus Baris) */}
      <div className="flex items-center gap-2 ml-auto">
        {material.note && (
          <span className="text-yellow-400 cursor-help p-1" title={`Catatan: ${material.note}`}>
            <HelpCircle className="w-4 h-4" />
          </span>
        )}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="settings-btn p-1 border-2 border-black bg-zinc-800 text-zinc-300 hover:bg-amber-400 hover:text-black shadow-[2px_2px_0px_#000]"
          title="Pengaturan Baris"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
        <button
          onClick={() => deleteMaterialRow(postId, material.id)}
          className="delete-material-btn p-1 border-2 border-black bg-zinc-800 text-zinc-300 hover:bg-red-500 hover:text-black shadow-[2px_2px_0px_#000]"
          title="Hapus Baris Materi"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <CommandSelectorModal
        isOpen={isCommandModalOpen}
        onClose={() => {
          setIsCommandModalOpen(false);
          setInsertIndex(null);
        }}
        onSelectCommand={handleCommandSelected}
      />

      <MaterialSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        material={material}
        onSave={(settings) => updateMaterialSettings(postId, material.id, settings)}
      />
    </div>
  );
};
