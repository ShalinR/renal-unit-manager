package com.peradeniya.renal.dto;

public class AbdomenExamDTO {
    private Boolean hepatomegaly;
    private Boolean splenomegaly;
    private Boolean renalMasses;
    private Boolean freeFluid;

    public Boolean getHepatomegaly() {
        return hepatomegaly;
    }

    public void setHepatomegaly(Boolean hepatomegaly) {
        this.hepatomegaly = hepatomegaly;
    }

    public Boolean getSplenomegaly() {
        return splenomegaly;
    }

    public void setSplenomegaly(Boolean splenomegaly) {
        this.splenomegaly = splenomegaly;
    }

    public Boolean getRenalMasses() {
        return renalMasses;
    }

    public void setRenalMasses(Boolean renalMasses) {
        this.renalMasses = renalMasses;
    }

    public Boolean getFreeFluid() {
        return freeFluid;
    }

    public void setFreeFluid(Boolean freeFluid) {
        this.freeFluid = freeFluid;
    }
}