package com.peradeniya.renal.dto;

import com.peradeniya.renal.model.Admission;
import com.peradeniya.renal.model.Patient;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class PatientResponse {

    private Long id;
    private String phn;
    private String name;
    private LocalDate dob;
    private String sex;
    private String status;

    // Patient demographics
    private String address;
    private String phone;
    private String nic;
    private String mohArea;
    private String ethnicGroup;
    private String religion;
    private String occupation;
    private String maritalStatus;

    // Admission merged fields
    private String bhtNumber; // Add this field
    private String ward;
    private String wardNumber;
    private String bedId;
    private LocalDate admissionDate;
    private String admissionTime;
    private String consultantName;
    private String referredBy;
    private String primaryDiagnosis;
    private String admissionType;
    private String admittingOfficer;
    private String presentingComplaints;

    // Examination fields from Admission
    private Double examTempC;
    private Double examHeightCm;
    private Double examWeightKg;
    private Double examBMI;
    private String examBloodPressure;
    private Integer examHeartRate;

    public static PatientResponse from(Patient p, Admission a) {
        return new PatientResponse(
                p.getId(),
                p.getPhn(),
                p.getName(),
                p.getDob(),
                p.getSex(),
                p.getStatus(),

                // Patient demographics
                p.getAddress(),
                p.getPhone(),
                p.getNic(),
                p.getMohArea(),
                p.getEthnicGroup(),
                p.getReligion(),
                p.getOccupation(),
                p.getMaritalStatus(),

                // Admission fields
                a != null ? a.getBhtNumber() : null, // Add BHT number
                a != null ? a.getWard() : null,
                a != null ? a.getWardNumber() : null,
                a != null ? a.getBedId() : null,
                a != null ? a.getAdmittedOn() : null,
                a != null && a.getAdmissionTime() != null ? a.getAdmissionTime().toString() : null,
                a != null ? a.getConsultantName() : null,
                a != null ? a.getReferredBy() : null,
                a != null ? a.getPrimaryDiagnosis() : null,
                a != null ? a.getAdmissionType() : null,
                a != null ? a.getAdmittingOfficer() : null,
                a != null ? a.getPresentingComplaints() : null,

                // Examination fields
                a != null ? a.getExamTempC() : null,
                a != null ? a.getExamHeightCm() : null,
                a != null ? a.getExamWeightKg() : null,
                a != null ? a.getExamBMI() : null,
                a != null ? a.getExamBloodPressure() : null,
                a != null ? a.getExamHeartRate() : null
        );
    }
}