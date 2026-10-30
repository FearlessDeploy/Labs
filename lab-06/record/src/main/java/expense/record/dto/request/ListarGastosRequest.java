package expense.record.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;

/**
 * Solicitud para listar gastos mediante paginación.
 *
 * @param page número de página solicitado
 * @param size cantidad de elementos por página
 */
public record ListarGastosRequest(
        @Min(value = 0, message = "La página no puede ser negativa.")
        Integer page,

        @Positive(message = "El tamaño de página debe ser mayor a cero.")
        Integer size
) {
}