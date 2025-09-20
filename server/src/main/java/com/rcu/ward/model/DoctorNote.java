package com.rcu.ward.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.Instant;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Table(name = "doctor_note")
public class DoctorNote extends BaseEntity {

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  private Admission admission;

  private String authorName; // optional for now

  @NotBlank
  @Column(length = 4000)
  private String text;

  @CreationTimestamp
  @Column(updatable = false)
  private Instant createdAt;
}
