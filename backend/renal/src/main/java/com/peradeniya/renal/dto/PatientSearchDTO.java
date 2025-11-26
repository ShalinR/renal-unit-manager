package com.peradeniya.renal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

import com.peradeniya.renal.model.DonorAssessment;
import com.peradeniya.renal.model.FollowUp;
import com.peradeniya.renal.model.KTSurgery;
import com.peradeniya.renal.model.Patient;
import com.peradeniya.renal.model.RecipientAssessment;

@Data
@AllArgsConstructor
public class PatientSearchDTO {
    private Patient patient;
    private DonorAssessment donor;
    private RecipientAssessment recipientAssessment;
    private KTSurgery ktSurgery;
    private List<FollowUp> followUps;
}
