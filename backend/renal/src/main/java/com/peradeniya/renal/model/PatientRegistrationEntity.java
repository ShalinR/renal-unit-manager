package com.peradeniya.renal.model;

import jakarta.persistence.*;

@Entity
@Table(name = "patient_registration")
public class PatientRegistrationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String patientId;

    // Basic Information
    private String counsellingDate;
    private String initiationDate;

    // Catheter Information
    private String catheterInsertionDate;
    private String insertionDoneBy;
    private String designation;
    private String technique;
    private String insertionPlace;

    // Flushing Dates
    private String firstFlushing;
    private String secondFlushing;
    private String thirdFlushing;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }
    
    public String getCounsellingDate() { return counsellingDate; }
    public void setCounsellingDate(String counsellingDate) { this.counsellingDate = counsellingDate; }
    
    public String getInitiationDate() { return initiationDate; }
    public void setInitiationDate(String initiationDate) { this.initiationDate = initiationDate; }
    
    public String getCatheterInsertionDate() { return catheterInsertionDate; }
    public void setCatheterInsertionDate(String catheterInsertionDate) { this.catheterInsertionDate = catheterInsertionDate; }
    
    public String getInsertionDoneBy() { return insertionDoneBy; }
    public void setInsertionDoneBy(String insertionDoneBy) { this.insertionDoneBy = insertionDoneBy; }
    
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    
    public String getTechnique() { return technique; }
    public void setTechnique(String technique) { this.technique = technique; }
    
    public String getInsertionPlace() { return insertionPlace; }
    public void setInsertionPlace(String insertionPlace) { this.insertionPlace = insertionPlace; }
    
    public String getFirstFlushing() { return firstFlushing; }
    public void setFirstFlushing(String firstFlushing) { this.firstFlushing = firstFlushing; }
    
    public String getSecondFlushing() { return secondFlushing; }
    public void setSecondFlushing(String secondFlushing) { this.secondFlushing = secondFlushing; }
    
    public String getThirdFlushing() { return thirdFlushing; }
    public void setThirdFlushing(String thirdFlushing) { this.thirdFlushing = thirdFlushing; }
}


















