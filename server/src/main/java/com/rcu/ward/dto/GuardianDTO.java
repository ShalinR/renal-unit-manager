package com.rcu.ward.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GuardianDTO {
  private String name;
  private String address;
  private String telephone;
  private String nic;
}