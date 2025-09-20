package com.rcu.ward.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Table(name = "admission", indexes = {
    @Index(columnList = "bht", unique = true)
})
public class Admission extends BaseEntity {

  @Column(nullable = false, unique = true)
  private String bht;

  private LocalDate dateOfAdmission;
  private LocalTime timeOfAdmission;

  private String wardNumber;
  private String consultantName;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  private Patient patient;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  private Guardian guardian;

  @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  private AdmissionClinical clinical;
}
