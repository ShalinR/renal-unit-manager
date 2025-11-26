package com.peradeniya.renal.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "infection_tracking")
public class InfectionTrackingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String patientId;

    @Column(nullable = false)
    private String infectionType; // "PERITONITIS", "EXIT_SITE", "TUNNEL"

    // Common fields for all infection types
    @Column(name = "episode_date")
    private String episodeDate;

    // Peritonitis specific fields
    @Lob
    @Column(columnDefinition = "TEXT")
    private String capdFullReports;

    @Column(name = "capd_culture")
    private String capdCulture;

    @Column(name = "antibiotic_sensitivity")
    private String antibioticSensitivity;

    @Column(name = "management_antibiotic")
    private String managementAntibiotic;

    @Column(name = "management_type")
    private String managementType;

    @Column(name = "management_duration")
    private String managementDuration;

    private String outcome;

    @Column(name = "reason_for_peritonitis")
    private String reasonForPeritonitis;

    @Column(name = "assessment_by_no")
    private String assessmentByNO;

    // Exit Site specific fields
    @Column(name = "date_onset")
    private String dateOnset;

    @Column(name = "number_of_episodes")
    private String numberOfEpisodes;

    @Column(name = "investigation_culture")
    private String investigationCulture;

    @Column(name = "investigation_exit_site")
    private String investigationExitSite;

    @Column(name = "investigation_other")
    private String investigationOther;

    @Column(name = "hospitalization_duration")
    private String hospitalizationDuration;

    @Column(name = "reason_for_infection")
    private String reasonForInfection;

    @Lob
    @Column(name = "special_remarks", columnDefinition = "TEXT")
    private String specialRemarks;

    @Lob
    @Column(name = "assessment_by_doctor", columnDefinition = "TEXT")
    private String assessmentByDoctor;

    // Tunnel specific fields
    @Column(name = "culture_report")
    private String cultureReport;

    private String treatment;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String remarks;

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

    public String getInfectionType() { return infectionType; }
    public void setInfectionType(String infectionType) { this.infectionType = infectionType; }

    public String getEpisodeDate() { return episodeDate; }
    public void setEpisodeDate(String episodeDate) { this.episodeDate = episodeDate; }

    public String getCapdFullReports() { return capdFullReports; }
    public void setCapdFullReports(String capdFullReports) { this.capdFullReports = capdFullReports; }

    public String getCapdCulture() { return capdCulture; }
    public void setCapdCulture(String capdCulture) { this.capdCulture = capdCulture; }

    public String getAntibioticSensitivity() { return antibioticSensitivity; }
    public void setAntibioticSensitivity(String antibioticSensitivity) { this.antibioticSensitivity = antibioticSensitivity; }

    public String getManagementAntibiotic() { return managementAntibiotic; }
    public void setManagementAntibiotic(String managementAntibiotic) { this.managementAntibiotic = managementAntibiotic; }

    public String getManagementType() { return managementType; }
    public void setManagementType(String managementType) { this.managementType = managementType; }

    public String getManagementDuration() { return managementDuration; }
    public void setManagementDuration(String managementDuration) { this.managementDuration = managementDuration; }

    public String getOutcome() { return outcome; }
    public void setOutcome(String outcome) { this.outcome = outcome; }

    public String getReasonForPeritonitis() { return reasonForPeritonitis; }
    public void setReasonForPeritonitis(String reasonForPeritonitis) { this.reasonForPeritonitis = reasonForPeritonitis; }

    public String getAssessmentByNO() { return assessmentByNO; }
    public void setAssessmentByNO(String assessmentByNO) { this.assessmentByNO = assessmentByNO; }

    public String getDateOnset() { return dateOnset; }
    public void setDateOnset(String dateOnset) { this.dateOnset = dateOnset; }

    public String getNumberOfEpisodes() { return numberOfEpisodes; }
    public void setNumberOfEpisodes(String numberOfEpisodes) { this.numberOfEpisodes = numberOfEpisodes; }

    public String getInvestigationCulture() { return investigationCulture; }
    public void setInvestigationCulture(String investigationCulture) { this.investigationCulture = investigationCulture; }

    public String getInvestigationExitSite() { return investigationExitSite; }
    public void setInvestigationExitSite(String investigationExitSite) { this.investigationExitSite = investigationExitSite; }

    public String getInvestigationOther() { return investigationOther; }
    public void setInvestigationOther(String investigationOther) { this.investigationOther = investigationOther; }

    public String getHospitalizationDuration() { return hospitalizationDuration; }
    public void setHospitalizationDuration(String hospitalizationDuration) { this.hospitalizationDuration = hospitalizationDuration; }

    public String getReasonForInfection() { return reasonForInfection; }
    public void setReasonForInfection(String reasonForInfection) { this.reasonForInfection = reasonForInfection; }

    public String getSpecialRemarks() { return specialRemarks; }
    public void setSpecialRemarks(String specialRemarks) { this.specialRemarks = specialRemarks; }

    public String getAssessmentByDoctor() { return assessmentByDoctor; }
    public void setAssessmentByDoctor(String assessmentByDoctor) { this.assessmentByDoctor = assessmentByDoctor; }

    public String getCultureReport() { return cultureReport; }
    public void setCultureReport(String cultureReport) { this.cultureReport = cultureReport; }

    public String getTreatment() { return treatment; }
    public void setTreatment(String treatment) { this.treatment = treatment; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

