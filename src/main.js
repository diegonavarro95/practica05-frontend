import './assets/style.css';
import { registerSW } from 'virtual:pwa-register';
import { supabase } from './config/supabase.js';

import { renderWelcome } from './pages/Welcome.js';
import { renderLogin } from './pages/Login.js';
import { renderHome } from './pages/Home.js';

window.deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.deferredPrompt = e;
  // Disparamos un evento custom por si la pantalla Welcome ya está renderizada
  window.dispatchEvent(new Event('pwa-ready'));
});

const appRoot = document.getElementById('app-root');

registerSW({
  onNeedRefresh() { console.log("Actualización PWA disponible."); },
  onOfflineReady() { console.log("PWA lista para uso offline."); },
});

export const router = async () => {
  appRoot.innerHTML = '<div class="flex h-screen items-center justify-center text-tech-cyan"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tech-cyan"></div></div>';
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    renderHome(appRoot, session.user.id);
  } else {
    const omitirWelcome = localStorage.getItem('preferencia_web') === 'true';
    
    if (omitirWelcome) {
      renderLogin(appRoot);
    } else {
      renderWelcome(appRoot, () => renderLogin(appRoot));
    }
  }
};

supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
    router();
  }
});

router();