import { Button } from '../components/UI.js';

export const renderWelcome = (container, alContinuar) => {
  container.innerHTML = `
    <div class="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-tech-dark">
      <div class="w-full max-w-md bg-tech-card p-8 rounded-2xl shadow-2xl border border-tech-border relative overflow-hidden">
        <div class="absolute -top-10 -left-10 w-32 h-32 bg-tech-cyan/20 blur-3xl rounded-full"></div>
        
        <h1 class="text-5xl font-display font-bold text-white mb-4 relative z-10">HW<span class="text-tech-cyan">Store</span></h1>
        <p class="text-slate-400 font-sans mb-10 relative z-10">
          Para una experiencia fluida, notificaciones nativas y acceso rápido, instala la aplicación en tu dispositivo.
        </p>
        
        <div class="space-y-4 relative z-10">
          <button id="btn-install" class="w-full py-3 px-4 bg-tech-cyan hover:bg-tech-cyanHover text-slate-900 font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-[1.02] hidden">
            Descargar e Instalar PWA
          </button>
          ${Button({ id: 'btn-web', text: 'Continuar en el Navegador', variant: 'secondary' })}
        </div>
      </div>
    </div>
  `;

  const btnInstall = document.getElementById('btn-install');
  const btnWeb = document.getElementById('btn-web');

  const checkPwaStatus = () => {
    if (window.deferredPrompt) {
      btnInstall.classList.remove('hidden');
    }
  };

  checkPwaStatus();
  window.addEventListener('pwa-ready', checkPwaStatus);

  btnInstall.addEventListener('click', async () => {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      const { outcome } = await window.deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('El usuario aceptó instalar la PWA');
        btnInstall.classList.add('hidden');
        alContinuar(); 
      }
      window.deferredPrompt = null;
    }
  });

  btnWeb.addEventListener('click', () => {
    localStorage.setItem('preferencia_web', 'true');
    alContinuar();
  });
};