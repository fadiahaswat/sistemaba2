import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ALL_COMMANDS_FLAT } from '../context/PlanContext';

export const formatPlanAsText = (plan) => {
  let text = `=== ${plan.title || 'RENCANA ABA-ABA'} ===\n`;
  if (plan.description) text += `Deskripsi : ${plan.description}\n`;
  if (plan.date) text += `Tanggal   : ${plan.date}\n`;
  if (plan.location) text += `Lokasi    : ${plan.location}\n`;
  text += `\n`;

  plan.posts.forEach((post, postIdx) => {
    const sizeParts = [post.size_p, post.size_l, post.turn_width].filter(Boolean);
    const sizeStr = sizeParts.length > 0 ? ` (${sizeParts.join(' x ')} m)` : '';
    text += `[POS ${postIdx + 1}: ${post.name || 'Pos ' + (postIdx + 1)} | Waktu: ${post.time || '0'} menit${sizeStr}]\n`;

    let numCounter = 0;
    if (post.materials && post.materials.length > 0) {
      post.materials.forEach((mat) => {
        if (mat.isNumbered) numCounter++;
        const prefix = mat.isNumbered ? `  ${numCounter}. ` : `  • `;

        const movesStr = (mat.movements || []).map(m => {
          const cmd = ALL_COMMANDS_FLAT.find(c => c.id === m.id);
          if (!cmd) return '';
          if (cmd.isCustomText) return cmd.text.replace('(...)', m.count || '...');
          if (cmd.needsInput) return `${m.count || ''} ${cmd.text}`;
          return cmd.text;
        }).join('  ->  ');

        text += `${prefix}${movesStr || '(Kosong)'}\n`;
      });
    } else {
      text += `  (Belum ada materi)\n`;
    }
    text += `\n`;
  });

  return text;
};

export const exportPlanToPDF = async (plan) => {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '800px';
  container.style.background = '#ffffff';
  container.style.color = '#18181b';
  container.style.padding = '32px';
  container.style.fontFamily = 'Arial, sans-serif';

  let html = `
    <div style="border-bottom: 2px solid #18181b; padding-bottom: 12px; margin-bottom: 20px;">
      <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #111827;">${plan.title || 'Rencana Aba-Aba'}</h1>
      <p style="margin: 4px 0 0 0; color: #4b5563; font-size: 14px;">${plan.description || ''}</p>
      <div style="margin-top: 8px; font-size: 12px; color: #6b7280; display: flex; gap: 16px;">
        <span>Tanggal: ${plan.date || '-'}</span>
        <span>Lokasi: ${plan.location || '-'}</span>
      </div>
    </div>
  `;

  plan.posts.forEach((post, pIdx) => {
    html += `
      <div style="margin-bottom: 24px;">
        <div style="background: #f3f4f6; padding: 8px 12px; border-radius: 6px; font-weight: bold; font-size: 16px; margin-bottom: 10px;">
          POS ${pIdx + 1}: ${post.name} (${post.time || '0'} Menit)
        </div>
    `;

    let numCounter = 0;
    post.materials.forEach((mat) => {
      if (mat.isNumbered) numCounter++;
      const prefix = mat.isNumbered ? `${numCounter}. ` : `• `;
      const movesStr = (mat.movements || []).map(m => {
        const cmd = ALL_COMMANDS_FLAT.find(c => c.id === m.id);
        if (!cmd) return '';
        if (cmd.isCustomText) return cmd.text.replace('(...)', m.count || '...');
        if (cmd.needsInput) return `${m.count || ''} ${cmd.text}`;
        return cmd.text;
      }).join('  →  ');

      html += `<div style="margin-left: 12px; margin-bottom: 6px; font-size: 13px;"><b>${prefix}</b>${movesStr}</div>`;
    });

    html += `</div>`;
  });

  container.innerHTML = html;
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${(plan.title || 'rencana_aba_aba').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
};

export const exportPlanToDocx = (plan) => {
  const content = formatPlanAsText(plan);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(plan.title || 'rencana_aba_aba').replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};
