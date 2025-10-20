package com.peradeniya.renal.dto;

import lombok.Data;

@Data
public class AssessmentDTO<T> {
    /**
     * The Patient Health Number (PHN) to associate this assessment with.
     */
    private String phn;

    /**
     * The actual assessment form data. This will be DonorAssessment or RecipientAssessment.
     */
    private T data;
}