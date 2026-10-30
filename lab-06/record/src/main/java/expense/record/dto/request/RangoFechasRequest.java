package expense.record.dto.request;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

/**
 * Solicitud para consultar gastos dentro de un rango de fechas.
 *
 * @param fechaInicio fecha inicial del rango
 * @param fechaFin fecha final del rango
 */
public record RangoFechasRequest(
        @NotNull(message = "La fecha inicial no puede ser nula.")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate fechaInicio,

        @NotNull(message = "La fecha final no puede ser nula.")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate fechaFin
) {
}