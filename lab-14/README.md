# app-promedio

## 1. Introducción

`app-promedio` es una aplicación web estática desarrollada con HTML5 y
JavaScript para estudiantes de la Universidad Industrial de Santander (UIS).
Ofrece una calculadora de notas por materia y una herramienta para calcular el
promedio ponderado semestral según los créditos de cada asignatura.

La aplicación se ejecuta por defecto en `http://localhost:8080`.

## 2. Dependencias

El proyecto no requiere un backend ni un gestor de paquetes para ejecutarse.
Los archivos estáticos se sirven mediante Nginx dentro de un contenedor Docker.

| Dependencia | Versión | Uso |
| --- | --- | --- |
| **HTML5 y JavaScript ES6+** | nativo | estructura de la aplicación y lógica de cálculo. |
| **Nginx** | `1.25-alpine` | servidor web para los archivos estáticos. |
| **Tailwind CSS** | `3.4` | estilos responsivos cargados mediante CDN. |
| **Chart.js** | `4.4` | visualización del promedio mediante gráficos. |
| **Lucide Icons** | `0.430` | iconos de la interfaz. |
| **Inter Font** | variable | tipografía cargada mediante Google Fonts. |

También se necesita tener instalado:

- Docker.
- Docker Compose como plugin de Docker, disponible mediante `docker compose`.
- Permisos para ejecutar Docker. En este README se usa `sudo` en los comandos.

## 3. Funcionalidades

La aplicación utiliza la ruta base `/`.

### Calculadora de cortes por materia

Permite registrar evaluaciones, indicar su porcentaje y asignar las notas
obtenidas. A partir de esos datos calcula:

- La nota acumulada.
- El porcentaje pendiente de evaluación.
- La nota promedio necesaria para alcanzar una meta.
- El estado de la materia, como alcanzable, aprobada o imposible de aprobar.

La nota objetivo puede configurarse entre `3.0` y `5.0`.

### Promedio ponderado semestral

Permite registrar asignaturas, créditos y notas para calcular el promedio
ponderado del semestre mediante la fórmula:

```text
promedio = suma(nota × créditos) / suma(créditos)
```

Los resultados se muestran en una lista y en un gráfico interactivo.

### Persistencia local

Los cortes y las asignaturas se guardan en el `localStorage` del navegador con
las claves `uis_cuts` y `uis_semestral`. No se utiliza una base de datos ni se
envían datos a un servidor de aplicación.

## 4. Despliegue y observabilidad

El único servicio definido en `docker-compose.yaml` es:

- `front`: contenedor Nginx que sirve los archivos de `app-promedio/src/` y
  publica la aplicación en <http://localhost:8080>.

Ejecuta los comandos desde la raíz del proyecto, donde se encuentra
`docker-compose.yaml`.

### Construir las imágenes

```bash
sudo docker compose build
```

Construye la imagen de la aplicación usando `docker/Dockerfile`. Nginx sirve el
contenido estático en el puerto `80` dentro del contenedor.

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

Detiene y elimina el contenedor y la red creados por Compose. Los datos del
`localStorage` permanecen en el navegador del usuario.

### Eliminar contenedores, volúmenes e imágenes

```bash
sudo docker compose down -v --rmi all
```

Detiene y elimina el contenedor, la red y las imágenes utilizadas por el
servicio. No elimina los datos guardados en el navegador, ya que no se
administran mediante Docker.
