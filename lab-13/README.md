# keytest

## 1. Introducción

`keytest` es una aplicación web desarrollada con Django para realizar tests de
mecanografía. La aplicación obtiene los textos disponibles desde una base de
datos MariaDB, selecciona uno aleatoriamente y lo muestra en una plantilla
HTML.

La aplicación se ejecuta por defecto en `http://localhost:8000`.

## 2. Dependencias

El proyecto requiere Python `3.12` o una versión superior. Las dependencias se
declaran en `keytest/pyproject.toml` y se instalan automáticamente durante la
construcción de la imagen de Docker.

| Dependencia | Versión | Uso |
| --- | --- | --- |
| **Django** | `>=6.1` | desarrollo del servidor web, vistas, modelos y plantillas. |
| **mysqlclient** | `>=2.2.8` | conexión de Django con MariaDB/MySQL. |
| **python-dotenv** | `>=1.2.3` | carga de variables de entorno de la aplicación. |
| **MariaDB** | `11` | almacenamiento de textos y resultados de mecanografía. |

También se necesita tener instalado:

- Docker.
- Docker Compose como plugin de Docker, disponible mediante `docker compose`.
- Permisos para ejecutar Docker. En este README se usa `sudo` en los comandos.

## 3. Endpoints

La aplicación utiliza la ruta base `/`.

### Mostrar un test de mecanografía

```http
GET /
```

Selecciona aleatoriamente un texto de la tabla `typing_test` y renderiza la
plantilla `typing_test.html` para que el usuario pueda realizar el test.

Si no existen textos disponibles, la página muestra el mensaje:

```text
No hay tests de mecanografía disponibles.
```

### Modelos de datos

La aplicación contiene los siguientes modelos:

- `TypingTest`: almacena el contenido de cada texto de mecanografía.
- `TypingTestResult`: almacena las métricas de un test, incluyendo palabras por
	minuto (`wpm`), precisión (`accuracy`), duración y fecha de creación.

## 4. Despliegue y observabilidad

Los servicios definidos en `docker-compose.yaml` son:

- `db`: contenedor MariaDB con la base de datos `key_test_db`. Ejecuta los
	scripts de `database/` al inicializar el volumen por primera vez y publica el
	puerto `3306`.
- `monolith`: contenedor de la aplicación Django. Espera a que MariaDB esté
	saludable, ejecuta las migraciones y publica la aplicación en
	<http://localhost:8000>.

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

Crea e inicia los servicios `db` y `monolith` en primer plano. El servicio web
ejecuta `python manage.py migrate` antes de iniciar el servidor de desarrollo
en `http://localhost:8000`.

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
nombre de cada servicio. Permite comprobar rápidamente que `db` y `monolith`
están activos.

### Consultar los logs

Para ver los logs de todos los servicios:

```bash
sudo docker compose logs
```

Para seguir los logs en tiempo real:

```bash
sudo docker compose logs -f
```

Para consultar un servicio concreto, por ejemplo la aplicación web:

```bash
sudo docker compose logs -f monolith
```

### Apagar la aplicación

```bash
sudo docker compose down
```

Detiene y elimina los contenedores y la red creados por Compose, pero conserva
el volumen `mariadb_data`.

### Eliminar contenedores, volúmenes e imágenes

```bash
sudo docker compose down -v --rmi all
```

Realiza una limpieza completa del proyecto:

- `down` detiene y elimina los contenedores y la red.
- `-v` elimina también el volumen de MariaDB.
- `--rmi all` elimina las imágenes utilizadas por los servicios.

Después de este comando, el siguiente `sudo docker compose up` tendrá que
crear nuevamente el volumen, ejecutar los scripts de inicialización y aplicar
las migraciones de Django.
