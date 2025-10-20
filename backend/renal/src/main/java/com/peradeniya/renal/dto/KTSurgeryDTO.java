package com.peradeniya.renal.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class KTSurgeryDTO {
    private Long id;
    private LocalDate dateOfKT;
    private String ktType; // LIVE_DONOR, DECEASED_DONOR
    private String donorRelationship;
    private String surgeonName;
    private String hospital;
    private String surgeryNotes;

    // NO Patient reference!
}