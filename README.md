# Laboratorios de Fearless Deploy

Este repositorio reúne el código fuente y la documentación de los laboratorios
de **Fearless Deploy**, una plataforma para desplegar aplicaciones
contenerizadas en infraestructura propia. Su propósito es permitir explorar
aplicaciones de ejemplo y entender cómo se organizan antes de desplegarlas.

## ¿Qué es Fearless Deploy?

Fearless Deploy facilita el despliegue de aplicaciones que se describen con
archivos Docker Compose. La plataforma interpreta esos archivos, los traduce a
manifiestos nativos de Kubernetes y despliega los recursos resultantes en la
infraestructura configurada.

Después del despliegue, permite consultar métricas y gestionar las aplicaciones
mediante operaciones inspiradas en los comandos habituales de Kubernetes:

- **Get:** consultar los recursos y el estado de una aplicación.
- **Describe:** revisar información detallada de los recursos desplegados.
- **Logs:** consultar los registros de los contenedores.
- **Redeploy:** volver a desplegar una aplicación cuando se actualiza su
  configuración o versión.
- **Delete:** eliminar una aplicación y los recursos asociados a su despliegue.

La plataforma también ofrece un conjunto de etiquetas propias agrupadas bajo
la etiqueta padre `navi`. Estas etiquetas forman parte de las convenciones de
Fearless Deploy que permiten acceder a funcionalidades de Kubernetes como:

- Aumento de recursos
- Aumento de Pods
- Definición de Sondeos

## Propósito y alcance de los laboratorios

Los laboratorios son ejemplos prácticos para conocer las aplicaciones que se
pueden desplegar y aprender cómo están construidas. El código permite
identificar la arquitectura de cada ejemplo, sus componentes, las tecnologías
utilizadas y las variables de entorno que pueden necesitar configuración.
También puede servir como referencia para comparar una aplicación con la
desplegada y ayudar a diagnosticar errores durante el proceso.

En total, la colección de Fearless Deploy comprende 17 laboratorios y cubre
siete topologías:

- Base de datos standalone.
- Backend standalone.
- Monolito standalone.
- Frontend standalone.
- Backend con base de datos.
- Monolito con base de datos.
- Arquitectura de tres capas.

Este repositorio contiene los laboratorios del `lab-06` al `lab-17`. Los cinco
primeros corresponden a ejemplos de bases de datos standalone y no están
incluidos aquí.

## Índice de laboratorios

Cada enlace abre el README del laboratorio correspondiente, donde se describen
su aplicación, sus dependencias, sus funcionalidades y cómo desplegarla con
Docker Compose.

| Laboratorio | Descripción |
| --- | --- |
| [Lab 06: Record](./lab-06/README.md) | API REST con Spring Boot para registrar gastos, consultarlos de forma paginada y calcular sumas y promedios por rango de fechas. |
| [Lab 07: Recommendation Song](./lab-07/README.md) | API con FastAPI para gestionar canciones y obtener recomendaciones aleatorias, con persistencia en base de datos. |
| [Lab 08: Wired](./lab-08/README.md) | API con Spring Boot para crear enlaces cortos y resolverlos a su URL original, con almacenamiento en PostgreSQL. |
| [Lab 09: Ver-App](./lab-09/README.md) | API con FastAPI para crear, consultar, actualizar, listar y eliminar verbos en inglés almacenados en MySQL. |
| [Lab 10: Blog](./lab-10/README.md) | API con Spring Boot y MongoDB para crear, editar, listar y eliminar publicaciones de un blog. |
| [Lab 11: Poll](./lab-11/README.md) | API con FastAPI y Redis para crear encuestas, registrar votos y consultar resultados. |
| [Lab 12: Keyboard](./lab-12/README.md) | Aplicación Django con un teclado virtual para validar las teclas detectadas por el navegador. |
| [Lab 13: Keytest](./lab-13/README.md) | Aplicación Django de mecanografía que selecciona textos de prueba desde MariaDB y registra métricas. |
| [Lab 14: App-Promedio](./lab-14/README.md) | Aplicación web para calcular notas por materia y el promedio semestral ponderado por créditos. |
| [Lab 15: ChronoPulse: Rogue Orbit](./lab-15/README.md) | Videojuego web de acción roguelite con combate orbital, control del tiempo y progresión por mejoras. |
| [Lab 16: UIS Markdown Studio](./lab-16/README.md) | Editor web de Markdown con vista previa en tiempo real, guardado local y exportación a Markdown o HTML. |
| [Lab 17: UIS Asignaturas](./lab-17/README.md) | Plataforma académica de tres capas para gestionar estudiantes e inscripciones mediante una SPA, una API y PostgreSQL. |
