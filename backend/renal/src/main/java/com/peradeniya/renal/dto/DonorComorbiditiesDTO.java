package com.peradeniya.renal.dto;

public class DonorComorbiditiesDTO {
    private Boolean dl;
    private Boolean dm;
    private String duration;
    private Boolean psychiatricIllness;
    private Boolean htn;
    private Boolean ihd;

    public Boolean getDl() {
        return dl;
    }

    public void setDl(Boolean dl) {
        this.dl = dl;
    }

    public Boolean getDm() {
        return dm;
    }

    public void setDm(Boolean dm) {
        this.dm = dm;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public Boolean getPsychiatricIllness() {
        return psychiatricIllness;
    }

    public void setPsychiatricIllness(Boolean psychiatricIllness) {
        this.psychiatricIllness = psychiatricIllness;
    }

    public Boolean getHtn() {
        return htn;
    }

    public void setHtn(Boolean htn) {
        this.htn = htn;
    }

    public Boolean getIhd() {
        return ihd;
    }

    public void setIhd(Boolean ihd) {
        this.ihd = ihd;
    }
}