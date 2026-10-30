const database = db.getSiblingDB("blogdb");

database.posts.insertMany([
  {
    title: "Introducción a Spring Boot",
    author: "Carlos Martínez",
    content: "Spring Boot facilita la creación de aplicaciones Java.",
    category: "PROGRAMACION",
    labels: ["java", "spring-boot", "backend"],
    create_at: ISODate("2026-08-01T09:00:00Z"),
    status: "PUBLICADO"
  },
  {
    title: "Programación orientada a objetos",
    author: "Laura Gómez",
    content: "La programación orientada a objetos utiliza clases, objetos, herencia y polimorfismo.",
    category: "PROGRAMACION",
    labels: ["java", "poo"],
    create_at: ISODate("2026-08-02T10:30:00Z"),
    status: "PUBLICADO"
  },
  {
    title: "Colecciones en Java",
    author: "Miguel Torres",
    content: "Las colecciones permiten trabajar con listas, conjuntos y mapas.",
    category: "PROGRAMACION",
    labels: ["java", "collections"],
    create_at: ISODate("2026-08-03T14:15:00Z"),
    status: "PUBLICADO"
  },
  {
    title: "Diferencias entre SQL y NoSQL",
    author: "Ana Rodríguez",
    content: "SQL utiliza tablas y relaciones, mientras NoSQL utiliza estructuras flexibles.",
    category: "BASES_DE_DATOS",
    labels: ["sql", "nosql"],
    create_at: ISODate("2026-08-04T08:45:00Z"),
    status: "PUBLICADO"
  },
  {
    title: "Introducción a MongoDB",
    author: "Carlos Martínez",
    content: "MongoDB es una base de datos orientada a documentos.",
    category: "BASES_DE_DATOS",
    labels: ["mongodb", "bson"],
    create_at: ISODate("2026-08-05T11:20:00Z"),
    status: "PUBLICADO"
  },
  {
    title: "Índices en MongoDB",
    author: "Sofía Hernández",
    content: "Los índices mejoran el rendimiento de las consultas.",
    category: "BASES_DE_DATOS",
    labels: ["mongodb", "indices"],
    create_at: ISODate("2026-08-06T16:00:00Z"),
    status: "PUBLICADO"
  },
  {
    title: "Diseño de documentos",
    author: "Diego Pérez",
    content: "El diseño debe tener en cuenta la forma en que se consultarán los datos.",
    category: "BASES_DE_DATOS",
    labels: ["mongodb", "modelado"],
    create_at: ISODate("2026-08-07T13:10:00Z"),
    status: "PUBLICADO"
  },
  {
    title: "Arquitectura hexagonal",
    author: "Laura Gómez",
    content: "La arquitectura hexagonal separa la lógica de negocio de los detalles externos.",
    category: "ARQUITECTURA",
    labels: ["hexagonal", "software"],
    create_at: ISODate("2026-08-08T09:35:00Z"),
    status: "PUBLICADO"
  },
  {
    title: "Puertos y adaptadores",
    author: "Miguel Torres",
    content: "Los puertos definen contratos y los adaptadores conectan tecnologías externas.",
    category: "ARQUITECTURA",
    labels: ["puertos", "adaptadores"],
    create_at: ISODate("2026-08-09T12:00:00Z"),
    status: "PUBLICADO"
  },
  {
    title: "Dominio e infraestructura",
    author: "Ana Rodríguez",
    content: "Separar el dominio facilita las pruebas y el mantenimiento.",
    category: "ARQUITECTURA",
    labels: ["dominio", "infraestructura"],
    create_at: ISODate("2026-08-10T15:25:00Z"),
    status: "PUBLICADO"
  },
  {
    title: "Casos de uso en backend",
    author: "Sofía Hernández",
    content: "Los casos de uso representan las acciones principales de la aplicación.",
    category: "ARQUITECTURA",
    labels: ["use-cases", "backend"],
    create_at: ISODate("2026-08-11T10:10:00Z"),
    status: "PUBLICADO"
  },
  {
    title: "Principios de seguridad web",
    author: "Diego Pérez",
    content: "La validación, autenticación y autorización son fundamentales.",
    category: "SEGURIDAD",
    labels: ["seguridad", "web"],
    create_at: ISODate("2026-08-12T08:30:00Z"),
    status: "PUBLICADO"
  },
  {
    title: "Qué es JWT",
    author: "Carlos Martínez",
    content: "JWT permite transmitir información firmada entre diferentes partes.",
    category: "SEGURIDAD",
    labels: ["jwt", "tokens"],
    create_at: ISODate("2026-08-13T17:40:00Z"),
    status: "PUBLICADO"
  },
  {
    title: "Validación de datos de entrada",
    author: "Laura Gómez",
    content: "Validar los datos ayuda a reducir riesgos de seguridad.",
    category: "SEGURIDAD",
    labels: ["validacion", "seguridad"],
    create_at: ISODate("2026-08-14T11:50:00Z"),
    status: "PUBLICADO"
  },
  {
    title: "Publicación eliminada",
    author: "Administrador",
    content: "Esta publicación fue eliminada por estar desactualizada.",
    category: "SEGURIDAD",
    labels: ["seguridad"],
    create_at: ISODate("2026-08-15T14:05:00Z"),
    status: "ELIMINADO"
  }
]);
