package com.peradeniya.renal.dto;

public class OralDTO {
    private Boolean dentalCaries;
    private Boolean oralHygiene;
    private Boolean satisfactory;
    private Boolean unsatisfactory;

    public Boolean getDentalCaries() {
        return dentalCaries;
    }

    public void setDentalCaries(Boolean dentalCaries) {
        this.dentalCaries = dentalCaries;
    }

    public Boolean getOralHygiene() {
        return oralHygiene;
    }

    public void setOralHygiene(Boolean oralHygiene) {
        this.oralHygiene = oralHygiene;
    }

    public Boolean getSatisfactory() {
        return satisfactory;
    }

    public void setSatisfactory(Boolean satisfactory) {
        this.satisfactory = satisfactory;
    }

    public Boolean getUnsatisfactory() {
        return unsatisfactory;
    }

    public void setUnsatisfactory(Boolean unsatisfactory) {
        this.unsatisfactory = unsatisfactory;
    }
}