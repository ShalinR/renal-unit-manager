package com.peradeniya.renal.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * HIPAA-compliant audit log for patient data access.
 * Standard HIPAA requirement: Track who accessed what patient data and when.
 */
@Entity
@Table(name = "patient_audit_logs", indexes = {
    @Index(name = "idx_patient_phn", columnList = "patientPhn"),
    @Index(name = "idx_username", columnList = "username"),
    @Index(name = "idx_timestamp", columnList = "timestamp")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username; // Who accessed

    @Column(nullable = false)
    private String userRole; // User's role

    @Column(nullable = false)
    private String action; // CREATE, VIEW, UPDATE, DELETE

    @Column(nullable = false)
    private String patientPhn; // Which patient (PHI identifier)

    @Column(nullable = false)
    private LocalDateTime timestamp; // When

    @Column(length = 500)
    private String description; // What happened

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}

