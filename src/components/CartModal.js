import { cartService } from '../services/cartService.js';

export const CartModal = (userId, onCartUpdated) => {
  const modalHTML = `
    <div id="cart-backdrop" class="fixed inset-0 bg-tech-dark/80 backdrop-blur-sm z-50 opacity-0 pointer-events-none transition-opacity duration-300"></div>
    <div id="cart-panel" class="fixed top-0 right-0 h-full w-full max-w-md bg-tech-card border-l border-tech-border z-50 transform translate-x-full transition-transform duration-300 flex flex-col shadow-2xl">
      
      <!-- Cabecera del Carrito -->
      <div class="px-6 py-4 border-b border-tech-border flex justify-between items-center bg-tech-dark/50">
        <h2 class="text-xl font-display font-bold text-white">Tu Carrito</h2>
        <button id="btn-close-cart" class="text-slate-400 hover:text-tech-cyan transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <!-- Contenedor de Items -->
      <div id="cart-items-container" class="flex-grow overflow-y-auto p-6 space-y-4">
        <!-- Los items se renderizan aquí -->
      </div>

      <!-- Pie del Carrito (Total y Pagar) -->
      <div class="p-6 border-t border-tech-border bg-tech-dark/50">
        <div class="flex justify-between items-center mb-4">
          <span class="text-slate-400 font-sans">Total Estimado</span>
          <span id="cart-total" class="text-2xl font-bold font-display text-white">$0.00</span>
        </div>
        <button id="btn-checkout" class="w-full py-3 bg-tech-cyan hover:bg-tech-cyanHover text-slate-900 font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          Procesar Pago Seguro
        </button>
        <p id="checkout-msg" class="text-sm text-center mt-2 hidden"></p>
      </div>
    </div>
  `;

  const oldBackdrop = document.getElementById('cart-backdrop');
  const oldPanel = document.getElementById('cart-panel');
  if (oldBackdrop) oldBackdrop.remove();
  if (oldPanel) oldPanel.remove();
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const backdrop = document.getElementById('cart-backdrop');
  const panel = document.getElementById('cart-panel');
  const itemsContainer = document.getElementById('cart-items-container');
  const totalEl = document.getElementById('cart-total');
  const btnCheckout = document.getElementById('btn-checkout');
  const msgEl = document.getElementById('checkout-msg');

  const toggleCart = (show) => {
    if (show) {
      backdrop.classList.remove('opacity-0', 'pointer-events-none');
      panel.classList.remove('translate-x-full');
      loadCartData();
    } else {
      backdrop.classList.add('opacity-0', 'pointer-events-none');
      panel.classList.add('translate-x-full');
    }
  };

  document.getElementById('btn-close-cart').addEventListener('click', () => toggleCart(false));
  backdrop.addEventListener('click', () => toggleCart(false));

  const loadCartData = async () => {
    itemsContainer.innerHTML = '<div class="text-center text-tech-cyan py-10 animate-pulse">Cargando carrito...</div>';
    try {
      const items = await cartService.obtenerCarrito(userId);
      renderItems(items);
      if (onCartUpdated) onCartUpdated(items.length); // Actualiza el badge (la bolita roja) del nav
    } catch (error) {
      itemsContainer.innerHTML = '<p class="text-red-400 text-center">Error al cargar el carrito.</p>';
    }
  };

  const renderItems = (items) => {
    if (items.length === 0) {
      itemsContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full opacity-50">
          <svg class="w-16 h-16 mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          <p class="text-slate-400">Tu carrito está vacío</p>
        </div>`;
      totalEl.textContent = '$0.00';
      btnCheckout.disabled = true;
      return;
    }

    let total = 0;
    itemsContainer.innerHTML = items.map(item => {
      const subtotal = item.cantidad * item.productos.precio;
      total += subtotal;
      return `
        <div class="flex bg-tech-dark rounded-lg p-3 border border-tech-border items-center gap-4">
          <div class="flex-grow">
            <h4 class="text-sm font-bold text-white leading-tight">${item.productos.nombre}</h4>
            <p class="text-xs text-tech-cyan mt-1">Cant: ${item.cantidad} x $${Number(item.productos.precio).toLocaleString('es-MX')}</p>
          </div>
          <div class="text-right">
            <p class="font-bold text-white mb-2">$${subtotal.toLocaleString('es-MX')}</p>
            <button class="btn-delete-item text-xs text-red-400 hover:text-red-300 px-2 py-1 bg-red-400/10 rounded" data-id="${item.id}">
              Eliminar
            </button>
          </div>
        </div>
      `;
    }).join('');

    totalEl.textContent = `$${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
    btnCheckout.disabled = false;

    document.querySelectorAll('.btn-delete-item').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id');
        e.target.innerText = '...';
        await cartService.eliminarItem(id);
        loadCartData(); // Recargamos para recalcular todo
      });
    });
  };

  btnCheckout.addEventListener('click', async () => {
    btnCheckout.disabled = true;
    btnCheckout.innerText = 'Procesando pago...';
    msgEl.classList.add('hidden');

    try {
      const res = await cartService.procesarCheckout(userId);
      msgEl.textContent = `¡Pago exitoso! Orden ID: ${res.pedido_id}`;
      msgEl.className = 'text-sm text-center mt-3 font-bold text-emerald-400 block';
      setTimeout(() => {
        toggleCart(false);
        btnCheckout.innerText = 'Procesar Pago Seguro';
        msgEl.classList.add('hidden');
        window.location.reload(); // Recargar para actualizar los stocks en el catálogo
      }, 3000);
    } catch (error) {
      msgEl.textContent = error.message;
      msgEl.className = 'text-sm text-center mt-3 text-red-400 block';
      btnCheckout.disabled = false;
      btnCheckout.innerText = 'Procesar Pago Seguro';
    }
  });

  return { toggleCart, loadCartData };
};