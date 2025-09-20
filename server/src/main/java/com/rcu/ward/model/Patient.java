package com.rcu.ward.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Table(name = "patient")
public class Patient extends BaseEntity {

  @Column(unique = true, nullable = false)
  private String phn; // Personal Health Number

  @NotBlank
  private String fullName;

  @NotBlank
  private String address;

  @Pattern(regexp = "^\\+?\\d{9,15}$")
  private String telephone;

  @NotBlank
  private String nic;

  private String mohArea;

  private LocalDate dateOfBirth;

  private Integer age; // demo convenience; could be derived

  @Enumerated(EnumType.STRING)
  private Sex sex;

  private String ethnicGroup;
  private String religion;
  private String occupation;
  private String maritalStatus;
}
