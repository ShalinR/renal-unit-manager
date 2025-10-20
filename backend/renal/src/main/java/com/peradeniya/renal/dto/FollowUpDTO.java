package com.peradeniya.renal.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class FollowUpDTO {
    private Long id;
    private LocalDate dateOfVisit;
    private Double sCreatinine;
    private Double eGFR;
    private String bloodPressure;
    private String medication;
    private String complications;
    private String notes;

    // NO Patient reference!
}