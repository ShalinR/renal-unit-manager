package com.peradeniya.renal.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "kt_investigation")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KTInvestigation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String date;
    private String type; // 'standard' or 'annual'

    @Column(columnDefinition = "TEXT")
    private String payload; // JSON string containing the full form data

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "patient_phn")
    private Patient patient;
}
