package com.peradeniya.renal.services;

import com.peradeniya.renal.model.PatientAuditLog;
import com.peradeniya.renal.repository.PatientAuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * HIPAA-compliant audit service for patient data access.
 * Logs: Who (username, role), What (action), Which patient (PHN), When (timestamp)
 */
@Service
public class HipaaAuditService {

    @Autowired
    private PatientAuditLogRepository repository;

    /**
     * Log patient data access according to HIPAA standards.
     * 
     * @param action CREATE, VIEW, UPDATE, or DELETE
     * @param patientPhn Patient's PHN (PHI identifier)
     * @param description Optional description of the action
     */
    @Transactional
    public void logPatientAccess(String action, String patientPhn, String description) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = "SYSTEM";
            String userRole = "SYSTEM";

            if (auth != null && auth.isAuthenticated() 
                && !"anonymousUser".equals(auth.getPrincipal().toString())) {
                username = auth.getName();
                if (auth.getAuthorities() != null && !auth.getAuthorities().isEmpty()) {
                    userRole = auth.getAuthorities().iterator().next().getAuthority();
                }
            }

            PatientAuditLog log = new PatientAuditLog();
            log.setUsername(username);
            log.setUserRole(userRole);
            log.setAction(action);
            log.setPatientPhn(patientPhn != null ? patientPhn : "UNKNOWN");
            log.setDescription(description);
            log.setTimestamp(java.time.LocalDateTime.now());

            repository.save(log);
        } catch (Exception e) {
            // Don't fail the operation if audit logging fails
            System.err.println("HIPAA Audit: Failed to log patient access: " + e.getMessage());
        }
    }
}

