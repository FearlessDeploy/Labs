package app.wired.infrastructure.in.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Solicitud para crear un enlace corto.
 * CreateShortLinkRequest
 */
public record CreateShortLinkRequest(

        @NotNull(message = "La url no puede ser nula.")
        @NotBlank(message = "La url no puede ser vacia.")
        String originalUrl
){}
