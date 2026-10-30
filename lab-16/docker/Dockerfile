# Etapa 1: Compilación de Angular v18 con Node 20
FROM node:20-alpine AS builder

WORKDIR /app

# copiar archivos de dependencias
COPY app-markdown/package*.json ./
RUN npm ci

# copiar todo el contenido de la aplicación angular
COPY app-markdown/ ./

# forzar la salida directamente a la carpeta 'dist'
RUN npx ng build --configuration=production --output-path=dist

# Etapa 2: Servidor estático Nginx Alpine
FROM nginx:1.25-alpine

# Añadir '/browser' al origen para copiar los archivos HTML/JS reales
COPY --from=builder /app/dist/browser /usr/share/nginx/html
COPY app-markdown/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
