# blog

## 1. Introduccion

`blog` es una API REST desarrollada con Spring Boot para gestionar posts de un
blog. La aplicacion permite crear, editar, listar posts publicados y eliminar
posts almacenados en MongoDB.

La API se ejecuta por defecto en `http://localhost:8080` y ofrece documentacion
interactiva mediante Scalar en:

- Scalar: `http://localhost:8080/scalar`
- OpenAPI: `http://localhost:8080/v3/api-docs`

## 2. Dependencias

El proyecto requiere Java `21` o una version superior. Las dependencias se
declaran en `blog/pom.xml` y se instalan automaticamente durante la
construccion de la imagen de Docker.

| Dependencia | Version | Uso |
| --- | --- | --- |
| **Spring Boot** | `4.1.1` | creacion de la API REST y configuracion de la aplicacion. |
| **Spring Data MongoDB** | administrada por Spring Boot | persistencia y gestion de documentos. |
| **MongoDB** | `8` | almacenamiento de los posts. |
| **SpringDoc Scalar** | `3.1.0` | documentacion interactiva de la API. |

Tambien se necesita tener instalado:

- Docker.
- Docker Compose como plugin de Docker, disponible mediante `docker compose`.
- Permisos para ejecutar Docker. En este README se usa `sudo` en los comandos.

## 3. Endpoints

Todos los endpoints utilizan la base URL `/api/v1/post`.

### Crear un post

```http
POST /api/v1/post/create
Content-Type: application/json
```

Crea un nuevo post y devuelve el recurso creado.

```json
{
	"title": "Introduccion a Spring Boot",
	"author": "Carlos Martinez",
	"content": "Spring Boot facilita la creacion de aplicaciones Java.",
	"category": "PROGRAMACION",
	"labels": ["java", "spring-boot", "backend"]
}
```

### Editar un post

```http
POST /api/v1/post/edit
Content-Type: application/json
```

Actualiza el titulo, contenido y etiquetas del post indicado.

```json
{
	"id": "665f1c2a8f1a2b3c4d5e6f70",
	"title": "Spring Boot actualizado",
	"content": "Contenido actualizado del post con informacion vigente.",
	"labels": ["java", "spring"]
}
```

### Listar posts publicados

```http
GET /api/v1/post/list
```

Devuelve la lista de posts cuyo estado es `PUBLICADO`.

### Eliminar un post

```http
DELETE /api/v1/post/delete/{id}
```

Elimina el post asociado al identificador indicado y responde con estado
`200 OK` sin cuerpo.

### Manejo de errores

La API centraliza las excepciones mediante `GlobalExceptionHandler`. Las
respuestas de error incluyen `status`, `error`, `message` y `timestamp`.

- `400 Bad Request`: datos de entrada invalidos o errores de validacion de
  dominio.
- `404 Not Found`: el post solicitado no existe.
- `500 Internal Server Error`: error inesperado del servidor.

## 4. Despliegue y observabilidad

Los servicios definidos en `docker-compose.yaml` son:

- `db`: contenedor MongoDB con la base de datos `blogdb`. Ejecuta los scripts
  de `database/` al inicializar el volumen por primera vez.
- `back`: contenedor de la API Spring Boot. Espera a que MongoDB este saludable
  y publica la API en <http://localhost:8080>.

Ejecuta los comandos desde la raiz del proyecto, donde se encuentra
`docker-compose.yaml`.

### Construir las imagenes

```bash
sudo docker compose build
```

Construye la imagen de la API usando `docker/Dockerfile`. Docker reutiliza las
capas que no hayan cambiado, por lo que las siguientes construcciones suelen
ser mas rapidas. Este comando solo construye imagenes; no inicia los
contenedores.

### Levantar la aplicacion

```bash
sudo docker compose up
```

Crea e inicia los servicios `db` y `back` en primer plano. Los logs aparecen
directamente en la terminal y la API queda disponible en
`http://localhost:8080`.

### Levantar la aplicacion en segundo plano

```bash
sudo docker compose up -d
```

La opcion `-d` significa *detached*: inicia los contenedores y devuelve el
control de la terminal. Es la forma habitual de dejar la aplicacion ejecutando
en segundo plano.

### Consultar los contenedores

```bash
sudo docker compose ps
```

Muestra los contenedores del proyecto, su estado, los puertos publicados y el
nombre de cada servicio. Permite comprobar rapidamente que `db` y `back` estan
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

### Apagar la aplicacion

```bash
sudo docker compose down
```

Detiene y elimina los contenedores y la red creados por Compose, pero conserva
el volumen `blog_data`.

### Eliminar contenedores, volumenes e imagenes

```bash
sudo docker compose down -v --rmi all
```

Realiza una limpieza completa del proyecto:

- `down` detiene y elimina los contenedores y la red.
- `-v` elimina tambien el volumen de MongoDB.
- `--rmi all` elimina las imagenes utilizadas por los servicios.

Despues de este comando, el siguiente `sudo docker compose up` tendra que
crear nuevamente el volumen, ejecutar los scripts de inicializacion y
construir o descargar las imagenes necesarias.
