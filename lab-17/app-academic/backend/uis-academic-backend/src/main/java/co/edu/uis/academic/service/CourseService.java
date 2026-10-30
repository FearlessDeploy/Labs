package co.edu.uis.academic.service;

import co.edu.uis.academic.dto.CourseDTO;
import co.edu.uis.academic.dto.StudentDTO;
import java.util.List;

public interface CourseService {
    CourseDTO createCourse(CourseDTO courseDTO);
    CourseDTO updateCourse(Long id, CourseDTO courseDTO);
    List<CourseDTO> getAllCourses();
    CourseDTO getCourseById(Long id);
    void deleteCourse(Long id);

    void enrollStudent(Long courseId, Long studentId);
    void unenrollStudent(Long courseId, Long studentId);
    List<StudentDTO> getEnrolledStudents(Long courseId);
}