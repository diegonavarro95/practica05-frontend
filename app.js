const API_URL = 'https://practica05-backend.onrender.com/api/v1';

const contenedorProductos = document.getElementById('lista-productos');
const consolaTicket = document.getElementById('ticket-compra');

// Función para obtener (GET) y renderizar productos
async function cargarInventario() {
    try {
        const respuesta = await fetch(`${API_URL}/productos`);
        const productos = await respuesta.json();

        contenedorProductos.innerHTML = '';

        productos.forEach(producto => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta-producto';
            
            const sinStock = producto.stock === 0;
            
            tarjeta.innerHTML = `
                <h3>${producto.nombre}</h3>
                <p class="precio">$${producto.precio} MXN</p>
                <p class="stock">Disponibles: ${producto.stock} unidades</p>
                <button 
                    onclick="comprarProducto(${producto.id}, '${producto.nombre}')" 
                    ${sinStock ? 'disabled' : ''}>
                    ${sinStock ? 'Agotado' : 'Comprar 1 Unidad'}
                </button>
            `;
            contenedorProductos.appendChild(tarjeta);
        });

    } catch (error) {
        contenedorProductos.innerHTML = '<p style="color:red;">Error de conexión con el Servidor REST.</p>';
        console.error("Error:", error);
    }
}

// Función para enviar (POST) una orden de compra
async function comprarProducto(idProducto, nombreProducto) {
    try {
        consolaTicket.textContent = "Procesando transacción...";

        const payload = {
            productoId: idProducto,
            cantidad: 1,
            cliente: "Usuario Demo"
        };

        const respuesta = await fetch(`${API_URL}/pedidos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await respuesta.json();

        if (respuesta.status === 201) {
            consolaTicket.textContent = `[201 CREATED]\n\nÉxito: ${data.mensaje}\nTicket ID: ${data.pedido.idPedido}\nProducto: ${data.pedido.producto}\nTotal Pagado: $${data.pedido.totalPagado}`;
            cargarInventario();
        } else {
            // Error manejado por el servidor
            consolaTicket.textContent = `[${respuesta.status} ERROR]\n\nFallo en la transacción:\n${data.error}`;
        }

    } catch (error) {
        consolaTicket.textContent = "[ERROR CRÍTICO] No se pudo contactar al servidor.";
    }
}

cargarInventario();