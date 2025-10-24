package com.peradeniya.renal.dto;

import lombok.Data;

@Data
public class RRTDetailsDTO {
    private Boolean modalityHD;
    private Boolean modalityCAPD;
    private String startingDate;
    private Boolean accessFemoral;
    private Boolean accessIJC;
    private Boolean accessPermeath;
    private Boolean accessCAPD;
    private String complications;
    public Boolean getModalityHD() {
        return modalityHD;
    }

    public void setModalityHD(Boolean modalityHD) {
        this.modalityHD = modalityHD;
    }

    public Boolean getModalityCAPD() {
        return modalityCAPD;
    }

    public void setModalityCAPD(Boolean modalityCAPD) {
        this.modalityCAPD = modalityCAPD;
    }

    public String getStartingDate() {
        return startingDate;
    }

    public void setStartingDate(String startingDate) {
        this.startingDate = startingDate;
    }

    public Boolean getAccessFemoral() {
        return accessFemoral;
    }

    public void setAccessFemoral(Boolean accessFemoral) {
        this.accessFemoral = accessFemoral;
    }

    public Boolean getAccessIJC() {
        return accessIJC;
    }

    public void setAccessIJC(Boolean accessIJC) {
        this.accessIJC = accessIJC;
    }

    public Boolean getAccessPermeath() {
        return accessPermeath;
    }

    public void setAccessPermeath(Boolean accessPermeath) {
        this.accessPermeath = accessPermeath;
    }

    public Boolean getAccessCAPD() {
        return accessCAPD;
    }

    public void setAccessCAPD(Boolean accessCAPD) {
        this.accessCAPD = accessCAPD;
    }

    public String getComplications() {
        return complications;
    }

    public void setComplications(String complications) {
        this.complications = complications;
    }


}