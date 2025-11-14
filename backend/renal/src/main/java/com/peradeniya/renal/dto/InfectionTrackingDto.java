package com.peradeniya.renal.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class InfectionTrackingDto {

    private Long id;
    private String patientId;
    private String infectionType; // "PERITONITIS", "EXIT_SITE", "TUNNEL"
    private String episodeDate;

    // Peritonitis fields
    private String capdFullReports;
    private String capdCulture;
    private String antibioticSensitivity;
    private String managementAntibiotic;
    private String managementType;
    private String managementDuration;
    private String outcome;
    private String reasonForPeritonitis;
    private String assessmentByNO;

    // Exit Site fields
    private String dateOnset;
    private String numberOfEpisodes;
    private String investigationCulture;
    private String investigationExitSite;
    private String investigationOther;
    private String hospitalizationDuration;
    private String reasonForInfection;
    private String specialRemarks;
    private String assessmentByDoctor;

    // Tunnel fields
    private String cultureReport;
    private String treatment;
    private String remarks;

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
}

