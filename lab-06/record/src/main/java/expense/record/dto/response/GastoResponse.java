package expense.record.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDate;

/**
 * Representa un gasto individual para respuestas de consulta.
 *
 * @param title título del gasto
 * @param description descripción opcional del gasto
 * @param date fecha del gasto
 * @param cost costo registrado
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record GastoResponse(
        String title,
        String description,
        LocalDate date,
        Double cost
) {
}