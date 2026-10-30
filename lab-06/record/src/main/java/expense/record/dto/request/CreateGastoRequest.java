package expense.record.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record CreateGastoRequest(
        @NotNull(message = "El titulo no puede ser nulo")
        @NotBlank(message = "El titulo no puede ser vacio.")
        @Size(min = 10, message = "El titulo debe tener minimo 10 caracteres.")
        String title,

        String description,

        String date,

        @NotNull(message = "El gasto no puede ser nulo.")
        @Positive(message = "El gasto tiene que ser positivo.")
        Double cost
){ }
