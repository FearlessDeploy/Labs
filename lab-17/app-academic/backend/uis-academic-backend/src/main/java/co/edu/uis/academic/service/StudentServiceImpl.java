package co.edu.uis.academic.service;

import co.edu.uis.academic.dto.StudentDTO;
import co.edu.uis.academic.exception.BadRequestException;
import co.edu.uis.academic.exception.ResourceNotFoundException;
import co.edu.uis.academic.model.Student;
import co.edu.uis.academic.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Override
    @Transactional
    public StudentDTO createStudent(StudentDTO dto) {
        if (studentRepository.existsByCode(dto.getCode())) {
            throw new BadRequestException("Ya existe un estudiante registrado con el código: " + dto.getCode());
        }
        if (studentRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Ya existe un estudiante registrado con el correo: " + dto.getEmail());
        }

        Student student = mapToEntity(dto);
        Student saved = studentRepository.save(student);
        return mapToDTO(saved);
    }

    @Override
    @Transactional
    public StudentDTO updateStudent(Long id, StudentDTO dto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado con ID: " + id));

        if (!student.getCode().equals(dto.getCode()) && studentRepository.existsByCode(dto.getCode())) {
            throw new BadRequestException("El código " + dto.getCode() + " ya está en uso por otro estudiante.");
        }
        if (!student.getEmail().equals(dto.getEmail()) && studentRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("El correo " + dto.getEmail() + " ya está en uso por otro estudiante.");
        }

        student.setFirstName(dto.getFirstName());
        student.setLastName(dto.getLastName());
        student.setCode(dto.getCode());
        student.setEmail(dto.getEmail());
        student.setSemester(dto.getSemester());
        student.setProgram(dto.getProgram());
        student.setCompletedCourses(dto.getCompletedCourses());
        student.setPassedCredits(dto.getPassedCredits());
        student.setPga(dto.getPga());

        Student updated = studentRepository.save(student);
        return mapToDTO(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado con ID: " + id));
        return mapToDTO(student);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StudentDTO> getAllStudents(String search, Pageable pageable) {
        if (search != null && !search.trim().isEmpty()) {
            return studentRepository
                    .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrCodeContaining(search, search, search, pageable)
                    .map(this::mapToDTO);
        }
        return studentRepository.findAll(pageable).map(this::mapToDTO);
    }

    @Override
    @Transactional
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Estudiante no encontrado con ID: " + id);
        }
        studentRepository.deleteById(id);
    }

    private StudentDTO mapToDTO(Student student) {
        StudentDTO dto = new StudentDTO();
        dto.setId(student.getId());
        dto.setFirstName(student.getFirstName());
        dto.setLastName(student.getLastName());
        dto.setCode(student.getCode());
        dto.setEmail(student.getEmail());
        dto.setSemester(student.getSemester());
        dto.setProgram(student.getProgram());
        dto.setCompletedCourses(student.getCompletedCourses());
        dto.setPassedCredits(student.getPassedCredits());
        dto.setPga(student.getPga());
        return dto;
    }

    private Student mapToEntity(StudentDTO dto) {
        return Student.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .code(dto.getCode())
                .email(dto.getEmail())
                .semester(dto.getSemester())
                .program(dto.getProgram())
                .completedCourses(dto.getCompletedCourses())
                .passedCredits(dto.getPassedCredits())
                .pga(dto.getPga())
                .build();
    }
}