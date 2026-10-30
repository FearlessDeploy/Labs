# wired

## 1. Introducción

`wired` es una API REST desarrollada con Spring Boot para crear y resolver
enlaces cortos. La aplicación persiste los enlaces en una base de datos
PostgreSQL y expone sus recursos bajo el prefijo `/api/v1/wired`.

La API se ejecuta por defecto en `http://localhost:8080` y ofrece documentación
interactiva mediante Scalar en:

- Scalar: `http://localhost:8080/scalar`
- OpenAPI: `http://localhost:8080/v3/api-docs`

## 2. Dependencias

El proyecto requiere Java `21` o una versión superior. Las dependencias se
declaran en `wired/pom.xml` y se instalan automáticamente durante la
construcción de la imagen de Docker.

| Dependencia | Versión | Uso |
| --- | --- | --- |
| **Spring Boot** | `4.1.0` | creación de la API REST y configuración de la aplicación. |
| **Spring Data JPA** | administrada por Spring Boot | persistencia y gestión de entidades. |
| **PostgreSQL** | `16` | almacenamiento de los enlaces cortos. |
| **SpringDoc Scalar** | `3.1.0` | documentación interactiva de la API. |

También se necesita tener instalado:

- Docker.
- Docker Compose como plugin de Docker, disponible mediante `docker compose`.
- Permisos para ejecutar Docker. En este README se usa `sudo` en los comandos.

## 3. Endpoints

Todos los endpoints utilizan la base URL `/api/v1/wired`.

### Crear un enlace corto

```http
POST /api/v1/wired/create
Content-Type: application/json
```

Recibe una URL original y devuelve el código corto generado. El código tiene
una longitud máxima de seis caracteres.

```json
{
	"originalUrl": "https://www.example.com/recurso"
}
```

La respuesta es un texto con el código corto creado:

```text
abc123
```

### Resolver un enlace corto

```http
GET /api/v1/wired/{shortCode}
```

Busca el código corto indicado y devuelve la URL original asociada.

```text
https://www.example.com/recurso
```

Los enlaces pueden tener una fecha de expiración. Los códigos incluidos en la
carga inicial de la base de datos se configuran con una vigencia de seis horas.

## 4. Despliegue y observabilidad

Los servicios definidos en `docker-compose.yaml` son:

- `db`: contenedor PostgreSQL con la base de datos `wired_db`. Ejecuta los
	scripts de `database/` al inicializar el volumen por primera vez.
- `back`: contenedor de la API Spring Boot. Espera a que PostgreSQL esté
	saludable y publica la API en <http://localhost:8080>.

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
`http://localhost:8080`.

### Levantar la aplicación en segundo plano

```bash
sudo docker compose up -d
```

La opción `-d` significa *detached*: inicia los contenedores y devuelve el
control de la terminal. Es la forma habitual de dejar la aplicación ejecutando
en segundo plano.

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
el volumen `wired_data`.

### Eliminar contenedores, volúmenes e imágenes

```bash
sudo docker compose down -v --rmi all
```

Realiza una limpieza completa del proyecto:

- `down` detiene y elimina los contenedores y la red.
- `-v` elimina también el volumen de PostgreSQL.
- `--rmi all` elimina las imágenes utilizadas por los servicios.

Después de este comando, el siguiente `sudo docker compose up` tendrá que
crear nuevamente el volumen, ejecutar los scripts de inicialización y
construir o descargar las imágenes necesarias.
