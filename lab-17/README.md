# UIS Asignaturas

## 1. Introducción

`UIS Asignaturas` es una plataforma académica de tres capas desarrollada para
la Universidad Industrial de Santander (UIS). Permite gestionar estudiantes,
autenticación e inscripción en asignaturas mediante una SPA en React, una API
REST en Spring Boot y una base de datos PostgreSQL.

La aplicación se ejecuta por defecto en `http://localhost`.

## 2. Dependencias

El frontend se compila con Node.js y Vite, mientras que el backend se compila
con Gradle y Java. Los servicios se ejecutan mediante Docker Compose.

| Dependencia | Versión | Uso |
| --- | --- | --- |
| **Node.js** | `20.x` o superior | entorno de ejecución para compilar el frontend. |
| **npm** | versión incluida con Node.js | instalación de dependencias del frontend. |
| **React** | `19.2.8` | construcción de la interfaz web. |
| **Vite** | `8.2.2` | bundler y servidor de desarrollo del frontend. |
| **Tailwind CSS** | `4.3.3` | estilos de la interfaz. |
| **Java** | `21` | ejecución y compilación del backend. |
| **Spring Boot** | `4.1.1` | framework principal de la API REST. |
| **Gradle** | `8.8` | construcción y gestión de dependencias del backend. |
| **JJWT** | `0.12.6` | emisión y validación de tokens JWT. |
| **PostgreSQL** | `16-alpine` | persistencia de la información académica. |
| **Nginx** | `1.25-alpine` | servidor del frontend y proxy de `/api`. |

También se necesita tener instalado:

- Docker.
- Docker Compose como plugin de Docker, disponible mediante `docker compose`.
- Permisos para ejecutar Docker. En este README se usa `sudo` en los comandos.

## 3. Funcionalidades

La aplicación web se publica en `/` y las peticiones de la API se enrutan por
`/api/`.

### Gestión académica

Permite consultar y administrar la información de estudiantes y asignaturas,
además de gestionar el proceso de inscripción académica.

### Autenticación y seguridad

El backend utiliza Spring Security y tokens JWT para proteger las operaciones
que requieren autenticación. Las validaciones de entrada se realizan mediante
las validaciones de Spring Boot.

### Interfaz web

El frontend es una Single Page Application desarrollada con React y Vite.
React Router gestiona la navegación y Axios permite consumir la API REST. Las
notificaciones se muestran mediante React Hot Toast.

## 4. Despliegue y observabilidad

Los servicios definidos en `docker-compose.yaml` son:

- `db`: PostgreSQL 16, disponible internamente en el puerto `5432`.
- `back`: API Spring Boot, disponible internamente en el puerto `8080`.
- `front`: Nginx que sirve el frontend y publica la aplicación en
  <http://localhost>.

El frontend depende del backend y este espera a que PostgreSQL esté saludable
antes de iniciar. En la configuración local de Docker Compose, Nginx puede
reenviar las peticiones `/api/` al servicio `back`.

> [!NOTE]
> Si ejecutas este laboratorio localmente con Docker Compose, descomenta el
> bloque de configuración del proxy para `/api/` en las líneas 22 a 28 de
> [`app-academic/frontend/nginx.conf`](./app-academic/frontend/nginx.conf).
> Esto permite que Nginx reenvíe las peticiones de la API al servicio `back`.
> Mantén ese bloque comentado al desplegar en Fearless Deploy: es una
> configuración específica del entorno local de Docker Compose y no es
> compatible con la plataforma.

La estructura principal del proyecto es:

```text
lab-17/
├── app-academic/
│   ├── backend/
│   │   └── uis-academic-backend/  # API Java 21 / Spring Boot / Gradle
│   └── frontend/                  # SPA React / Vite
├── docker/
│   ├── Dockerfile.backend         # Build multi-etapa del backend
│   └── Dockerfile.frontend        # Build Node 20 y servidor Nginx
├── docker-compose.yaml            # Orquestación de DB, backend y frontend
└── README.md                      # Documentación del proyecto
```

Ejecuta los comandos desde la raíz del proyecto, donde se encuentra
`docker-compose.yaml`.

### Construir las imágenes

```bash
sudo docker compose build
```

Construye las imágenes mediante dos procesos:

1. Node 20 instala las dependencias y genera el bundle de React con Vite;
	Nginx sirve el contenido estático.
2. Gradle 8.8 compila el backend con Java 21 y genera el archivo JAR;
	Eclipse Temurin 21 ejecuta la aplicación.

### Levantar la aplicación

```bash
sudo docker compose up
```

Crea e inicia los servicios en primer plano. La aplicación queda disponible en
`http://localhost` y los logs de los tres servicios aparecen en la terminal.

### Levantar la aplicación en segundo plano

```bash
sudo docker compose up -d
```

La opción `-d` inicia los contenedores en segundo plano y devuelve el control de
la terminal.

### Consultar los contenedores

```bash
sudo docker compose ps
```

Muestra el estado, los puertos publicados y el nombre de cada servicio.

### Consultar los logs

Para ver los logs de todos los servicios:

```bash
sudo docker compose logs
```

Para seguirlos en tiempo real:

```bash
sudo docker compose logs -f
```

También se puede consultar un servicio específico, por ejemplo:

```bash
sudo docker compose logs -f back
```

### Apagar la aplicación

```bash
sudo docker compose down
```

Detiene y elimina los contenedores y la red creados por Compose.

### Eliminar contenedores, volúmenes e imágenes

```bash
sudo docker compose down -v --rmi all
```

Detiene y elimina los contenedores, la red, los volúmenes y las imágenes
utilizadas por los servicios.