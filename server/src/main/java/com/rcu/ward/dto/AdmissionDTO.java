package com.rcu.ward.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AdmissionDTO {
  private String bht;
  private LocalDate dateOfAdmission;
  private LocalTime timeOfAdmission;
  private String wardNumber;
  private String consultantName;

  private PatientDTO patient;
  private GuardianDTO guardian;
  private AdmissionClinicalDTO clinical;
}