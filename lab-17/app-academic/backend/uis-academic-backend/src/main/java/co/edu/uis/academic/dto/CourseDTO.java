package co.edu.uis.academic.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CourseDTO {

    private Long id;

    @NotBlank(message = "El código de la asignatura es obligatorio")
    @Pattern(regexp = "^[A-Za-z]{2,4}\\d{2,4}$", message = "El código debe tener formato válido de asignatura UIS (ej: SOFT301, BD401)")
    private String code;

    @NotBlank(message = "El nombre de la asignatura es obligatorio")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$", message = "El nombre solo debe contener letras y espacios")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    private String name;

    @NotNull(message = "Los créditos son obligatorios")
    @Min(value = 1, message = "Los créditos mínimos son 1")
    @Max(value = 10, message = "Los créditos máximos son 10")
    private Integer credits;

    @Size(max = 1000, message = "La descripción no debe exceder los 1000 caracteres")
    private String description;
}