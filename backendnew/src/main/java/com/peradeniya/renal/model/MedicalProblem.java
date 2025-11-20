package com.peradeniya.renal.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data @Builder
@NoArgsConstructor @AllArgsConstructor
public class MedicalProblem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String problem;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;
}
