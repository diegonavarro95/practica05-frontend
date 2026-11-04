import { Input, Button } from '../components/UI.js';
import { supabase } from '../config/supabase.js';

export const renderLogin = (container) => {
  let modoRegistro = false;

  const renderHTML = () => {
    container.innerHTML = `
      <div class="flex min-h-screen items-center justify-center p-4">
        <div class="w-full max-w-md bg-tech-card border border-tech-border rounded-2xl shadow-2xl overflow-hidden">
          <div class="p-6 md:p-8">
            <div class="text-center mb-8">
              <h1 class="text-3xl font-bold font-display text-white mb-2">
                ${modoRegistro ? 'Crear Cuenta' : 'Bienvenido de nuevo'}
              </h1>
              <p class="text-slate-400 text-sm font-sans">
                ${modoRegistro ? 'Únete al núcleo de hardware' : 'Accede a tu cuenta para continuar'}
              </p>
            </div>
            
            <form id="auth-form" class="space-y-2">
              ${Input({ id: 'email', label: 'Correo Electrónico', type: 'email', placeholder: 'usuario@ejemplo.com' })}
              ${Input({ id: 'password', label: 'Contraseña', type: 'password', placeholder: '••••••••' })}
              
              <div class="pt-6 space-y-4">
                ${Button({ id: 'btn-submit', text: modoRegistro ? 'Registrarse' : 'Iniciar Sesión', variant: 'primary' })}
                <button type="button" id="btn-toggle" class="w-full text-sm text-slate-400 hover:text-tech-cyan transition-colors">
                  ${modoRegistro ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí'}
                </button>
              </div>
              <p id="auth-error" class="text-sm text-red-400 mt-4 text-center hidden font-sans bg-red-400/10 p-3 rounded-lg border border-red-500/20"></p>
            </form>
          </div>
        </div>
      </div>
    `;
    asignarEventos();
  };

  const asignarEventos = () => {
    const btnSubmit = document.getElementById('btn-submit');
    const btnToggle = document.getElementById('btn-toggle');
    const errorEl = document.getElementById('auth-error');

    btnToggle.addEventListener('click', () => {
      modoRegistro = !modoRegistro;
      renderHTML(); // Re-renderizamos para cambiar los textos
    });

    btnSubmit.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      
      if (!email || !password) {
        errorEl.textContent = 'Completa todos los campos.';
        errorEl.classList.remove('hidden');
        return;
      }

      btnSubmit.innerText = 'Procesando...';
      errorEl.classList.add('hidden');

      try {
        const { error } = modoRegistro 
          ? await supabase.auth.signUp({ email, password })
          : await supabase.auth.signInWithPassword({ email, password });

        if (error) throw error;
      } catch (error) {
        errorEl.textContent = error.message;
        errorEl.classList.remove('hidden');
        btnSubmit.innerText = modoRegistro ? 'Registrarse' : 'Iniciar Sesión';
      }
    });
  };

  renderHTML();
};