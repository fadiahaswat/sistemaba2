import React from 'react';
import { Plus } from 'lucide-react';
import { usePlan } from '../../../context/PlanContext';

export const PostList = () => {
  const { plan, activePostId, setActivePostId, addPost } = usePlan();

  return (
    <div className="glass-card p-5 border-2 border-black shadow-[4px_4px_0px_#000]">
      <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
        <h2 className="text-sm font-black uppercase tracking-wider text-white">Daftar Pos</h2>
        <button
          onClick={addPost}
          className="btn btn-primary text-xs font-black py-1 px-3 flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Pos
        </button>
      </div>

      <div className="space-y-2">
        {plan.posts.map((post, index) => {
          const isActive = post.id === activePostId;
          const name = post.name || `Pos ${index + 1}`;
          return (
            <button
              key={post.id}
              onClick={() => setActivePostId(post.id)}
              className={`w-full text-left p-3 border-2 border-black transition-transform flex justify-between items-center ${
                isActive
                  ? 'bg-amber-400 text-black font-black shadow-[3px_3px_0px_#000] -translate-y-0.5'
                  : 'bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 shadow-[2px_2px_0px_#000]'
              }`}
            >
              <span className="font-mono text-xs uppercase font-extrabold truncate">
                {name}
              </span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 border border-black ${isActive ? 'bg-black text-amber-400' : 'bg-zinc-800 text-zinc-400'}`}>
                {post.materials?.length || 0}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
