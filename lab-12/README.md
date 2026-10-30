# keyboard

## 1. Introducción

`keyboard` es una aplicación web desarrollada con Django para validar la
lectura de un teclado español latinoamericano. La aplicación muestra un teclado
virtual y permite comprobar las teclas físicas detectadas por el navegador.

La aplicación se ejecuta por defecto en `http://localhost:8000`.

## 2. Dependencias

El proyecto requiere Python `3.12` o una versión superior. La única dependencia
de la aplicación es Django, declarada en `keyboard/pyproject.toml` e instalada
automáticamente durante la construcción de la imagen de Docker.

| Dependencia | Versión | Uso |
| --- | --- | --- |
| **Django** | `>=6.1` | desarrollo del servidor web, vistas y plantillas. |

También se necesita tener instalado:

- Docker.
- Docker Compose como plugin de Docker, disponible mediante `docker compose`.
- Permisos para ejecutar Docker. En este README se usa `sudo` en los comandos.

## 3. Endpoints

La aplicación utiliza la ruta base `/`.

### Mostrar el validador de teclado

```http
GET /
```

Renderiza la plantilla `app/home.html`, que contiene la representación visual
de un teclado español latinoamericano.

El navegador escucha los eventos de teclado y actualiza la interfaz para:

- Marcar las teclas detectadas como validadas.
- Mostrar la tecla que está siendo presionada.
- Informar cuando se presiona una tecla que no está representada en el teclado
	virtual.

La interacción se implementa en los archivos estáticos:

- `app/static/app/css/keyboard.css`: estilos del teclado y sus estados.
- `app/static/app/js/keyboard.js`: detección y validación de teclas.

## 4. Despliegue y observabilidad

El único servicio definido en `docker-compose.yaml` es:

- `monolith`: contenedor de la aplicación Django. Ejecuta las migraciones y
	publica la aplicación en <http://localhost:8000>.

La aplicación utiliza la base de datos SQLite `keyboard/db.sqlite3`, incluida en
el directorio del proyecto y disponible dentro del contenedor mediante el
volumen `./keyboard:/app`.

Ejecuta los comandos desde la raíz del proyecto, donde se encuentra
`docker-compose.yaml`.

### Construir las imágenes

```bash
sudo docker compose build
```

Construye la imagen de la aplicación usando `docker/Dockerfile`. Docker
reutiliza las capas que no hayan cambiado, por lo que las siguientes
construcciones suelen ser más rápidas. Este comando solo construye imágenes;
no inicia los contenedores.

### Levantar la aplicación

```bash
sudo docker compose up
```

Crea e inicia el servicio `monolith` en primer plano. Antes de iniciar el
servidor de desarrollo en `http://localhost:8000`, ejecuta el comando
`python manage.py migrate`.

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
nombre del servicio. Permite comprobar rápidamente que `monolith` está activo.

### Consultar los logs

Para ver los logs del servicio:

```bash
sudo docker compose logs monolith
```

Para seguir los logs en tiempo real:

```bash
sudo docker compose logs -f monolith
```

### Apagar la aplicación

```bash
sudo docker compose down
```

Detiene y elimina el contenedor y la red creados por Compose. El archivo
`keyboard/db.sqlite3` se conserva porque pertenece al directorio del proyecto.

### Eliminar contenedores, volúmenes e imágenes

```bash
sudo docker compose down -v --rmi all
```

Detiene y elimina el contenedor, la red y las imágenes utilizadas por el
servicio. La base de datos SQLite no se elimina porque no se gestiona mediante
un volumen nombrado de Docker.
