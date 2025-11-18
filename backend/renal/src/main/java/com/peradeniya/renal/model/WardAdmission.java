package com.peradeniya.renal.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "ward_admission")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WardAdmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // BHT number (unique)
    @Column(name = "bht_number", nullable = false, unique = true)
    private String bhtNumber;

    // Link to Patient (existing table)
    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private PatientRegistrationEntity patient;

    // Ward + Bed
    @Column(name = "ward_code", nullable = false)
    private String wardCode;

    @Column(name = "bed_id")
    private String bedId;

    // Admission date/time
    @Column(name = "admission_date", nullable = false)
    private LocalDate admissionDate;

    @Column(name = "admission_time")
    private LocalTime admissionTime;

    // Admission type
    @Enumerated(EnumType.STRING)
    @Column(name = "admission_type")
    private AdmissionType admissionType;

    // Consultant & officer details
    @Column(name = "consultant_name")
    private String consultantName;

    @Column(name = "referred_by")
    private String referredBy;

    @Column(name = "primary_diagnosis")
    private String primaryDiagnosis;

    @Column(name = "admitting_officer")
    private String admittingOfficer;

    @Column(name = "presenting_complaints", columnDefinition = "TEXT")
    private String presentingComplaints;

    // Status
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private AdmissionStatus status;

    // Discharge
    @Column(name = "discharge_date")
    private LocalDate dischargeDate;

    @Column(name = "has_discharge_summary")
    private boolean hasDischargeSummary;
}
