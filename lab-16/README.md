# UIS Markdown Studio

## 1. Introducción

`UIS Markdown Studio` es una aplicación web frontend desarrollada con Angular
18 Standalone para editar y previsualizar documentos Markdown en tiempo real.
Permite exportar el documento como Markdown o HTML y guarda el contenido localmente
en el navegador.

La aplicación se ejecuta por defecto en `http://localhost:8080`.

## 2. Dependencias

El proyecto utiliza Node.js para instalar las dependencias y generar el bundle
de producción. El resultado se sirve mediante Nginx dentro de un contenedor
Docker.

| Dependencia | Versión | Uso |
| --- | --- | --- |
| **Node.js** | `20.x` o superior | entorno de ejecución para el build. |
| **npm** | `10.x` o superior | instalación de dependencias y ejecución de scripts. |
| **Angular** | `18.2.x` | framework frontend con componentes Standalone. |
| **Angular CLI** | `18.2.x` | compilación y configuración del proyecto. |
| **Marked** | `14.1.4` | conversión de Markdown a HTML. |
| **Tailwind CSS** | `3.4.19` | estilos de la interfaz. |
| **Nginx** | `1.25-alpine` | servidor de archivos estáticos en producción. |

También se necesita tener instalado:

- Docker.
- Docker Compose como plugin de Docker, disponible mediante `docker compose`.
- Permisos para ejecutar Docker. En este README se usa `sudo` en los comandos.

## 3. Funcionalidades

La aplicación utiliza la ruta base `/`.

### Editor y previsualización

Permite escribir Markdown y visualizar su conversión a HTML de forma
inmediata. La interfaz está construida con Angular Signals para mantener
sincronizados el editor y la vista previa.

### Persistencia y exportación

El contenido se guarda automáticamente en `localStorage` para evitar su pérdida
al cerrar o recargar el navegador. También se puede descargar como:

- Documento Markdown (`.md`).
- Documento HTML (`.html`) compilado y estilizado.

### Métricas y plantillas

La barra de estado muestra en tiempo real el número de caracteres, palabras y
líneas. El panel de plantillas permite insertar rápidamente sintaxis Markdown
habitual.

## 4. Despliegue y observabilidad

El único servicio definido en `docker-compose.yaml` es:

- `front`: contenedor Nginx que sirve el bundle generado por Angular y publica
  la aplicación en <http://localhost:8080>.

La aplicación es frontend standalone y no requiere una base de datos ni un
servicio backend para ejecutarse.

Ejecuta los comandos desde la raíz del proyecto, donde se encuentra
`docker-compose.yaml`.

### Construir las imágenes

```bash
sudo docker compose build
```

Construye la imagen mediante dos etapas:

1. Node 20 instala las dependencias con `npm ci` y genera el bundle de Angular.
2. Nginx 1.25 Alpine sirve el contenido generado en el puerto `80` del
   contenedor.

### Levantar la aplicación

```bash
sudo docker compose up
```

Crea e inicia el servicio `front` en primer plano. La aplicación queda
disponible en `http://localhost:8080` y los logs de Nginx aparecen en la
terminal.

### Levantar la aplicación en segundo plano

```bash
sudo docker compose up -d
```

La opción `-d` inicia el contenedor en segundo plano y devuelve el control de
la terminal.

### Consultar los contenedores

```bash
sudo docker compose ps
```

Muestra el estado del contenedor, el puerto publicado y el nombre del servicio.

### Consultar los logs

Para ver los logs del servicio:

```bash
sudo docker compose logs front
```

Para seguir los logs en tiempo real:

```bash
sudo docker compose logs -f front
```

### Apagar la aplicación

```bash
sudo docker compose down
```

Detiene y elimina el contenedor y la red creados por Compose.

### Eliminar contenedores, volúmenes e imágenes

```bash
sudo docker compose down -v --rmi all
```

Detiene y elimina el contenedor, la red y las imágenes utilizadas por el
servicio. No elimina datos persistentes porque la aplicación no utiliza una
base de datos ni volúmenes nombrados.