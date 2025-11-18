package com.peradeniya.renal.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class PatientCreateRequest {
    private String phn;
    private String name;
    private LocalDate dob;
    private String sex;

    private String address;
    private String phone;
    private String nic;
    private String mohArea;
    private String ethnicGroup;
    private String religion;
    private String occupation;
    private String maritalStatus;

    // Admission info
    private String ward;
    private String wardNumber;
    private String bedId;
    private LocalDate admissionDate;
    private LocalDateTime admissionTime; // CHANGED from String to LocalDateTime
    private String admissionType;
    private String consultantName;
    private String referredBy;
    private String primaryDiagnosis;
    private String admittingOfficer;
    private String presentingComplaints;

    // Examinations
    private Double tempC;
    private Double heightCm;
    private Double weightKg;
    private Double bmi;
    private String bloodPressure;
    private Integer heartRate;

    // Problem list
    private String[] medicalProblems;
    private String[] allergyProblems;
}