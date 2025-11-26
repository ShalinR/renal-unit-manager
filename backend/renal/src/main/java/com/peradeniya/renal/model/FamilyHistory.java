package com.peradeniya.renal.model;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FamilyHistory {
    private String dm;
    private String htn;
    private String ihd;
    private String stroke;
    private String renal;

    public String getDm() {
        return dm;
    }

    public void setDm(String dm) {
        this.dm = dm;
    }

    public String getHtn() {
        return htn;
    }

    public void setHtn(String htn) {
        this.htn = htn;
    }

    public String getIhd() {
        return ihd;
    }

    public void setIhd(String ihd) {
        this.ihd = ihd;
    }

    public String getStroke() {
        return stroke;
    }

    public void setStroke(String stroke) {
        this.stroke = stroke;
    }

    public String getRenal() {
        return renal;
    }

    public void setRenal(String renal) {
        this.renal = renal;
    }
}
