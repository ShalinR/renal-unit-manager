package com.peradeniya.renal.dto;

import lombok.Data;

@Data
public class ComorbiditiesDTO {
    private Boolean dm;
    private String duration;
    private Boolean psychiatricIllness;
    private Boolean htn;
    private Boolean ihd;

    // Microvascular complications
    private Boolean retinopathy;
    private Boolean nephropathy;
    private Boolean neuropathy;

    // Macrovascular complications
    private String twoDEcho;
    private String coronaryAngiogram;
    private Boolean cva;
    private Boolean pvd;

    // Other comorbidities
    private Boolean dl; // Dyslipidemia
    private Boolean clcd; // Chronic Liver Disease
    private String childClass;
    private String meldScore;
    private Boolean hf; // Heart Failure
}