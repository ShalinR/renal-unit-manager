package com.peradeniya.renal.services;

import com.peradeniya.renal.model.PatientAuditLog;
import com.peradeniya.renal.repository.PatientAuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
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
     * Extract current user info from SecurityContext
     */
    public String[] getCurrentUserInfo() {
        String username = "SYSTEM";
        String userRole = "SYSTEM";
        
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            
            if (auth != null && auth.isAuthenticated()) {
                Object principal = auth.getPrincipal();
                
                if (principal != null && !"anonymousUser".equals(principal.toString())) {
                    if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
                        username = ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
                    } else if (auth.getName() != null && !auth.getName().isEmpty()) {
                        username = auth.getName();
                    }
                    
                    if (auth.getAuthorities() != null && !auth.getAuthorities().isEmpty()) {
                        userRole = auth.getAuthorities().iterator().next().getAuthority();
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("❌ Error extracting user info: " + e.getMessage());
        }
        
        return new String[]{username, userRole};
    }

    /**
     * Log patient data access - auto-detect username from SecurityContext
     */
    public void logPatientAccess(String action, String patientPhn, String description) {
        String[] userInfo = getCurrentUserInfo();
        logPatientAccessWithUser(userInfo[0], userInfo[1], action, patientPhn, description);
    }

    /**
     * Log patient data access with explicit username/role (preferred method)
     * 
     * @param username Username performing the action
     * @param userRole User's role
     * @param action CREATE, VIEW, UPDATE, or DELETE
     * @param patientPhn Patient's PHN (PHI identifier)
     * @param description Optional description of the action
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logPatientAccessWithUser(String username, String userRole, String action, String patientPhn, String description) {
        try {
            System.out.println("🔐 AUDIT LOG ATTEMPT:");
            System.out.println("   Username received: " + username);
            System.out.println("   Role received: " + userRole);
            System.out.println("   Action: " + action);
            System.out.println("   Patient PHN: " + patientPhn);
            
            PatientAuditLog log = new PatientAuditLog();
            log.setUsername(username != null ? username : "SYSTEM");
            log.setUserRole(userRole != null ? userRole : "SYSTEM");
            log.setAction(action);
            log.setPatientPhn(patientPhn != null ? patientPhn : "UNKNOWN");
            log.setDescription(description);
            log.setTimestamp(java.time.LocalDateTime.now());

            repository.save(log);
            
            System.out.println("✅ HIPAA AUDIT SUCCESS: [" + action + "] User: " + username + " (Role: " + userRole + ") | Patient: " + patientPhn);
        } catch (Exception e) {
            System.err.println("❌ HIPAA Audit: Failed to log patient access: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

