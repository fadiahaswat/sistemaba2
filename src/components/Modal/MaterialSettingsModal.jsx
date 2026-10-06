import React, { useState } from 'react';
import { X } from 'lucide-react';

export const MaterialSettingsModal = ({ isOpen, onClose, material, onSave }) => {
  if (!isOpen || !material) return null;

  const [formData, setFormData] = useState({
    commanderExecutes: !!material.commanderExecutes,
    isNumbered: material.isNumbered !== false,
    note: material.note || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div className="glass-card w-full max-w-sm flex flex-col anim-pop-in bg-zinc-900 border-2 border-black shadow-[8px_8px_0px_#000000] p-6">
        <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-amber-400 border border-black"></span>
            <h3 className="font-black text-sm text-white uppercase tracking-wider">Pengaturan Baris Materi</h3>
          </div>
          <button onClick={onClose} className="p-1 border border-black bg-zinc-900 hover:bg-red-500 hover:text-black text-zinc-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="flex items-center justify-between p-3 bg-zinc-950 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer">
            <span className="text-xs font-mono font-bold text-zinc-200 uppercase">Dilaksanakan Danton</span>
            <input
              type="checkbox"
              checked={formData.commanderExecutes}
              onChange={(e) => setFormData({ ...formData, commanderExecutes: e.target.checked })}
              className="form-checkbox h-5 w-5 bg-zinc-800 border-2 border-black text-amber-400 accent-amber-400 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-zinc-950 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer">
            <span className="text-xs font-mono font-bold text-zinc-200 uppercase">Gunakan Penomoran</span>
            <input
              type="checkbox"
              checked={formData.isNumbered}
              onChange={(e) => setFormData({ ...formData, isNumbered: e.target.checked })}
              className="form-checkbox h-5 w-5 bg-zinc-800 border-2 border-black text-amber-400 accent-amber-400 cursor-pointer"
            />
          </label>

          <div>
            <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1">Catatan Tambahan</label>
            <input
              type="text"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="form-input w-full p-2 text-xs text-white font-mono"
              placeholder="misal: Dilakukan di sudut lapangan"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn px-4 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary px-4 py-1.5 rounded-lg text-sm font-semibold"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
