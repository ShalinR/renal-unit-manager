package com.peradeniya.renal.model;

import jakarta.persistence.*;

@Entity
@Table(name = "capd_summary")
public class CapdSummaryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // We use this to find the summary, e.g., "patient-123"
    @Column(unique = true, nullable = false)
    private String patientId;

    // --- Simple fields ---
    private String counsellingDate;
    private String catheterInsertionDate;
    private String insertionDoneBy;
    private String insertionPlace;
    private String technique;
    private String designation;
    private String firstFlushing;
    private String secondFlushing;
    private String thirdFlushing;
    private String initiationDate;

    // --- Complex fields stored as JSON ---
    // @Lob tells JPA to use a 'TEXT' or 'CLOB' (large object) column
    @Lob
    @Column(columnDefinition = "TEXT")
    private String petResultsJson;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String adequacyResultsJson;

    // Getters and Setters for all fields...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }
    
    public String getCounsellingDate() { return counsellingDate; }
    public void setCounsellingDate(String counsellingDate) { this.counsellingDate = counsellingDate; }
    
    public String getCatheterInsertionDate() { return catheterInsertionDate; }
    public void setCatheterInsertionDate(String catheterInsertionDate) { this.catheterInsertionDate = catheterInsertionDate; }
    
    public String getInsertionDoneBy() { return insertionDoneBy; }
    public void setInsertionDoneBy(String insertionDoneBy) { this.insertionDoneBy = insertionDoneBy; }
    
    public String getInsertionPlace() { return insertionPlace; }
    public void setInsertionPlace(String insertionPlace) { this.insertionPlace = insertionPlace; }
    
    public String getFirstFlushing() { return firstFlushing; }
    public void setFirstFlushing(String firstFlushing) { this.firstFlushing = firstFlushing; }
    
    public String getSecondFlushing() { return secondFlushing; }
    public void setSecondFlushing(String secondFlushing) { this.secondFlushing = secondFlushing; }
    
    public String getThirdFlushing() { return thirdFlushing; }
    public void setThirdFlushing(String thirdFlushing) { this.thirdFlushing = thirdFlushing; }
    
    public String getInitiationDate() { return initiationDate; }
    public void setInitiationDate(String initiationDate) { this.initiationDate = initiationDate; }
    
    public String getTechnique() { return technique; }
    public void setTechnique(String technique) { this.technique = technique; }
    
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    
    public String getPetResultsJson() { return petResultsJson; }
    public void setPetResultsJson(String petResultsJson) { this.petResultsJson = petResultsJson; }
    
    public String getAdequacyResultsJson() { return adequacyResultsJson; }
    public void setAdequacyResultsJson(String adequacyResultsJson) { this.adequacyResultsJson = adequacyResultsJson; }
}