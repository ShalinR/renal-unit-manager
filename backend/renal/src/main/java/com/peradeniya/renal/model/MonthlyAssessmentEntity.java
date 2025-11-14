package com.peradeniya.renal.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "monthly_assessment")
public class MonthlyAssessmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String patientId;

    @Column(nullable = false)
    private String assessmentDate;

    private String exitSite;
    private String residualUrineOutput;
    private String pdBalance;
    private String bodyWeight;
    private String bloodPressure;
    private String numberOfExchanges;
    private String totalBalance;
    private Boolean shortnessOfBreath;
    private Boolean edema;
    private String ivIron;
    private String erythropoietin;
    private Boolean capdPrescriptionAPDPlan;
    private Boolean handWashingTechnique;
    private String capdPrescription;
    private Boolean catheterComponentsInOrder;

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
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getAssessmentDate() { return assessmentDate; }
    public void setAssessmentDate(String assessmentDate) { this.assessmentDate = assessmentDate; }

    public String getExitSite() { return exitSite; }
    public void setExitSite(String exitSite) { this.exitSite = exitSite; }

    public String getResidualUrineOutput() { return residualUrineOutput; }
    public void setResidualUrineOutput(String residualUrineOutput) { this.residualUrineOutput = residualUrineOutput; }

    public String getPdBalance() { return pdBalance; }
    public void setPdBalance(String pdBalance) { this.pdBalance = pdBalance; }

    public String getBodyWeight() { return bodyWeight; }
    public void setBodyWeight(String bodyWeight) { this.bodyWeight = bodyWeight; }

    public String getBloodPressure() { return bloodPressure; }
    public void setBloodPressure(String bloodPressure) { this.bloodPressure = bloodPressure; }

    public String getNumberOfExchanges() { return numberOfExchanges; }
    public void setNumberOfExchanges(String numberOfExchanges) { this.numberOfExchanges = numberOfExchanges; }

    public String getTotalBalance() { return totalBalance; }
    public void setTotalBalance(String totalBalance) { this.totalBalance = totalBalance; }

    public Boolean getShortnessOfBreath() { return shortnessOfBreath; }
    public void setShortnessOfBreath(Boolean shortnessOfBreath) { this.shortnessOfBreath = shortnessOfBreath; }

    public Boolean getEdema() { return edema; }
    public void setEdema(Boolean edema) { this.edema = edema; }

    public String getIvIron() { return ivIron; }
    public void setIvIron(String ivIron) { this.ivIron = ivIron; }

    public String getErythropoietin() { return erythropoietin; }
    public void setErythropoietin(String erythropoietin) { this.erythropoietin = erythropoietin; }

    public Boolean getCapdPrescriptionAPDPlan() { return capdPrescriptionAPDPlan; }
    public void setCapdPrescriptionAPDPlan(Boolean capdPrescriptionAPDPlan) { this.capdPrescriptionAPDPlan = capdPrescriptionAPDPlan; }

    public Boolean getHandWashingTechnique() { return handWashingTechnique; }
    public void setHandWashingTechnique(Boolean handWashingTechnique) { this.handWashingTechnique = handWashingTechnique; }

    public String getCapdPrescription() { return capdPrescription; }
    public void setCapdPrescription(String capdPrescription) { this.capdPrescription = capdPrescription; }

    public Boolean getCatheterComponentsInOrder() { return catheterComponentsInOrder; }
    public void setCatheterComponentsInOrder(Boolean catheterComponentsInOrder) { this.catheterComponentsInOrder = catheterComponentsInOrder; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

