package com.peradeniya.renal.controller;

import com.peradeniya.renal.dto.PatientBasicDTO;
import com.peradeniya.renal.dto.PatientCreateRequest;
import com.peradeniya.renal.dto.PatientProfileDTO;
import com.peradeniya.renal.dto.PatientResponse;
import com.peradeniya.renal.model.Admission;
import com.peradeniya.renal.model.Patient;
import com.peradeniya.renal.services.PatientService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;

import java.util.Optional;

@RestController
@RequestMapping("/api/patient")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService service;

    /**
     * Get current authenticated user's username
     */
    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("🔍 DEBUG: Auth object = " + auth);
        if (auth != null) {
            System.out.println("🔍 DEBUG: Auth principal = " + auth.getPrincipal());
            System.out.println("🔍 DEBUG: Auth name = " + auth.getName());
            System.out.println("🔍 DEBUG: Auth authenticated = " + auth.isAuthenticated());
        }
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            return auth.getName();
        }
        return "SYSTEM";
    }

    /**
     * Get current authenticated user's role
     */
    private String getCurrentUserRole() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName()) && !auth.getAuthorities().isEmpty()) {
            return auth.getAuthorities().iterator().next().getAuthority();
        }
        return "SYSTEM";
    }

    @PostMapping
    public ResponseEntity<Patient> createPatient(@RequestBody PatientCreateRequest request) {
        String username = getCurrentUsername();
        String userRole = getCurrentUserRole();
        Patient patient = service.createPatientWithAudit(request, username, userRole);
        return ResponseEntity.ok(patient);
    }

    @GetMapping
    public ResponseEntity<PatientResponse> getPatientByPhn(@RequestParam("phn") String phn) {
        String cleanPhn = phn.replaceAll("[^0-9]", "");
        String username = getCurrentUsername();
        String userRole = getCurrentUserRole();
        Patient patient = service.getPatientByPhnWithAudit(cleanPhn, username, userRole);

        Admission active = service.getActiveAdmission(patient).orElse(null);

        PatientResponse response = PatientResponse.from(patient, active);

        return ResponseEntity.ok(response);
    }


    @PutMapping("/{phn}/status")
    public ResponseEntity<Patient> updatePatientStatus(
            @PathVariable("phn") String phn,
            @RequestBody StatusUpdateRequest request) {

        String cleanPhn = phn.replaceAll("[^0-9]", "");
        String username = getCurrentUsername();
        String userRole = getCurrentUserRole();
        Patient patient = service.updatePatientStatusWithAudit(cleanPhn, request.getStatus(), username, userRole);
        return ResponseEntity.ok(patient);
    }

    @GetMapping("/debug/{phn}")
    public ResponseEntity<Map<String, Object>> debugPatient(@PathVariable("phn") String phn) {

        String cleanPhn = phn.replaceAll("[^0-9]", "");
        try {
            Patient patient = service.getPatientByPhn(cleanPhn);
            Optional<Admission> admissionOpt = service.getActiveAdmission(patient);
            Admission admission = admissionOpt.orElse(null);

            PatientResponse response = PatientResponse.from(patient, admission);

            Map<String, Object> debug = new HashMap<>();
            debug.put("patient", patient);
            debug.put("activeAdmission", response.getActiveAdmission());
            debug.put("activeAdmissionId",
                    response.getActiveAdmission() != null ? response.getActiveAdmission().getId() : null);

            return ResponseEntity.ok(debug);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // For global search - returns basic info only
    @GetMapping("/{phn}")
    public ResponseEntity<PatientBasicDTO> getByPhn(@PathVariable String phn) {
        String username = getCurrentUsername();
        String userRole = getCurrentUserRole();
        // Log audit with explicit user info
        if (service.getHipaaAuditService() != null) {
            service.getHipaaAuditService().logPatientAccessWithUser(username, userRole, "VIEW", phn, "Viewed patient basic info via search");
        }
        Optional<PatientBasicDTO> patient = service.getBasicByPhn(phn);
        return patient.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // For complete patient profile
    @GetMapping("/{phn}/profile")
    public ResponseEntity<PatientProfileDTO> getProfileByPhn(@PathVariable String phn) {
        String username = getCurrentUsername();
        String userRole = getCurrentUserRole();
        // Log audit with explicit user info
        if (service.getHipaaAuditService() != null) {
            service.getHipaaAuditService().logPatientAccessWithUser(username, userRole, "VIEW", phn, "Viewed full patient profile");
        }
        Optional<PatientProfileDTO> profile = service.getPatientProfile(phn);
        return profile.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        String username = getCurrentUsername();
        String userRole = getCurrentUserRole();
        service.deleteByIdWithAudit(id, username, userRole);
        return ResponseEntity.ok().build();
    }

    public static class StatusUpdateRequest {
        private String status;

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}