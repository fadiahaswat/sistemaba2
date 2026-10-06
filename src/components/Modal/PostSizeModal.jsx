import React, { useState } from 'react';
import { X } from 'lucide-react';

export const PostSizeModal = ({ isOpen, onClose, post, onSave }) => {
  if (!isOpen || !post) return null;

  const [formData, setFormData] = useState({
    size_p: post.size_p || '',
    size_l: post.size_l || '',
    turn_width: post.turn_width || '',
    time: post.time || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div className="glass-card w-full max-w-md flex flex-col anim-pop-in bg-zinc-900 border-2 border-black shadow-[8px_8px_0px_#000000] p-6">
        <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-amber-400 border border-black"></span>
            <h3 className="font-black text-sm text-white uppercase tracking-wider">Atur Ukuran Lapangan & Waktu</h3>
          </div>
          <button onClick={onClose} className="p-1 border border-black bg-zinc-900 hover:bg-red-500 hover:text-black text-zinc-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Panjang (m)</label>
              <input
                type="number"
                value={formData.size_p}
                onChange={(e) => setFormData({ ...formData, size_p: e.target.value })}
                className="form-input w-full p-2 border rounded-lg text-sm text-white"
                placeholder="misal: 15"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Lebar (m)</label>
              <input
                type="number"
                value={formData.size_l}
                onChange={(e) => setFormData({ ...formData, size_l: e.target.value })}
                className="form-input w-full p-2 border rounded-lg text-sm text-white"
                placeholder="misal: 10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Lebar Belokan (m)</label>
            <input
              type="number"
              value={formData.turn_width}
              onChange={(e) => setFormData({ ...formData, turn_width: e.target.value })}
              className="form-input w-full p-2 border rounded-lg text-sm text-white"
              placeholder="misal: 5"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Alokasi Waktu (Menit)</label>
            <input
              type="number"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="form-input w-full p-2 border rounded-lg text-sm text-white"
              placeholder="misal: 15"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="btn px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary px-4 py-2 rounded-lg text-sm font-semibold"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
