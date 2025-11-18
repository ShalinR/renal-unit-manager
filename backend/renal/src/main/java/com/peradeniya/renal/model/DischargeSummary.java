package com.peradeniya.renal.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "discharge_summary")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DischargeSummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to admission
    @ManyToOne
    @JoinColumn(name = "admission_id", nullable = false)
    private WardAdmission admission;

    // Summary fields
    @Column(name = "consultant_name")
    private String consultantName;

    @Column(name = "findings", columnDefinition = "TEXT")
    private String findings;

    @Column(name = "diagnosis", columnDefinition = "TEXT")
    private String diagnosis;

    @Column(name = "treatment_given", columnDefinition = "TEXT")
    private String treatmentGiven;

    @Column(name = "discharge_medications", columnDefinition = "TEXT")
    private String dischargeMedications;

    @Column(name = "follow_up_plan", columnDefinition = "TEXT")
    private String followUpPlan;

    @Column(name = "summary_text", columnDefinition = "TEXT")
    private String summaryText;

    // Date & time
    @Column(name = "summary_date")
    private LocalDate date;

    @Column(name = "summary_time")
    private LocalTime time;
}
