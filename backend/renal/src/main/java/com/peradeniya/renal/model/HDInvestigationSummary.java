package com.peradeniya.renal.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "hd_investigation_summary")
public class HDInvestigationSummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String patientId; // PHN

    @Column(nullable = false)
    private String patientName;

    // Store investigation data as JSON
    @Lob
    @Column(columnDefinition = "TEXT")
    private String investigationDataJson; // Contains dates array and values object

    // Who filled out the form
    private String filledBy;

    // Doctor's note
    @Lob
    @Column(columnDefinition = "TEXT")
    private String doctorsNote;

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

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getInvestigationDataJson() {
        return investigationDataJson;
    }

    public void setInvestigationDataJson(String investigationDataJson) {
        this.investigationDataJson = investigationDataJson;
    }

    public String getFilledBy() {
        return filledBy;
    }

    public void setFilledBy(String filledBy) {
        this.filledBy = filledBy;
    }

    public String getDoctorsNote() {
        return doctorsNote;
    }

    public void setDoctorsNote(String doctorsNote) {
        this.doctorsNote = doctorsNote;
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

