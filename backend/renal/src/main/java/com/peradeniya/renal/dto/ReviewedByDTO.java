package com.peradeniya.renal.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ReviewedByDTO {
    private String consultantName;
    private String consultantId;
    private LocalDate reviewDate;
    private String approvalStatus; // "pending", "approved", "rejected"
    private String notes;
}