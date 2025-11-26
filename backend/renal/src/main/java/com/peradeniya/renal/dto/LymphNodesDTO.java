package com.peradeniya.renal.dto;

public class LymphNodesDTO {
    private Boolean cervical;
    private Boolean axillary;
    private Boolean inguinal;

    public Boolean getCervical() {
        return cervical;
    }

    public void setCervical(Boolean cervical) {
        this.cervical = cervical;
    }

    public Boolean getAxillary() {
        return axillary;
    }

    public void setAxillary(Boolean axillary) {
        this.axillary = axillary;
    }

    public Boolean getInguinal() {
        return inguinal;
    }

    public void setInguinal(Boolean inguinal) {
        this.inguinal = inguinal;
    }
}