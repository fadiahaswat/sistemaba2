import React from 'react';
import { Edit3 } from 'lucide-react';
import { usePlan } from '../../../context/PlanContext';
import { PostList } from './PostList';
import { Workspace } from './Workspace';
import { HelperBox } from '../../HelperBox';

export const EditorPage = () => {
  const { plan, updatePlanField, setCurrentPage } = usePlan();

  return (
    <div className="page-content anim-fade-in space-y-6">
      <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-black pb-5">
        <div>
          <div className="inline-block mb-1">
            <span className="brutal-badge bg-amber-400 text-black">FIELD COMMANDER // BUILDER</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase flex items-center gap-3">
            <Edit3 className="h-8 w-8 text-amber-400" /> EDITOR RENCANA
          </h1>
          <p className="mt-1 text-zinc-300 text-xs sm:text-sm font-mono">
            Rancang skenario aba-aba secara leluasa pos demi pos.
          </p>
        </div>
        <button
          onClick={() => setCurrentPage('viewer')}
          className="btn px-4 py-2.5 text-xs font-black flex items-center gap-2 bg-emerald-400 text-black hover:bg-emerald-300 border-2 border-black shadow-[3px_3px_0px_#000]"
        >
          <span>BUKA MODE BACA [AMAN]</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <aside className="lg:col-span-1 xl:col-span-1 space-y-6">
          <div className="glass-card p-5 space-y-3 border-2 border-black shadow-[4px_4px_0px_#000]">
            <div className="flex items-center gap-2 border-b-2 border-black pb-2 mb-3">
              <span className="w-2.5 h-2.5 bg-amber-400 border border-black"></span>
              <h2 className="text-sm font-black uppercase tracking-wider text-white">Detail Informasi</h2>
            </div>
            <input
              type="text"
              value={plan.title}
              onChange={(e) => updatePlanField('title', e.target.value)}
              placeholder="NAMA ABA-ABA (WAJIB)"
              className="form-input w-full p-2 text-sm text-white font-mono uppercase"
            />
            <textarea
              value={plan.description}
              onChange={(e) => updatePlanField('description', e.target.value)}
              placeholder="Deskripsi singkat skenario..."
              className="form-input w-full p-2 text-sm text-white font-mono"
              rows={2}
            />
            <input
              type="date"
              value={plan.date || ''}
              onChange={(e) => updatePlanField('date', e.target.value)}
              className="form-input w-full p-2 border rounded-lg text-zinc-300 text-sm"
            />
            <input
              type="text"
              value={plan.location}
              onChange={(e) => updatePlanField('location', e.target.value)}
              placeholder="Lokasi Latihan / Lomba"
              className="form-input w-full p-2 border rounded-lg text-sm text-white"
            />
          </div>

          <PostList />
        </aside>

        <section className="lg:col-span-2 xl:col-span-3">
          <Workspace />
        </section>
      </div>

      <HelperBox />
    </div>
  );
};
