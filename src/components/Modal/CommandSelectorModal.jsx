import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { PBB_COMMANDS } from '../../data/pbbCommands';

export const CommandSelectorModal = ({ isOpen, onClose, onSelectCommand }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredCategories = PBB_COMMANDS.map(cat => {
    const matchedItems = cat.items.filter(item =>
      item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return { ...cat, items: matchedItems };
  }).filter(cat => cat.items.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div className="glass-card w-full max-w-2xl max-h-[85vh] flex flex-col anim-pop-in bg-zinc-900 border-2 border-black shadow-[8px_8px_0px_#000000]">
        <div className="p-4 border-b-2 border-black flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-amber-400 border border-black"></span>
            <h3 className="font-black text-base text-white uppercase tracking-wider">Pilih Aba-aba Gerakan</h3>
          </div>
          <button onClick={onClose} className="p-1 border border-black bg-zinc-900 hover:bg-red-500 hover:text-black text-zinc-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b-2 border-black bg-zinc-900">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="CARI ABA-ABA..."
              className="form-input w-full pl-9 pr-4 py-2 text-sm text-white font-mono uppercase"
              autoFocus
            />
          </div>
        </div>

        <div className="p-4 overflow-y-auto space-y-6 flex-grow">
          {filteredCategories.length === 0 ? (
            <p className="text-center text-zinc-500 py-8 font-mono text-xs">TIDAK ADA ABA-ABA YANG COCOK.</p>
          ) : (
            filteredCategories.map((cat) => (
              <div key={cat.category}>
                <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-2 font-mono flex items-center gap-2">
                  <span>//</span> {cat.category}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {cat.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectCommand(item.id);
                        onClose();
                      }}
                      className="p-2.5 text-left bg-zinc-800 hover:bg-amber-400 hover:text-black border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-bold text-zinc-200 transition-colors"
                    >
                      {item.text}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
