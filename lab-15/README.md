# ChronoPulse: Rogue Orbit

## 1. Introducción

`ChronoPulse: Rogue Orbit` es un videojuego web de acción tipo *roguelite*
desarrollado con React 19 y TypeScript. El juego combina mecánicas de
ralentización temporal, físicas orbitales y mejoras seleccionables entre
oleadas de enemigos.

La aplicación se ejecuta por defecto en `http://localhost:8080`.

## 2. Dependencias

El proyecto utiliza Node.js para instalar las dependencias y generar el bundle
de producción. Los archivos resultantes se sirven mediante Nginx dentro de un
contenedor Docker.

| Dependencia | Versión | Uso |
| --- | --- | --- |
| **Node.js** | `20.x` o superior | entorno de ejecución para el build. |
| **npm** | `10.x` o superior | instalación de dependencias y ejecución de scripts. |
| **React** | `19.0.1` | construcción de la interfaz y la lógica del juego. |
| **Vite** | `6.2.3` | bundler y servidor de desarrollo. |
| **TypeScript** | `5.8.2` | tipado estático del código fuente. |
| **Tailwind CSS** | `4.1.14` | estilos de la interfaz. |
| **Motion** | `12.23.24` | animaciones de la interfaz. |
| **Lucide React** | `0.546.0` | iconografía de los menús y paneles. |
| **Canvas Confetti** | `1.9.4` | efectos visuales de celebración. |
| **Nginx** | `1.25-alpine` | servidor de archivos estáticos en producción. |

También se necesita tener instalado:

- Docker.
- Docker Compose como plugin de Docker, disponible mediante `docker compose`.
- Permisos para ejecutar Docker. En este README se usa `sudo` en los comandos.

## 3. Funcionalidades

La aplicación utiliza la ruta base `/`.

### Juego principal

Permite controlar una nave en un escenario de acción orbital, enfrentarse a
oleadas de enemigos y utilizar habilidades de ralentización temporal. El
renderizado del juego se realiza en tiempo real mediante HTML5 Canvas.

### Mejoras y progresión

Entre oleadas se pueden seleccionar mejoras y sinergias para modificar las
capacidades de la nave. El juego incluye estados de victoria y derrota, así
como progreso basado en los resultados de cada partida.

### Modos y pantallas

La aplicación incluye:

- Menú principal.
- Tutorial interactivo.
- Laboratorio Sandbox.
- HUD con información de la partida.
- Pantallas de mejoras, victoria y fin de partida.
- Sistema de logros.
- Tabla de clasificación y configuración.

## 4. Despliegue y observabilidad

El único servicio definido en `docker-compose.yaml` es:

- `front`: contenedor Nginx que sirve el bundle generado por Vite y publica la
  aplicación en <http://localhost:8080>.

La aplicación es frontend standalone y no requiere una base de datos ni un
servicio backend para ejecutarse.

Ejecuta los comandos desde la raíz del proyecto, donde se encuentra
`docker-compose.yaml`.

### Construir las imágenes

```bash
sudo docker compose build
```

Construye la imagen mediante dos etapas:

1. Node 20 instala las dependencias con `npm ci` y genera el bundle con
   `npm run build`.
2. Nginx 1.25 Alpine sirve el contenido de la carpeta `dist` en el puerto `80`
   del contenedor.

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

La opción `-d` significa *detached*: inicia el contenedor y devuelve el control
de la terminal. Es la forma habitual de dejar la aplicación ejecutando en
segundo plano.

### Consultar los contenedores

```bash
sudo docker compose ps
```

Muestra el contenedor de la aplicación, su estado, el puerto publicado y el
nombre del servicio. Permite comprobar rápidamente que `front` está activo.

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
