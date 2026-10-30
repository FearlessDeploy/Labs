package co.edu.uis.academic.config;

import co.edu.uis.academic.model.Role;
import co.edu.uis.academic.model.User;
import co.edu.uis.academic.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Garantizar únicamente el usuario administrador por defecto
        User teacher = userRepository.findByUsername("admin").orElse(new User());
        teacher.setUsername("admin");
        teacher.setPassword(passwordEncoder.encode("admin123"));
        teacher.setName("Profesor UIS");
        teacher.setRole(Role.ROLE_TEACHER);
        userRepository.save(teacher);
    }
}