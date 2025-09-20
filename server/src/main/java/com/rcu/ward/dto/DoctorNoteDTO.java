package com.rcu.ward.dto;

import lombok.*;
import java.time.Instant;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DoctorNoteDTO {
  private Long id;
  private String authorName;
  private String text;
  private Instant createdAt;
}