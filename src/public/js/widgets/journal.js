import { api } from '../api.js';
import { showToast } from '../views.js';

export async function renderJournal(){
  const container=document.getElementById('journalEntries');
  const form=document.getElementById('journalForm');
  
  form.onsubmit=async e=>{
    e.preventDefault();
    const fd=new FormData(form);
    try{
      await api.journal.create(Object.fromEntries(fd.entries()));
      form.reset();
      showToast('Entrada de diario creada', 'success');
      renderJournal();
    }catch(err){ 
      showToast(err.message, 'error'); 
    }
  };

  // Show loading spinner
  container.innerHTML='<div class="spinner"></div>';
  
  try{
    const entries=await api.journal.list();
    if(!entries.length){ 
      container.innerHTML='<p>No hay entradas.</p>'; 
      return; 
    }
    
    container.innerHTML=entries.map(en=>`
      <div class="card" data-id="${en.id}">
        <strong>${en.title||'(Sin título)'}</strong> ${en.mood?`<span class="badge">${en.mood}</span>`:''}
        <div style="font-size:.55rem;opacity:.6;margin:.25rem 0;">${new Date(en.created_at).toLocaleString()}</div>
        <div style="white-space:pre-wrap;font-size:.85rem;">${escapeHtml(en.content)}</div>
        <div class="action-buttons">
          <button data-action="delete" class="danger">Eliminar</button>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('button[data-action="delete"]').forEach(btn=>{
      btn.addEventListener('click',async()=>{
        const id=btn.closest('.card').dataset.id;
        if(confirm('¿Eliminar entrada?')){
          try {
            await api.journal.remove(id);
            showToast('Entrada eliminada', 'success');
            renderJournal();
          } catch(err) {
            showToast(err.message, 'error');
          }
        }
      });
    });
  }catch(e){ 
    container.innerHTML=`<p style="color:#f66">${e.message}</p>`; 
    showToast('Error al cargar diario', 'error');
  }
}

function escapeHtml(str){
  return str.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}