package co.edu.uis.academic.repository;

import co.edu.uis.academic.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByCode(String code);
    Boolean existsByCode(String code);
}