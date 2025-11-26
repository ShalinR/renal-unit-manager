package com.peradeniya.renal.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class HemodialysisMonthlyReviewDto {

    private Long id;
    private String patientId;
    private String reviewDate;
    private String exitSiteCondition;
    private String residualUrineOutput;
    private Double bodyWeight;
    private String bloodPressure;
    private String clinicalAssessment;
    private String doctorNotes;
    private String treatmentPlan;
    private String reviewedBy;
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

    public String getReviewDate() {
        return reviewDate;
    }

    public void setReviewDate(String reviewDate) {
        this.reviewDate = reviewDate;
    }

    public String getExitSiteCondition() {
        return exitSiteCondition;
    }

    public void setExitSiteCondition(String exitSiteCondition) {
        this.exitSiteCondition = exitSiteCondition;
    }

    public String getResidualUrineOutput() {
        return residualUrineOutput;
    }

    public void setResidualUrineOutput(String residualUrineOutput) {
        this.residualUrineOutput = residualUrineOutput;
    }

    public Double getBodyWeight() {
        return bodyWeight;
    }

    public void setBodyWeight(Double bodyWeight) {
        this.bodyWeight = bodyWeight;
    }

    public String getBloodPressure() {
        return bloodPressure;
    }

    public void setBloodPressure(String bloodPressure) {
        this.bloodPressure = bloodPressure;
    }

    public String getClinicalAssessment() {
        return clinicalAssessment;
    }

    public void setClinicalAssessment(String clinicalAssessment) {
        this.clinicalAssessment = clinicalAssessment;
    }

    public String getDoctorNotes() {
        return doctorNotes;
    }

    public void setDoctorNotes(String doctorNotes) {
        this.doctorNotes = doctorNotes;
    }

    public String getTreatmentPlan() {
        return treatmentPlan;
    }

    public void setTreatmentPlan(String treatmentPlan) {
        this.treatmentPlan = treatmentPlan;
    }

    public String getReviewedBy() {
        return reviewedBy;
    }

    public void setReviewedBy(String reviewedBy) {
        this.reviewedBy = reviewedBy;
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
