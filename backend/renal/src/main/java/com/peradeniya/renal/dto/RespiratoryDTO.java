package com.peradeniya.renal.dto;

public class RespiratoryDTO {
    private Boolean cough;
    private Boolean hemoptysis;
    private Boolean wheezing;

    public Boolean getCough() {
        return cough;
    }

    public void setCough(Boolean cough) {
        this.cough = cough;
    }

    public Boolean getHemoptysis() {
        return hemoptysis;
    }

    public void setHemoptysis(Boolean hemoptysis) {
        this.hemoptysis = hemoptysis;
    }

    public Boolean getWheezing() {
        return wheezing;
    }

    public void setWheezing(Boolean wheezing) {
        this.wheezing = wheezing;
    }
}