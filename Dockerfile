# Dockerfile para Tutorial Stripe con Coolify
FROM node:18-alpine

WORKDIR /app

# Instalar Caddy (servidor web)
RUN apk add --no-cache caddy

# Copiar archivos de la aplicación
COPY index.html ./
COPY styles.css ./
COPY config.js ./
COPY products.js ./
COPY app.js ./
COPY entrypoint.sh ./

# Hacer ejecutable el script
RUN chmod +x /app/entrypoint.sh

# Crear archivo Caddyfile
RUN echo -e ":${PORT:-8080} {\n\
    root * /app\n\
    file_server\n\
    try_files {path} /index.html\n\
    \n\
    # Headers de seguridad\n\
    header {\n\
        X-Content-Type-Options nosniff\n\
        X-Frame-Options DENY\n\
        X-XSS-Protection \"1; mode=block\"\n\
        Referrer-Policy strict-origin-when-cross-origin\n\
    }\n\
    \n\
    # CORS para desarrollo\n\
    header Access-Control-Allow-Origin *\n\
    header Access-Control-Allow-Methods \"GET, POST, OPTIONS\"\n\
    header Access-Control-Allow-Headers \"Content-Type, Authorization\"\n\
}" > /app/Caddyfile

# Puerto 8080 (estándar de Coolify)
EXPOSE 8080

# Usar el script de entrada que inyecta variables
CMD ["/app/entrypoint.sh"]