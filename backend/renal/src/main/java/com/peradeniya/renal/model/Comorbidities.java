package com.peradeniya.renal.model;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comorbidities {
    private boolean dm;
    private String duration;
    private boolean psychiatricIllness;
    private boolean htn;
    private boolean ihd;

    public boolean isDm() {
        return dm;
    }

    public void setDm(boolean dm) {
        this.dm = dm;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public boolean isPsychiatricIllness() {
        return psychiatricIllness;
    }

    public void setPsychiatricIllness(boolean psychiatricIllness) {
        this.psychiatricIllness = psychiatricIllness;
    }

    public boolean isHtn() {
        return htn;
    }

    public void setHtn(boolean htn) {
        this.htn = htn;
    }

    public boolean isIhd() {
        return ihd;
    }

    public void setIhd(boolean ihd) {
        this.ihd = ihd;
    }
}
