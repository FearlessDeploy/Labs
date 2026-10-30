package expense.record.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

/**
 * Respuesta paginada para el listado de gastos.
 *
 * @param gastos elementos de la página actual
 * @param page página actual
 * @param size tamaño de la página
 * @param totalElements total de elementos encontrados
 * @param totalPages total de páginas disponibles
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ListarGastosResponse(
        List<GastoResponse> gastos,
        int page,
        int size,
        long totalElements,
        int totalPages
) {
}