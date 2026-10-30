package co.edu.uis.academic.service;

import co.edu.uis.academic.dto.StudentDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StudentService {
    StudentDTO createStudent(StudentDTO studentDTO);
    StudentDTO updateStudent(Long id, StudentDTO studentDTO);
    StudentDTO getStudentById(Long id);
    Page<StudentDTO> getAllStudents(String search, Pageable pageable);
    void deleteStudent(Long id);
}