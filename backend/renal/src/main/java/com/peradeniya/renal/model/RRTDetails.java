package com.peradeniya.renal.model;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class RRTDetails {
    private boolean modalityHD;
    private boolean modalityCAPD;
    private String startingDate;
    private boolean accessFemoral;
    private boolean accessIJC;
    private boolean accessPermeath;
    private boolean accessCAPD;
    private String complications;
}