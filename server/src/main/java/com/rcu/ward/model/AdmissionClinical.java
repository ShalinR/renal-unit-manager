package com.rcu.ward.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Table(name = "admission_clinical")
public class AdmissionClinical extends BaseEntity {

  @Enumerated(EnumType.STRING)
  private TypeOfAdmission typeOfAdmission;

  @Lob @Column(columnDefinition = "TEXT")
  private String complaints;

  @Lob @Column(columnDefinition = "TEXT")
  private String examination;

  @Lob @Column(columnDefinition = "TEXT")
  private String allergies;

  @Lob @Column(columnDefinition = "TEXT")
  private String currentMedications;

  @Lob @Column(columnDefinition = "TEXT")
  private String problems;

  @Lob @Column(columnDefinition = "TEXT")
  private String management;

  private String stamps; // keep short

  private boolean notifiableDisease;

  private String admittingOfficer;
}
