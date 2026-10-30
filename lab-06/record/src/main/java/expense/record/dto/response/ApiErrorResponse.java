package expense.record.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;

/**
 * Respuesta estándar para errores de la API.
 *
 * @param timestamp instante en que ocurrió el error
 * @param status código HTTP devuelto
 * @param error tipo o categoría del error
 * @param message mensaje descriptivo del error
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiErrorResponse(
        Instant timestamp,
        int status,
        String error,
        String message
) {
}