// ===== CONFIGURACIÓN DE STRIPE =====
// Este archivo maneja la configuración segura de Stripe

// Estado actual del modo (test/live)
let currentMode = localStorage.getItem('stripeMode') || null;

// Configuración de Stripe
const STRIPE_CONFIG = {
    // URLs base para el API
    apiUrl: window.ENV?.API_URL || window.location.origin,
    
    // Claves públicas de Stripe (las secretas NUNCA van en el frontend)
    keys: {
        test: window.ENV?.STRIPE_TEST_PUBLIC_KEY || 'pk_test_configurar_en_coolify',
        live: window.ENV?.STRIPE_LIVE_PUBLIC_KEY || 'pk_live_configurar_en_coolify'
    },
    
    // Endpoints del backend
    endpoints: {
        createCheckoutSession: '/api/create-checkout-session',
        getTransactions: '/api/transactions',
        webhooks: '/api/webhooks/stripe'
    },
    
    // URLs de retorno después del pago
    urls: {
        success: `${window.location.origin}/success.html`,
        cancel: `${window.location.origin}/cancel.html`
    }
};

// Obtener la clave pública actual según el modo
function getCurrentStripeKey() {
    if (!currentMode) {
        console.warn('⚠️ No se ha seleccionado un modo de Stripe');
        return null;
    }
    
    const key = STRIPE_CONFIG.keys[currentMode];
    
    // Validar que la clave esté configurada
    if (!key || key.includes('configurar_en_coolify')) {
        console.error(`❌ Clave de Stripe para modo ${currentMode} no configurada`);
        return null;
    }
    
    return key;
}

// Establecer el modo de Stripe
function setStripeMode(mode) {
    if (['test', 'live'].includes(mode)) {
        currentMode = mode;
        localStorage.setItem('stripeMode', mode);
        console.log(`✅ Modo de Stripe establecido: ${mode}`);
        return true;
    }
    console.error('❌ Modo de Stripe inválido:', mode);
    return false;
}

// Obtener el modo actual
function getStripeMode() {
    return currentMode;
}

// Verificar si las claves están configuradas
function verificarConfiguracionStripe() {
    const errores = [];
    
    // Verificar claves según el modo
    if (currentMode === 'test') {
        if (!window.ENV?.STRIPE_TEST_PUBLIC_KEY || 
            window.ENV.STRIPE_TEST_PUBLIC_KEY.includes('configurar')) {
            errores.push('STRIPE_TEST_PUBLIC_KEY no configurada');
        }
    } else if (currentMode === 'live') {
        if (!window.ENV?.STRIPE_LIVE_PUBLIC_KEY || 
            window.ENV.STRIPE_LIVE_PUBLIC_KEY.includes('configurar')) {
            errores.push('STRIPE_LIVE_PUBLIC_KEY no configurada');
        }
    }
    
    // Verificar API URL
    if (!window.ENV?.API_URL && window.location.hostname === 'localhost') {
        console.warn('⚠️ API_URL no configurada, usando localhost para desarrollo');
    }
    
    if (errores.length > 0) {
        console.error('❌ Errores de configuración:', errores);
        return false;
    }
    
    console.log('✅ Configuración de Stripe verificada correctamente');
    return true;
}

// Construir URL completa para un endpoint
function getApiEndpoint(endpoint) {
    return `${STRIPE_CONFIG.apiUrl}${STRIPE_CONFIG.endpoints[endpoint]}`;
}

// Headers comunes para las peticiones
function getRequestHeaders() {
    return {
        'Content-Type': 'application/json',
        'X-Stripe-Mode': currentMode || 'test'
    };
}

// Información de tarjetas de prueba
const TEST_CARDS = {
    success: {
        number: '4242 4242 4242 4242',
        description: 'Pago exitoso'
    },
    declined: {
        number: '4000 0000 0000 0002',
        description: 'Tarjeta rechazada'
    },
    insufficient: {
        number: '4000 0000 0000 9995',
        description: 'Fondos insuficientes'
    },
    authentication: {
        number: '4000 0025 0000 3155',
        description: 'Requiere autenticación'
    }
};

// Exportar funciones de validación
function validarMontoPago(amount) {
    // Stripe requiere montos en centavos y mínimo 50 centavos
    if (typeof amount !== 'number' || amount < 50) {
        throw new Error('El monto mínimo es 0.50€');
    }
    return true;
}

// Log de configuración (para debug)
console.log('📋 Configuración de Stripe cargada');
console.log('   - Modo actual:', currentMode || 'No seleccionado');
console.log('   - Variables de entorno:', window.ENV ? '✅ Cargadas' : '❌ No cargadas');