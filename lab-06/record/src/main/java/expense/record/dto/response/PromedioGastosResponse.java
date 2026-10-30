package expense.record.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDate;

/**
 * Respuesta con el promedio de gastos de un rango de fechas.
 *
 * @param fechaInicio fecha inicial del rango
 * @param fechaFin fecha final del rango
 * @param promedio promedio de los costos
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record PromedioGastosResponse(
        LocalDate fechaInicio,
        LocalDate fechaFin,
        Double promedio
) {
}