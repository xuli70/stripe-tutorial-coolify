#!/bin/sh
# Script para inyectar variables de entorno de Stripe

echo "🚀 Iniciando aplicación Stripe Tutorial..."

# Crear archivo env.js con las variables de entorno
cat > /app/env.js << EOF
// Variables de entorno inyectadas por Coolify
window.ENV = {
    // URL del API (backend)
    API_URL: "${API_URL:-http://localhost:3000}",
    
    // Claves públicas de Stripe (NUNCA pongas las secretas aquí)
    STRIPE_TEST_PUBLIC_KEY: "${STRIPE_TEST_PUBLIC_KEY}",
    STRIPE_LIVE_PUBLIC_KEY: "${STRIPE_LIVE_PUBLIC_KEY}",
    
    // Modo por defecto
    DEFAULT_MODE: "${STRIPE_DEFAULT_MODE:-test}",
    
    // URLs de webhook (para referencia)
    WEBHOOK_URL: "${WEBHOOK_URL:-${API_URL}/api/webhooks/stripe}"
};

console.log('✅ Variables de entorno cargadas');
console.log('   - Modo:', window.ENV.DEFAULT_MODE);
console.log('   - API URL:', window.ENV.API_URL);
console.log('   - Test Key:', window.ENV.STRIPE_TEST_PUBLIC_KEY ? '✅ Configurada' : '❌ No configurada');
console.log('   - Live Key:', window.ENV.STRIPE_LIVE_PUBLIC_KEY ? '✅ Configurada' : '❌ No configurada');
EOF

echo "✅ Variables de entorno configuradas"

# Verificar que las variables críticas estén configuradas
if [ -z "$STRIPE_TEST_PUBLIC_KEY" ]; then
    echo "⚠️  ADVERTENCIA: STRIPE_TEST_PUBLIC_KEY no está configurada"
fi

# Iniciar Caddy
echo "🌐 Iniciando servidor web en puerto ${PORT:-8080}..."
exec caddy run --config /app/Caddyfile --adapter caddyfile