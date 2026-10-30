# record

## 1. Introducción

`record` es una API REST desarrollada con Spring Boot para registrar gastos,
listarlos de forma paginada y obtener métricas de suma y promedio dentro de un
rango de fechas.

La API se ejecuta por defecto en `http://localhost:8080` y ofrece documentación
interactiva mediante Scalar en:

- Scalar: `http://localhost:8080/scalar`
- OpenAPI: `http://localhost:8080/v3/api-docs`
- Consola H2: `http://localhost:8080/h2-console`

La base de datos H2 se ejecuta en memoria y se reinicia cada vez que se inicia
la aplicación.

## 2. Dependencias

El proyecto requiere Java `21` o una versión superior. Las dependencias se
declaran en `record/pom.xml` y se instalan automáticamente durante la
construcción de la imagen de Docker.

| Dependencia | Versión | Uso |
| --- | --- | --- |
| **Spring Boot** | `4.1.0` | creación de la API REST y configuración de la aplicación. |
| **Spring Data JPA** | administrada por Spring Boot | persistencia y consultas de gastos. |
| **H2 Database** | administrada por Spring Boot | base de datos en memoria para la aplicación. |
| **Spring Validation** | administrada por Spring Boot | validación de los datos de entrada. |
| **SpringDoc Scalar** | `3.1.0` | documentación interactiva de la API. |

También se necesita tener instalado:

- Docker.
- Docker Compose como plugin de Docker, disponible mediante `docker compose`.
- Permisos para ejecutar Docker. En este README se usa `sudo` en los comandos.

## 3. Endpoints

Todos los endpoints utilizan la base URL `/api/v1/expense`.

### Crear un gasto

```http
POST /api/v1/expense/create
Content-Type: application/json
```

Registra un gasto y devuelve el recurso creado con estado `201 Created`.

```json
{
	"title": "Compra de supermercado",
	"description": "Compra semanal",
	"date": "2026-08-13",
	"cost": 120.5
}
```

Reglas principales:

- `title` es obligatorio, no puede estar vacío y debe tener al menos diez
  caracteres.
- `description` es opcional.
- `date` es opcional y utiliza el formato `yyyy-MM-dd`.
- `cost` es obligatorio y debe ser positivo.

Respuesta:

```json
{
	"title": "Compra de supermercado",
	"description": "Compra semanal",
	"date": "2026-08-13",
	"cost": 120.5
}
```

### Listar gastos

```http
GET /api/v1/expense?page=0&size=10
```

Devuelve los gastos de forma paginada. `page` debe ser mayor o igual que cero y
`size` debe ser mayor que cero.

```json
{
	"gastos": [
		{
			"title": "Compra de supermercado",
			"description": "Compra semanal",
			"date": "2026-08-13",
			"cost": 120.5
		}
	],
	"page": 0,
	"size": 10,
	"totalElements": 1,
	"totalPages": 1
}
```

### Calcular la suma de gastos

```http
GET /api/v1/expense/sum?fechaInicio=2026-08-01&fechaFin=2026-08-31
```

Calcula la suma de los gastos registrados dentro del rango indicado. Las fechas
son obligatorias, utilizan el formato `yyyy-MM-dd` y `fechaInicio` no puede ser
posterior a `fechaFin`.

```json
{
	"fechaInicio": "2026-08-01",
	"fechaFin": "2026-08-31",
	"total": 540.75
}
```

### Calcular el promedio de gastos

```http
GET /api/v1/expense/average?fechaInicio=2026-08-01&fechaFin=2026-08-31
```

Calcula el promedio de los gastos registrados dentro del rango indicado y
devuelve una respuesta con la misma validación de fechas.

```json
{
	"fechaInicio": "2026-08-01",
	"fechaFin": "2026-08-31",
	"promedio": 67.59
}
```

## 4. Despliegue y observabilidad

El servicio definido en `docker-compose.yaml` es:

- `back`: contenedor de la API Spring Boot. Publica la API en
  <http://localhost:8080>.

La aplicación utiliza H2 en memoria, por lo que no necesita un contenedor de
base de datos independiente ni conserva los datos después de reiniciarse.

Ejecuta los comandos desde la raíz del proyecto, donde se encuentra
`docker-compose.yaml`.

### Construir las imágenes

```bash
sudo docker compose build
```

Construye la imagen de la API usando `docker/Dockerfile`. Docker reutiliza las
capas que no hayan cambiado, por lo que las siguientes construcciones suelen
ser más rápidas. Este comando solo construye imágenes; no inicia el
contenedor.

### Levantar la aplicación

```bash
sudo docker compose up
```

Crea e inicia el servicio `back` en primer plano. Los logs aparecen
directamente en la terminal y la API queda disponible en
`http://localhost:8080`.

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

Muestra el contenedor de la API, su estado, el puerto publicado y el nombre del
servicio. Permite comprobar rápidamente que `back` está activo.

### Consultar los logs

Para ver los logs del servicio:

```bash
sudo docker compose logs back
```

Para seguir los logs en tiempo real:

```bash
sudo docker compose logs -f back
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
servicio. No elimina datos persistentes porque H2 se ejecuta en memoria.
