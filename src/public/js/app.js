import { api, setToken } from './api.js';
import { showAppUI, showAuthUI, showView } from './views.js';

document.getElementById('nav').addEventListener('click', e=>{
  if(e.target.matches('button[data-view]')) showView(e.target.dataset.view);
});
document.getElementById('logoutBtn').addEventListener('click',()=>{
  setToken(null);
  showAuthUI();
});

const registerForm=document.getElementById('registerForm');
const loginForm=document.getElementById('loginForm');

registerForm.addEventListener('submit', async e=>{
  e.preventDefault();
  const fd=new FormData(registerForm);
  const { email, password }=Object.fromEntries(fd.entries());
  const msg=registerForm.querySelector('[data-msg-register]');
  msg.textContent='...';
  try{
    const { token }=await api.register(email,password);
    setToken(token);
    msg.textContent='Registrado';
    showAppUI();
  }catch(err){ msg.textContent=err.message; }
});

loginForm.addEventListener('submit', async e=>{
  e.preventDefault();
  const fd=new FormData(loginForm);
  const { email, password }=Object.fromEntries(fd.entries());
  const msg=loginForm.querySelector('[data-msg-login]');
  msg.textContent='...';
  try{
    const { token }=await api.login(email,password);
    setToken(token);
    msg.textContent='Bienvenido';
    showAppUI();
  }catch(err){ msg.textContent=err.message; }
});