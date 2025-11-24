package com.peradeniya.renal.controller;

import com.peradeniya.renal.model.PatientAuditLog;
import com.peradeniya.renal.repository.PatientAuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller to view HIPAA audit logs for patient data access.
 */
@RestController
@RequestMapping("/api/hipaa-audit")
public class HipaaAuditController {

    @Autowired
    private PatientAuditLogRepository repository;

    /**
     * Get audit logs for a specific patient (Admin or Doctor only)
     */
    @GetMapping("/patient/{phn}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<List<PatientAuditLog>> getPatientLogs(@PathVariable String phn) {
        List<PatientAuditLog> logs = repository.findByPatientPhnOrderByTimestampDesc(phn);
        return ResponseEntity.ok(logs);
    }

    /**
     * Get audit logs for current user
     */
    @GetMapping("/my-logs")
    public ResponseEntity<List<PatientAuditLog>> getMyLogs() {
        org.springframework.security.core.Authentication auth = 
            org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        String username = auth != null ? auth.getName() : "UNKNOWN";
        
        List<PatientAuditLog> logs = repository.findByUsernameOrderByTimestampDesc(username);
        return ResponseEntity.ok(logs);
    }

    /**
     * Get all audit logs (Admin only)
     */
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PatientAuditLog>> getAllLogs() {
        List<PatientAuditLog> logs = repository.findAll();
        return ResponseEntity.ok(logs);
    }

    /**
     * Get audit statistics (Admin only)
     */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getStats() {
        List<PatientAuditLog> allLogs = repository.findAll();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalLogs", allLogs.size());
        stats.put("creates", allLogs.stream().filter(l -> "CREATE".equals(l.getAction())).count());
        stats.put("views", allLogs.stream().filter(l -> "VIEW".equals(l.getAction())).count());
        stats.put("updates", allLogs.stream().filter(l -> "UPDATE".equals(l.getAction())).count());
        stats.put("deletes", allLogs.stream().filter(l -> "DELETE".equals(l.getAction())).count());
        
        return ResponseEntity.ok(stats);
    }
}

