package com.peradeniya.renal.dto;

import lombok.Data;

@Data
public class ProgressNoteRequest {
    private Double tempC;
    private Double weightKg;
    private Integer bpHigh;
    private Integer bpLow;
    private Integer heartRate;
    private Integer inputMl;
    private Integer urineOutputMl;
    private Integer pdBalance;
    private Integer totalBalance;
}
