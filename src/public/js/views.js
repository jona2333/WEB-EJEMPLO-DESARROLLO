import { renderDashboard } from './widgets/dashboard.js';
import { renderGoals } from './widgets/goals.js';
import { renderHabits } from './widgets/habits.js';
import { renderJournal } from './widgets/journal.js';
import { renderTasks } from './widgets/tasks.js';

const viewMap = {
  dashboard:'dashboardView',
  goals:'goalsView',
  habits:'habitsView',
  journal:'journalView',
  tasks:'tasksView'
};

export function showView(key){
  document.querySelectorAll('.appView').forEach(v=>v.classList.add('hidden'));
  const id=viewMap[key];
  if(!id) return;
  document.getElementById(id).classList.remove('hidden');
  if (key==='dashboard') renderDashboard();
  if (key==='goals') renderGoals();
  if (key==='habits') renderHabits();
  if (key==='journal') renderJournal();
  if (key==='tasks') renderTasks();
}

export function showAppUI(){
  document.getElementById('authSection').classList.add('hidden');
  showView('dashboard');
}

export function showAuthUI(){
  document.getElementById('authSection').classList.remove('hidden');
  document.querySelectorAll('.appView').forEach(v=>v.classList.add('hidden'));
}