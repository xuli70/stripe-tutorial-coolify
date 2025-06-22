// ===== CATÁLOGO DE PRODUCTOS =====
// Productos de ejemplo para el tutorial

const PRODUCTS = [
    {
        id: 'prod_tutorial_coffee',
        name: 'Café Premium ☕',
        description: 'Café de especialidad tostado artesanalmente',
        price: 499, // En centavos (4.99€)
        priceDisplay: '€4.99',
        emoji: '☕',
        category: 'bebidas'
    },
    {
        id: 'prod_tutorial_book',
        name: 'Libro Digital 📚',
        description: 'Guía completa de programación web',
        price: 1999, // 19.99€
        priceDisplay: '€19.99',
        emoji: '📚',
        category: 'digital'
    },
    {
        id: 'prod_tutorial_course',
        name: 'Curso Online 🎓',
        description: 'Acceso completo al curso de JavaScript',
        price: 4999, // 49.99€
        priceDisplay: '€49.99',
        emoji: '🎓',
        category: 'cursos'
    },
    {
        id: 'prod_tutorial_tshirt',
        name: 'Camiseta Dev 👕',
        description: 'Camiseta "Hello World" edición limitada',
        price: 2499, // 24.99€
        priceDisplay: '€24.99',
        emoji: '👕',
        category: 'merchandising'
    },
    {
        id: 'prod_tutorial_sticker',
        name: 'Pack Stickers 🎨',
        description: 'Pack de 10 stickers para desarrolladores',
        price: 999, // 9.99€
        priceDisplay: '€9.99',
        emoji: '🎨',
        category: 'merchandising'
    },
    {
        id: 'prod_tutorial_donation',
        name: 'Donación ❤️',
        description: 'Apoya el desarrollo del proyecto',
        price: 100, // 1.00€
        priceDisplay: '€1.00+',
        emoji: '❤️',
        category: 'donacion',
        customAmount: true // Permite montos personalizados
    }
];

// Carrito de compras (en memoria)
let shoppingCart = [];

// Cargar carrito desde localStorage
function loadCart() {
    const savedCart = localStorage.getItem('stripeCart');
    if (savedCart) {
        try {
            shoppingCart = JSON.parse(savedCart);
        } catch (e) {
            console.error('Error cargando carrito:', e);
            shoppingCart = [];
        }
    }
}

// Guardar carrito en localStorage
function saveCart() {
    localStorage.setItem('stripeCart', JSON.stringify(shoppingCart));
}

// Agregar producto al carrito
function addToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) {
        console.error('Producto no encontrado:', productId);
        return;
    }
    
    // Verificar si ya está en el carrito
    const existingItem = shoppingCart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        shoppingCart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            priceDisplay: product.priceDisplay,
            emoji: product.emoji,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    mostrarMensaje(`${product.emoji} ${product.name} agregado al carrito`, 'success');
}

// Actualizar cantidad en el carrito
function updateCartQuantity(productId, quantity) {
    const item = shoppingCart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart();
            updateCartUI();
        }
    }
}

// Eliminar del carrito
function removeFromCart(productId) {
    shoppingCart = shoppingCart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    mostrarMensaje('Producto eliminado del carrito', 'info');
}

// Vaciar carrito
function clearCart() {
    shoppingCart = [];
    saveCart();
    updateCartUI();
}

// Calcular total del carrito
function calculateCartTotal() {
    return shoppingCart.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

// Formatear precio para mostrar
function formatPrice(cents) {
    return `€${(cents / 100).toFixed(2)}`;
}

// Obtener items del carrito para Stripe
function getCartItemsForStripe() {
    return shoppingCart.map(item => ({
        price_data: {
            currency: 'eur',
            product_data: {
                name: item.name,
                description: `${item.emoji} ${item.name}`
            },
            unit_amount: item.price
        },
        quantity: item.quantity
    }));
}

// Inicializar productos
loadCart();