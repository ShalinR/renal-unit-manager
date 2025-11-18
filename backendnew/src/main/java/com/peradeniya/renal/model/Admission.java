package com.peradeniya.renal.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data 
@Builder
@NoArgsConstructor 
@AllArgsConstructor
public class Admission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // BHT Number e.g., BHT-1001
    @Column(nullable = false)
    private String bhtNumber;

    // Admission number (1st admission, 2nd...)
    private int number;

    private boolean active;
    private boolean dischargeSummaryAvailable;

    private LocalDate admittedOn;
    private LocalDateTime admissionTime;

    private String ward;
    private String wardNumber;
    private String bedId;

    // Admission details
    private String consultantName;
    private String referredBy;
    private String primaryDiagnosis;
    private String admissionType;
    private String admittingOfficer;
    private String presentingComplaints;

    // Examinations
    private Double examTempC;
    private Double examHeightCm;
    private Double examWeightKg;
    private Double examBMI;
    private String examBloodPressure;
    private Integer examHeartRate;

    // Relations
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @OneToMany(mappedBy = "admission", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProgressNote> progressNotes = new ArrayList<>();

    @OneToOne(mappedBy = "admission", cascade = CascadeType.ALL, orphanRemoval = true)
    private DischargeSummary dischargeSummary;
}