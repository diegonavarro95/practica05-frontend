import { fetchApi } from '../config/api.js';

export const cartService = {
  obtenerCarrito: async (usuario_id) => {
    return await fetchApi(`/carritos/${usuario_id}`);
  },
  
  agregarItem: async (usuario_id, producto_id, cantidad = 1) => {
    return await fetchApi('/carritos', {
      method: 'POST',
      body: JSON.stringify({ usuario_id, producto_id, cantidad })
    });
  },
  
  eliminarItem: async (carrito_id) => {
    return await fetchApi(`/carritos/${carrito_id}`, {
      method: 'DELETE'
    });
  },

  procesarCheckout: async (usuario_id) => {
    return await fetchApi('/pedidos', {
      method: 'POST',
      body: JSON.stringify({ usuario_id })
    });
  }
};