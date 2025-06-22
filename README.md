# 💳 Tutorial Stripe con Coolify

Una aplicación web educativa para aprender a integrar Stripe, preparada para desplegarse con Coolify en tu VPS.

## 🎯 Objetivo

Aprender cómo funciona Stripe implementando una tienda simple con:
- Modo desarrollo/prueba y producción
- Carrito de compras
- Integración con Stripe Checkout
- Despliegue seguro con variables de entorno

## 🚀 Características

- ✅ Selector de modo (Test/Live)
- ✅ Catálogo de productos
- ✅ Carrito de compras funcional
- ✅ Integración con Stripe.js
- ✅ Panel de debug para desarrollo
- ✅ Historial de transacciones
- ✅ Variables de entorno securizadas
- ✅ Dockerfile optimizado para Coolify

## 📋 Requisitos

1. **Cuenta de Stripe** (gratuita)
   - Ve a [stripe.com](https://stripe.com) y regístrate
   - Obtén tus claves API del dashboard

2. **Coolify** instalado en tu VPS

3. **Backend API** (no incluido en este tutorial frontend)
   - Necesitarás un backend para crear sesiones de pago
   - Puede ser Node.js, Python, PHP, etc.

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/xuli70/stripe-tutorial-coolify.git
cd stripe-tutorial-coolify
```

### 2. Configurar Stripe

1. Accede a tu [Dashboard de Stripe](https://dashboard.stripe.com)
2. Copia tus claves públicas:
   - **Modo Test**: `pk_test_...`
   - **Modo Live**: `pk_live_...` (requiere cuenta verificada)

### 3. Configurar en Coolify

1. **Crear aplicación** en Coolify
2. **Tipo**: Dockerfile
3. **Puerto**: 8080
4. **Variables de entorno**:

```env
# Requeridas
STRIPE_TEST_PUBLIC_KEY=pk_test_tuClaveAqui

# Opcionales
STRIPE_LIVE_PUBLIC_KEY=pk_live_tuClaveAqui
API_URL=https://tu-backend.com
STRIPE_DEFAULT_MODE=test
```

### 4. Deploy

Coolify hará el deploy automáticamente.

## 🧪 Modo de Prueba

### Tarjetas de prueba de Stripe

| Tipo | Número | Comportamiento |
|------|---------|----------------|
| ✅ Exitosa | 4242 4242 4242 4242 | Pago aprobado |
| ❌ Rechazada | 4000 0000 0000 0002 | Tarjeta rechazada |
| 💰 Sin fondos | 4000 0000 0000 9995 | Fondos insuficientes |
| 🔐 3D Secure | 4000 0025 0000 3155 | Requiere autenticación |

**Datos adicionales para pruebas:**
- Fecha: Cualquier fecha futura
- CVC: Cualquier 3 dígitos
- ZIP: Cualquier código postal

## 📁 Estructura del Proyecto

```
stripe-tutorial-coolify/
├── index.html          # Interfaz principal
├── styles.css          # Estilos
├── config.js           # Configuración de Stripe
├── products.js         # Catálogo de productos
├── app.js              # Lógica principal
├── entrypoint.sh       # Script para variables
├── Dockerfile          # Config para Coolify
├── .env.example        # Ejemplo de variables
├── .gitignore          # Archivos ignorados
└── README.md           # Esta documentación
```

## 💻 Desarrollo Local

### 1. Crear archivo `.env.local`

```env
STRIPE_TEST_PUBLIC_KEY=pk_test_tuClaveReal
API_URL=http://localhost:3000
```

### 2. Servir localmente

```bash
# Con Python
python -m http.server 8000

# Con Node.js
npx http-server -p 8000

# Con PHP
php -S localhost:8000
```

### 3. Modificar `entrypoint.sh` para desarrollo

Temporalmente puedes crear `env.js` manualmente con tus claves de prueba.

## 🔌 Integración con Backend

Esta app frontend necesita un backend para:

1. **Crear sesiones de checkout**
2. **Procesar webhooks**
3. **Gestionar clientes**
4. **Guardar transacciones**

### Ejemplo de endpoint necesario:

```javascript
// POST /api/create-checkout-session
{
  "items": [
    {
      "price_data": {
        "currency": "eur",
        "product_data": {
          "name": "Producto"
        },
        "unit_amount": 1000
      },
      "quantity": 1
    }
  ]
}
```

## 🛡️ Seguridad

### ✅ Buenas prácticas implementadas:

1. **Variables de entorno** para las claves
2. **Claves públicas** únicamente en frontend
3. **Validación** de montos y datos
4. **HTTPS** obligatorio en producción
5. **Headers de seguridad** en Caddyfile

### ⚠️ IMPORTANTE:

- **NUNCA** pongas claves secretas (`sk_`) en el frontend
- **SIEMPRE** valida los pagos en tu backend
- **USA** webhooks para confirmar pagos
- **ACTIVA** HTTPS en producción

## 📚 Recursos para Aprender

### Documentación oficial:
- [Stripe Docs](https://stripe.com/docs)
- [Stripe Checkout](https://stripe.com/docs/checkout)
- [Stripe.js](https://stripe.com/docs/js)
- [Webhooks](https://stripe.com/docs/webhooks)

### Tutoriales recomendados:
- [Accept a payment](https://stripe.com/docs/payments/accept-a-payment)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Testing](https://stripe.com/docs/testing)

## 🐛 Solución de Problemas

### "Clave no configurada"
- Verifica las variables en Coolify
- Asegúrate de hacer redeploy
- Revisa la consola del navegador

### "No se puede conectar"
- Verifica que uses HTTPS en producción
- Confirma que las claves sean del modo correcto
- Revisa CORS si conectas a un backend

### "Error 502"
- Confirma puerto 8080 en Dockerfile
- Verifica logs en Coolify

## 🚀 Próximos Pasos

1. **Crear un backend** en tu lenguaje favorito
2. **Implementar webhooks** para confirmar pagos
3. **Agregar autenticación** de usuarios
4. **Guardar transacciones** en base de datos
5. **Implementar suscripciones** con Stripe Billing

## 📊 Flujo de Pago Completo

```
1. Usuario agrega productos al carrito
   ↓
2. Click en "Proceder al Pago"
   ↓
3. Frontend envía items al backend
   ↓
4. Backend crea sesión con Stripe
   ↓
5. Frontend redirige a Stripe Checkout
   ↓
6. Usuario completa el pago
   ↓
7. Stripe envía webhook al backend
   ↓
8. Backend confirma y procesa el pedido
   ↓
9. Usuario es redirigido a página de éxito
```

## 🤝 Contribuciones

Este es un proyecto educativo. Si encuentras mejoras, ¡los PRs son bienvenidos!

## ⚖️ Licencia

Proyecto de código abierto para fines educativos.

---

**Creado por**: xuli70  
**Stack**: Stripe + JavaScript + Coolify  
**Propósito**: Tutorial educativo

## 🆘 Ayuda

Si tienes preguntas:
1. Revisa la [documentación de Stripe](https://stripe.com/docs)
2. Busca en [Stack Overflow](https://stackoverflow.com/questions/tagged/stripe-payments)
3. Únete al [Discord de Stripe](https://stripe.com/discord)