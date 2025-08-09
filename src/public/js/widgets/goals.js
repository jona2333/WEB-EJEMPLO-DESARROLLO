import { api } from '../api.js';
import { showToast } from '../views.js';

let currentPage = 1;
const itemsPerPage = 5; // Smaller for demo purposes

export async function renderGoals(page = 1){
  currentPage = page;
  const ul=document.getElementById('goalsList');
  const form=document.getElementById('goalForm');
  
  form.onsubmit=async e=>{
    e.preventDefault();
    const fd=new FormData(form);
    try{
      await api.goals.create(Object.fromEntries(fd.entries()));
      form.reset();
      showToast('Objetivo creado exitosamente', 'success');
      renderGoals(1); // Go back to first page when creating new item
    }catch(err){ 
      showToast(err.message, 'error'); 
    }
  };

  // Show loading spinner
  ul.innerHTML='<div class="spinner"></div>';
  
  // Remove existing pagination if it exists
  const existingPagination = document.querySelector('.pagination');
  if (existingPagination) existingPagination.remove();
  
  try{
    const result = await api.goals.list(currentPage, itemsPerPage);
    const { goals, pagination } = result;
    
    if(!goals.length){ 
      ul.innerHTML='<li>No hay objetivos.</li>'; 
      return; 
    }
    
    ul.innerHTML = goals.map(g=>`
      <li data-id="${g.id}">
        <strong>${g.title}</strong> ${g.target_date?`<span class="badge">${g.target_date}</span>`:''}
        <div>${g.description||''}</div>
        <div class="status-progress"><span style="width:${g.progress}%;"></span></div>
        <div style="font-size:.65rem;opacity:.7;margin-top:.25rem;">Progreso: ${g.progress}%</div>
        <div class="action-buttons">
          <button data-action="progress" data-delta="+10">+10%</button>
          <button data-action="progress" data-delta="-10">-10%</button>
          <button data-action="edit">Editar</button>
          <button data-action="delete" class="danger">Eliminar</button>
        </div>
      </li>
    `).join('');
    
    // Add pagination controls
    const paginationHtml = `
      <div class="pagination" style="display: flex; justify-content: center; gap: 0.5rem; margin-top: 1rem;">
        ${pagination.hasPrev ? `<button data-action="prev-page" style="background: #243444; color: var(--text); border: 1px solid #314458; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Anterior</button>` : ''}
        <span style="padding: 0.5rem 1rem; color: var(--text);">Página ${pagination.page} de ${pagination.totalPages}</span>
        ${pagination.hasNext ? `<button data-action="next-page" style="background: #243444; color: var(--text); border: 1px solid #314458; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Siguiente</button>` : ''}
      </div>
    `;
    ul.insertAdjacentHTML('afterend', paginationHtml);

    ul.querySelectorAll('button').forEach(btn=>{
      btn.addEventListener('click',async()=>{
        const li=btn.closest('li');
        const id=li.dataset.id;
        const action=btn.dataset.action;
        
        if(action==='delete'){
          if(confirm('¿Eliminar objetivo?')){
            try {
              await api.goals.remove(id);
              showToast('Objetivo eliminado', 'success');
              renderGoals(currentPage);
            } catch(err) {
              showToast(err.message, 'error');
            }
          }
        }
        
        if(action==='edit'){
          const titleElement = li.querySelector('strong');
          const descElement = li.querySelector('div:nth-child(2)');
          const currentTitle = titleElement.textContent;
          const currentDesc = descElement.textContent;
          
          // Replace text with input fields
          titleElement.innerHTML = `<input type="text" value="${currentTitle}" data-field="title" style="background: #253444; border: 1px solid #314458; border-radius: 4px; padding: 0.3rem; color: var(--text); width: 200px;">`;
          descElement.innerHTML = `<input type="text" value="${currentDesc}" data-field="description" style="background: #253444; border: 1px solid #314458; border-radius: 4px; padding: 0.3rem; color: var(--text); width: 100%;">`;
          
          // Replace edit button with save/cancel
          btn.outerHTML = `
            <button data-action="save">Guardar</button>
            <button data-action="cancel">Cancelar</button>
          `;
          
          // Re-attach event listeners for new buttons
          const saveBtn = li.querySelector('button[data-action="save"]');
          const cancelBtn = li.querySelector('button[data-action="cancel"]');
          
          saveBtn.addEventListener('click', async () => {
            const newTitle = li.querySelector('input[data-field="title"]').value;
            const newDesc = li.querySelector('input[data-field="description"]').value;
            
            try {
              await api.goals.patch(id, { title: newTitle, description: newDesc });
              showToast('Objetivo actualizado', 'success');
              renderGoals(currentPage); // Stay on current page
            } catch(err) {
              showToast(err.message, 'error');
              renderGoals(currentPage); // Revert changes on error
            }
          });
          
          cancelBtn.addEventListener('click', () => {
            renderGoals(currentPage); // Just refresh to revert changes
          });
        }
        
        if(action==='progress'){
          try {
            const result = await api.goals.list(currentPage, itemsPerPage);
            const goal = result.goals.find(g=>g.id==id);
            const delta=Number(btn.dataset.delta);
            const p=Math.min(100,Math.max(0, goal.progress+delta));
            
            await api.goals.patch(id,{progress:p});
            
            // Update DOM directly instead of full re-render
            const progressBar = li.querySelector('.status-progress span');
            const progressText = li.querySelector('.status-progress').nextElementSibling;
            progressBar.style.width = p + '%';
            progressText.textContent = `Progreso: ${p}%`;
            
            showToast('Progreso actualizado', 'success');
          } catch(err) {
            showToast(err.message, 'error');
          }
        }
      });
    });
    
    // Add pagination event handlers
    document.querySelectorAll('button[data-action="prev-page"], button[data-action="next-page"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        if (action === 'prev-page') {
          renderGoals(currentPage - 1);
        } else if (action === 'next-page') {
          renderGoals(currentPage + 1);
        }
      });
    });
    
  }catch(e){ 
    ul.innerHTML=`<li style="color:#f66">${e.message}</li>`; 
    showToast('Error al cargar objetivos', 'error');
  }
}