package com.peradeniya.renal.dto;

public class RespiratoryExamDTO {
    private Boolean rr;
    private Boolean spo2;
    private Boolean auscultation;
    private Boolean crepts;
    private Boolean ranchi;
    private Boolean effusion;

    public Boolean getRr() {
        return rr;
    }

    public void setRr(Boolean rr) {
        this.rr = rr;
    }

    public Boolean getSpo2() {
        return spo2;
    }

    public void setSpo2(Boolean spo2) {
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