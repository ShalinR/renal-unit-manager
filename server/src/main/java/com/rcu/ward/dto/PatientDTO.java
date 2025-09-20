package com.rcu.ward.dto;

import com.rcu.ward.model.Sex;
import lombok.*;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PatientDTO {
  private String phn;
  private String fullName;
  private String address;
  private String telephone;
  private String nic;
  private String mohArea;
  private LocalDate dateOfBirth;
  private Integer age;
  private Sex sex;
  private String ethnicGroup;
  private String religion;
  private String occupation;
  private String maritalStatus;
}