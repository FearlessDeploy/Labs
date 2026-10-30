# poll

## 1. Introducción

`poll` es una API desarrollada con FastAPI para crear encuestas, consultar sus
opciones, registrar votos y obtener resultados. La aplicación utiliza Redis
para almacenar las encuestas y controlar los votos de los usuarios, y expone
sus recursos bajo el prefijo `/api/v1/encuestas`.

La API se ejecuta por defecto en `http://localhost:8000` y ofrece documentación
interactiva en:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 2. Dependencias

El proyecto requiere Python `3.12` o una versión superior. Las dependencias se
declaran en `poll/pyproject.toml` y se instalan automáticamente durante la
construcción de la imagen de Docker.

| Dependencia | Versión | Uso |
| --- | --- | --- |
| **FastAPI** | `>=0.141.1` | creación de la API y definición de endpoints. |
| **Redis** | `>=7.0.0` | almacenamiento de encuestas y registro de votos. |
| **Uvicorn** | `>=0.52.4` | servidor ASGI para ejecutar la aplicación. |

También se necesita tener instalado:

- Docker.
- Docker Compose como plugin de Docker, disponible mediante `docker compose`.
- Permisos para ejecutar Docker. En este README se usa `sudo` en los comandos.

## 3. Endpoints

Todos los endpoints utilizan la base URL `/api/v1/encuestas`.

### Crear una encuesta

```http
POST /api/v1/encuestas/create
Content-Type: application/json
```

Recibe una pregunta y entre dos y veinte opciones únicas. Devuelve la encuesta
creada.

```json
{
	"pregunta": "¿Cuál es tu lenguaje favorito?",
	"opciones": ["Python", "Java", "JavaScript"]
}
```

### Obtener una encuesta

```http
GET /api/v1/encuestas/{poll_id}
```

Devuelve la encuesta asociada al identificador indicado.

```json
{
	"id": 1,
	"pregunta": "¿Cuál es tu lenguaje favorito?",
	"opciones": ["Python", "Java", "JavaScript"],
	"creada_en": "2026-08-25T12:00:00Z"
}
```

### Registrar un voto

```http
POST /api/v1/encuestas/{poll_id}/votar
X-User-Id: usuario-1
Content-Type: application/json
```

Registra la opción seleccionada por el usuario. El header `X-User-Id` es
obligatorio y permite impedir que un usuario vote más de una vez dentro del
periodo configurado.

```json
{
	"opcion": "Python"
}
```

Respuesta:

```json
{
	"encuesta_id": 1,
	"opcion": "Python",
	"mensaje": "Voto registrado"
}
```

### Obtener resultados

```http
GET /api/v1/encuestas/{poll_id}/resultados
```

Devuelve el total de votos agrupado por opción.

```json
{
	"encuesta_id": 1,
	"pregunta": "¿Cuál es tu lenguaje favorito?",
	"resultados": {
		"Python": 3,
		"Java": 2,
		"JavaScript": 1
	}
}
```

Las respuestas de error utilizan el campo `detail` e informan, entre otros,
los siguientes casos:

- `400 Bad Request`: datos inválidos, opción inexistente o voto repetido.
- `404 Not Found`: la encuesta solicitada no existe.
- `500 Internal Server Error`: error inesperado del servidor.

## 4. Despliegue y observabilidad

Los servicios definidos en `docker-compose.yaml` son:

- `db`: contenedor Redis 7 Alpine. Persiste los datos en el volumen
  `redis-data` y publica el puerto `6379`.
- `back`: contenedor de la API FastAPI. Espera a que Redis esté saludable y
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

Crea e inicia los servicios `db` y `back` en primer plano. Los logs aparecen
directamente en la terminal y la API queda disponible en
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
nombre de cada servicio. Permite comprobar rápidamente que `db` y `back` están
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

Para consultar un servicio concreto, por ejemplo la API:

```bash
sudo docker compose logs -f back
```

### Apagar la aplicación

```bash
sudo docker compose down
```

Detiene y elimina los contenedores y la red creados por Compose, pero conserva
el volumen `redis-data`.

### Eliminar contenedores, volúmenes e imágenes

```bash
sudo docker compose down -v --rmi all
```

Realiza una limpieza completa del proyecto:

- `down` detiene y elimina los contenedores y la red.
- `-v` elimina también el volumen de Redis.
- `--rmi all` elimina las imágenes utilizadas por los servicios.

Después de este comando, el siguiente `sudo docker compose up` tendrá que
crear nuevamente el volumen y construir o descargar las imágenes necesarias.
