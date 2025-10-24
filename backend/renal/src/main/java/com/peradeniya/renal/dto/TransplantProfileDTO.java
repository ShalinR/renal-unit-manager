package com.peradeniya.renal.dto;

import com.peradeniya.renal.model.*;
import lombok.Data;

@Data
public class TransplantProfileDTO {
    private Patient patient;
    private RecipientAssessment recipientAssessment;
    private DonorAssessment donor;
    // private KTSurgery ktSurgery;
    // private FollowUp followUp;
}