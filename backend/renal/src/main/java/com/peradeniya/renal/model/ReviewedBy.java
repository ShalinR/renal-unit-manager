package com.peradeniya.renal.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewedBy {
    private String consultantName;
    private String consultantId;
    private LocalDate reviewDate;
    private String approvalStatus; // "pending", "approved", "rejected"
    private String notes;
}