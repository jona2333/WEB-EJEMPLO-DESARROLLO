import { api } from '../api.js';
import { showToast } from '../views.js';

export async function renderTasks(){
  const ul=document.getElementById('tasksList');
  const form=document.getElementById('taskForm');
  
  form.onsubmit=async e=>{
    e.preventDefault();
    const fd=new FormData(form);
    try{
      await api.tasks.create(Object.fromEntries(fd.entries()));
      form.reset();
      showToast('Tarea creada exitosamente', 'success');
      renderTasks();
    }catch(err){ 
      showToast(err.message, 'error'); 
    }
  };

  // Show loading spinner
  ul.innerHTML='<div class="spinner"></div>';
  
  try{
    const tasks=await api.tasks.list();
    if(!tasks.length){ 
      ul.innerHTML='<li>No hay tareas.</li>'; 
      return; 
    }
    
    ul.innerHTML=tasks.map(t=>`
      <li data-id="${t.id}">
        <label style="display:flex;gap:.5rem;align-items:center;">
          <input type="checkbox" data-action="toggle" ${t.done?'checked':''}/>
          <span style="${t.done?'text-decoration:line-through;opacity:.6;':''}">${t.title}</span>
        </label>
        <div style="font-size:.55rem;opacity:.6;margin-top:.3rem;">
          Prioridad: <strong>${t.priority}</strong>${t.due_date?' | vence: '+t.due_date:''}
        </div>
        <div class="action-buttons">
          <button data-action="delete" class="danger">Eliminar</button>
        </div>
      </li>
    `).join('');

    ul.querySelectorAll('input[data-action="toggle"]').forEach(chk=>{
      chk.addEventListener('change',async()=>{
        const li = chk.closest('li');
        const id = li.dataset.id;
        try {
          await api.tasks.patch(id, { done: chk.checked });
          
          // Update DOM directly instead of full re-render
          const span = li.querySelector('span');
          span.style.textDecoration = chk.checked ? 'line-through' : 'none';
          span.style.opacity = chk.checked ? '0.6' : '1';
          
          showToast('Tarea actualizada', 'success');
        } catch (err) {
          showToast(err.message, 'error');
          chk.checked = !chk.checked; // Revert change if API fails
        }
      });
    });

    ul.querySelectorAll('button[data-action="delete"]').forEach(btn=>{
      btn.addEventListener('click',async()=>{
        const id=btn.closest('li').dataset.id;
        if(confirm('¿Eliminar tarea?')){
          try {
            await api.tasks.remove(id);
            showToast('Tarea eliminada', 'success');
            renderTasks();
          } catch(err) {
            showToast(err.message, 'error');
          }
        }
      });
    });
  }catch(e){ 
    ul.innerHTML=`<li style="color:#f66">${e.message}</li>`; 
    showToast('Error al cargar tareas', 'error');
  }
}