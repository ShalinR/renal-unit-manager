package com.rcu.ward.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Table(name = "guardian")
public class Guardian extends BaseEntity {

  @NotBlank
  private String name;

  @NotBlank
  private String address;

  @Pattern(regexp = "^\\+?\\d{9,15}$")
  private String telephone;

  @NotBlank
  private String nic;
}
