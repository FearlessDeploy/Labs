package api.blog.infrastructure.in.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * DTO para la solicitud de creación de un post.
 * CreatePostRequest
 */
public record CreatePostRequest(
        @NotNull(message = "El titulo no puede ser nulo.")
        @NotBlank(message = "El titulo no puede ser vacio.")
        @Size(min = 5, max = 255, message = "El titulo tiene que se tener minimo 5 caracteres y maximo 255.")
        String title,

        @NotNull(message = "El autor no puede ser nulo.")
        @NotBlank(message = "El autor no puede ser vacio.")
        @Size(min = 4, max = 255, message = "El autor tiene que se tener minimo 4 caracteres y maximo 255.")
        String author,

        @NotNull(message = "El contenido no puede ser nulo.")
        @NotBlank(message = "El contenido no puede ser vacio.")
        @Size(min = 20, max = 10000, message = "El autor contenido que se tener minimo 20 caracteres y maximo 10000.")
        String content,

        @NotNull(message = "El contenido no puede ser nulo.")
        @NotBlank(message = "El contenido no puede ser vacio.")
        String category,

        List<String> labels
) {
}
