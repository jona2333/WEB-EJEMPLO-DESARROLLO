import { api } from '../api.js';
import { showToast } from '../views.js';

export async function renderHabits(){
  const ul=document.getElementById('habitsList');
  const form=document.getElementById('habitForm');
  
  form.onsubmit=async e=>{
    e.preventDefault();
    const fd=new FormData(form);
    try{
      await api.habits.create(Object.fromEntries(fd.entries()));
      form.reset();
      showToast('Hábito creado exitosamente', 'success');
      renderHabits();
    }catch(err){ 
      showToast(err.message, 'error'); 
    }
  };

  // Show loading spinner
  ul.innerHTML='<div class="spinner"></div>';
  
  try{
    const habits=await api.habits.list();
    if(!habits.length){ 
      ul.innerHTML='<li>No hay hábitos.</li>'; 
      return; 
    }
    
    const today=new Date().toISOString().slice(0,10);
    ul.innerHTML=habits.map(h=>`
      <li data-id="${h.id}">
        <strong>${h.name}</strong> <span class="badge">${h.frequency}</span>
        <div class="action-buttons">
          <button data-action="done">Marcar hoy</button>
          <button data-action="logs">Ver logs</button>
          <button data-action="delete" class="danger">Eliminar</button>
        </div>
        <div class="logs" style="margin-top:.4rem;font-size:.6rem;"></div>
      </li>
    `).join('');

    ul.querySelectorAll('button').forEach(btn=>{
      btn.addEventListener('click',async()=>{
        const li=btn.closest('li');
        const id=li.dataset.id;
        const act=btn.dataset.action;
        
        if(act==='delete'){
          if(confirm('¿Eliminar hábito?')){ 
            try {
              await api.habits.remove(id); 
              showToast('Hábito eliminado', 'success');
              renderHabits();
            } catch(err) {
              showToast(err.message, 'error');
            }
          }
        }
        
        if(act==='done'){
          try {
            await api.habits.log({habit_id:Number(id),date:today,completed:1});
            showToast('Hábito registrado', 'success');
          } catch(err) {
            showToast(err.message, 'error');
          }
        }
        
        if(act==='logs'){
          try {
            const logs=await api.habits.logs(id);
            li.querySelector('.logs').innerHTML=logs.slice(0,10).map(l=>`<span class="badge" style="background:${l.completed?'#22c55e':'#555'}">${l.log_date}</span>`).join(' ')||'Sin logs';
          } catch(err) {
            showToast(err.message, 'error');
          }
        }
      });
    });
  }catch(e){ 
    ul.innerHTML=`<li style="color:#f66">${e.message}</li>`; 
    showToast('Error al cargar hábitos', 'error');
  }
}