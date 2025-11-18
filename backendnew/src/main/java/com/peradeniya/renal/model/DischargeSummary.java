package com.peradeniya.renal.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Data @Builder
@NoArgsConstructor @AllArgsConstructor
public class DischargeSummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dischargeDate;
    private String diagnosis;
    private String icd10;
    private String progressSummary;
    private String management;
    private String dischargePlan;
    private String drugsFreeHand;

    @OneToOne
    @JoinColumn(name = "admission_id")
    private Admission admission;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;
}
