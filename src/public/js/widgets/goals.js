import { api } from '../api.js';
export async function renderGoals(){
  const ul=document.getElementById('goalsList');
  const form=document.getElementById('goalForm');
  form.onsubmit=async e=>{
    e.preventDefault();
    const fd=new FormData(form);
    try{
      await api.goals.create(Object.fromEntries(fd.entries()));
      form.reset();
      renderGoals();
    }catch(err){ alert(err.message); }
  };
  ul.innerHTML='Cargando...';
  try{
    const goals=await api.goals.list();
    if(!goals.length){ ul.innerHTML='<li>No hay objetivos.</li>'; return; }
    ul.innerHTML=goals.map(g=>`
      <li data-id="${g.id}">
        <strong>${g.title}</strong> ${g.target_date?`<span class="badge">${g.target_date}</span>`:''}
        <div>${g.description||''}</div>
        <div class="status-progress"><span style="width:${g.progress}%;"></span></div>
        <div style="font-size:.65rem;opacity:.7;margin-top:.25rem;">Progreso: ${g.progress}%</div>
        <div class="action-buttons">
          <button data-action="progress" data-delta="+10">+10%</button>
          <button data-action="progress" data-delta="-10">-10%</button>
          <button data-action="delete" class="danger">Eliminar</button>
        </div>
      </li>
    `).join('');
    ul.querySelectorAll('button').forEach(btn=>{
      btn.addEventListener('click',async()=>{
        const li=btn.closest('li');
        const id=li.dataset.id;
        const action=btn.dataset.action;
        if(action==='delete'){
          if(confirm('¿Eliminar objetivo?')){
            await api.goals.remove(id);
            renderGoals();
          }
        }
        if(action==='progress'){
          const goalsList=await api.goals.list();
          const goal=goalsList.find(g=>g.id==id);
          const delta=Number(btn.dataset.delta);
          const p=Math.min(100,Math.max(0, goal.progress+delta));
            await api.goals.patch(id,{progress:p});
            renderGoals();
        }
      });
    });
  }catch(e){ ul.innerHTML=`<li style="color:#f66">${e.message}</li>`; }
}