package com.peradeniya.renal.dto;



import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PetDataDto {

    private String date;

    // This Map handles the "t0", "t1", etc. keys
    private Map<String, TimePointMeasurementDto> measurements;

    // Auto-filled fields
    private String dpCreatinine;
    private String dd0Glucose;
    private String creatinineClassification;
    private String glucoseClassification;

    // --- Getters and Setters ---
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public Map<String, TimePointMeasurementDto> getMeasurements() { return measurements; }
    public void setMeasurements(Map<String, TimePointMeasurementDto> measurements) { this.measurements = measurements; }

    public String getDpCreatinine() { return dpCreatinine; }
    public void setDpCreatinine(String dpCreatinine) { this.dpCreatinine = dpCreatinine; }

    public String getDd0Glucose() { return dd0Glucose; }
    public void setDd0Glucose(String dd0Glucose) { this.dd0Glucose = dd0Glucose; }

    public String getCreatinineClassification() { return creatinineClassification; }
    public void setCreatinineClassification(String creatinineClassification) { this.creatinineClassification = creatinineClassification; }

    public String getGlucoseClassification() { return glucoseClassification; }
    public void setGlucoseClassification(String glucoseClassification) { this.glucoseClassification = glucoseClassification; }
}
