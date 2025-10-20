package com.peradeniya.renal.dto;

public class DonorAssessmentDTO {
    private String phn;
    private DonorAssessmentDataDTO data; // Changed from DonorAssessment to DTO

    public String getPhn() {
        return phn;
    }

    public void setPhn(String phn) {
        this.phn = phn;
    }

    public DonorAssessmentDataDTO getData() {
        return data;
    }

    public void setData(DonorAssessmentDataDTO data) {
        this.data = data;
    }
}