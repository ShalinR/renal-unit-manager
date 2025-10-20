package com.peradeniya.renal.model;

import jakarta.persistence.*;
import lombok.*;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SystemicInquiry {

    @Embedded
    private Constitutional constitutional;

    @Embedded
    private CVS cvs;

    @Embedded
    private Resp respiratory;

    @Embedded
    private GIT git;

    @Embedded
    private Renal renal;

    @Embedded
    private Neuro neuro;

    @Embedded
    private Gynecology gynecology;

    private String sexualHistory;

    // Add explicit getters/setters if Lombok isn't working
    public Constitutional getConstitutional() {
        return constitutional;
    }

    public void setConstitutional(Constitutional constitutional) {
        this.constitutional = constitutional;
    }

    public CVS getCvs() {
        return cvs;
    }

    public void setCvs(CVS cvs) {
        this.cvs = cvs;
    }

    public Resp getRespiratory() {
        return respiratory;
    }

    public void setRespiratory(Resp respiratory) {
        this.respiratory = respiratory;
    }

    public GIT getGit() {
        return git;
    }

    public void setGit(GIT git) {
        this.git = git;
    }

    public Renal getRenal() {
        return renal;
    }

    public void setRenal(Renal renal) {
        this.renal = renal;
    }

    public Neuro getNeuro() {
        return neuro;
    }

    public void setNeuro(Neuro neuro) {
        this.neuro = neuro;
    }

    public Gynecology getGynecology() {
        return gynecology;
    }

    public void setGynecology(Gynecology gynecology) {
        this.gynecology = gynecology;
    }

    public String getSexualHistory() {
        return sexualHistory;
    }

    public void setSexualHistory(String sexualHistory) {
        this.sexualHistory = sexualHistory;
    }

    // ... your embedded classes remain the same
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Constitutional {
        private boolean loa;
        private boolean low;
    }

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CVS {
        private boolean chestPain;
        private boolean odema;
        private boolean sob;
    }

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Resp {
        private boolean cough;
        private boolean hemoptysis;
        private boolean wheezing;
    }

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GIT {
        private boolean constipation;
        private boolean diarrhea;
        private boolean melena;
        private boolean prBleeding;
    }

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Renal {
        private boolean hematuria;
        private boolean frothyUrine;
    }

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Neuro {
        private boolean seizures;
        private boolean visualDisturbance;
        private boolean headache;
        private boolean limbWeakness;
    }

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Gynecology {
        private boolean pvBleeding;
        private boolean menopause;
        private boolean menorrhagia;
        private boolean lrmp;
    }
}