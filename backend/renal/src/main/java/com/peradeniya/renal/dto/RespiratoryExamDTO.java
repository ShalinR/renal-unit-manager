package com.peradeniya.renal.dto;

public class RespiratoryExamDTO {
    private String rr;
    private String spo2;
    private Boolean auscultation;
    private Boolean crepts;
    private Boolean ranchi;
    private Boolean effusion;

    public String getRr() {
        return rr;
    }

    public void setRr(String rr) {
        this.rr = rr;
    }

    public String getSpo2() {
        return spo2;
    }

    public void setSpo2(String spo2) {
        this.spo2 = spo2;
    }

    public Boolean getAuscultation() {
        return auscultation;
    }

    public void setAuscultation(Boolean auscultation) {
        this.auscultation = auscultation;
    }

    public Boolean getCrepts() {
        return crepts;
    }

    public void setCrepts(Boolean crepts) {
        this.crepts = crepts;
    }

    public Boolean getRanchi() {
        return ranchi;
    }

    public void setRanchi(Boolean ranchi) {
        this.ranchi = ranchi;
    }

    public Boolean getEffusion() {
        return effusion;
    }

    public void setEffusion(Boolean effusion) {
        this.effusion = effusion;
    }
}