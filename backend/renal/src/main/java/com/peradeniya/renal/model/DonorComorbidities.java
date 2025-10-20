package com.peradeniya.renal.model;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DonorComorbidities {
    private boolean dl;
    private boolean dm;
    private String duration; // Add this field
    private boolean psychiatricIllness;
    private boolean htn;
    private boolean ihd;
}
