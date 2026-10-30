package expense.record.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDate;

/**
 * Respuesta con la suma total de gastos de un rango de fechas.
 *
 * @param fechaInicio fecha inicial del rango
 * @param fechaFin fecha final del rango
 * @param total suma total de los costos
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record SumaGastosResponse(
        LocalDate fechaInicio,
        LocalDate fechaFin,
        Double total
) {
}