package com.peradeniya.renal.dto;

import lombok.Data;

@Data
public class FollowUpDTO {
    private Long id;
    private String date;
    private String dateOfVisit;
    private String notes;
    private String doctorNote;
    private Double sCreatinine;
    private Double eGFR;
}