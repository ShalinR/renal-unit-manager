package com.peradeniya.renal.dto;

public class NeurologicalExamDTO {
    private Boolean cranialNerves;
    private Boolean upperLimb;
    private Boolean lowerLimb;
    private Boolean coordination;

    public Boolean getCranialNerves() {
        return cranialNerves;
    }

    public void setCranialNerves(Boolean cranialNerves) {
        this.cranialNerves = cranialNerves;
    }

    public Boolean getUpperLimb() {
        return upperLimb;
    }

    public void setUpperLimb(Boolean upperLimb) {
        this.upperLimb = upperLimb;
    }

    public Boolean getLowerLimb() {
        return lowerLimb;
    }

    public void setLowerLimb(Boolean lowerLimb) {
        this.lowerLimb = lowerLimb;
    }

    public Boolean getCoordination() {
        return coordination;
    }

    public void setCoordination(Boolean coordination) {
        this.coordination = coordination;
    }
}