import React, { createContext, useContext, useState, useEffect } from 'react';
import { PBB_COMMANDS } from '../data/pbbCommands';

const PlanContext = createContext();

export const ALL_COMMANDS_FLAT = PBB_COMMANDS.flatMap(category => category.items);

const createEmptyPlan = () => ({
  id: crypto.randomUUID(),
  title: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
  location: '',
  posts: [
    {
      id: crypto.randomUUID(),
      name: 'Pos 1',
      time: 15,
      size_p: '',
      size_l: '',
      turn_width: '',
      materials: [
        {
          id: crypto.randomUUID(),
          isNumbered: true,
          commanderExecutes: false,
          note: '',
          movements: []
        }
      ]
    }
  ]
});

export const PlanProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('beranda');
  const [plan, setPlan] = useState(createEmptyPlan);
  const [activePostId, setActivePostId] = useState(null);
  const [history, setHistory] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('siap_riwayat');
      if (saved) setHistory(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const shared = urlParams.get('plan');
    if (shared) {
      try {
        const decoded = JSON.parse(atob(shared));
        setPlan(decoded);
        setActivePostId(decoded.posts?.[0]?.id || null);
        setCurrentPage('editor');
        showToast('Rencana dari tautan berhasil dimuat!');
        return;
      } catch (e) {
        console.error(e);
      }
    }

    try {
      const autoSave = localStorage.getItem('siap_autosave');
      if (autoSave) {
        const parsed = JSON.parse(autoSave);
        setPlan(parsed);
        setActivePostId(parsed.posts?.[0]?.id || null);
      } else {
        const initial = createEmptyPlan();
        setPlan(initial);
        setActivePostId(initial.posts[0].id);
      }
    } catch (e) {
      const initial = createEmptyPlan();
      setPlan(initial);
      setActivePostId(initial.posts[0].id);
    }
  }, []);

  useEffect(() => {
    if (plan.posts.length > 0) {
      if (!activePostId || !plan.posts.some(p => p.id === activePostId)) {
        setActivePostId(plan.posts[0].id);
      }
    } else {
      setActivePostId(null);
    }
  }, [plan.posts, activePostId]);

  useEffect(() => {
    if (plan) {
      try {
        localStorage.setItem('siap_autosave', JSON.stringify(plan));
      } catch (e) {
        console.error(e);
      }
    }
  }, [plan]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const updatePlanField = (field, value) => {
    setPlan(prev => ({ ...prev, [field]: value }));
  };

  const addPost = () => {
    const newPostIndex = plan.posts.length + 1;
    const newPost = {
      id: crypto.randomUUID(),
      name: `Pos ${newPostIndex}`,
      time: 10,
      size_p: '',
      size_l: '',
      turn_width: '',
      materials: [
        {
          id: crypto.randomUUID(),
          isNumbered: true,
          commanderExecutes: false,
          note: '',
          movements: []
        }
      ]
    };
    setPlan(prev => ({ ...prev, posts: [...prev.posts, newPost] }));
    setActivePostId(newPost.id);
  };

  const deletePost = (postId) => {
    if (plan.posts.length <= 1) {
      showToast('Minimal harus ada 1 pos!');
      return;
    }
    setPlan(prev => ({
      ...prev,
      posts: prev.posts.filter(p => p.id !== postId)
    }));
  };

  const updatePost = (postId, field, value) => {
    setPlan(prev => ({
      ...prev,
      posts: prev.posts.map(p => p.id === postId ? { ...p, [field]: value } : p)
    }));
  };

  const addMaterialRow = (postId) => {
    setPlan(prev => ({
      ...prev,
      posts: prev.posts.map(p => {
        if (p.id !== postId) return p;
        const newMat = {
          id: crypto.randomUUID(),
          isNumbered: true,
          commanderExecutes: false,
          note: '',
          movements: []
        };
        return { ...p, materials: [...(p.materials || []), newMat] };
      })
    }));
  };

  const deleteMaterialRow = (postId, matId) => {
    setPlan(prev => ({
      ...prev,
      posts: prev.posts.map(p => {
        if (p.id !== postId) return p;
        return { ...p, materials: p.materials.filter(m => m.id !== matId) };
      })
    }));
  };

  const toggleMaterialNumbering = (postId, matId) => {
    setPlan(prev => ({
      ...prev,
      posts: prev.posts.map(p => {
        if (p.id !== postId) return p;
        return {
          ...p,
          materials: p.materials.map(m => m.id === matId ? { ...m, isNumbered: !m.isNumbered } : m)
        };
      })
    }));
  };

  const moveMaterial = (postId, matIndex, direction) => {
    setPlan(prev => ({
      ...prev,
      posts: prev.posts.map(p => {
        if (p.id !== postId) return p;
        const mats = [...p.materials];
        const targetIndex = direction === 'up' ? matIndex - 1 : matIndex + 1;
        if (targetIndex < 0 || targetIndex >= mats.length) return p;
        const [removed] = mats.splice(matIndex, 1);
        mats.splice(targetIndex, 0, removed);
        return { ...p, materials: mats };
      })
    }));
  };

  const updateMaterialSettings = (postId, matId, settings) => {
    setPlan(prev => ({
      ...prev,
      posts: prev.posts.map(p => {
        if (p.id !== postId) return p;
        return {
          ...p,
          materials: p.materials.map(m => m.id === matId ? { ...m, ...settings } : m)
        };
      })
    }));
  };

  const addMovementToMaterial = (postId, matId, commandId, insertIndex = null) => {
    // Peta auto-chain asli dari file HTML:
    const autoChainMap = {
      'custom_honor_jury': 'tegak_gerak',
      'hormat_gerak': 'tegak_gerak',
      'hormat_kanan_gerak': 'tegak_gerak',
      'hormat_kiri_gerak': 'tegak_gerak',
      'lencang_kanan_gerak': 'tegak_gerak',
      'lencang_kiri_gerak': 'tegak_gerak',
      'setengah_lengan_lencang_kanan_gerak': 'tegak_gerak',
      'setengah_lengan_lencang_kiri_gerak': 'tegak_gerak',
      'lencang_depan_gerak': 'tegak_gerak',
      'periksa_kerapian_mulai': 'periksa_kerapian_selesai',
      'parade_periksa_kerapian_mulai': 'periksa_kerapian_selesai',
      'berhimpun_mulai': 'selesai_himpun_kumpul',
      'untuk_perhatian': 'istirahat_ditempat_gerak',
      'haluan_kanan_jalan': 'henti_gerak_berjalan',
      'haluan_kiri_jalan': 'henti_gerak_berjalan',
      'melintang_kanan_jalan': 'henti_gerak_berjalan',
      'melintang_kiri_jalan': 'henti_gerak_berjalan',
      'haluan_kanan_maju_jalan': 'maju_jalan',
      'haluan_kiri_maju_jalan': 'maju_jalan',
      'melintang_kanan_maju_jalan': 'maju_jalan',
      'melintang_kiri_maju_jalan': 'maju_jalan'
    };

    setPlan(prev => ({
      ...prev,
      posts: prev.posts.map(p => {
        if (p.id !== postId) return p;
        return {
          ...p,
          materials: p.materials.map(m => {
            if (m.id !== matId) return m;
            const newMovement = { id: commandId, count: '' };
            const movs = [...(m.movements || [])];

            if (insertIndex !== null && insertIndex >= 0 && insertIndex <= movs.length) {
              movs.splice(insertIndex, 0, newMovement);
            } else {
              movs.push(newMovement);
            }

            // Logika kumpul bersaf / berbanjar otomatis menyelipkan penjuru di depannya jika belum ada
            if (commandId === 'bersaf_kumpul_mulai' || commandId === 'berbanjar_kumpul_mulai') {
              const kumpulIndex = movs.findIndex(mv => mv.id === commandId);
              if (kumpulIndex > -1) {
                const hasPenjuru = movs.some(mv => mv.id === 'custom_penjuru');
                if (!hasPenjuru) {
                  movs.splice(kumpulIndex, 0, { id: 'custom_penjuru', count: '' });
                }
              }
              movs.push({ id: 'selesai_himpun_kumpul', count: '' });
            } else if (autoChainMap[commandId]) {
              // Auto chain gerakan pelengkapnya (misal Hormat -> Tegak, Haluan -> Henti)
              movs.push({ id: autoChainMap[commandId], count: '' });
            }

            return { ...m, movements: movs };
          })
        };
      })
    }));
  };

  const updateMovementCount = (postId, matId, movIndex, count) => {
    setPlan(prev => ({
      ...prev,
      posts: prev.posts.map(p => {
        if (p.id !== postId) return p;
        return {
          ...p,
          materials: p.materials.map(m => {
            if (m.id !== matId) return m;
            const movs = [...m.movements];
            if (movs[movIndex]) movs[movIndex] = { ...movs[movIndex], count };
            return { ...m, movements: movs };
          })
        };
      })
    }));
  };

  const toggleMovementTimerMarker = (postId, matId, movIndex) => {
    setPlan(prev => ({
      ...prev,
      posts: prev.posts.map(p => {
        if (p.id !== postId) return p;

        // Cari tahu apakah sudah ada start dan stop di pos ini
        let existingStartLoc = null; // { matId, movIdx }
        let existingStopLoc = null;  // { matId, movIdx }

        p.materials.forEach(m => {
          (m.movements || []).forEach((mv, idx) => {
            if (mv.timerMarker === 'start') existingStartLoc = { matId: m.id, movIdx: idx };
            if (mv.timerMarker === 'stop') existingStopLoc = { matId: m.id, movIdx: idx };
          });
        });

        const isCurrentlyStart = existingStartLoc?.matId === matId && existingStartLoc?.movIdx === movIndex;
        const isCurrentlyStop = existingStopLoc?.matId === matId && existingStopLoc?.movIdx === movIndex;

        let nextAction = 'set_start';

        if (isCurrentlyStart) {
          // Jika gerakan ini sudah START dan diklik lagi -> hapus START
          nextAction = 'clear';
        } else if (isCurrentlyStop) {
          // Jika gerakan ini sudah STOP dan diklik lagi -> hapus STOP
          nextAction = 'clear';
        } else {
          // Gerakan ini belum punya status:
          // Jika belum ada START sama sekali -> pasang START
          if (!existingStartLoc) {
            nextAction = 'set_start';
          } 
          // Jika sudah ada START, maka pilihan berikutnya HANYA STOP
          else {
            nextAction = 'set_stop';
          }
        }

        return {
          ...p,
          materials: p.materials.map(m => {
            return {
              ...m,
              movements: (m.movements || []).map((mv, idx) => {
                const isTarget = m.id === matId && idx === movIndex;

                if (isTarget) {
                  if (nextAction === 'clear') return { ...mv, timerMarker: 'none' };
                  if (nextAction === 'set_start') return { ...mv, timerMarker: 'start' };
                  if (nextAction === 'set_stop') return { ...mv, timerMarker: 'stop' };
                }

                // Jika memasang START baru, pastikan START lama di tempat lain di pos ini dihapus
                if (nextAction === 'set_start' && mv.timerMarker === 'start') {
                  return { ...mv, timerMarker: 'none' };
                }

                // Jika memasang STOP baru, pastikan STOP lama di tempat lain di pos ini dihapus
                if (nextAction === 'set_stop' && mv.timerMarker === 'stop') {
                  return { ...mv, timerMarker: 'none' };
                }

                return mv;
              })
            };
          })
        };
      })
    }));
  };

  const deleteMovementFromMaterial = (postId, matId, movIndex) => {
    setPlan(prev => ({
      ...prev,
      posts: prev.posts.map(p => {
        if (p.id !== postId) return p;
        return {
          ...p,
          materials: p.materials.map(m => {
            if (m.id !== matId) return m;
            const movs = [...m.movements];
            movs.splice(movIndex, 1);
            return { ...m, movements: movs };
          })
        };
      })
    }));
  };

  const savePlanToHistory = () => {
    if (!plan.title || !plan.title.trim()) {
      showToast('Harap isi Judul Aba-aba sebelum menyimpan!');
      return false;
    }
    const updatedPlan = {
      ...plan,
      savedAt: new Date().toISOString()
    };
    const newHistory = [updatedPlan, ...history.filter(h => h.id !== plan.id)];
    setHistory(newHistory);
    localStorage.setItem('siap_riwayat', JSON.stringify(newHistory));
    showToast('Rencana berhasil disimpan ke riwayat!');
    return true;
  };

  const loadPlan = (savedPlan) => {
    setPlan(savedPlan);
    setActivePostId(savedPlan.posts?.[0]?.id || null);
    setCurrentPage('editor');
    showToast(`Rencana "${savedPlan.title}" dimuat!`);
  };

  const deleteHistoryItem = (planId) => {
    const filtered = history.filter(h => h.id !== planId);
    setHistory(filtered);
    localStorage.setItem('siap_riwayat', JSON.stringify(filtered));
    showToast('Item riwayat dihapus.');
  };

  const newPlan = () => {
    const empty = createEmptyPlan();
    setPlan(empty);
    setActivePostId(empty.posts[0].id);
    showToast('Membuat rencana baru.');
  };

  const duplicatePlan = () => {
    const duplicated = {
      ...JSON.parse(JSON.stringify(plan)),
      id: crypto.randomUUID(),
      title: `${plan.title || 'Rencana'} (Salinan)`,
      savedAt: new Date().toISOString()
    };
    setPlan(duplicated);
    setActivePostId(duplicated.posts[0].id);
    showToast('Rencana berhasil diduplikasi!');
  };

  return (
    <PlanContext.Provider value={{
      currentPage,
      setCurrentPage,
      plan,
      activePostId,
      setActivePostId,
      history,
      toastMessage,
      showToast,
      updatePlanField,
      addPost,
      deletePost,
      updatePost,
      addMaterialRow,
      deleteMaterialRow,
      toggleMaterialNumbering,
      moveMaterial,
      updateMaterialSettings,
      addMovementToMaterial,
      updateMovementCount,
      toggleMovementTimerMarker,
      deleteMovementFromMaterial,
      savePlanToHistory,
      loadPlan,
      deleteHistoryItem,
      newPlan,
      duplicatePlan
    }}>
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => useContext(PlanContext);
