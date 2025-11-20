package com.peradeniya.renal.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class DischargeSummaryRequest {
    private LocalDate dischargeDate;
    private String diagnosis;
    private String icd10;
    private String progressSummary;
    private String management;
    private String dischargePlan;
    private String drugsFreeHand;
}
