// ===== APLICACIÓN PRINCIPAL STRIPE TUTORIAL =====

// Variable global de Stripe
let stripe = null;

// Estado de la aplicación
let isConnected = false;
let transactions = [];

// Seleccionar modo (test/live)
function selectMode(mode) {
    if (setStripeMode(mode)) {
        // Ocultar selector y mostrar app
        document.getElementById('modeSelector').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        
        // Actualizar indicador de modo
        const modeText = mode === 'test' ? '🧪 Prueba' : '💳 Producción';
        document.getElementById('currentMode').textContent = modeText;
        
        // Inicializar Stripe
        initializeStripe();
        
        // Cargar productos
        displayProducts();
        
        // Actualizar UI del carrito
        updateCartUI();
        
        // Cargar transacciones
        loadTransactions();
    }
}

// Inicializar Stripe
function initializeStripe() {
    const publicKey = getCurrentStripeKey();
    
    if (!publicKey) {
        updateConnectionStatus('error', '❌ Clave de Stripe no configurada');
        mostrarMensaje('Por favor configura las claves de Stripe en Coolify', 'error');
        return;
    }
    
    try {
        // Crear instancia de Stripe
        stripe = Stripe(publicKey);
        isConnected = true;
        updateConnectionStatus('success', '✅ Conectado a Stripe');
        
        // Actualizar panel de debug
        updateDebugPanel();
        
        // Mostrar mensaje según el modo
        if (getStripeMode() === 'test') {
            mostrarMensaje('🧪 Modo prueba activo. Usa la tarjeta 4242 4242 4242 4242', 'info');
        } else {
            mostrarMensaje('💳 Modo producción activo. Se procesarán pagos reales', 'warning');
        }
    } catch (error) {
        console.error('Error inicializando Stripe:', error);
        updateConnectionStatus('error', '❌ Error al conectar con Stripe');
        isConnected = false;
    }
}

// Actualizar estado de conexión
function updateConnectionStatus(status, message) {
    const statusElement = document.getElementById('connectionStatus');
    statusElement.className = `connection-status ${status}`;
    statusElement.querySelector('.status-text').textContent = message;
}

// Mostrar productos
function displayProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    
    PRODUCTS.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.priceDisplay}</div>
                <button class="add-to-cart-btn" onclick="addToCart('${product.id}')" ${!isConnected ? 'disabled' : ''}>
                    Agregar al Carrito
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Actualizar UI del carrito
function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const totalAmount = document.getElementById('totalAmount');
    const checkoutButton = document.getElementById('checkoutButton');
    
    if (shoppingCart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">El carrito está vacío</p>';
        cartTotal.style.display = 'none';
        checkoutButton.style.display = 'none';
    } else {
        // Mostrar items del carrito
        cartItems.innerHTML = shoppingCart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.emoji} ${item.name}</div>
                    <div class="cart-item-price">${item.priceDisplay} cada uno</div>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    <span class="remove-btn" onclick="removeFromCart('${item.id}')">🗑️</span>
                </div>
            </div>
        `).join('');
        
        // Mostrar total
        const total = calculateCartTotal();
        totalAmount.textContent = formatPrice(total);
        cartTotal.style.display = 'block';
        checkoutButton.style.display = 'block';
        checkoutButton.disabled = !isConnected;
    }
}

// Proceder al pago
async function procederAlPago() {
    if (!isConnected || !stripe) {
        mostrarMensaje('Stripe no está conectado', 'error');
        return;
    }
    
    if (shoppingCart.length === 0) {
        mostrarMensaje('El carrito está vacío', 'warning');
        return;
    }
    
    const checkoutButton = document.getElementById('checkoutButton');
    checkoutButton.disabled = true;
    checkoutButton.textContent = 'Procesando...';
    
    try {
        // En una app real, esto llamaría a tu backend
        // Por ahora simulamos la creación de una sesión
        mostrarMensaje('⚠️ Necesitas un backend para crear sesiones de pago', 'warning');
        
        // Código ejemplo de cómo sería con backend:
        /*
        const response = await fetch(getApiEndpoint('createCheckoutSession'), {
            method: 'POST',
            headers: getRequestHeaders(),
            body: JSON.stringify({
                items: getCartItemsForStripe(),
                mode: getStripeMode()
            })
        });
        
        const session = await response.json();
        
        // Redirigir a Stripe Checkout
        const result = await stripe.redirectToCheckout({
            sessionId: session.id
        });
        
        if (result.error) {
            mostrarMensaje(result.error.message, 'error');
        }
        */
        
        // Para el tutorial, mostramos información
        mostrarInfoCheckout();
        
    } catch (error) {
        console.error('Error al procesar pago:', error);
        mostrarMensaje('Error al procesar el pago', 'error');
    } finally {
        checkoutButton.disabled = false;
        checkoutButton.textContent = 'Proceder al Pago';
    }
}

// Mostrar información sobre el checkout (para el tutorial)
function mostrarInfoCheckout() {
    const items = getCartItemsForStripe();
    const total = calculateCartTotal();
    
    const mensaje = `
        <strong>🎓 Tutorial: Checkout de Stripe</strong><br><br>
        Para completar el pago necesitas:<br>
        1. Un backend (Node.js, Python, etc.)<br>
        2. Crear una sesión de Checkout<br>
        3. Redirigir al usuario a Stripe<br><br>
        <strong>Tu pedido:</strong><br>
        ${items.map(item => `- ${item.price_data.product_data.name} x${item.quantity}`).join('<br>')}<br>
        <strong>Total: ${formatPrice(total)}</strong>
    `;
    
    mostrarMensaje(mensaje, 'info', 10000);
}

// Cargar transacciones (simulado)
function loadTransactions() {
    // En una app real, esto vendría de tu backend
    const savedTransactions = localStorage.getItem('stripeTransactions');
    if (savedTransactions) {
        try {
            transactions = JSON.parse(savedTransactions);
            displayTransactions();
        } catch (e) {
            transactions = [];
        }
    }
}

// Mostrar transacciones
function displayTransactions() {
    const list = document.getElementById('transactionsList');
    
    if (transactions.length === 0) {
        list.innerHTML = '<p class="no-transactions">No hay transacciones aún</p>';
    } else {
        list.innerHTML = transactions.map(tx => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-id">ID: ${tx.id}</div>
                    <div class="transaction-date">${new Date(tx.date).toLocaleString()}</div>
                </div>
                <div class="transaction-amount">${formatPrice(tx.amount)}</div>
                <span class="transaction-status status-${tx.status}">${tx.statusText}</span>
            </div>
        `).join('');
    }
}

// Actualizar panel de debug
function updateDebugPanel() {
    const publicKey = getCurrentStripeKey();
    const mode = getStripeMode();
    
    document.getElementById('debugPublicKey').textContent = 
        publicKey ? `${publicKey.substring(0, 20)}...` : 'No configurada';
    
    document.getElementById('debugEndpoint').textContent = 
        getApiEndpoint('createCheckoutSession');
    
    // Mostrar panel solo en modo test
    document.getElementById('debugPanel').style.display = 
        mode === 'test' ? 'block' : 'none';
}

// Mostrar mensajes
function mostrarMensaje(texto, tipo = 'info', duracion = 5000) {
    const container = document.getElementById('messageContainer');
    const message = document.createElement('div');
    message.className = `message ${tipo}`;
    message.innerHTML = texto;
    
    container.appendChild(message);
    
    // Auto-eliminar después de la duración
    setTimeout(() => {
        message.remove();
    }, duracion);
}

// Manejar errores globales
window.addEventListener('error', (event) => {
    console.error('Error global:', event);
    document.getElementById('debugError').textContent = event.message;
});

// Verificar si hay parámetros de retorno de Stripe
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Verificar si viene de un pago exitoso
    if (urlParams.get('success') === 'true') {
        mostrarMensaje('✅ ¡Pago completado exitosamente!', 'success');
        clearCart();
        
        // Simular agregar transacción
        const sessionId = urlParams.get('session_id');
        if (sessionId) {
            transactions.unshift({
                id: sessionId.substring(0, 10),
                date: new Date().toISOString(),
                amount: 0, // En una app real vendría del backend
                status: 'success',
                statusText: 'Completado'
            });
            localStorage.setItem('stripeTransactions', JSON.stringify(transactions));
            displayTransactions();
        }
    }
    
    // Verificar si se canceló el pago
    if (urlParams.get('canceled') === 'true') {
        mostrarMensaje('❌ Pago cancelado', 'warning');
    }
});

// Log inicial
console.log('🚀 Stripe Tutorial App iniciada');
console.log('📚 Abre el panel de debug para más información');