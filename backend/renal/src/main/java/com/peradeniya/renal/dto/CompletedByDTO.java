package com.peradeniya.renal.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CompletedByDTO {
    private String staffName;
    private String staffRole;
    private String staffId;
    private String department;
    private String signature;
    private LocalDate completionDate;
}