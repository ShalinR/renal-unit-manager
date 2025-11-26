package com.peradeniya.renal.controller;

import com.peradeniya.renal.dto.LoginRequest;
import com.peradeniya.renal.dto.LoginResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import com.peradeniya.renal.service.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
// CORS is handled globally by SecurityConfig.corsConfigurationSource()
// Removed @CrossOrigin to avoid conflicts with global CORS configuration
public class AuthenticationController {

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse response = authenticationService.authenticate(loginRequest);
            // Set HttpOnly cookie with JWT so browser can use cookie-based session
            ResponseCookie cookie = ResponseCookie.from("AUTH-TOKEN", response.getToken())
                    .httpOnly(true)
                    .path("/")
                    .maxAge(7 * 24 * 60 * 60) // 7 days
                    .sameSite("Lax")
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(
                new ErrorResponse("Authentication failed: " + e.getMessage())
            );
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        try {
            // Token validation is handled by JwtAuthenticationFilter
            return ResponseEntity.ok(new MessageResponse("Token is valid"));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(
                new ErrorResponse("Invalid token")
            );
        }
    }

    // Inner classes for response
    private static class ErrorResponse {
        private String error;
        
        public ErrorResponse(String error) {
            this.error = error;
        }
        
        public String getError() {
            return error;
        }
    }

    private static class MessageResponse {
        private String message;
        
        public MessageResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() {
            return message;
        }
    }
}

