package com.peradeniya.renal.dto;

public class GitDTO {
    private Boolean constipation;
    private Boolean diarrhea;
    private Boolean melena;
    private Boolean prBleeding;

    public Boolean getConstipation() {
        return constipation;
    }

    public void setConstipation(Boolean constipation) {
        this.constipation = constipation;
    }

    public Boolean getDiarrhea() {
        return diarrhea;
    }

    public void setDiarrhea(Boolean diarrhea) {
        this.diarrhea = diarrhea;
    }

    public Boolean getMelena() {
        return melena;
    }

    public void setMelena(Boolean melena) {
        this.melena = melena;
    }

    public Boolean getPrBleeding() {
        return prBleeding;
    }

    public void setPrBleeding(Boolean prBleeding) {
        this.prBleeding = prBleeding;
    }
}