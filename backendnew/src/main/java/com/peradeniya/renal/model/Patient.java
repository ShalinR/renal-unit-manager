package com.peradeniya.renal.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data 
@Builder
@NoArgsConstructor 
@AllArgsConstructor
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String phn;

    @Column(nullable = false)
    private String name;

    private LocalDate dob;
    private String sex;

    // Demographics
    private String address;
    private String phone;
    private String nic;
    private String mohArea;
    private String ethnicGroup;
    private String religion;
    private String occupation;
    private String maritalStatus;

    // Active status (Admitted / Discharged)
    private String status;

    // Relationships
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Admission> admissions = new ArrayList<>();

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<MedicalProblem> medicalHistory = new ArrayList<>();

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Allergy> allergies = new ArrayList<>();
}