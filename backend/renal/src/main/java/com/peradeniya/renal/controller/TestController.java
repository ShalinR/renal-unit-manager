package com.peradeniya.renal.controller;

import com.peradeniya.renal.model.User;
import com.peradeniya.renal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:5173")
public class TestController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/check-user/{username}")
    public ResponseEntity<?> checkUser(@PathVariable String username) {
        Map<String, Object> response = new HashMap<>();
        userRepository.findByUsername(username).ifPresentOrElse(
            user -> {
                response.put("exists", true);
                response.put("username", user.getUsername());
                response.put("role", user.getRole());
                response.put("enabled", user.getEnabled());
                response.put("passwordHash", user.getPassword());
                response.put("passwordLength", user.getPassword() != null ? user.getPassword().length() : 0);
                response.put("passwordStartsWith", user.getPassword() != null && user.getPassword().startsWith("$2a$") ? "Yes (BCrypt)" : "No");
            },
            () -> {
                response.put("exists", false);
                response.put("message", "User not found");
            }
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password/{username}")
    public ResponseEntity<?> resetPassword(@PathVariable String username, @RequestParam String newPassword) {
        return userRepository.findByUsername(username).map(user -> {
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Password reset successfully for user: " + username);
            response.put("newPasswordHash", user.getPassword());
            return ResponseEntity.ok(response);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/create-test-user")
    public ResponseEntity<?> createTestUser(@RequestParam String username, @RequestParam String password) {
        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body("User already exists");
        }
        
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("DOCTOR");
        user.setEnabled(true);
        user.setFullName("Test User");
        user.setEmail(username + "@test.com");
        
        User saved = userRepository.save(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "User created successfully");
        response.put("username", saved.getUsername());
        response.put("passwordHash", saved.getPassword());
        
        return ResponseEntity.ok(response);
    }
}

