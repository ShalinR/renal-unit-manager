package com.peradeniya.renal.dto;

public class GynecologyDTO {
    private Boolean pvBleeding;
    private Boolean menopause;
    private Boolean menorrhagia;
    private Boolean lrmp;

    public Boolean getPvBleeding() {
        return pvBleeding;
    }

    public void setPvBleeding(Boolean pvBleeding) {
        this.pvBleeding = pvBleeding;
    }

    public Boolean getMenopause() {
        return menopause;
    }

    public void setMenopause(Boolean menopause) {
        this.menopause = menopause;
    }

    public Boolean getMenorrhagia() {
        return menorrhagia;
    }

    public void setMenorrhagia(Boolean menorrhagia) {
        this.menorrhagia = menorrhagia;
    }

    public Boolean getLrmp() {
        return lrmp;
    }

    public void setLrmp(Boolean lrmp) {
        this.lrmp = lrmp;
    }
}