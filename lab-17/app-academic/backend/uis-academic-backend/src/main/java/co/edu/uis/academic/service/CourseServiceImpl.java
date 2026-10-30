package co.edu.uis.academic.service;

import co.edu.uis.academic.dto.CourseDTO;
import co.edu.uis.academic.dto.StudentDTO;
import co.edu.uis.academic.exception.BadRequestException;
import co.edu.uis.academic.exception.ResourceNotFoundException;
import co.edu.uis.academic.model.Course;
import co.edu.uis.academic.model.Student;
import co.edu.uis.academic.repository.CourseRepository;
import co.edu.uis.academic.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Override
    @Transactional
    public CourseDTO createCourse(CourseDTO dto) {
        if (courseRepository.existsByCode(dto.getCode())) {
            throw new BadRequestException("Ya existe una asignatura con el código: " + dto.getCode());
        }
        Course course = mapToEntity(dto);
        Course saved = courseRepository.save(course);
        return mapToDTO(saved);
    }

    @Override
    @Transactional
    public CourseDTO updateCourse(Long id, CourseDTO dto) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asignatura no encontrada con ID: " + id));

        if (!course.getCode().equals(dto.getCode()) && courseRepository.existsByCode(dto.getCode())) {
            throw new BadRequestException("El código " + dto.getCode() + " ya está en uso.");
        }

        course.setCode(dto.getCode());
        course.setName(dto.getName());
        course.setCredits(dto.getCredits());
        course.setDescription(dto.getDescription());

        Course updated = courseRepository.save(course);
        return mapToDTO(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CourseDTO getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asignatura no encontrada con ID: " + id));
        return mapToDTO(course);
    }

    @Override
    @Transactional
    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Asignatura no encontrada con ID: " + id);
        }
        courseRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void enrollStudent(Long courseId, Long studentId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Asignatura no encontrada con ID: " + courseId));
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado con ID: " + studentId));

        if (student.getEnrolledCourses().contains(course)) {
            throw new BadRequestException("El estudiante ya se encuentra matriculado en " + course.getName());
        }

        student.getEnrolledCourses().add(course);
        studentRepository.save(student);
    }

    @Override
    @Transactional
    public void unenrollStudent(Long courseId, Long studentId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Asignatura no encontrada con ID: " + courseId));
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado con ID: " + studentId));

        if (!student.getEnrolledCourses().contains(course)) {
            throw new BadRequestException("El estudiante no está matriculado en " + course.getName());
        }

        student.getEnrolledCourses().remove(course);
        studentRepository.save(student);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDTO> getEnrolledStudents(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Asignatura no encontrada con ID: " + courseId));

        return course.getEnrolledStudents().stream().map(student -> {
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
        }).collect(Collectors.toList());
    }

    private CourseDTO mapToDTO(Course course) {
        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId());
        dto.setCode(course.getCode());
        dto.setName(course.getName());
        dto.setCredits(course.getCredits());
        dto.setDescription(course.getDescription());
        return dto;
    }

    private Course mapToEntity(CourseDTO dto) {
        return Course.builder()
                .code(dto.getCode())
                .name(dto.getName())
                .credits(dto.getCredits())
                .description(dto.getDescription())
                .build();
    }
}