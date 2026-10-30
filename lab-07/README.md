# recommendation-song

## 1. Introducción

`recommendation-song` es una API desarrollada con FastAPI para gestionar canciones y obtener recomendaciones aleatorias. La aplicación persiste la información en una base de datos mediante SQLAlchemy y expone sus recursos bajo el prefijo `/api/v1/songs`.

La API se ejecuta por defecto en `http://localhost:8000` y ofrece documentación interactiva en:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 2. Dependencias

El proyecto requiere Python `3.12` o una versión superior. Las dependencias se
declaran en `reccomendation-song/pyproject.toml` y se instalan automáticamente durante la
construcción de la imagen de Docker.

| Dependencia     | version       | Uso                                           |
| --------------- | ------------- | --------------------------------------------- |
|**FastAPI**      | `>=0.141.1`   | creación de la API y definición de endpoints. |
| **SQLAlchemy**  | `>=2.0.52`    | conexión y gestión de la base de datos.       |
| **Uvicorn**     | `>=0.52.3`    | servidor ASGI para ejecutar la aplicación.    |

También se necesita tener instalado:

- Docker.
- Docker Compose como plugin de Docker, disponible mediante `docker compose`.
- Permisos para ejecutar Docker. En este README se usa `sudo` en los comandos.

## 3. Endpoints

Todos los endpoints utilizan la base URL `/api/v1/songs`.

### Obtener una canción por ID

```http
GET /api/v1/songs/get-by-id/{song_id}
```

Devuelve la canción asociada al ID indicado.

### Crear una canción

```http
POST /api/v1/songs/create
Content-Type: application/json
```

Recibe los datos de una canción y devuelve el registro creado.

```json
{
	"title": "Bohemian Rhapsody",
	"artist": "Queen",
	"genre": "Rock",
	"year": "1975"
}
```

### Actualizar una canción

```http
PUT /api/v1/songs/update/{song_id}
Content-Type: application/json
```

Actualiza uno o varios campos de la canción indicada. Todos los campos del cuerpo son opcionales.

```json
{
	"genre": "Rock clásico",
	"year": "1975"
}
```

### Eliminar una canción

```http
DELETE /api/v1/songs/delete/{song_id}
```

Elimina la canción asociada al ID y devuelve un booleano que indica si la operación fue exitosa.

### Obtener una canción aleatoria

```http
GET /api/v1/songs/random
```

Devuelve una canción seleccionada aleatoriamente de la base de datos.

Las respuestas de consulta, creación y actualización tienen esta estructura:

```json
{
	"id": 1,
	"title": "Bohemian Rhapsody",
	"artist": "Queen",
	"genre": "Rock",
	"year": "1975"
}
```

## 4. Despliegue y observabilidad

Los servicios definidos en `docker-compose.yaml` son:

- `back`: contenedor de la API FastAPI.
	publica la API en <http://localhost:8000>.

Ejecuta los comandos desde la raíz del proyecto, donde se encuentra
`docker-compose.yaml`.

### Construir las imágenes

```bash
sudo docker compose build
```

Construye la imagen de la API usando `docker/Dockerfile`. Docker reutiliza las
capas que no hayan cambiado, por lo que las siguientes construcciones suelen
ser más rápidas. Este comando solo construye imágenes; no inicia los
contenedores.

### Levantar la aplicación

```bash
sudo docker compose up
```

Crea e inicia los servicio `back` en primer plano. Los logs aparecen
directamente en la terminal y el proceso continúa ejecutándose mientras la
terminal permanezca abierta. La API queda disponible en
`http://localhost:8000`.

### Levantar la aplicación en segundo plano

```bash
sudo docker compose up -d
```

La opción `-d` significa *detached*: inicia los contenedores y devuelve el
control de la terminal. Es la forma habitual de dejar la aplicación ejecutando
en segundo plano. Los logs se pueden consultar después con el comando de
observabilidad correspondiente.

### Consultar los contenedores

```bash
sudo docker compose ps
```

Muestra los contenedores del proyecto, su estado, los puertos publicados y el
nombre de cada servicio. Permite comprobar rápidamente `back` están
activos.

### Consultar los logs

Para ver los logs de todos los servicios:

```bash
sudo docker compose logs
```

Para seguir los logs en tiempo real:

```bash
sudo docker compose logs -f
```

Para consultar un servicio concreto, por ejemplo la API

```bash
sudo docker compose logs -f back
```

`docker compose service` no es un comando válido para consultar logs. El
subcomando correcto es `logs`, seguido opcionalmente del nombre del servicio.
La opción `-f` mantiene la salida abierta y muestra las nuevas líneas a medida
que se generan.

### Apagar la aplicación

```bash
sudo docker compose down
```

Detiene y elimina los contenedores y la red creados por Compose, pero conserva
el volumen  si existe.

### Eliminar contenedores, volúmenes e imágenes

```bash
sudo docker compose down -v --rmi all
```

Realiza una limpieza completa del proyecto:

- `down` detiene y elimina los contenedores y la red.
- `-v` elimina también el volumen.
- `--rmi all` elimina las imágenes utilizadas por los servicios.

Después de este comando, el siguiente `sudo docker compose up` tendrá que
crear nuevamente el volumen y construir o descargar las imágenes necesarias.
