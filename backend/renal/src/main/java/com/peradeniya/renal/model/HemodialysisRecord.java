package com.peradeniya.renal.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "hemodialysis_record")
public class HemodialysisRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String patientId;

    // Session date for easy querying
    @Column(nullable = false)
    private String sessionDate;

    // Store full prescription as JSON
    @Lob
    @Column(columnDefinition = "TEXT")
    private String prescriptionJson;

    // Store full vascular access as JSON
    @Lob
    @Column(columnDefinition = "TEXT")
    private String vascularAccessJson;

    // Store full session data as JSON
    @Lob
    @Column(columnDefinition = "TEXT")
    private String sessionJson;

    // Other notes
    @Lob
    @Column(columnDefinition = "TEXT")
    private String otherNotes;

    // Who filled out the form
    private String filledBy;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getSessionDate() {
        return sessionDate;
    }

    public void setSessionDate(String sessionDate) {
        this.sessionDate = sessionDate;
    }

    public String getPrescriptionJson() {
        return prescriptionJson;
    }

    public void setPrescriptionJson(String prescriptionJson) {
        this.prescriptionJson = prescriptionJson;
    }

    public String getVascularAccessJson() {
        return vascularAccessJson;
    }

    public void setVascularAccessJson(String vascularAccessJson) {
        this.vascularAccessJson = vascularAccessJson;
    }

    public String getSessionJson() {
        return sessionJson;
    }

    public void setSessionJson(String sessionJson) {
        this.sessionJson = sessionJson;
    }

    public String getOtherNotes() {
        return otherNotes;
    }

    public void setOtherNotes(String otherNotes) {
        this.otherNotes = otherNotes;
    }

    public String getFilledBy() {
        return filledBy;
    }

    public void setFilledBy(String filledBy) {
        this.filledBy = filledBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

