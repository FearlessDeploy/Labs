# Imagen base ultra-ligera de Nginx Alpine Linux
FROM nginx:1.25-alpine

# Copiar los archivos estáticos de la aplicación
COPY app-promedio/src/ /usr/share/nginx/html/

# Copiar la configuración personalizada de Nginx
COPY app-promedio/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]