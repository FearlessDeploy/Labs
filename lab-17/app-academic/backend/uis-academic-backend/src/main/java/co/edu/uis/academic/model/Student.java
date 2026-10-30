package co.edu.uis.academic.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName; // Nombres (solo letras)

    @Column(nullable = false)
    private String lastName; // Apellidos (solo letras)

    @Column(unique = true, nullable = false)
    private String code; // Código estudiantil (Ej: 2180032)

    @Column(unique = true, nullable = false)
    private String email; // Correo @correo.uis.edu.co o @uis.edu.co

    @Column(nullable = false)
    private Integer semester; // 1 a 10

    @Column(nullable = false)
    private String program; // Ej: Ingeniería de Sistemas

    @Column(length = 1000)
    private String completedCourses; // Prerrequisitos aprobados

    @Column(nullable = false)
    private Integer passedCredits; // Créditos acumulados

    @Column(nullable = false)
    private Double pga; // Promedio Ponderado Acumulado (0.0 a 5.0)

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "student_courses",
            joinColumns = @JoinColumn(name = "student_id"),
            inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private Set<Course> enrolledCourses = new HashSet<>();
}