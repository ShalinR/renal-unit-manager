package com.peradeniya.renal.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comorbidities {
    private boolean dm;

    @Column(columnDefinition = "TEXT")  // Duration can be descriptive
    private String duration;

    private boolean psychiatricIllness;
    private boolean htn;
    private boolean ihd;

    // Microvascular complications
    private boolean retinopathy;
    private boolean nephropathy;
    private boolean neuropathy;

    // Macrovascular complications
    @Column(columnDefinition = "TEXT")  // Echo results can be detailed
    private String twoDEcho;

    @Column(columnDefinition = "TEXT")  // Angiogram details can be long
    private String coronaryAngiogram;

    private boolean cva;
    private boolean pvd;

    // Other comorbidities
    private boolean dl; // Dyslipidemia
    private boolean clcd; // Chronic Liver Disease

    @Column(length = 50)  // Child class is usually short (A, B, C, etc.)
    private String childClass;

    @Column(length = 20)  // MELD score is typically numeric/short
    private String meldScore;

    private boolean hf; // Heart Failure

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

    public boolean isRetinopathy() {
        return retinopathy;
    }

    public void setRetinopathy(boolean retinopathy) {
        this.retinopathy = retinopathy;
    }

    public boolean isNephropathy() {
        return nephropathy;
    }

    public void setNephropathy(boolean nephropathy) {
        this.nephropathy = nephropathy;
    }

    public boolean isNeuropathy() {
        return neuropathy;
    }

    public void setNeuropathy(boolean neuropathy) {
        this.neuropathy = neuropathy;
    }

    public String getTwoDEcho() {
        return twoDEcho;
    }

    public void setTwoDEcho(String twoDEcho) {
        this.twoDEcho = twoDEcho;
    }

    public String getCoronaryAngiogram() {
        return coronaryAngiogram;
    }

    public void setCoronaryAngiogram(String coronaryAngiogram) {
        this.coronaryAngiogram = coronaryAngiogram;
    }

    public boolean isCva() {
        return cva;
    }

    public void setCva(boolean cva) {
        this.cva = cva;
    }

    public boolean isPvd() {
        return pvd;
    }

    public void setPvd(boolean pvd) {
        this.pvd = pvd;
    }

    public boolean isDl() {
        return dl;
    }

    public void setDl(boolean dl) {
        this.dl = dl;
    }

    public boolean isClcd() {
        return clcd;
    }

    public void setClcd(boolean clcd) {
        this.clcd = clcd;
    }

    public String getChildClass() {
        return childClass;
    }

    public void setChildClass(String childClass) {
        this.childClass = childClass;
    }

    public String getMeldScore() {
        return meldScore;
    }

    public void setMeldScore(String meldScore) {
        this.meldScore = meldScore;
    }

    public boolean isHf() {
        return hf;
    }

    public void setHf(boolean hf) {
        this.hf = hf;
    }
}