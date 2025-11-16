package com.peradeniya.renal.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class KTInvestigationDTO {
    private Long id;
    private String patientPhn;
    private String date;
    private String type; // standard | annual
    private String payload; // JSON string with form data
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
