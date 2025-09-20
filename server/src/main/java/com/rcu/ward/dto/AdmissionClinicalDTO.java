package com.rcu.ward.dto;

import com.rcu.ward.model.TypeOfAdmission;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AdmissionClinicalDTO {
  private TypeOfAdmission typeOfAdmission;
  private String complaints;
  private String examination;
  private String allergies;
  private String currentMedications;
  private String problems;
  private String management;
  private String stamps;
  private boolean notifiableDisease;
  private String admittingOfficer;
}