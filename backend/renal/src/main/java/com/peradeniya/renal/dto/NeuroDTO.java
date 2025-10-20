package com.peradeniya.renal.dto;

public class NeuroDTO {
    private Boolean seizures;
    private Boolean visualDisturbance;
    private Boolean headache;
    private Boolean limbWeakness;

    public Boolean getSeizures() {
        return seizures;
    }

    public void setSeizures(Boolean seizures) {
        this.seizures = seizures;
    }

    public Boolean getVisualDisturbance() {
        return visualDisturbance;
    }

    public void setVisualDisturbance(Boolean visualDisturbance) {
        this.visualDisturbance = visualDisturbance;
    }

    public Boolean getHeadache() {
        return headache;
    }

    public void setHeadache(Boolean headache) {
        this.headache = headache;
    }

    public Boolean getLimbWeakness() {
        return limbWeakness;
    }

    public void setLimbWeakness(Boolean limbWeakness) {
        this.limbWeakness = limbWeakness;
    }
}