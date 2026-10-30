package co.edu.uis.academic.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code; // Ej: SOFT101

    @Column(nullable = false)
    private String name; // Ej: Software 1

    @Column(nullable = false)
    private Integer credits; // Ej: 4

    @Column(length = 1000)
    private String description;

    @JsonIgnore
    @ManyToMany(mappedBy = "enrolledCourses", fetch = FetchType.LAZY)
    private Set<Student> enrolledStudents = new HashSet<>();
}