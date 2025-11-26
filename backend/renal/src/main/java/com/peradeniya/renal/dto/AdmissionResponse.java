package com.peradeniya.renal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class AdmissionResponse {

    private Long id;
    private String bhtNumber;
    private int number;
    private boolean active;
    private boolean dischargeSummaryAvailable;

    private LocalDate admittedOn;
    private String admissionTime;

    private String ward;
    private String wardNumber;
    private String bedId;

    private String consultantName;
    private String referredBy;
    private String primaryDiagnosis;
    private String admissionType;
    private String admittingOfficer;
    private String presentingComplaints;

    private Double examTempC;
    private Double examHeightCm;
    private Double examWeightKg;
    private Double examBMI;
    private String examBloodPressure;
    private Integer examHeartRate;
}
