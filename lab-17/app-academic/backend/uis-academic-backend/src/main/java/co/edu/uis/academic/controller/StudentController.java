package co.edu.uis.academic.controller;

import co.edu.uis.academic.dto.StudentDTO;
import co.edu.uis.academic.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping
    public ResponseEntity<?> createStudent(@Valid @RequestBody StudentDTO studentDTO) {
        StudentDTO created = studentService.createStudent(studentDTO);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Estudiante registrado exitosamente");
        response.put("data", created);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @Valid @RequestBody StudentDTO studentDTO) {
        StudentDTO updated = studentService.updateStudent(id, studentDTO);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Datos del estudiante actualizados exitosamente");
        response.put("data", updated);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStudentById(@PathVariable Long id) {
        StudentDTO student = studentService.getStudentById(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", student);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<?> getAllStudents(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "firstName") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Page<StudentDTO> students = studentService.getAllStudents(search, PageRequest.of(page, size, sort));

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", students);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Estudiante eliminado exitosamente");
        return ResponseEntity.ok(response);
    }
}