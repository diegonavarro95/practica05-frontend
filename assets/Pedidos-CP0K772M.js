import{t as e}from"./index-D2WQL74G.js";var t=async(t,n,r)=>{t.innerHTML=`
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
  `,document.getElementById(`btn-volver`).addEventListener(`click`,r),document.getElementById(`btn-logo`).addEventListener(`click`,r);let i=document.getElementById(`lista-pedidos`);try{let t=await e(`/pedidos/${n}`);if(t.length===0){i.innerHTML=`
        <div class="bg-tech-card border border-tech-border rounded-xl p-10 text-center">
          <p class="text-slate-400">Aún no has realizado ninguna compra.</p>
        </div>`;return}i.innerHTML=t.map(e=>{let t=new Date(e.creado_en).toLocaleDateString(`es-MX`,{year:`numeric`,month:`long`,day:`numeric`,hour:`2-digit`,minute:`2-digit`}),n=e.detalles_pedido.map(e=>`
        <li class="flex justify-between items-center text-sm border-b border-tech-border/50 py-2 last:border-0">
          <span class="text-slate-300"><span class="text-tech-cyan font-bold">${e.cantidad}x</span> ${e.productos.nombre}</span>
          <span class="text-white font-medium">$${(e.cantidad*e.precio_unitario).toLocaleString(`es-MX`)}</span>
        </li>
      `).join(``);return`
        <div class="bg-tech-card border border-tech-border rounded-xl overflow-hidden shadow-lg">
          <div class="bg-tech-dark/50 px-6 py-4 flex flex-wrap justify-between items-center border-b border-tech-border gap-4">
            <div>
              <p class="text-xs text-slate-400 mb-1">ID Orden: <span class="font-mono text-tech-violet">${e.id.split(`-`)[0]}</span></p>
              <p class="text-sm font-medium text-white">${t}</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-slate-400 mb-1">Estado: <span class="text-emerald-400 uppercase tracking-wider">${e.estado}</span></p>
              <p class="text-xl font-bold font-display text-white">$${Number(e.total).toLocaleString(`es-MX`,{minimumFractionDigits:2})}</p>
            </div>
          </div>
          <div class="px-6 py-4 bg-tech-card">
            <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Artículos</h4>
            <ul class="space-y-1">${n}</ul>
          </div>
        </div>
      `}).join(``)}catch{i.innerHTML=`<p class="text-red-400 text-center p-10 bg-tech-card rounded-xl">Error al cargar el historial.</p>`}};export{t as renderPedidos};