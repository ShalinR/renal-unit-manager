package com.rcu.ward.dto;

import lombok.*;
import jakarta.validation.constraints.NotBlank;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CreateDoctorNoteRequest {
  private String authorName; // optional
  @NotBlank
  private String text;
}