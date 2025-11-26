package com.peradeniya.renal.dto;



import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TimePointMeasurementDto {

    private String dialysateCreatinine;
    private String dialysateGlucose;
    private String serumCreatinine;

    // --- Getters and Setters ---
    public String getDialysateCreatinine() { return dialysateCreatinine; }
    public void setDialysateCreatinine(String dialysateCreatinine) { this.dialysateCreatinine = dialysateCreatinine; }

    public String getDialysateGlucose() { return dialysateGlucose; }
    public void setDialysateGlucose(String dialysateGlucose) { this.dialysateGlucose = dialysateGlucose; }

    public String getSerumCreatinine() { return serumCreatinine; }
    public void setSerumCreatinine(String serumCreatinine) { this.serumCreatinine = serumCreatinine; }
}