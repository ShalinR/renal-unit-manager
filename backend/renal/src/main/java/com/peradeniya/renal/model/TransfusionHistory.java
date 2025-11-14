package com.peradeniya.renal.model;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransfusionHistory {
    private String date;
    private String indication;
    private String volume;
}