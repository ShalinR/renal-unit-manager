package com.peradeniya.renal.service;

import com.peradeniya.renal.dto.LoginRequest;
import com.peradeniya.renal.dto.LoginResponse;
import com.peradeniya.renal.model.User;
import com.peradeniya.renal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtTokenService jwtTokenService;

    @Autowired
    private UserRepository userRepository;

    public LoginResponse authenticate(LoginRequest loginRequest) {
        try {
            // Check if user exists first
            User user = userRepository.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found: " + loginRequest.getUsername()));
            
            // Check if user is enabled
            if (!user.getEnabled()) {
                throw new RuntimeException("User account is disabled");
            }

            // Authenticate user
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            // Load user details
            UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());
            
            // Generate JWT token
            String token = jwtTokenService.generateToken(userDetails);

            return new LoginResponse(
                    token,
                    user.getUsername(),
                    user.getRole(),
                    user.getFullName() != null ? user.getFullName() : user.getUsername(),
                    "Login successful"
            );
        } catch (BadCredentialsException e) {
            System.err.println("Authentication failed for user: " + loginRequest.getUsername());
            e.printStackTrace();
            throw new RuntimeException("Invalid username or password");
        } catch (Exception e) {
            System.err.println("Error during authentication: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Authentication failed: " + e.getMessage());
        }
    }
}

