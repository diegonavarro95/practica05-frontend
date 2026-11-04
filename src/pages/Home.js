import { fetchApi } from '../config/api.js';
import { supabase } from '../config/supabase.js';
import { cartService } from '../services/cartService.js';
import { CartModal } from '../components/CartModal.js';

export const renderHome = async (container, userId) => {
  container.innerHTML = `
    <div class="min-h-screen flex flex-col bg-tech-dark">
      <header class="bg-tech-card/80 backdrop-blur-md border-b border-tech-border sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 class="text-2xl font-display font-bold text-white">HW<span class="text-tech-cyan">Store</span></h1>
          
          <div class="flex items-center gap-6">
            <button id="btn-pedidos" class="text-sm text-slate-300 hover:text-white hidden sm:block">Mis Pedidos</button>
            <button id="btn-cart" class="text-slate-300 hover:text-white relative">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              <span id="cart-badge" class="absolute -top-2 -right-2 bg-tech-violet text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center opacity-0 transition-opacity">0</span>
            </button>
            <button id="btn-account" class="text-slate-300 hover:text-tech-cyan"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg></button>
          </div>
        </div>
      </header>

      <main class="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        <div id="grid-productos" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div class="col-span-full py-12 flex justify-center"><div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-tech-cyan"></div></div>
        </div>
      </main>
    </div>
  `;

  // Inicializar Modal del Carrito
  const updateBadge = (count) => {
    const badge = document.getElementById('cart-badge');
    badge.textContent = count;
    count > 0 ? badge.classList.remove('opacity-0') : badge.classList.add('opacity-0');
  };
  
  const cart = CartModal(userId, updateBadge);
  document.getElementById('btn-cart').addEventListener('click', () => cart.toggleCart(true));

  // Cargar Catálogo
  const grid = document.getElementById('grid-productos');
  try {
    const productos = await fetchApi('/productos');
    grid.innerHTML = productos.map(p => `
      <div class="bg-tech-card border border-tech-border rounded-xl p-5 flex flex-col hover:border-tech-cyan/40 shadow-lg">
        <div class="flex justify-between items-start mb-3">
          <span class="text-xs font-semibold text-tech-cyan bg-tech-cyan/10 px-2 py-1 rounded-md">${p.categoria}</span>
          <span class="text-xs font-medium ${p.stock > 0 ? 'text-emerald-400' : 'text-red-400'}">${p.stock > 0 ? `Stock: ${p.stock}` : 'Agotado'}</span>
        </div>
        <h3 class="text-lg font-bold text-white mb-2">${p.nombre}</h3>
        <p class="text-sm text-slate-400 flex-grow mb-6 line-clamp-3">${p.descripcion}</p>
        <div class="text-2xl font-display font-bold text-white mb-4">$${Number(p.precio).toLocaleString('es-MX', {minimumFractionDigits: 2})}</div>
        <button
          class="add-to-cart-btn w-full py-2.5 rounded-lg font-bold transition-all ${p.stock > 0 ? 'bg-tech-border text-white hover:bg-tech-cyan hover:text-slate-900' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}"
          data-id="${p.id}" ${p.stock === 0 ? 'disabled' : ''}
        >${p.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}</button>
      </div>
    `).join('');

    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id');
        const prevText = e.target.innerText;
        e.target.innerText = 'Agregando...';
        try {
          await cartService.agregarItem(userId, id, 1);
          cart.loadCartData(); // Recargar el modal en segundo plano para actualizar el badge
          e.target.innerText = '¡Agregado!';
          setTimeout(() => e.target.innerText = prevText, 1500);
        } catch (error) {
          alert('Error al agregar el producto');
          e.target.innerText = prevText;
        }
      });
    });

  } catch (error) {
    grid.innerHTML = '<p class="col-span-full text-center text-red-400">Error conectando con el servidor.</p>';
  }

  cart.loadCartData();

  // Lógica de Navegación a Pedidos
  const btnPedidos = document.getElementById('btn-pedidos');
  if (btnPedidos) {
    btnPedidos.addEventListener('click', async () => {
      const { renderPedidos } = await import('./Pedidos.js');
      renderPedidos(container, userId, () => renderHome(container, userId));
    });
  }

  // Cerrar Sesión
  document.getElementById('btn-account').addEventListener('click', async () => {
    if (confirm("¿Deseas cerrar sesión?")) await supabase.auth.signOut();
  });
};