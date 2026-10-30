package api.blog.domain.enums;

import api.blog.domain.exception.DomainValidationException;

/**
 * Enum que representa las categorías de los posts.
 * CategoryPost
 */
public enum CategoryPost {
    PROGRAMACION,
    BASES_DE_DATOS,
    ARQUITECTURA,
    SEGURIDAD;

    // Método estático para convertir una cadena de texto a un valor enum AppArchitecture
    public static CategoryPost from(String value) {
        // Validación de entrada: la cadena no puede ser nula ni vacía
        if (value == null || value.isBlank()) {
            throw new DomainValidationException("La categoria no puede ser nula o vacía");
        }
        // Normalización de la cadena: se eliminan espacios, se convierten a mayúsculas y se reemplazan guiones por guiones bajos
        String normalized = value
                .trim()
                .toUpperCase()
                .replace("-", "_")
                .replace(" ", "_");

        // Intento de conversión a enum, manejando el caso en que el valor no sea válido
        // Si el valor no corresponde a ningún enum, se lanza una excepción personalizada con un mensaje claro
        // El bloque try-catch captura la excepción IllegalArgumentException que se lanza cuando el valor no es válido, y
        // la convierte en una DomainValidationException con un mensaje específico
        try {
            return CategoryPost.valueOf(normalized);
        } catch (IllegalArgumentException e) {
            throw new DomainValidationException(
                    "Categoria no soportada: " + value
            );
        }
    }
}