# Etapa 1: Compilación de React / TypeScript con Node 20
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias desde la subcarpeta
COPY juego-chronopulse/package*.json ./

# Instalación limpia de dependencias
RUN npm ci

# Copiar el código fuente completo del proyecto React
COPY juego-chronopulse/ .

# Compilar para producción (genera la carpeta /dist)
RUN npm run build

# Etapa 2: Servidor estático Nginx Alpine
FROM nginx:1.25-alpine

# Copiar el bundle de producción desde la etapa builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar la configuración personalizada de Nginx
COPY juego-chronopulse/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]