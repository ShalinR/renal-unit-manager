package com.peradeniya.renal.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data @Builder
@NoArgsConstructor @AllArgsConstructor
public class ProgressNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime createdAt;

    private Double tempC;
    private Double weightKg;
    private Integer bpHigh;
    private Integer bpLow;
    private Integer heartRate;
    private Integer inputMl;
    private Integer urineOutputMl;
    private Integer pdBalance;
    private Integer totalBalance;

    @ManyToOne
    @JoinColumn(name = "admission_id")
    private Admission admission;
}
