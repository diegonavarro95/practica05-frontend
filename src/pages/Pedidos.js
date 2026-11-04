import { fetchApi } from '../config/api.js';

export const renderPedidos = async (container, userId, irAlHome) => {
  container.innerHTML = `
    <div class="min-h-screen flex flex-col bg-tech-dark">
      <!-- Navbar Simplificado -->
      <header class="bg-tech-card/80 backdrop-blur-md border-b border-tech-border sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 class="text-2xl font-display font-bold text-white cursor-pointer" id="btn-logo">HW<span class="text-tech-cyan">Store</span></h1>
          <button id="btn-volver" class="text-sm font-medium text-slate-300 hover:text-tech-cyan transition-colors flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Volver al Catálogo
          </button>
        </div>
      </header>

      <main class="flex-grow max-w-4xl mx-auto px-4 py-8 w-full">
        <h2 class="text-3xl font-display font-bold text-white mb-8">Historial de Compras</h2>
        <div id="lista-pedidos" class="space-y-6">
          <div class="flex justify-center py-10"><div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-tech-cyan"></div></div>
        </div>
      </main>
    </div>
  `;

  document.getElementById('btn-volver').addEventListener('click', irAlHome);
  document.getElementById('btn-logo').addEventListener('click', irAlHome);

  const lista = document.getElementById('lista-pedidos');

  try {
    const pedidos = await fetchApi(`/pedidos/${userId}`);
    
    if (pedidos.length === 0) {
      lista.innerHTML = `
        <div class="bg-tech-card border border-tech-border rounded-xl p-10 text-center">
          <p class="text-slate-400">Aún no has realizado ninguna compra.</p>
        </div>`;
      return;
    }

    lista.innerHTML = pedidos.map(pedido => {
      const fecha = new Date(pedido.creado_en).toLocaleDateString('es-MX', { 
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      });
      
      const detallesHTML = pedido.detalles_pedido.map(d => `
        <li class="flex justify-between items-center text-sm border-b border-tech-border/50 py-2 last:border-0">
          <span class="text-slate-300"><span class="text-tech-cyan font-bold">${d.cantidad}x</span> ${d.productos.nombre}</span>
          <span class="text-white font-medium">$${(d.cantidad * d.precio_unitario).toLocaleString('es-MX')}</span>
        </li>
      `).join('');

      return `
        <div class="bg-tech-card border border-tech-border rounded-xl overflow-hidden shadow-lg">
          <div class="bg-tech-dark/50 px-6 py-4 flex flex-wrap justify-between items-center border-b border-tech-border gap-4">
            <div>
              <p class="text-xs text-slate-400 mb-1">ID Orden: <span class="font-mono text-tech-violet">${pedido.id.split('-')[0]}</span></p>
              <p class="text-sm font-medium text-white">${fecha}</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-slate-400 mb-1">Estado: <span class="text-emerald-400 uppercase tracking-wider">${pedido.estado}</span></p>
              <p class="text-xl font-bold font-display text-white">$${Number(pedido.total).toLocaleString('es-MX', {minimumFractionDigits:2})}</p>
            </div>
          </div>
          <div class="px-6 py-4 bg-tech-card">
            <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Artículos</h4>
            <ul class="space-y-1">${detallesHTML}</ul>
          </div>
        </div>
      `;
    }).join('');

  } catch (error) {
    lista.innerHTML = '<p class="text-red-400 text-center p-10 bg-tech-card rounded-xl">Error al cargar el historial.</p>';
  }
};