# ver-app

## 1. Introducción

`ver-app` es una API REST desarrollada con FastAPI para gestionar verbos y sus
formas en inglés. La aplicación permite crear, consultar, actualizar, listar y
eliminar verbos almacenados en una base de datos MySQL.

La API se ejecuta en el puerto `8000` y la base de datos MySQL en el puerto
`3306`. Al iniciar la aplicación, FastAPI también genera automáticamente la
documentación interactiva en:

- Swagger UI: <http://localhost:8000/docs>
- ReDoc: <http://localhost:8000/redoc>

## 2. Dependencias

El proyecto requiere Python `3.12` o una versión superior. Las dependencias se
declaran en `verb-app/pyproject.toml` y se instalan automáticamente durante la
construcción de la imagen de Docker.

| Dependencia     | version       | Uso                                           |
| --------------- | ------------- | --------------------------------------------- |
|**FastAPI**      | `>=0.141.1`   | creación de la API y definición de endpoints. |
| **SQLAlchemy**  | `>=2.0.52`    | conexión y gestión de la base de datos.       |
| **Uvicorn**     | `>=0.52.3`    | servidor ASGI para ejecutar la aplicación.    |
| **mysql-connector-python** | `>=26.7.0` | Conector de Python para establecer la conexión con MySQL. |


También se necesita tener instalado:

- Docker.
- Docker Compose como plugin de Docker, disponible mediante `docker compose`.
- Permisos para ejecutar Docker. En este README se usa `sudo` en los comandos.

## 3. Endpoints

La URL base de los endpoints de verbos es:

```text
http://localhost:8000/api/v1/verbs
```

Todos los endpoints de creación y actualización reciben y devuelven JSON. Un
verbo tiene la siguiente estructura:

```json
{
	"spanish": "comer",
	"infinitive": "eat",
	"past_simple": "ate",
	"past_participle": "eaten"
}
```

### Crear un verbo

```http
POST /api/v1/verbs/create
```

Registra un verbo nuevo en la base de datos. Los cuatro campos del cuerpo son
obligatorios. Devuelve el verbo creado junto con su `id`.

### Actualizar un verbo

```http
PUT /api/v1/verbs/update/{verb_id}
```

Actualiza el verbo identificado por `verb_id`. Los campos del cuerpo son
opcionales, por lo que se pueden modificar uno o varios datos. Si el ID no
existe, devuelve `404 Not Found`.

### Eliminar un verbo

```http
DELETE /api/v1/verbs/delete/{verb_id}
```

Elimina de forma permanente el verbo indicado por su ID. Si el ID no existe,
devuelve `404 Not Found`.

### Buscar por infinitivo

```http
GET /api/v1/verbs/search/{infinitive}
```

Busca un verbo usando su infinitivo, por ejemplo
`/api/v1/verbs/search/eat`. Si no encuentra coincidencias, devuelve `404 Not
Found`.

### Listar verbos

```http
GET /api/v1/verbs/list?skip=0&limit=10
```

Devuelve una lista paginada de verbos. `skip` indica cuántos registros se
omiten y `limit` establece el número máximo de resultados. Ambos parámetros
son opcionales; sus valores predeterminados son `skip=0` y `limit=10`.

## 4. Despliegue y observabilidad

Los servicios definidos en `docker-compose.yaml` son:

- `db`: contenedor MySQL con la base de datos `verb_app`. Ejecuta los scripts
	de `database/` al inicializar el volumen por primera vez.
- `back`: contenedor de la API FastAPI. Espera a que MySQL esté saludable y
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
nombre de cada servicio. Permite comprobar rápidamente si `db` y `back` están
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

Para consultar un servicio concreto, por ejemplo la API o MySQL:

```bash
sudo docker compose logs -f back
sudo docker compose logs -f db
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
el volumen `mysql_data`. Por eso, los datos de MySQL permanecen disponibles al
volver a ejecutar la aplicación.

### Eliminar contenedores, volúmenes e imágenes

```bash
sudo docker compose down -v --rmi all
```

Realiza una limpieza completa del proyecto:

- `down` detiene y elimina los contenedores y la red.
- `-v` elimina también el volumen `mysql_data`, por lo que se pierden los datos
	almacenados en MySQL.
- `--rmi all` elimina las imágenes utilizadas por los servicios.

Después de este comando, el siguiente `sudo docker compose up` tendrá que
crear nuevamente el volumen y construir o descargar las imágenes necesarias.
