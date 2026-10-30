package co.edu.uis.academic.repository;

import co.edu.uis.academic.model.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByCode(String code);
    Optional<Student> findByEmail(String email);
    Boolean existsByCode(String code);
    Boolean existsByEmail(String email);

    Page<Student> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrCodeContaining(
            String firstName, String lastName, String code, Pageable pageable
    );
}