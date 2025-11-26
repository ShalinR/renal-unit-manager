package com.peradeniya.renal.config;

import com.peradeniya.renal.model.User;
import com.peradeniya.renal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create or update admin user
        User admin = userRepository.findByUsername("admin").orElse(new User());
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole("ADMIN");
        admin.setEnabled(true);
        admin.setFullName("System Administrator");
        admin.setEmail("admin@hospital.lk");
        userRepository.save(admin);
        System.out.println("✅ Created/Updated default admin user (username: admin, password: admin123)");

        // Create or update doctor user
        User doctor = userRepository.findByUsername("doctor").orElse(new User());
        doctor.setUsername("doctor");
        doctor.setPassword(passwordEncoder.encode("doctor123"));
        doctor.setRole("DOCTOR");
        doctor.setEnabled(true);
        doctor.setFullName("Dr. John Doe");
        doctor.setEmail("doctor@hospital.lk");
        userRepository.save(doctor);
        System.out.println("✅ Created/Updated default doctor user (username: doctor, password: doctor123)");

        // Create or update nurse user
        User nurse = userRepository.findByUsername("nurse").orElse(new User());
        nurse.setUsername("nurse");
        nurse.setPassword(passwordEncoder.encode("nurse123"));
        nurse.setRole("NURSE");
        nurse.setEnabled(true);
        nurse.setFullName("Nurse Jane Smith");
        nurse.setEmail("nurse@hospital.lk");
        userRepository.save(nurse);
        System.out.println("✅ Created/Updated default nurse user (username: nurse, password: nurse123)");
    }
}

