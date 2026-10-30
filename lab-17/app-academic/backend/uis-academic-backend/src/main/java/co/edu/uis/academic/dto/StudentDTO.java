package co.edu.uis.academic.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class StudentDTO {

    private Long id;

    @NotBlank(message = "Los nombres son obligatorios")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$", message = "Los nombres solo deben contener letras y espacios")
    @Size(min = 2, max = 50, message = "Los nombres deben tener entre 2 y 50 caracteres")
    private String firstName;

    @NotBlank(message = "Los apellidos son obligatorios")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$", message = "Los apellidos solo deben contener letras y espacios")
    @Size(min = 2, max = 50, message = "Los apellidos deben tener entre 2 y 50 caracteres")
    private String lastName;

    @NotBlank(message = "El código estudiantil es obligatorio")
    @Pattern(regexp = "^\\d{5,8}$", message = "El código debe ser numérico entre 5 y 8 dígitos")
    private String code;

    @NotBlank(message = "El correo es obligatorio")
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@(correo\\.uis\\.edu\\.co|uis\\.edu\\.co)$", message = "Solo se permiten correos institucionales (@correo.uis.edu.co o @uis.edu.co)")
    private String email;

    @NotNull(message = "El semestre es obligatorio")
    @Min(value = 1, message = "El semestre mínimo es 1")
    @Max(value = 10, message = "El semestre máximo es 10")
    private Integer semester;

    @NotBlank(message = "El programa académico es obligatorio")
    private String program;

    private String completedCourses;

    @NotNull(message = "Los créditos aprobados son obligatorios")
    @Min(value = 0, message = "Los créditos no pueden ser negativos")
    private Integer passedCredits;

    @NotNull(message = "El promedio PGA es obligatorio")
    @DecimalMin(value = "0.0", message = "El PGA mínimo es 0.0")
    @DecimalMax(value = "5.0", message = "El PGA máximo es 5.0")
    private Double pga;
}