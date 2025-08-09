import { api } from '../api.js';
let chart;
export async function renderDashboard(){
  const container=document.getElementById('dashboardCards');
  container.innerHTML='Cargando...';
  try{
    const data=await api.dashboard();
    container.innerHTML=`
      <div class="card"><div class="metric">Objetivos</div><div class="value">${data.goalsCount}</div></div>
      <div class="card"><div class="metric">Tareas abiertas</div><div class="value">${data.tasksOpen}</div></div>
      <div class="card"><div class="metric">Tareas hechas</div><div class="value">${data.tasksDone}</div></div>
      <div class="card"><div class="metric">Hábitos</div><div class="value">${data.habits}</div></div>
      <div class="card"><div class="metric">Entradas 7d</div><div class="value">${data.journalEntries7}</div></div>
      <div class="card"><div class="metric">Progreso medio</div><div class="value">${data.progressAvg}%</div></div>
    `;
    renderChart(data);
  }catch(e){
    container.innerHTML=`<span style="color:#f66">${e.message}</span>`;
  }
}
function renderChart(d){
  const ctx=document.getElementById('progressChart').getContext('2d');
  if(chart) chart.destroy();
  chart=new Chart(ctx,{
    type:'radar',
    data:{
      labels:['Objetivos','Tareas abiertas','Tareas hechas','Hábitos','Entradas 7d','Progreso %'],
      datasets:[{
        label:'Indicadores',
        data:[d.goalsCount,d.tasksOpen,d.tasksDone,d.habits,d.journalEntries7,d.progressAvg],
        fill:true,
        backgroundColor:'rgba(77,171,247,0.2)',
        borderColor:'#4dabf7',
        pointBackgroundColor:'#a78bfa'
      }]
    },
    options:{
      responsive:true,
      scales:{ r:{ grid:{color:'#243444'}, angleLines:{color:'#243444'}, pointLabels:{color:'#eee'}, ticks:{color:'#ccc', backdropColor:'transparent'} } },
      plugins:{ legend:{ labels:{ color:'#eee'} } }
    }
  });
}