package app.wired.infrastructure.in.dto.response;

/**
 * Respuesta para devolver la información de un enlace corto.
 * ShortLinkResponse
 */
public record ShortLinkResponse(
        String shortCode,
        String originalUrl
){}
