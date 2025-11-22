package com.peradeniya.renal.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class DischargeSummaryRequest {
    private String dischargeDate;
    private String diagnosis;
    private String icd10;
    private String progressSummary;
    private String management;
    private String dischargePlan;
    private String drugsFreeHand;
    
    // Helper method to parse discharge date
    public LocalDate getDischargeDateAsLocalDate() {
        if (dischargeDate == null || dischargeDate.trim().isEmpty()) {
            return null;
        }
        try {
            return LocalDate.parse(dischargeDate);
        } catch (Exception e) {
            System.err.println("Failed to parse discharge date: " + dischargeDate);
            return null;
        }
    }
}