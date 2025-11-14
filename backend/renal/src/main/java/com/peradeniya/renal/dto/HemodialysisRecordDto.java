package com.peradeniya.renal.dto;

import java.util.Map;

public class HemodialysisRecordDto {
    private Long id;
    private String patientId;
    private String sessionDate;
    
    // Nested objects - these will be stored as JSON in the entity
    private Map<String, Object> prescription;
    private Map<String, Object> vascularAccess;
    private Map<String, Object> session;
    
    private String otherNotes;
    private String filledBy;
    private String createdAt;
    private String updatedAt;

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

    public Map<String, Object> getPrescription() {
        return prescription;
    }

    public void setPrescription(Map<String, Object> prescription) {
        this.prescription = prescription;
    }

    public Map<String, Object> getVascularAccess() {
        return vascularAccess;
    }

    public void setVascularAccess(Map<String, Object> vascularAccess) {
        this.vascularAccess = vascularAccess;
    }

    public Map<String, Object> getSession() {
        return session;
    }

    public void setSession(Map<String, Object> session) {
        this.session = session;
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

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }
}

