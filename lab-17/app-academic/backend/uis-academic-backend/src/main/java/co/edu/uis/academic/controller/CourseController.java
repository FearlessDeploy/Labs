package co.edu.uis.academic.controller;

import co.edu.uis.academic.dto.CourseDTO;
import co.edu.uis.academic.dto.StudentDTO;
import co.edu.uis.academic.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @PostMapping
    public ResponseEntity<?> createCourse(@Valid @RequestBody CourseDTO courseDTO) {
        CourseDTO created = courseService.createCourse(courseDTO);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Asignatura creada exitosamente");
        response.put("data", created);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCourse(@PathVariable Long id, @Valid @RequestBody CourseDTO courseDTO) {
        CourseDTO updated = courseService.updateCourse(id, courseDTO);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Asignatura actualizada exitosamente");
        response.put("data", updated);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<?> getAllCourses() {
        List<CourseDTO> courses = courseService.getAllCourses();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", courses);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseById(@PathVariable Long id) {
        CourseDTO course = courseService.getCourseById(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", course);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Asignatura eliminada exitosamente");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{courseId}/enroll/{studentId}")
    public ResponseEntity<?> enrollStudent(@PathVariable Long courseId, @PathVariable Long studentId) {
        courseService.enrollStudent(courseId, studentId);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Estudiante matriculado en la asignatura exitosamente");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{courseId}/unenroll/{studentId}")
    public ResponseEntity<?> unenrollStudent(@PathVariable Long courseId, @PathVariable Long studentId) {
        courseService.unenrollStudent(courseId, studentId);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Estudiante retirado de la asignatura exitosamente");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{courseId}/students")
    public ResponseEntity<?> getEnrolledStudents(@PathVariable Long courseId) {
        List<StudentDTO> students = courseService.getEnrolledStudents(courseId);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", students);
        return ResponseEntity.ok(response);
    }
}