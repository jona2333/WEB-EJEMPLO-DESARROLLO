const API_BASE = '/api';
let authToken = null;

export function setToken(t){ authToken=t; }
export function getToken(){ return authToken; }

async function request(path, options = {}) {
  const headers = options.headers || {};
  if (authToken) headers.Authorization = 'Bearer '+authToken;
  if (!(options.body instanceof FormData)) headers['Content-Type']='application/json';
  const res = await fetch(API_BASE + path, { ...options, headers });
  if (!res.ok) {
    let msg='Error'; try{ const j=await res.json(); msg=j.error||JSON.stringify(j);}catch{}
    throw new Error(msg);
  }
  if (res.status===204) return null;
  return res.json();
}

export const api = {
  register:(email,password)=>request('/auth/register',{method:'POST',body:JSON.stringify({email,password})}),
  login:(email,password)=>request('/auth/login',{method:'POST',body:JSON.stringify({email,password})}),
  dashboard:()=>request('/dashboard/overview'),
  goals:{
    list:()=>request('/goals'),
    create:d=>request('/goals',{method:'POST',body:JSON.stringify(d)}),
    patch:(id,d)=>request(`/goals/${id}`,{method:'PATCH',body:JSON.stringify(d)}),
    remove:id=>request(`/goals/${id}`,{method:'DELETE'})
  },
  habits:{
    list:()=>request('/habits'),
    create:d=>request('/habits',{method:'POST',body:JSON.stringify(d)}),
    remove:id=>request(`/habits/${id}`,{method:'DELETE'}),
    log:d=>request('/habits/log',{method:'POST',body:JSON.stringify(d)}),
    logs:id=>request(`/habits/${id}/logs`)
  },
  journal:{
    list:()=>request('/journal'),
    create:d=>request('/journal',{method:'POST',body:JSON.stringify(d)}),
    remove:id=>request(`/journal/${id}`,{method:'DELETE'})
  },
  tasks:{
    list:()=>request('/tasks'),
    create:d=>request('/tasks',{method:'POST',body:JSON.stringify(d)}),
    patch:(id,d)=>request(`/tasks/${id}`,{method:'PATCH',body:JSON.stringify(d)}),
    remove:id=>request(`/tasks/${id}`,{method:'DELETE'})
  }
};