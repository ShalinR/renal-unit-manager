package com.peradeniya.renal.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AdequacyDataDto {

    private String date;
    private String patientName;
    private String bodyWeight;            // kg
    private String dialysateUreaVolume;   // L
    private String urineUreaVolume;       // L
    private String bloodUrea;             // mg/dL
    private String peritonealKtV;
    private String renalKtV;
    private String totalKtV;
    private String vValue;                // L
    private Boolean isAdequate;

    // --- Getters and Setters ---
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getBodyWeight() { return bodyWeight; }
    public void setBodyWeight(String bodyWeight) { this.bodyWeight = bodyWeight; }

    public String getDialysateUreaVolume() { return dialysateUreaVolume; }
    public void setDialysateUreaVolume(String dialysateUreaVolume) { this.dialysateUreaVolume = dialysateUreaVolume; }

    public String getUrineUreaVolume() { return urineUreaVolume; }
    public void setUrineUreaVolume(String urineUreaVolume) { this.urineUreaVolume = urineUreaVolume; }

    public String getBloodUrea() { return bloodUrea; }
    public void setBloodUrea(String bloodUrea) { this.bloodUrea = bloodUrea; }

    public String getPeritonealKtV() { return peritonealKtV; }
    public void setPeritonealKtV(String peritonealKtV) { this.peritonealKtV = peritonealKtV; }

    public String getRenalKtV() { return renalKtV; }
    public void setRenalKtV(String renalKtV) { this.renalKtV = renalKtV; }

    public String getTotalKtV() { return totalKtV; }
    public void setTotalKtV(String totalKtV) { this.totalKtV = totalKtV; }

    public String getVValue() { return vValue; }
    public void setVValue(String vValue) { this.vValue = vValue; }

    public Boolean getIsAdequate() { return isAdequate; }
    public void setIsAdequate(Boolean isAdequate) { this.isAdequate = isAdequate; }
}




